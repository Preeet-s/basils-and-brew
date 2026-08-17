import { menuItems, coffeeItems, pastaItems } from './menuItems'

const aiKnowledge = {
  greeting:
    'Welcome to Basils AI Concierge. I can recommend coffee and pasta pairings, answer menu questions, and help you build your order.',

  menuItems,

  coffeeItems,

  pastaItems,

  pairings: {
    'Pesto Basil': 'Basil Honey Latte',
    Alfredo: 'Flat White',
    Arrabbiata: 'Smoked Vanilla Cold Brew',
    'Espresso Pepper Pasta': 'Cappuccino',
  },

  recommendations: [
    'Basil Honey Latte + Pesto Basil',
    'Flat White + Alfredo',
    'Smoked Vanilla Cold Brew + Arrabbiata',
    'Cappuccino + Espresso Pepper Pasta',
  ],
}

export default aiKnowledge