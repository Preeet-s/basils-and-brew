import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()

const PORT = 3001
const OLLAMA_URL = 'http://localhost:11434/api/chat'
const MODEL = 'qwen3:4b-instruct'

app.use(cors())
app.use(express.json())

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

function cleanAIResult(result) {
  const validActions = [
    'add_to_cart',
    'remove_from_cart',
    'update_quantity',
    'clear_cart',
    'show_cart',
    'recommend',
    'chat',
  ]

  if (!validActions.includes(result.action)) {
    result.action = 'chat'
  }

  if (!Array.isArray(result.items)) {
    result.items = []
  }

  result.items = result.items
    .filter((item) =>
      MENU.some(
        (product) => product.id === item.id
      )
    )
    .map((item) => ({
      id: item.id,
      quantity: Math.max(
        1,
        Math.floor(Number(item.quantity) || 1)
      ),
    }))

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
    // SEND TO OLLAMA
    // --------------------------------------------------------

    const ollamaResponse =
      await fetch(OLLAMA_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          model: MODEL,

          stream: false,

          format: 'json',

          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },

            {
              role: 'user',
              content: message.trim(),
            },
          ],

          options: {
            temperature: 0.2,
          },
        }),
      })

    // --------------------------------------------------------
    // OLLAMA ERROR
    // --------------------------------------------------------

    if (!ollamaResponse.ok) {
      const errorText =
        await ollamaResponse.text()

      console.error(
        'Ollama error:',
        errorText
      )

      return res.status(500).json({
        action: 'chat',
        items: [],
        reply:
          'My local AI is unavailable right now. Please make sure Ollama is running.',
      })
    }

    // --------------------------------------------------------
    // READ OLLAMA RESPONSE
    // --------------------------------------------------------

    const data =
      await ollamaResponse.json()

    const raw =
      data?.message?.content || ''

    console.log(
      '\nAI RAW RESPONSE:\n',
      raw
    )

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
      cleanAIResult(result)

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
// API ROUTES
// ============================================================

// Your frontend currently uses /chat.
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

app.listen(PORT, () => {
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