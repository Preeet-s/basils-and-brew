import { useState } from 'react'
import {
  findProduct,
  findProducts,
  findProductById,
  getProductsByCategory,
  getProductsUnderBudget,
  getCheapestProducts,
  searchMenu,
} from '../ai/menuSearch'
import {
  buildMeal,
  formatMeal,
} from '../ai/mealBuilder'

const API_URL = 'http://localhost:3001/api/concierge'

function normalize(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[₹,]/g, '')
    .trim()
}

function getCartTotal(items = []) {
  return items.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  )
}

function formatMoney(amount) {
  return `₹${Number(amount || 0)}`
}

function getQuantity(text = '') {
  const normalized = normalize(text)

  const numberMatch =
    normalized.match(/\b(\d+)\b/)

  if (numberMatch) {
    return Math.max(
      1,
      Number(numberMatch[1])
    )
  }

  const words = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
  }

  for (const [word, value] of Object.entries(
    words
  )) {
    if (
      normalized.includes(
        ` ${word} `
      ) ||
      normalized.startsWith(`${word} `)
    ) {
      return value
    }
  }

  return 1
}

function isAddRequest(text = '') {
  const normalized = normalize(text)

  return (
    /\badd\b/.test(normalized) ||
    /\bget\b/.test(normalized) ||
    /\border\b/.test(normalized) ||
    /\bi want\b/.test(normalized) ||
    /\bgive me\b/.test(normalized)
  )
}

function isRemoveRequest(text = '') {
  const normalized = normalize(text)

  return (
    /\bremove\b/.test(normalized) ||
    /\bdelete\b/.test(normalized) ||
    /\btake out\b/.test(normalized)
  )
}

function isClearRequest(text = '') {
  const normalized = normalize(text)

  return (
    normalized.includes(
      'clear my cart'
    ) ||
    normalized.includes(
      'empty my cart'
    ) ||
    normalized.includes(
      'remove everything'
    )
  )
}

function isCartRequest(text = '') {
  const normalized = normalize(text)

  return (
    normalized.includes(
      'what is in my cart'
    ) ||
    normalized.includes(
      "what's in my cart"
    ) ||
    normalized.includes(
      'show my cart'
    ) ||
    normalized.includes(
      'show cart'
    ) ||
    normalized.includes(
      'my cart'
    ) ||
    normalized.includes(
      'how much am i spending'
    ) ||
    normalized.includes(
      'how much am i spending?'
    ) ||
    normalized.includes(
      'cart total'
    )
  )
}

function isCheapestRequest(text = '') {
  const normalized = normalize(text)

  return (
    normalized.includes(
      'cheapest'
    ) ||
    normalized.includes(
      'least expensive'
    ) ||
    normalized.includes(
      'lowest price'
    )
  )
}

function extractBudget(text = '') {
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
    const match =
      normalized.match(pattern)

    if (match) {
      return Number(match[1])
    }
  }

  return null
}

function findCartItem(
  text,
  cartItems
) {
  const products = findProducts(text)

  if (!products.length) {
    return null
  }

  const productIds = new Set(
    products.map(
      (product) => product.id
    )
  )

  return (
    cartItems.find((item) =>
      productIds.has(item.id)
    ) || null
  )
}

function buildCartReply(items) {
  if (!items.length) {
    return 'Your cart is empty right now.'
  }

  const lines = items.map(
    (item) =>
      `${item.quantity} × ${item.name} — ${formatMoney(
        item.price * item.quantity
      )}`
  )

  const total = getCartTotal(items)

  return `Here’s your current cart:\n${lines.join(
    '\n'
  )}\n\nTotal: ${formatMoney(total)}`
}

function buildBudgetReply(
  budget,
  products
) {
  if (!products.length) {
    return `I couldn't find a menu item under ${formatMoney(
      budget
    )}.`
  }

  const lines = products
    .slice(0, 6)
    .map(
      (item) =>
        `${item.name} — ${formatMoney(
          item.price
        )}`
    )

  return `Here are some options under ${formatMoney(
    budget
  )}:\n${lines.join('\n')}`
}

function buildCheapestReply(
  products,
  category
) {
  if (!products.length) {
    return `I couldn't find any ${
      category || ''
    } items.`
  }

  const cheapest = products[0]

  const categoryText = category
    ? `${category.toLowerCase()} `
    : ''

  return `The cheapest ${categoryText}option is ${cheapest.name} at ${formatMoney(
    cheapest.price
  )}.`
}

export function useAIConcierge(
  addItem,
  removeByName,
  items = [],
  updateQuantity,
  clearCart
) {
  const [messages, setMessages] =
    useState([
      {
        role: 'assistant',
        text:
          'Welcome to Basils AI Concierge. I can help you choose coffee, pasta, pairings, manage your cart, and build meals within a budget.',
      },
    ])

  const [loading, setLoading] =
    useState(false)
  
  const [
  lastRecommendedMeal,
  setLastRecommendedMeal,
] = useState(null)

  function addAssistantMessage(
    text
  ) {
    setMessages((current) => [
      ...current,
      {
        role: 'assistant',
        text,
      },
    ])
  }

  function addUserMessage(text) {
    setMessages((current) => [
      ...current,
      {
        role: 'user',
        text,
      },
    ])
  }

  /*
  |--------------------------------------------------------------------------
  | Local command handling
  |--------------------------------------------------------------------------
  */

  function handleLocalCommand(
    message
  ) {
    const normalized =
      normalize(message)
  /*
|--------------------------------------------------------------------------
| ADD LAST RECOMMENDED MEAL
|--------------------------------------------------------------------------
*/

if (
  normalized.includes(
    'add that meal'
  ) ||
  normalized.includes(
    'add the meal'
  ) ||
  normalized.includes(
    'add this meal'
  ) ||
  normalized.includes(
    'add recommended meal'
  )
) {
  if (
    !lastRecommendedMeal ||
    !lastRecommendedMeal.length
  ) {
    return {
      handled: true,
      reply:
        "I don't have a recent meal recommendation to add.",
    }
  }

  const addedNames = []

  lastRecommendedMeal.forEach(
    (item) => {
      const product =
        findProductById(
          item.id
        )

      if (!product) {
        return
      }

      const quantity =
        Math.max(
          1,
          Number(
            item.quantity
          ) || 1
        )

      if (
        typeof addItem ===
        'function'
      ) {
        for (
          let i = 0;
          i < quantity;
          i++
        ) {
          addItem(product)
        }
      }

      addedNames.push(
        `${quantity} × ${product.name}`
      )
    }
  )

  if (!addedNames.length) {
    return {
      handled: true,
      reply:
        "I couldn't add that meal because the products are no longer available.",
    }
  }

  return {
    handled: true,
    reply: `Done. I added ${addedNames.join(
      ', '
    )} to your cart.`,
  }
}
    /*
    |--------------------------------------------------------------------------
    | CLEAR CART
    |--------------------------------------------------------------------------
    */

    if (isClearRequest(message)) {
      if (!items.length) {
        return {
          handled: true,
          reply:
            'Your cart is already empty.',
        }
      }

      if (
        typeof clearCart ===
        'function'
      ) {
        clearCart()
      }

      return {
        handled: true,
        reply:
          'Done. I cleared your cart.',
      }
    }

    /*
    |--------------------------------------------------------------------------
    | SHOW CART
    |--------------------------------------------------------------------------
    */

    if (isCartRequest(message)) {
      return {
        handled: true,
        reply: buildCartReply(items),
      }
    }

    /*
    |--------------------------------------------------------------------------
    | CHEAPEST ITEM
    |--------------------------------------------------------------------------
    */

    if (isCheapestRequest(message)) {
      let category = null

      if (
        normalized.includes(
          'coffee'
        )
      ) {
        category = 'Coffee'
      }

      if (
        normalized.includes(
          'pasta'
        )
      ) {
        category = 'Pasta'
      }

      const products =
        getCheapestProducts(
          category,
          5
        )

      return {
        handled: true,
        reply: buildCheapestReply(
          products,
          category
        ),
      }
    }

    /*
    |--------------------------------------------------------------------------
    | BUDGET SEARCH
    |--------------------------------------------------------------------------
    */

    const budget =
      extractBudget(message)

    if (
      budget !== null &&
      !isAddRequest(message)
    ) {
      const products =
        getProductsUnderBudget(
          budget
        )

      return {
        handled: true,
        reply: buildBudgetReply(
          budget,
          products
        ),
      }
    }

    /*
    |--------------------------------------------------------------------------
    | REMOVE PRODUCT
    |--------------------------------------------------------------------------
    */

    if (isRemoveRequest(message)) {
      const cartItem =
        findCartItem(
          message,
          items
        )

      if (!cartItem) {
        const product =
          findProduct(message)

        if (!product) {
          return {
            handled: true,
            reply:
              "I couldn't find that product in your cart.",
          }
        }

        return {
          handled: true,
          reply: `${product.name} isn't currently in your cart.`,
        }
      }

      if (
        typeof removeByName ===
        'function'
      ) {
        removeByName(
          cartItem.name
        )
      }

      return {
        handled: true,
        reply: `Done. I removed ${cartItem.name} from your cart.`,
      }
    }

    /*
    |--------------------------------------------------------------------------
    | ADD PRODUCT
    |--------------------------------------------------------------------------
    */

    if (isAddRequest(message)) {
      const product =
        findProduct(message)

      if (product) {
        const quantity =
          getQuantity(message)

        if (
          typeof addItem ===
          'function'
        ) {
          for (
            let i = 0;
            i < quantity;
            i++
          ) {
            addItem(product)
          }
        }

        const newTotal =
          getCartTotal(items) +
          product.price *
            quantity

        const quantityText =
          quantity === 1
            ? `I added ${product.name} to your cart.`
            : `I added ${quantity} × ${product.name} to your cart.`

        return {
          handled: true,
          reply: `${quantityText} Added total: ${formatMoney(
            newTotal
          )}.`,
        }
      }
    }
    /*
|--------------------------------------------------------------------------
| MEAL BUILDER
|--------------------------------------------------------------------------
*/

const mealRequest =
  normalized.includes(
    'build me a meal'
  ) ||
  normalized.includes(
    'build a meal'
  ) ||
  normalized.includes(
    'make me a meal'
  ) ||
  normalized.includes(
    'create a meal'
  ) ||
  normalized.includes(
    'meal under'
  ) ||
  normalized.includes(
    'meal for'
  ) ||
  (
    normalized.includes(
      'coffee'
    ) &&
    normalized.includes(
      'pasta'
    ) &&
    (
      normalized.includes(
        'under'
      ) ||
      normalized.includes(
        'budget'
      ) ||
      normalized.includes(
        'meal'
      )
    )
  )

if (mealRequest) {
  const meal =
    buildMeal(
      message,
      items
    )

  if (!meal) {
    return {
      handled: true,
      reply:
        "I couldn't build a suitable coffee and pasta combination within that budget. Try giving me a little more room.",
    }
  }

  setLastRecommendedMeal(
    meal.items
  )

  return {
    handled: true,
    reply: formatMeal(
      meal,
      message
    ),
  }
}
    return {
      handled: false,
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Ask Ollama
  |--------------------------------------------------------------------------
  */

  async function askAI(message) {
    const response =
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          message,
          cart: items,
        }),
      })

    if (!response.ok) {
      throw new Error(
        `AI server returned ${response.status}`
      )
    }

    return response.json()
  }

  /*
  |--------------------------------------------------------------------------
  | Process AI action
  |--------------------------------------------------------------------------
  */

  function processAIResult(result) {
    if (!result) {
      addAssistantMessage(
        'I could not understand that request.'
      )

      return
    }

    const action =
      result.action || 'chat'

    const resultItems =
      Array.isArray(result.items)
        ? result.items
        : []

    /*
    |--------------------------------------------------------------------------
    | ADD TO CART
    |--------------------------------------------------------------------------
    */

    if (
      action ===
        'add_to_cart' &&
      resultItems.length
    ) {
      let addedItems = []

      resultItems.forEach(
        (item) => {
          const product =
            findProductById(
              item.id
            )

          if (!product) {
            return
          }

          const quantity =
            Math.max(
              1,
              Number(
                item.quantity
              ) || 1
            )

          if (
            typeof addItem ===
            'function'
          ) {
            for (
              let i = 0;
              i < quantity;
              i++
            ) {
              addItem(product)
            }
          }

          addedItems.push(
            `${quantity} × ${product.name}`
          )
        }
      )

      if (
        addedItems.length
      ) {
        addAssistantMessage(
          result.reply ||
            `Done. I added ${addedItems.join(
              ', '
            )} to your cart.`
        )

        return
      }
    }

    /*
    |--------------------------------------------------------------------------
    | REMOVE FROM CART
    |--------------------------------------------------------------------------
    */

    if (
      action ===
        'remove_from_cart'
    ) {
      resultItems.forEach(
        (item) => {
          const product =
            findProductById(
              item.id
            )

          if (
            product &&
            typeof removeByName ===
              'function'
          ) {
            removeByName(
              product.name
            )
          }
        }
      )

      addAssistantMessage(
        result.reply ||
          'Done. I updated your cart.'
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE QUANTITY
    |--------------------------------------------------------------------------
    */

    if (
      action ===
        'update_quantity'
    ) {
      resultItems.forEach(
        (item) => {
          const product =
            findProductById(
              item.id
            )

          if (
            product &&
            typeof updateQuantity ===
              'function'
          ) {
            updateQuantity(
              product.id,
              Math.max(
                1,
                Number(
                  item.quantity
                ) || 1
              )
            )
          }
        }
      )

      addAssistantMessage(
        result.reply ||
          'Done. I updated the quantities in your cart.'
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | CLEAR CART
    |--------------------------------------------------------------------------
    */

    if (
      action ===
      'clear_cart'
    ) {
      if (
        typeof clearCart ===
        'function'
      ) {
        clearCart()
      }

      addAssistantMessage(
        result.reply ||
          'Done. I cleared your cart.'
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | SHOW CART
    |--------------------------------------------------------------------------
    */

    if (
      action ===
      'show_cart'
    ) {
      addAssistantMessage(
        buildCartReply(items)
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | RECOMMENDATION
    |--------------------------------------------------------------------------
    */

    if (
      action ===
      'recommend'
    ) {
      const validProducts =
        resultItems
          .map(
            (item) =>
              findProductById(
                item.id
              )
          )
          .filter(Boolean)

      if (
        validProducts.length
      ) {
        const names =
          validProducts.map(
            (product) =>
              `${product.name} — ${formatMoney(
                product.price
              )}`
          )

        const recommendationText =
          result.reply ||
          `I'd recommend:\n${names.join(
            '\n'
          )}`

        addAssistantMessage(
          recommendationText
        )

        return
      }
    }

    /*
    |--------------------------------------------------------------------------
    | NORMAL CHAT
    |--------------------------------------------------------------------------
    */

    addAssistantMessage(
      result.reply ||
        'How can I help with your order?'
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Main send function
  |--------------------------------------------------------------------------
  */

  async function sendMessage(
    message
  ) {
    const cleanMessage =
      String(message || '').trim()

    if (!cleanMessage) {
      return
    }

    addUserMessage(
      cleanMessage
    )

    /*
    |--------------------------------------------------------------------------
    | LOCAL INTENT FIRST
    |--------------------------------------------------------------------------
    */

    try {
      const localResult =
        handleLocalCommand(
          cleanMessage
        )

      if (
        localResult.handled
      ) {
        addAssistantMessage(
          localResult.reply
        )

        return
      }
    } catch (error) {
      console.error(
        'Local command error:',
        error
      )
    }

    /*
    |--------------------------------------------------------------------------
    | AI FALLBACK
    |--------------------------------------------------------------------------
    */

    setLoading(true)

    try {
      const result =
        await askAI(
          cleanMessage
        )

      processAIResult(
        result
      )
    } catch (error) {
      console.error(
        'Concierge AI error:',
        error
      )

      /*
      |--------------------------------------------------------------------------
      | Last-resort local search
      |--------------------------------------------------------------------------
      */

      const searchResults =
        searchMenu(
          cleanMessage
        )

      if (
        searchResults.length
      ) {
        const suggestions =
          searchResults
            .slice(0, 4)
            .map(
              (item) =>
                `${item.name} — ${formatMoney(
                  item.price
                )}`
            )

        addAssistantMessage(
          `I couldn't reach the AI right now, but these menu items may help:\n${suggestions.join(
            '\n'
          )}`
        )
      } else {
        addAssistantMessage(
          "I couldn't connect to the AI right now. Please try again."
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    messages,
    sendMessage,
    loading,
  }
}