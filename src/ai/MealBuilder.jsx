import { menuItems } from '../data/menuItems'

/*
|--------------------------------------------------------------------------
| Meal Builder
|--------------------------------------------------------------------------
| Builds valid coffee + pasta combinations using the real menu.
|--------------------------------------------------------------------------
*/

function normalize(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[₹,]/g, '')
    .trim()
}

function getBudget(text = '') {
  const normalized = normalize(text)

  const patterns = [
    /under\s+(\d+)/,
    /below\s+(\d+)/,
    /within\s+(\d+)/,
    /budget\s+(\d+)/,
    /for\s+(\d+)/,
    /₹\s*(\d+)/,
  ]

  for (const pattern of patterns) {
    const match = normalized.match(pattern)

    if (match) {
      return Number(match[1])
    }
  }

  return null
}

function hasAny(text, words) {
  const normalized = normalize(text)

  return words.some((word) =>
    normalized.includes(word)
  )
}

function getPreferenceProfile(text = '') {
  const normalized = normalize(text)

  const profile = {
    spicy: false,
    creamy: false,
    light: false,
    sweet: false,
    bold: false,
    fresh: false,
    basil: false,
    classic: false,
    signature: false,
  }

  if (
    hasAny(normalized, [
      'spicy',
      'hot',
      'chilli',
      'chili',
      'heat',
    ])
  ) {
    profile.spicy = true
  }

  if (
    hasAny(normalized, [
      'creamy',
      'cream',
      'rich',
      'indulgent',
    ])
  ) {
    profile.creamy = true
  }

  if (
    hasAny(normalized, [
      'light',
      'lighter',
      'fresh',
      'not too heavy',
      'not heavy',
    ])
  ) {
    profile.light = true
  }

  if (
    hasAny(normalized, [
      'sweet',
      'sweetness',
      'dessert',
    ])
  ) {
    profile.sweet = true
  }

  if (
    hasAny(normalized, [
      'bold',
      'strong',
      'intense',
    ])
  ) {
    profile.bold = true
  }

  if (
    hasAny(normalized, [
      'fresh',
      'refreshing',
      'freshness',
    ])
  ) {
    profile.fresh = true
  }

  if (
    hasAny(normalized, [
      'basil',
      'herby',
      'herbal',
    ])
  ) {
    profile.basil = true
  }

  if (
    hasAny(normalized, [
      'classic',
      'traditional',
    ])
  ) {
    profile.classic = true
  }

  if (
    hasAny(normalized, [
      'signature',
      'special',
      'premium',
    ])
  ) {
    profile.signature = true
  }

  return profile
}

function scoreProduct(
  product,
  profile,
  category
) {
  let score = 0

  const tags = product.tags || []

  /*
  |--------------------------------------------------------------------------
  | Category
  |--------------------------------------------------------------------------
  */

  if (
    product.category === category
  ) {
    score += 10
  }

  /*
  |--------------------------------------------------------------------------
  | Preference matching
  |--------------------------------------------------------------------------
  */

  if (
    profile.spicy &&
    tags.includes('spicy')
  ) {
    score += 8
  }

  if (
    profile.creamy &&
    tags.includes('creamy')
  ) {
    score += 7
  }

  if (
    profile.light &&
    (
      tags.includes('light') ||
      tags.includes('fresh')
    )
  ) {
    score += 8
  }

  if (
    profile.sweet &&
    tags.includes('sweet')
  ) {
    score += 7
  }

  if (
    profile.bold &&
    (
      tags.includes('strong') ||
      tags.includes('bold')
    )
  ) {
    score += 8
  }

  if (
    profile.fresh &&
    (
      tags.includes('fresh') ||
      tags.includes('cold')
    )
  ) {
    score += 6
  }

  if (
    profile.basil &&
    tags.includes('basil')
  ) {
    score += 7
  }

  if (
    profile.classic &&
    product.subcategory ===
      'Classic'
  ) {
    score += 5
  }

  if (
    profile.signature &&
    product.subcategory ===
      'Signature'
  ) {
    score += 5
  }

  /*
  |--------------------------------------------------------------------------
  | General balancing
  |--------------------------------------------------------------------------
  */

  if (
    profile.light &&
    tags.includes('rich')
  ) {
    score -= 3
  }

  if (
    profile.light &&
    tags.includes('luxury')
  ) {
    score -= 2
  }

  return score
}

function scorePair(
  pasta,
  coffee,
  profile
) {
  let score = 0

  const pastaTags =
    pasta.tags || []

  const coffeeTags =
    coffee.tags || []

  /*
  |--------------------------------------------------------------------------
  | Pasta ↔ coffee balancing
  |--------------------------------------------------------------------------
  */

  if (
    pastaTags.includes('spicy') &&
    coffeeTags.includes('creamy')
  ) {
    score += 7
  }

  if (
    pastaTags.includes('spicy') &&
    coffeeTags.includes('sweet')
  ) {
    score += 5
  }

  if (
    pastaTags.includes('creamy') &&
    coffeeTags.includes('strong')
  ) {
    score += 7
  }

  if (
    pastaTags.includes('creamy') &&
    coffeeTags.includes('cold')
  ) {
    score += 5
  }

  if (
    pastaTags.includes('basil') &&
    coffeeTags.includes('basil')
  ) {
    score += 7
  }

  if (
    pastaTags.includes('tomato') &&
    coffeeTags.includes('sweet')
  ) {
    score += 4
  }

  if (
    pastaTags.includes('rich') &&
    coffeeTags.includes('strong')
  ) {
    score += 6
  }

  if (
    pastaTags.includes('light') &&
    coffeeTags.includes('cold')
  ) {
    score += 6
  }

  /*
  |--------------------------------------------------------------------------
  | Preference-specific pair bonuses
  |--------------------------------------------------------------------------
  */

  if (
    profile.spicy &&
    pastaTags.includes('spicy')
  ) {
    score += 5
  }

  if (
    profile.creamy &&
    (
      pastaTags.includes('creamy') ||
      coffeeTags.includes('creamy')
    )
  ) {
    score += 4
  }

  if (
    profile.light &&
    (
      pastaTags.includes('light') ||
      pastaTags.includes('fresh') ||
      coffeeTags.includes('cold')
    )
  ) {
    score += 5
  }

  if (
    profile.bold &&
    (
      coffeeTags.includes('strong') ||
      coffeeTags.includes('bold')
    )
  ) {
    score += 5
  }

  if (
    profile.sweet &&
    coffeeTags.includes('sweet')
  ) {
    score += 5
  }

  /*
  |--------------------------------------------------------------------------
  | Avoid awkward combinations
  |--------------------------------------------------------------------------
  */

  if (
    pastaTags.includes('spicy') &&
    coffeeTags.includes('strong') &&
    !coffeeTags.includes('creamy')
  ) {
    score -= 2
  }

  return score
}

function getCategories(
  message
) {
  const normalized =
    normalize(message)

  const wantsCoffee =
    normalized.includes(
      'coffee'
    ) ||
    normalized.includes(
      'drink'
    ) ||
    normalized.includes(
      'beverage'
    )

  const wantsPasta =
    normalized.includes(
      'pasta'
    ) ||
    normalized.includes(
      'meal'
    )

  return {
    wantsCoffee,
    wantsPasta,
  }
}

/*
|--------------------------------------------------------------------------
| Build best meal
|--------------------------------------------------------------------------
*/

export function buildMeal(
  message,
  cartItems = []
) {
  const budget =
    getBudget(message)

  const profile =
    getPreferenceProfile(message)

  const {
    wantsCoffee,
    wantsPasta,
  } = getCategories(message)

  const coffees =
    menuItems.filter(
      (item) =>
        item.category ===
        'Coffee'
    )

  const pastas =
    menuItems.filter(
      (item) =>
        item.category ===
        'Pasta'
    )

  /*
  |--------------------------------------------------------------------------
  | Existing cart
  |--------------------------------------------------------------------------
  */

  const cartIds = new Set(
    cartItems.map(
      (item) => item.id
    )
  )

  /*
  |--------------------------------------------------------------------------
  | Candidate lists
  |--------------------------------------------------------------------------
  */

  const coffeeCandidates =
    coffees
      .filter(
        (item) =>
          !cartIds.has(item.id)
      )
      .map((item) => ({
        item,
        score: scoreProduct(
          item,
          profile,
          'Coffee'
        ),
      }))

  const pastaCandidates =
    pastas
      .filter(
        (item) =>
          !cartIds.has(item.id)
      )
      .map((item) => ({
        item,
        score: scoreProduct(
          item,
          profile,
          'Pasta'
        ),
      }))

  /*
  |--------------------------------------------------------------------------
  | If user explicitly asks only for coffee
  |--------------------------------------------------------------------------
  */

  if (
    wantsCoffee &&
    !wantsPasta
  ) {
    const sorted =
      coffeeCandidates.sort(
        (a, b) =>
          b.score - a.score ||
          a.item.price -
            b.item.price
      )

    const selected =
      sorted.find(
        (candidate) =>
          budget === null ||
          candidate.item.price <=
            budget
      )

    if (!selected) {
      return null
    }

    return {
      items: [
        {
          id: selected.item.id,
          quantity: 1,
        },
      ],
      products: [
        selected.item,
      ],
      total:
        selected.item.price,
      budget,
    }
  }

  /*
  |--------------------------------------------------------------------------
  | If user explicitly asks only for pasta
  |--------------------------------------------------------------------------
  */

  if (
    wantsPasta &&
    !wantsCoffee
  ) {
    const sorted =
      pastaCandidates.sort(
        (a, b) =>
          b.score - a.score ||
          a.item.price -
            b.item.price
      )

    const selected =
      sorted.find(
        (candidate) =>
          budget === null ||
          candidate.item.price <=
            budget
      )

    if (!selected) {
      return null
    }

    return {
      items: [
        {
          id: selected.item.id,
          quantity: 1,
        },
      ],
      products: [
        selected.item,
      ],
      total:
        selected.item.price,
      budget,
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Build coffee + pasta combination
  |--------------------------------------------------------------------------
  */

  let bestMeal = null

  for (
    const pastaCandidate of
      pastaCandidates
  ) {
    for (
      const coffeeCandidate of
        coffeeCandidates
    ) {
      const pasta =
        pastaCandidate.item

      const coffee =
        coffeeCandidate.item

      const total =
        pasta.price +
        coffee.price

      if (
        budget !== null &&
        total > budget
      ) {
        continue
      }

      const pairScore =
        pastaCandidate.score +
        coffeeCandidate.score +
        scorePair(
          pasta,
          coffee,
          profile
        )

      if (
        !bestMeal ||
        pairScore >
          bestMeal.score ||
        (
          pairScore ===
            bestMeal.score &&
          total <
            bestMeal.total
        )
      ) {
        bestMeal = {
          score: pairScore,
          total,
          budget,
          products: [
            pasta,
            coffee,
          ],
          items: [
            {
              id: pasta.id,
              quantity: 1,
            },
            {
              id: coffee.id,
              quantity: 1,
            },
          ],
        }
      }
    }
  }

  return bestMeal
}

/*
|--------------------------------------------------------------------------
| Explain meal
|--------------------------------------------------------------------------
*/

export function explainMeal(
  meal,
  message
) {
  if (!meal) {
    return "I couldn't find a suitable combination within that budget."
  }

  const pasta =
    meal.products.find(
      (item) =>
        item.category ===
        'Pasta'
    )

  const coffee =
    meal.products.find(
      (item) =>
        item.category ===
        'Coffee'
    )

  const profile =
    getPreferenceProfile(message)

  let reason =
    'The combination gives you a balanced coffee-and-pasta meal.'

  if (
    profile.spicy
  ) {
    reason =
      `${pasta.name} brings the spice, while ${coffee.name} provides a smoother contrast.`
  } else if (
    profile.creamy
  ) {
    reason =
      `${pasta.name} gives you the creamy richness, while ${coffee.name} adds a balanced espresso finish.`
  } else if (
    profile.light
  ) {
    reason =
      `The combination keeps the meal approachable and balanced without feeling too heavy.`
  } else if (
    profile.bold
  ) {
    reason =
      `The pairing gives you a more pronounced, bold flavour profile without losing balance.`
  } else if (
    profile.sweet
  ) {
    reason =
      `${coffee.name} adds a gentle sweetness that complements the pasta nicely.`
  }

  return reason
}

export function formatMeal(
  meal,
  message
) {
  if (!meal) {
    return "I couldn't find a suitable meal within that budget."
  }

  const lines =
    meal.products.map(
      (product, index) =>
        `${index + 1}. ${product.name} — ₹${product.price}`
    )

  const budgetText =
    meal.budget !== null
      ? `\nBudget: ₹${meal.budget}`
      : ''

  const remaining =
    meal.budget !== null
      ? meal.budget -
        meal.total
      : null

  const remainingText =
    remaining !== null
      ? `\nRemaining: ₹${remaining}`
      : ''

  const explanation =
    explainMeal(
      meal,
      message
    )

  return `🌿 Your Basils & Brew meal

${lines.join('\n')}

Total: ₹${meal.total}${budgetText}${remainingText}

Why:
${explanation}

Say "add that meal" if you'd like me to add it to your cart.`
}