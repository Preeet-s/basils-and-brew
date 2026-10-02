import { menuItems } from '../data/menuItems.js'

/*
|--------------------------------------------------------------------------
| TEXT NORMALIZATION
|--------------------------------------------------------------------------
|
| Converts natural user input into a predictable form.
|
| Examples:
|
| "Pistachio Creme Latte"
|      ↓
| "pistachio cream latte"
|
| "FLAT-WHITE"
|      ↓
| "flat white"
|
| "espresso!"
|      ↓
| "espresso"
|
|--------------------------------------------------------------------------
*/

function normalize(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[₹,]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/*
|--------------------------------------------------------------------------
| COMMON SPELLING / PHRASE NORMALIZATION
|--------------------------------------------------------------------------
|
| These are intentionally conservative.
|
| We only normalize obvious variations that customers may naturally type.
|
|--------------------------------------------------------------------------
*/

function normalizeWords(text = '') {
  let normalized = normalize(text)

  const replacements = {
    // Cream
    creme: 'cream',
    crème: 'cream',

    // Espresso
    expresso: 'espresso',

    // Cappuccino
    cappucino: 'cappuccino',
    capuccino: 'cappuccino',

    // Americano
    american: 'americano',

    // Pistachio
    pistacio: 'pistachio',
    pistachioo: 'pistachio',

    // Vanilla
    vanila: 'vanilla',

    // Basil
    basel: 'basil',

    // Tomato
    tomatos: 'tomato',
    tomatoes: 'tomato',

    // Mushroom
    mushrooms: 'mushroom',

    // Burrata
    buratta: 'burrata',

    // Alfredo
    alfredo: 'alfredo',
  }

  for (const [wrong, correct] of Object.entries(
    replacements
  )) {
    normalized = normalized.replace(
      new RegExp(`\\b${wrong}\\b`, 'g'),
      correct
    )
  }

  return normalized
}

/*
|--------------------------------------------------------------------------
| TOKENIZE
|--------------------------------------------------------------------------
*/

function tokenize(text = '') {
  return normalizeWords(text)
    .split(/\s+/)
    .filter(Boolean)
}

/*
|--------------------------------------------------------------------------
| REMOVE COMMON COMMAND WORDS
|--------------------------------------------------------------------------
|
| We don't want words like "add", "please", "to", "cart"
| influencing product matching.
|
|--------------------------------------------------------------------------
*/

function removeCommandWords(tokens = []) {
  const ignoredWords = new Set([
    'add',
    'please',
    'put',
    'get',
    'give',
    'want',
    'order',
    'buy',
    'bring',
    'send',
    'include',
    'place',
    'another',
    'some',
    'the',
    'a',
    'an',
    'to',
    'my',
    'cart',
    'in',
    'into',
    'for',
    'me',
  ])

  return tokens.filter(
    (token) => !ignoredWords.has(token)
  )
}

/*
|--------------------------------------------------------------------------
| PRODUCT TOKEN SCORE
|--------------------------------------------------------------------------
|
| Specific products should ALWAYS beat generic products.
|
| Example:
|
| "pistachio creme latte"
|
| Latte:
|     latte = 1 matching token
|
| Pistachio Cream Latte:
|     pistachio = match
|     cream = match
|     latte = match
|
| Therefore:
|
| Pistachio Cream Latte wins.
|
|--------------------------------------------------------------------------
*/

function scoreProduct(
  product,
  queryTokens
) {
  const productTokens =
    tokenize(product.name)

  if (!productTokens.length) {
    return 0
  }

  let score = 0
  let matchedTokens = 0

  for (const token of productTokens) {
    if (queryTokens.includes(token)) {
      matchedTokens += 1

      /*
       * Product-name tokens are worth more than generic
       * searchable text.
       */
      score += 10
    }
  }

  /*
   * Reward products where ALL name tokens match.
   *
   * This is the key protection against:
   *
   * Latte
   *
   * incorrectly beating:
   *
   * Pistachio Cream Latte
   */
  if (
    matchedTokens ===
    productTokens.length
  ) {
    score += 100
  }

  /*
   * Reward longer / more specific product names.
   */
  score += productTokens.length * 2

  return score
}

/*
|--------------------------------------------------------------------------
| FIND ONE PRODUCT
|--------------------------------------------------------------------------
*/

export function findProduct(text = '') {
  const normalized =
    normalizeWords(text)

  if (!normalized) {
    return null
  }

  /*
   * --------------------------------------------------------------
   * STEP 1
   * Exact normalized product-name match
   * --------------------------------------------------------------
   */

  const exactMatch =
    menuItems.find((item) => {
      const productName =
        normalizeWords(item.name)

      return (
        normalized === productName ||
        normalized.includes(
          ` ${productName} `
        ) ||
        normalized.startsWith(
          `${productName} `
        ) ||
        normalized.endsWith(
          ` ${productName}`
        )
      )
    })

  if (exactMatch) {
    return exactMatch
  }

  /*
   * --------------------------------------------------------------
   * STEP 2
   * Token-based scoring
   * --------------------------------------------------------------
   */

  const queryTokens = removeCommandWords(
    tokenize(normalized)
  ).filter((token) => !/^\d+$/.test(token));

  if (!queryTokens.length) {
    return null;
  }

  // Match singular and plural product words without
  // treating unrelated words as valid product matches.
  const matchesToken = (productToken, queryToken) => {
    if (productToken === queryToken) {
      return true;
    }

    // latte -> lattes
    if (
      productToken.endsWith('e') &&
      queryToken === `${productToken.slice(0, -1)}es`
    ) {
      return true;
    }

    // coffee -> coffees, cup -> cups
    if (queryToken === `${productToken}s`) {
      return true;
    }

    // berry -> berries
    if (
      productToken.endsWith('y') &&
      queryToken === `${productToken.slice(0, -1)}ies`
    ) {
      return true;
    }

    return false;
  };

  const scoredProducts = menuItems
    .map((item) => {
      const productTokens = tokenize(
        normalizeWords(item.name)
      );

      const matchedTokens = productTokens.filter(
        (productToken) =>
          queryTokens.some((queryToken) =>
            matchesToken(productToken, queryToken)
          )
      );

      const score =
        matchedTokens.length * 10 +
        (matchedTokens.length === productTokens.length
          ? 100
          : 0);

      return { item, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scoredProducts.length) {
    return null;
  }

  return scoredProducts[0].item;
}

/*
|--------------------------------------------------------------------------
| FIND MULTIPLE PRODUCTS
|--------------------------------------------------------------------------
*/

export function findProducts(
  text = ''
) {
  const normalized =
    normalizeWords(text)

  if (!normalized) {
    return []
  }

  const queryTokens =
    removeCommandWords(
      tokenize(normalized)
    )

  if (!queryTokens.length) {
    return []
  }

  return menuItems
    .map((item) => ({
      item,
      score: scoreProduct(
        item,
        queryTokens
      ),
    }))
    .filter(
      (result) =>
        result.score > 0
    )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .map(
      (result) =>
        result.item
    )
}

/*
|--------------------------------------------------------------------------
| FIND BY ID
|--------------------------------------------------------------------------
*/

export function findProductById(id) {
  return (
    menuItems.find(
      (item) =>
        item.id === id
    ) || null
  )
}

/*
|--------------------------------------------------------------------------
| FIND BY CATEGORY
|--------------------------------------------------------------------------
*/

export function getProductsByCategory(
  category
) {
  if (!category) {
    return []
  }

  return menuItems.filter(
    (item) =>
      String(item.category || '')
        .toLowerCase() ===
      String(category)
        .toLowerCase()
  )
}

/*
|--------------------------------------------------------------------------
| FIND BY TAG
|--------------------------------------------------------------------------
*/

export function getProductsByTag(
  tag
) {
  if (!tag) {
    return []
  }

  const normalizedTag =
    normalizeWords(tag)

  return menuItems.filter(
    (item) =>
      Array.isArray(item.tags) &&
      item.tags.some(
        (itemTag) =>
          normalizeWords(itemTag) ===
          normalizedTag
      )
  )
}

/*
|--------------------------------------------------------------------------
| SEARCH ENTIRE MENU
|--------------------------------------------------------------------------
*/

export function searchMenu(
  query = ''
) {
  const normalized =
    normalizeWords(query)

  if (!normalized) {
    return []
  }

  const terms =
    removeCommandWords(
      tokenize(normalized)
    )

  if (!terms.length) {
    return []
  }

  return menuItems
    .map((item) => {
      const searchableText = normalizeWords(
        [
          item.name,
          item.category,
          item.subcategory,
          item.description || '',
          ...(Array.isArray(item.tags)
            ? item.tags
            : []),
        ].join(' ')
      )

      let score = 0

      /*
       * Product-name matches are strongest.
       */
      for (const term of terms) {
        const productName =
          normalizeWords(
            item.name
          )

        if (
          productName
            .split(' ')
            .includes(term)
        ) {
          score += 10
        } else if (
          searchableText.includes(term)
        ) {
          score += 1
        }
      }

      /*
       * Strong bonus when all product-name
       * tokens are represented in the query.
       */
      const productTokens =
        tokenize(item.name)

      const allTokensMatch =
        productTokens.every(
          (token) =>
            terms.includes(token)
        )

      if (allTokensMatch) {
        score += 100
      }

      return {
        item,
        score,
      }
    })
    .filter(
      (result) =>
        result.score > 0
    )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .map(
      (result) =>
        result.item
    )
}

/*
|--------------------------------------------------------------------------
| PRODUCTS UNDER BUDGET
|--------------------------------------------------------------------------
*/

export function getProductsUnderBudget(
  budget,
  excludeIds = []
) {
  const numericBudget =
    Number(budget)

  if (
    !Number.isFinite(
      numericBudget
    ) ||
    numericBudget < 0
  ) {
    return []
  }

  const excluded =
    new Set(excludeIds)

  return menuItems
    .filter(
      (item) =>
        item.price <=
          numericBudget &&
        !excluded.has(item.id)
    )
    .sort(
      (a, b) =>
        a.price - b.price
    )
}

/*
|--------------------------------------------------------------------------
| PRODUCTS IN PRICE RANGE
|--------------------------------------------------------------------------
*/

export function getProductsInPriceRange(
  min,
  max
) {
  const minimum =
    Number(min)

  const maximum =
    Number(max)

  if (
    !Number.isFinite(minimum) ||
    !Number.isFinite(maximum)
  ) {
    return []
  }

  return menuItems
    .filter(
      (item) =>
        item.price >= minimum &&
        item.price <= maximum
    )
    .sort(
      (a, b) =>
        a.price - b.price
    )
}

/*
|--------------------------------------------------------------------------
| CHEAPEST PRODUCTS
|--------------------------------------------------------------------------
*/

export function getCheapestProducts(
  category = null,
  limit = 5
) {
  let products = [
    ...menuItems,
  ]

  if (category) {
    products =
      products.filter(
        (item) =>
          String(
            item.category || ''
          ).toLowerCase() ===
          String(category)
            .toLowerCase()
      )
  }

  return products
    .sort(
      (a, b) =>
        a.price - b.price
    )
    .slice(
      0,
      Math.max(
        1,
        Number(limit) || 5
      )
    )
}

/*
|--------------------------------------------------------------------------
| MOST EXPENSIVE PRODUCTS
|--------------------------------------------------------------------------
*/

export function getMostExpensiveProducts(
  category = null,
  limit = 5
) {
  let products = [
    ...menuItems,
  ]

  if (category) {
    products =
      products.filter(
        (item) =>
          String(
            item.category || ''
          ).toLowerCase() ===
          String(category)
            .toLowerCase()
      )
  }

  return products
    .sort(
      (a, b) =>
        b.price - a.price
    )
    .slice(
      0,
      Math.max(
        1,
        Number(limit) || 5
      )
    )
}

/*
|--------------------------------------------------------------------------
| MENU VALIDATION
|--------------------------------------------------------------------------
*/

export function productExists(
  id
) {
  return menuItems.some(
    (item) =>
      item.id === id
  )
}

export function validateProducts(
  products = []
) {
  if (
    !Array.isArray(products)
  ) {
    return []
  }

  return products.filter(
    (product) =>
      product &&
      productExists(
        product.id
      )
  )
}

/*
|--------------------------------------------------------------------------
| MENU NAMES
|--------------------------------------------------------------------------
*/

export function getMenuNames() {
  return menuItems.map(
    (item) =>
      item.name
  )
}

/*
|--------------------------------------------------------------------------
| FULL MENU
|--------------------------------------------------------------------------
*/

export function getAllMenuItems() {
  return [
    ...menuItems,
  ]
}