import { Link } from 'react-router-dom'
import { useCart } from '../../store/cartStore.jsx'

export default function Navbar() {
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--basil)] text-white font-bold">
            B
          </div>
          <div>
            <h1 className="text-2xl text-[var(--basil)] font-heading">
              Basils & Brew
            </h1>
            <p className="text-sm text-gray-500">Where basil meets brew</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/">Home</Link>
          <Link to="/coffee">Coffee</Link>
          <Link to="/pasta">Pasta</Link>

          <Link to="/cart" className="relative">
            Cart
            {totalItems > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--basil)] text-xs text-white">
                {totalItems}
              </span>
            )}
          </Link>

          <Link to="/about">About</Link>
        </nav>
      </div>
    </header>
  )
}