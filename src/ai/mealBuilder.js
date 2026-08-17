import { menuItems } from '../data/menuItems'

/**
 * Build a meal from the actual Basils & Brew menu.
 *
 * This module does NOT use AI.
 * It performs deterministic meal selection using:
 *
 * - budget
 * - coffee/pasta balance
 * - current cart
 * - customer preferences
 *
 * This makes the application reliable even when
 * the local LLM is unavailable.
 */

export function getMenuItem(id) {
  return menuItems.find((item) => item.id === id)
}

export function getCoffeeItems() {
  return menuItems.filter(
    (item) => item.category === 'Coffee'
  )
}

export function getPastaItems() {
  return menuItems.filter(
    (item) => item.category === 'Pasta'
  )
}

export function getItemPrice(id) {
  const item = getMenuItem(id)

  return item ? Number(item.price) : 0
}

export function calculateMealTotal(items = []) {
  return items.reduce((total, item) => {
    const product = getMenuItem(item.id)

    if (!product) {
      return total
    }

    const quantity = Math.max(
      1,
      Number(item.quantity) || 1
    )

    return total + product.price * quantity
  }, 0)
}

/**
 * Check whether an item already exists in the cart.
 */
export function cartHasItem(cart = [], id) {
  return cart.some(
    (item) => item.id === id
  )
}

/**
 * Convert cart items into IDs.
 */
export function getCartIds(cart = []) {
  return cart
    .map((item) => item.id)
    .filter(Boolean)
}

/**
 * Score a coffee for a particular pasta.
 *
 * Higher score = better pairing.
 */
function scoreCoffeeForPasta(
  coffee,
  pasta
) {
  let score = 0

  const pastaTags = pasta.tags || []
  const coffeeTags = coffee.tags || []

  // Creamy pasta
  if (
    pastaTags.includes('creamy')
  ) {
    if (
      coffeeTags.includes('classic')
    ) {
      score += 3
    }

    if (
      coffeeTags.includes('strong')
    ) {
      score += 2
    }

    if (
      coffeeTags.includes('sweet')
    ) {
      score += 1
    }

    if (
      coffeeTags.includes('cold')
    ) {
      score += 2
    }
  }

  // Spicy pasta
  if (
    pastaTags.includes('spicy')
  ) {
    if (
      coffeeTags.includes('creamy')
    ) {
      score += 3
    }

    if (
      coffeeTags.includes('sweet')
    ) {
      score += 2
    }

    if (
      coffeeTags.includes('cold')
    ) {
      score += 2
    }
  }

  // Basil / pesto pasta
  if (
    pastaTags.includes('basil') ||
    pastaTags.includes('pesto')
  ) {
    if (
      coffeeTags.includes('basil')
    ) {
      score += 4
    }

    if (
      coffeeTags.includes('sweet')
    ) {
      score += 2
    }

    if (
      coffeeTags.includes('signature')
    ) {
      score += 2
    }
  }

  // Rich pasta
  if (
    pastaTags.includes('rich') ||
    pastaTags.includes('luxury') ||
    pastaTags.includes('truffle')
  ) {
    if (
      coffeeTags.includes('strong')
    ) {
      score += 3
    }

    if (
      coffeeTags.includes('classic')
    ) {
      score += 2
    }

    if (
      coffeeTags.includes('sweet')
    ) {
      score -= 1
    }
  }

  // Light pasta
  if (
    pastaTags.includes('light') ||
    pastaTags.includes('fresh')
  ) {
    if (
      coffeeTags.includes('cold')
    ) {
      score += 3
    }

    if (
      coffeeTags.includes('light')
    ) {
      score += 2
    }

    if (
      coffeeTags.includes('classic')
    ) {
      score += 1
    }
  }

  // Coffee-inspired pasta
  if (
    pastaTags.includes('coffee')
  ) {
    if (
      coffeeTags.includes('classic')
    ) {
      score += 3
    }

    if (
      coffeeTags.includes('strong')
    ) {
      score += 3
    }

    if (
      coffeeTags.includes('sweet')
    ) {
      score += 1
    }
  }

  return score
}

/**
 * Find the best coffee pairing for a pasta.
 */
export function findBestCoffeePairing(
  pasta,
  {
    budget = Infinity,
    cart = [],
  } = {}
) {
  if (!pasta) {
    return null
  }

  const cartIds = getCartIds(cart)

  const candidates = getCoffeeItems()
    .filter(
      (coffee) =>
        coffee.price <= budget
    )
    .filter(
      (coffee) =>
        !cartIds.includes(coffee.id)
    )

  if (candidates.length === 0) {
    return null
  }

  const ranked = candidates
    .map((coffee) => ({
      coffee,
      score: scoreCoffeeForPasta(
        coffee,
        pasta
      ),
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.coffee.price - b.coffee.price
    )

  return ranked[0].coffee
}

/**
 * Find the best pasta that fits a budget.
 */
export function findBestPasta({
  budget = Infinity,
  cart = [],
  preferences = {},
} = {}) {
  const cartIds = getCartIds(cart)

  const candidates = getPastaItems()
    .filter(
      (pasta) =>
        pasta.price <= budget
    )
    .filter(
      (pasta) =>
        !cartIds.includes(pasta.id)
    )

  if (candidates.length === 0) {
    return null
  }

  const ranked = candidates
    .map((pasta) => {
      let score = 0

      const tags = pasta.tags || []

      if (
        preferences.spicy &&
        tags.includes('spicy')
      ) {
        score += 5
      }

      if (
        preferences.creamy &&
        tags.includes('creamy')
      ) {
        score += 5
      }

      if (
        preferences.light &&
        tags.includes('light')
      ) {
        score += 5
      }

      if (
        preferences.basil &&
        tags.includes('basil')
      ) {
        score += 5
      }

      if (
        preferences.signature &&
        tags.includes('signature')
      ) {
        score += 3
      }

      return {
        pasta,
        score,
      }
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.pasta.price - b.pasta.price
    )

  return ranked[0].pasta
}

/**
 * Build a complete coffee + pasta meal.
 */
export function buildMeal({
  budget = 600,
  cart = [],
  preferences = {},
} = {}) {
  const numericBudget =
    Number(budget) || 600

  const cartTotal =
    calculateMealTotal(cart)

  const remainingBudget =
    Math.max(
      0,
      numericBudget - cartTotal
    )

  /*
   * If the customer already has pasta,
   * use that pasta for the pairing.
   */
  const existingPasta = cart.find(
    (item) => {
      const product = getMenuItem(
        item.id
      )

      return (
        product &&
        product.category === 'Pasta'
      )
    }
  )

  let pasta = existingPasta
    ? getMenuItem(existingPasta.id)
    : null

  let coffee = null

  if (pasta) {
    const coffeeBudget =
      remainingBudget

    coffee =
      findBestCoffeePairing(
        pasta,
        {
          budget: coffeeBudget,
          cart,
        }
      )
  } else {
    /*
     * No pasta in cart.
     *
     * Find a pasta that leaves enough
     * money for a coffee.
     */

    const possibleMeals =
      getPastaItems()
        .filter(
          (pastaItem) =>
            pastaItem.price <=
            remainingBudget
        )
        .map((pastaItem) => {
          const coffee =
            findBestCoffeePairing(
              pastaItem,
              {
                budget:
                  remainingBudget -
                  pastaItem.price,
                cart,
              }
            )

          if (!coffee) {
            return null
          }

          return {
            pasta: pastaItem,
            coffee,
            total:
              pastaItem.price +
              coffee.price,
            score:
              scoreCoffeeForPasta(
                coffee,
                pastaItem
              ),
          }
        })
        .filter(Boolean)
        .sort(
          (a, b) =>
            b.score - a.score ||
            b.total - a.total
        )

    if (
      possibleMeals.length > 0
    ) {
      pasta =
        possibleMeals[0].pasta

      coffee =
        possibleMeals[0].coffee
    }
  }

  /*
   * If we already had pasta but could
   * not find a coffee within budget.
   */
  if (pasta && !coffee) {
    return {
      success: false,
      items: [],
      total: cartTotal,
      remaining:
        numericBudget - cartTotal,
      message:
        'I could not build a complete meal within that budget.',
    }
  }

  if (!pasta || !coffee) {
    return {
      success: false,
      items: [],
      total: cartTotal,
      remaining:
        numericBudget - cartTotal,
      message:
        'I could not find a coffee and pasta combination within that budget.',
    }
  }

  const items = []

  /*
   * Only add items that aren't already
   * present in the cart.
   */

  if (
    !cartHasItem(
      cart,
      pasta.id
    )
  ) {
    items.push({
      id: pasta.id,
      quantity: 1,
    })
  }

  if (
    !cartHasItem(
      cart,
      coffee.id
    )
  ) {
    items.push({
      id: coffee.id,
      quantity: 1,
    })
  }

  const addedTotal =
    items.reduce(
      (sum, item) =>
        sum +
        getItemPrice(item.id) *
          item.quantity,
      0
    )

  return {
    success: true,
    items,
    total:
      cartTotal + addedTotal,
    remaining:
      numericBudget -
      cartTotal -
      addedTotal,
    pasta,
    coffee,
    message: `I recommend ${pasta.name} with ${coffee.name}.`,
  }
}

/**
 * Format a meal for display in the
 * concierge chat.
 */
export function formatMeal(
  meal,
  budget = null
) {
  if (
    !meal ||
    !meal.success
  ) {
    return (
      meal?.message ||
      'I could not build a suitable meal right now.'
    )
  }

  const lines = [
    `🍝 ${meal.pasta.name} — ₹${meal.pasta.price}`,
    `☕ ${meal.coffee.name} — ₹${meal.coffee.price}`,
    `Total: ₹${meal.total}`,
  ]

  if (
    budget !== null &&
    meal.remaining >= 0
  ) {
    lines.push(
      `Remaining budget: ₹${meal.remaining}`
    )
  }

  lines.push(
    `Why: ${meal.pasta.name} and ${meal.coffee.name} make a balanced coffee-and-pasta combination.`
  )

  return lines.join('\n')
}