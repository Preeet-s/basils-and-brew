import { menuItems } from '../data/menuItems'

function normalize(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[₹,]/g, '')
    .trim()
}

/*
|--------------------------------------------------------------------------
| Find one exact product
|--------------------------------------------------------------------------
*/

export function findProduct(text = '') {
  const normalized = normalize(text)

  if (!normalized) {
    return null
  }

  return [...menuItems]
    .sort(
      (a, b) =>
        b.name.length - a.name.length
    )
    .find((item) =>
      normalized.includes(
        normalize(item.name)
      )
    ) || null
}

/*
|--------------------------------------------------------------------------
| Find multiple products
|--------------------------------------------------------------------------
*/

export function findProducts(text = '') {
  const normalized = normalize(text)

  if (!normalized) {
    return []
  }

  return [...menuItems]
    .sort(
      (a, b) =>
        b.name.length - a.name.length
    )
    .filter((item) =>
      normalized.includes(
        normalize(item.name)
      )
    )
}

/*
|--------------------------------------------------------------------------
| Find by ID
|--------------------------------------------------------------------------
*/

export function findProductById(id) {
  return menuItems.find(
    (item) => item.id === id
  ) || null
}

/*
|--------------------------------------------------------------------------
| Find by category
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
      item.category.toLowerCase() ===
      String(category).toLowerCase()
  )
}

/*
|--------------------------------------------------------------------------
| Find by tag
|--------------------------------------------------------------------------
*/

export function getProductsByTag(tag) {
  if (!tag) {
    return []
  }

  return menuItems.filter((item) =>
    item.tags.some(
      (itemTag) =>
        itemTag.toLowerCase() ===
        String(tag).toLowerCase()
    )
  )
}

/*
|--------------------------------------------------------------------------
| Search entire menu
|--------------------------------------------------------------------------
*/

export function searchMenu(query = '') {
  const normalized = normalize(query)

  if (!normalized) {
    return []
  }

  const terms = normalized
    .split(/\s+/)
    .filter(Boolean)

  return menuItems
    .map((item) => {
      const searchableText = [
        item.name,
        item.category,
        item.subcategory,
        item.description || '',
        ...item.tags,
      ]
        .join(' ')
        .toLowerCase()

      let score = 0

      for (const term of terms) {
        if (
          normalize(item.name).includes(term)
        ) {
          score += 5
        } else if (
          searchableText.includes(term)
        ) {
          score += 1
        }
      }

      return {
        item,
        score,
      }
    })
    .filter(
      (result) => result.score > 0
    )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .map(
      (result) => result.item
    )
}

/*
|--------------------------------------------------------------------------
| Products under a budget
|--------------------------------------------------------------------------
*/

export function getProductsUnderBudget(
  budget,
  excludeIds = []
) {
  const numericBudget =
    Number(budget)

  if (
    !Number.isFinite(numericBudget) ||
    numericBudget < 0
  ) {
    return []
  }

  const excluded =
    new Set(excludeIds)

  return menuItems
    .filter(
      (item) =>
        item.price <= numericBudget &&
        !excluded.has(item.id)
    )
    .sort(
      (a, b) =>
        a.price - b.price
    )
}

/*
|--------------------------------------------------------------------------
| Products in a price range
|--------------------------------------------------------------------------
*/

export function getProductsInPriceRange(
  min,
  max
) {
  const minimum = Number(min)
  const maximum = Number(max)

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
| Cheapest products
|--------------------------------------------------------------------------
*/

export function getCheapestProducts(
  category = null,
  limit = 5
) {
  let products = [...menuItems]

  if (category) {
    products =
      products.filter(
        (item) =>
          item.category.toLowerCase() ===
          String(category).toLowerCase()
      )
  }

  return products
    .sort(
      (a, b) =>
        a.price - b.price
    )
    .slice(
      0,
      Math.max(1, Number(limit) || 5)
    )
}

/*
|--------------------------------------------------------------------------
| Most expensive products
|--------------------------------------------------------------------------
*/

export function getMostExpensiveProducts(
  category = null,
  limit = 5
) {
  let products = [...menuItems]

  if (category) {
    products =
      products.filter(
        (item) =>
          item.category.toLowerCase() ===
          String(category).toLowerCase()
      )
  }

  return products
    .sort(
      (a, b) =>
        b.price - a.price
    )
    .slice(
      0,
      Math.max(1, Number(limit) || 5)
    )
}

/*
|--------------------------------------------------------------------------
| Menu validation
|--------------------------------------------------------------------------
*/

export function productExists(id) {
  return menuItems.some(
    (item) => item.id === id
  )
}

export function validateProducts(
  products = []
) {
  if (!Array.isArray(products)) {
    return []
  }

  return products.filter(
    (product) =>
      product &&
      productExists(product.id)
  )
}

/*
|--------------------------------------------------------------------------
| Menu names
|--------------------------------------------------------------------------
*/

export function getMenuNames() {
  return menuItems.map(
    (item) => item.name
  )
}

/*
|--------------------------------------------------------------------------
| Full menu
|--------------------------------------------------------------------------
*/

export function getAllMenuItems() {
  return [...menuItems]
}