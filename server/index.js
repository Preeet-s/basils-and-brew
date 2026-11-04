import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

// Load environment variables first
dotenv.config()
dotenv.config({ path: 'backend/.env' })

// Load Supabase modules after environment setup
const { supabaseAdmin } = await import('./supabaseAdmin.js')
const { requireAuth } = await import('./authMiddleware.js')

// Initialize Express
const app = express()
app.use(cors())
app.use(express.json())

const PORT = Number(process.env.PORT) || 3001

const AI_PROVIDER = process.env.AI_PROVIDER || 'ollama'

const OLLAMA_URL =
  process.env.OLLAMA_URL ||
  'http://localhost:11434/api/chat'

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ||
  'qwen3:4b-instruct'

const GROQ_API_URL =
  'https://api.groq.com/openai/v1/chat/completions'

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const GROQ_MODEL = process.env.GROQ_MODEL || ''

const MODEL =
  AI_PROVIDER === 'groq'
    ? GROQ_MODEL
    : OLLAMA_MODEL

// ============================================================
// MENU
// ============================================================

const MENU = [
  // =========================
  // COFFEE
  // =========================

  {
    id: 'espresso',
    name: 'Espresso',
    price: 120,
    category: 'Coffee',
    subcategory: 'Classic',
    tags: ['hot', 'strong', 'classic'],
  },

  {
    id: 'americano',
    name: 'Americano',
    price: 140,
    category: 'Coffee',
    subcategory: 'Classic',
    tags: ['hot', 'light', 'classic'],
  },

  {
    id: 'cappuccino',
    name: 'Cappuccino',
    price: 180,
    category: 'Coffee',
    subcategory: 'Classic',
    tags: ['hot', 'creamy', 'classic'],
  },

  {
    id: 'latte',
    name: 'Latte',
    price: 190,
    category: 'Coffee',
    subcategory: 'Classic',
    tags: ['hot', 'creamy', 'mild'],
  },

  {
    id: 'flat-white',
    name: 'Flat White',
    price: 200,
    category: 'Coffee',
    subcategory: 'Classic',
    tags: ['hot', 'strong', 'creamy'],
  },

  {
    id: 'mocha',
    name: 'Mocha',
    price: 210,
    category: 'Coffee',
    subcategory: 'Classic',
    tags: ['hot', 'sweet', 'chocolate'],
  },

  {
    id: 'basil-honey-latte',
    name: 'Basil Honey Latte',
    price: 260,
    category: 'Coffee',
    subcategory: 'Signature',
    tags: ['hot', 'sweet', 'basil', 'signature'],
  },

  {
    id: 'smoked-vanilla-cold-brew',
    name: 'Smoked Vanilla Cold Brew',
    price: 280,
    category: 'Coffee',
    subcategory: 'Signature',
    tags: ['cold', 'sweet', 'signature'],
  },

  {
    id: 'pistachio-cream-latte',
    name: 'Pistachio Cream Latte',
    price: 290,
    category: 'Coffee',
    subcategory: 'Signature',
    tags: ['hot', 'creamy', 'nutty', 'signature'],
  },

  // =========================
  // PASTA
  // =========================

  {
    id: 'aglio-e-olio',
    name: 'Aglio e Olio',
    price: 280,
    category: 'Pasta',
    subcategory: 'Italian Classics',
    tags: ['garlic', 'light', 'spicy'],
  },

  {
    id: 'arrabbiata',
    name: 'Arrabbiata',
    price: 290,
    category: 'Pasta',
    subcategory: 'Italian Classics',
    tags: ['tomato', 'spicy'],
  },

  {
    id: 'alfredo',
    name: 'Alfredo',
    price: 320,
    category: 'Pasta',
    subcategory: 'Italian Classics',
    tags: ['creamy', 'rich'],
  },

  {
    id: 'pesto-basil',
    name: 'Pesto Basil',
    price: 330,
    category: 'Pasta',
    subcategory: 'Italian Classics',
    tags: ['pesto', 'basil', 'herby'],
  },

  {
    id: 'pink-sauce',
    name: 'Pink Sauce',
    price: 310,
    category: 'Pasta',
    subcategory: 'Italian Classics',
    tags: ['tomato', 'creamy'],
  },

  {
    id: 'creamy-mushroom',
    name: 'Creamy Mushroom',
    price: 330,
    category: 'Pasta',
    subcategory: 'Italian Classics',
    tags: ['creamy', 'mushroom', 'rich'],
  },

  {
    id: 'basil-truffle-alfredo',
    name: 'Basil Truffle Alfredo',
    price: 420,
    category: 'Pasta',
    subcategory: 'Signature',
    tags: ['creamy', 'truffle', 'basil', 'luxury'],
  },

  {
    id: 'roasted-garlic-herb-pasta',
    name: 'Roasted Garlic Herb Pasta',
    price: 350,
    category: 'Pasta',
    subcategory: 'Signature',
    tags: ['garlic', 'herbs', 'savory'],
  },

  {
    id: 'smoked-tomato-burrata-pasta',
    name: 'Smoked Tomato Burrata Pasta',
    price: 430,
    category: 'Pasta',
    subcategory: 'Signature',
    tags: ['tomato', 'burrata', 'smoky', 'rich'],
  },

  {
    id: 'lemon-basil-butter-pasta',
    name: 'Lemon Basil Butter Pasta',
    price: 350,
    category: 'Pasta',
    subcategory: 'Signature',
    tags: ['lemon', 'basil', 'fresh', 'light'],
  },

  {
    id: 'sundried-tomato-pesto-pasta',
    name: 'Sundried Tomato Pesto Pasta',
    price: 370,
    category: 'Pasta',
    subcategory: 'Signature',
    tags: ['tomato', 'pesto', 'basil'],
  },

  {
    id: 'espresso-pepper-pasta',
    name: 'Espresso Pepper Pasta',
    price: 390,
    category: 'Pasta',
    subcategory: 'Signature',
    tags: ['coffee', 'pepper', 'bold'],
  },
]

// ============================================================
// MENU TEXT FOR AI
// ============================================================

const MENU_TEXT = MENU.map(
  (item) =>
    `${item.id} | ${item.name} | ₹${item.price} | ${item.category} | ${item.subcategory} | ${item.tags.join(', ')}`
).join('\n')

// ============================================================
// HELPER
// ============================================================


function cleanAIResult(result, userMessage = '') {
  const validActions = [
    'add_to_cart',
    'remove_from_cart',
    'update_quantity',
    'clear_cart',
    'show_cart',
    'recommend',
    'chat',
  ]

  const message = String(userMessage).toLowerCase()

  const asksAboutDelivery =
    /\b(delivery|deliver|home delivery)\b/i.test(message) &&
    /\b(can i|do you|does|is there|available|offer|provide|have|how|what|whether|order)\b/i.test(message)

  // An informational delivery question must not change the cart.
  if (asksAboutDelivery && result.action === 'add_to_cart') {
    return {
      action: 'chat',
      items: [],
      reply:
        "I can't confirm delivery availability from the information available to me. Please check our ordering options for details.",
    }
  }

  const explicitAddIntent =
    /\b(add|buy|purchase|include)\b/i.test(message) ||
    /\b(order|get|give me|i want|i'd like)\b/i.test(message)

  if (!validActions.includes(result.action)) {
    result.action = 'chat'
  }

  // Do not allow the model to add products without a
  // recognizable ordering request.
  if (
    result.action === 'add_to_cart' &&
    !explicitAddIntent
  ) {
    return {
      action: 'chat',
      items: [],
      reply:
        "Tell me which menu item you'd like to add, and I'll help you with your order.",
    }
  }

  if (!Array.isArray(result.items)) {
    result.items = []
  }

  result.items = result.items
    .filter((item) =>
      MENU.some((product) => product.id === item.id)
    )
    .map((item) => {
      const parsedQuantity = Number(item.quantity)

      return {
        id: item.id,
        quantity:
          Number.isInteger(parsedQuantity) &&
          parsedQuantity >= 1 &&
          parsedQuantity <= 20
            ? parsedQuantity
            : 1,
      }
    })

  return {
    action: result.action,
    items: result.items,
    reply:
      result.reply ||
      'How can I help with your order?',
  }
}


// ============================================================
// CHAT HANDLER
// ============================================================

async function handleChat(req, res) {
  try {
    const {
      message,
      cart = [],
    } = req.body

    // --------------------------------------------------------
    // Validate message
    // --------------------------------------------------------

    if (
      typeof message !== 'string' ||
      !message.trim()
    ) {
      return res.status(400).json({
        action: 'chat',
        items: [],
        reply:
          'What can I help you discover today?',
      })
    }

    // --------------------------------------------------------
    // Cart summary
    // --------------------------------------------------------

    const cartSummary =
      Array.isArray(cart) &&
      cart.length > 0
        ? cart
            .map(
              (item) =>
                `${item.quantity}x ${item.name} - ₹${item.price}`
            )
            .join('\n')
        : 'Cart is empty.'

    const cartTotal =
      Array.isArray(cart)
        ? cart.reduce(
            (sum, item) =>
              sum +
              Number(item.price || 0) *
                Number(item.quantity || 0),
            0
          )
        : 0

    // --------------------------------------------------------
    // AI SYSTEM PROMPT
    // --------------------------------------------------------

    const systemPrompt = `
You are Basils AI Concierge for Basils & Brew.

Basils & Brew is a premium cloud kitchen focused on artisan coffee and fresh pasta.

Your job is to help customers:

- discover menu items
- recommend coffee
- recommend pasta
- suggest pairings
- understand prices
- manage their cart
- build meals within a budget
- answer simple menu questions

You have access to the REAL MENU below.

============================================================
CURRENT CART
============================================================

${cartSummary}

CURRENT CART TOTAL:

₹${cartTotal}

============================================================
REAL MENU
============================================================

${MENU_TEXT}

============================================================
STRICT RULES
============================================================

ONLY use products that exist in the menu.

NEVER invent:
- products
- prices
- IDs
- categories
- menu items

Always use the exact product ID from the menu.

For example:

Espresso

has ID:

espresso

Flat White

has ID:

flat-white

Alfredo

has ID:

alfredo

============================================================
CART RULES
============================================================

If the user asks to ADD something:

Use:

add_to_cart

If the user asks to REMOVE something:

Use:

remove_from_cart

If the user asks to change quantity:

Use:

update_quantity

If the user asks to clear everything:

Use:

clear_cart

If the user asks:

"What's in my cart?"

Use:

show_cart

If the user asks for recommendations:

Use:

recommend

Do NOT automatically add recommended items.

============================================================
BUDGET RULES
============================================================

If the user gives a budget:

Calculate using the REAL MENU prices.

Never invent a price.

Example:

Budget ₹600

Possible combination:

Alfredo ₹320
Cappuccino ₹180

Total ₹500

This is valid.

If something costs more than the budget, do not recommend it as being within budget.

============================================================
PAIRING RULES
============================================================

Creamy pasta:

Prefer:
- Espresso
- Americano
- Flat White
- Cappuccino

Spicy pasta:

Prefer:
- Latte
- Cappuccino
- Basil Honey Latte

Pesto / basil pasta:

Prefer:
- Basil Honey Latte
- Flat White
- Latte

Rich pasta:

Prefer:
- Espresso
- Americano
- Flat White

Light pasta:

Prefer:
- Americano
- Cold Brew

============================================================
IMPORTANT
============================================================

The customer may ask natural questions.

For example:

"Why does flat white pair with creamy pasta?"

Answer naturally.

Do NOT claim that the pairing is objectively proven.

Frame pairing advice as a flavor recommendation.

For example:

"Flat White works nicely with creamy pasta because its espresso-forward flavor gives the rich sauce a stronger coffee contrast without adding much sweetness."

============================================================
CURRENT CART AWARENESS
============================================================

If the customer already has an item in the cart:

Do not recommend adding the same item again unless they specifically ask for another quantity.

If the customer says:

"I already have Alfredo"

treat Alfredo as already purchased.

============================================================
MEAL BUILDING
============================================================

If the user asks:

"Build me a meal under ₹600"

Choose a sensible combination from the real menu.

Prefer:

1 pasta
2 coffee

when the user asks for a complete meal.

If the budget cannot support both:

Explain that clearly.

============================================================
RESPONSE FORMAT
============================================================

RETURN ONLY VALID JSON.

Never return markdown.

Never return code fences.

Never return explanations outside JSON.

The JSON must have exactly this structure:

{
  "action": "chat",
  "items": [],
  "reply": "Your response here"
}

============================================================
AVAILABLE ACTIONS
============================================================

add_to_cart

remove_from_cart

update_quantity

clear_cart

show_cart

recommend

chat

============================================================
EXAMPLE: ADD
============================================================

User:

"Add an espresso"

Return:

{
  "action": "add_to_cart",
  "items": [
    {
      "id": "espresso",
      "quantity": 1
    }
  ],
  "reply": "Done. I added an Espresso to your cart."
}

============================================================
EXAMPLE: REMOVE
============================================================

User:

"Remove the espresso"

Return:

{
  "action": "remove_from_cart",
  "items": [
    {
      "id": "espresso",
      "quantity": 1
    }
  ],
  "reply": "Done. I removed the Espresso from your cart."
}

============================================================
EXAMPLE: ADD MULTIPLE
============================================================

User:

"Add two cappuccinos"

Return:

{
  "action": "add_to_cart",
  "items": [
    {
      "id": "cappuccino",
      "quantity": 2
    }
  ],
  "reply": "Done. I added 2 Cappuccinos to your cart."
}

============================================================
EXAMPLE: RECOMMENDATION
============================================================

User:

"What goes well with Alfredo?"

Return:

{
  "action": "recommend",
  "items": [
    {
      "id": "flat-white",
      "quantity": 1
    }
  ],
  "reply": "I'd pair Alfredo with a Flat White. The espresso-forward coffee gives the creamy pasta a pleasant contrast without adding extra sweetness."
}

============================================================
EXAMPLE: BUDGET
============================================================

User:

"Build me a meal under ₹600"

Return:

{
  "action": "recommend",
  "items": [
    {
      "id": "alfredo",
      "quantity": 1
    },
    {
      "id": "cappuccino",
      "quantity": 1
    }
  ],
  "reply": "For ₹600, I'd choose Alfredo at ₹320 and Cappuccino at ₹180. Total: ₹500."
}

============================================================
EXAMPLE: CART
============================================================

User:

"What's in my cart?"

Return:

{
  "action": "show_cart",
  "items": [],
  "reply": "You currently have 2 Cappuccinos in your cart for ₹360."
}

============================================================
FINAL RULE
============================================================

Return ONLY JSON.
`


    // --------------------------------------------------------
    // SEND TO SELECTED AI PROVIDER
    // --------------------------------------------------------

    const useGroq = AI_PROVIDER === 'groq'

    if (useGroq && (!GROQ_API_KEY || !GROQ_MODEL)) {
      return res.status(500).json({
        action: 'chat',
        items: [],
        reply: 'The hosted AI service is not configured yet.',
      })
    }

    if (!useGroq && AI_PROVIDER !== 'ollama') {
      return res.status(500).json({
        action: 'chat',
        items: [],
        reply: 'The AI provider configuration is invalid.',
      })
    }

    const aiResponse = await fetch(
      useGroq ? GROQ_API_URL : OLLAMA_URL,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          ...(useGroq
            ? { Authorization: `Bearer ${GROQ_API_KEY}` }
            : {}),
        },

        body: JSON.stringify(
          useGroq
            ? {
                model: GROQ_MODEL,
                stream: false,
                response_format: { type: 'json_object' },
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: message.trim() },
                ],
                temperature: 0.2,
              }
            : {
                model: OLLAMA_MODEL,
                stream: false,
                format: 'json',
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: message.trim() },
                ],
                options: {
                  temperature: 0.2,
                },
              }
        ),
      }
    )

    // --------------------------------------------------------
    // AI PROVIDER ERROR
    // --------------------------------------------------------

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text()

      console.error(
        `${AI_PROVIDER} error (${aiResponse.status}):`,
        errorText
      )

      return res.status(502).json({
        action: 'chat',
        items: [],
        reply:
          'My AI assistant is temporarily unavailable. Please try again shortly.',
      })
    }

    // --------------------------------------------------------
    // READ PROVIDER RESPONSE
    // --------------------------------------------------------

    const data = await aiResponse.json()

    const raw = useGroq
      ? data?.choices?.[0]?.message?.content || ''
      : data?.message?.content || ''

    console.log('\nAI RAW RESPONSE:\n', raw)

    // --------------------------------------------------------
    // PARSE JSON
    // --------------------------------------------------------

    let result

    try {
      result = JSON.parse(
        raw
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim()
      )
    } catch (error) {
      console.error(
        'Invalid AI JSON:',
        raw
      )

      return res.json({
        action: 'chat',
        items: [],
        reply:
          'I understood your request, but I had trouble formatting the response. Please try asking again.',
      })
    }

    // --------------------------------------------------------
    // CLEAN + VALIDATE AI RESPONSE
    // --------------------------------------------------------

    const cleanedResult =
      cleanAIResult(result, message)

    console.log(
      '\nAI CLEAN RESPONSE:\n',
      cleanedResult
    )

    // --------------------------------------------------------
    // RETURN TO FRONTEND
    // --------------------------------------------------------

    return res.json(
      cleanedResult
    )
  } catch (error) {
    console.error(
      '\nCONCIERGE ERROR:\n',
      error
    )

    return res.status(500).json({
      action: 'chat',
      items: [],
      reply:
        'I am having trouble connecting to the local AI assistant.',
    })
  }
}

// ============================================================
// ORDER CREATION
// ============================================================

async function handleCreateOrder(req, res) {
  try {
    const {
      items,
      paymentMethod,
      delivery,
    } = req.body

    // --------------------------------------------------------
    // Validate cart
    // --------------------------------------------------------

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Your cart is empty.',
      })
    }

    if (items.length > 20) {
      return res.status(400).json({
        error: 'Too many different products in one order.',
      })
    }

    const validPaymentMethods = ['upi', 'card', 'cod']

    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        error: 'Invalid payment method.',
      })
    }

    // --------------------------------------------------------
    // Validate products and quantities against real menu
    // --------------------------------------------------------

    const quantities = new Map()

    for (const item of items) {
      if (
        typeof item.id !== 'string' ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 20
      ) {
        return res.status(400).json({
          error: 'Invalid product or quantity.',
        })
      }

      const product = MENU.find(
        (menuItem) => menuItem.id === item.id
      )

      if (!product) {
        return res.status(400).json({
          error: `Product "${item.id}" is not available.`,
        })
      }

      const updatedQuantity =
        (quantities.get(product.id) || 0) + item.quantity

      if (updatedQuantity > 20) {
        return res.status(400).json({
          error: 'Maximum quantity per product is 20.',
        })
      }

      quantities.set(product.id, updatedQuantity)
    }

    // --------------------------------------------------------
    // Calculate prices on the server
    // --------------------------------------------------------

    const orderItems = [...quantities.entries()].map(
      ([productId, quantity]) => {
        const product = MENU.find(
          (item) => item.id === productId
        )

        return {
          product_id: product.id,
          product_name: product.name,
          quantity,
          unit_price: product.price,
        }
      }
    )

    const subtotal = orderItems.reduce(
      (sum, item) =>
        sum + item.unit_price * item.quantity,
      0
    )

    const deliveryFee = 40
    const taxes = Math.round(subtotal * 0.05)
    const total = subtotal + deliveryFee + taxes

    // --------------------------------------------------------
    // Validate delivery information
    // --------------------------------------------------------

   
const name = delivery?.name?.trim() || ''

const phone = String(delivery?.phone ?? '')
  .trim()
  .replace(/[\s()-]/g, '')

const street = delivery?.street?.trim() || ''
const city = delivery?.city?.trim() || ''
const postcode = delivery?.postcode?.trim() || ''

// Validate each field separately
if (name.length < 2 || name.length > 100) {
  return res.status(400).json({
    field: 'name',
    error: 'Please enter a name between 2 and 100 characters.',
  })
}

const validPhone =
  /^(?:\+[1-9]\d{7,14}|[6-9]\d{9})$/.test(phone)

if (!validPhone) {
  return res.status(400).json({
    field: 'phone',
    error: 'Please enter a valid phone number. Include your country code for international numbers.',
  })
}

if (street.length < 5 || street.length > 250) {
  return res.status(400).json({
    field: 'street',
    error: 'Please enter a street address between 5 and 250 characters.',
  })
}

if (city.length < 2 || city.length > 100) {
  return res.status(400).json({
    field: 'city',
    error: 'Please enter a valid city name.',
  })
}

if (!/^\d{6}$/.test(postcode)) {
  return res.status(400).json({
    field: 'postcode',
    error: 'Please enter a valid 6-digit PIN code.',
  })
}


    // --------------------------------------------------------
    // Save order and items atomically in Supabase
    // --------------------------------------------------------

    const { data: orderId, error } =
      await supabaseAdmin.rpc(
        'create_order_with_items',
        {
          p_user_id: req.user.id,
          p_total_amount: total,
          p_payment_method: paymentMethod,
          p_delivery_name: name,
          p_delivery_phone: phone,
          p_delivery_street: street,
          p_delivery_city: city,
          p_delivery_postcode: postcode,
          p_items: orderItems,
        }
      )

    if (error) {
      console.error('ORDER DATABASE ERROR:', error)

      return res.status(500).json({
        error: 'Unable to save your order. Please try again.',
      })
    }

    // --------------------------------------------------------
    // Return confirmation
    // --------------------------------------------------------

    return res.status(201).json({
      success: true,
      orderId,
      subtotal,
      deliveryFee,
      taxes,
      total,
      paymentStatus: 'test_pending',
      orderStatus: 'pending',
      message: 'Your demo order has been placed successfully.',
    })
  } catch (error) {
    console.error('ORDER CREATION ERROR:', error)

    return res.status(500).json({
      error: 'Something went wrong while placing your order.',
    })
  }
}

// ============================================================
// API ROUTES
// ============================================================

// Your frontend currently uses /chat.
app.post('/api/orders', requireAuth, handleCreateOrder)
app.post('/chat', handleChat)

// Keep this route too, so the API remains compatible
// with the earlier version of the application.
app.post('/api/concierge', handleChat)

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Basils & Brew AI Concierge',
    model: MODEL,
    ollama: OLLAMA_URL,
  })
})

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, '0.0.0.0', () => {
  console.log('')
  console.log('==========================================')
  console.log(' Basils & Brew AI server')
  console.log('==========================================')
  console.log(
    ` Server: http://localhost:${PORT}`
  )
  console.log(
    ` Chat:   http://localhost:${PORT}/chat`
  )
  console.log(
    ` API:    http://localhost:${PORT}/api/concierge`
  )
  console.log(
    ` Model:  ${MODEL}`
  )
  console.log('==========================================')
  console.log('')
})