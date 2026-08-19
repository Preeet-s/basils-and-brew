import { Link } from 'react-router-dom'
import { useCart } from '../../store/cartStore.jsx'

export default function Navbar() {
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center"
          aria-label="Basils & Brew Home"
        >
          <div className="flex flex-col items-center justify-center leading-none">

            {/* Logo Image */}
            <img
              src="basils-brew-logo.png"
              alt="Basils & Brew"
              className="h-16 w-15 object-contain"
            />

            {/* Brand Name */}
            <span
              className="mt-0.5 text-[17px] font-semibold tracking-tight text-[var(--espresso)]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Basils & Brew
            </span>

            {/* Tagline */}
            <span
              className="mt-1 whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.16em] text-gray-500"
              style={{
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Coffee • Pasta • Concierge
            </span>

          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="transition hover:text-[var(--basil)]">
            Home
          </Link>

          <Link to="/coffee" className="transition hover:text-[var(--basil)]">
            Coffee
          </Link>

          <Link to="/pasta" className="transition hover:text-[var(--basil)]">
            Pasta
          </Link>

          <Link
            to="/cart"
            className="relative transition hover:text-[var(--basil)]"
          >
            Cart

            {totalItems > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--basil)] text-xs text-white">
                {totalItems}
              </span>
            )}
          </Link>

          <Link to="/about" className="transition hover:text-[var(--basil)]">
            About
          </Link>
        </nav>

      </div>
    </header>
  )
}










