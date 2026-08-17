import { Home, Coffee, Utensils, ShoppingCart, Info } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function BottomNav() {
  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 md:hidden">
      <div className="flex items-center gap-6 rounded-full border border-gray-200 bg-white px-6 py-3 shadow-xl">
        <Link to="/"><Home size={22} /></Link>
        <Link to="/coffee"><Coffee size={22} /></Link>
        <Link to="/pasta"><Utensils size={22} /></Link>
        <Link to="/cart"><ShoppingCart size={22} /></Link>
        <Link to="/about"><Info size={22} /></Link>
      </div>
    </div>
  )
}