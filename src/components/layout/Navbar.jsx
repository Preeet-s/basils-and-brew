
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ShoppingBag,
  UserRound,
  Menu,
  X,
  Leaf,
} from 'lucide-react'
import { useCart } from '../../store/cartStore.jsx'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Coffee', path: '/coffee' },
  { label: 'Pasta', path: '/pasta' },
  { label: 'About', path: '/about' },
]

export default function Navbar() {
  const { totalItems } = useCart()
  const location = useLocation()

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 35)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isActive = (path) => location.pathname === path

  const navLinkClass = (path) => `
    relative whitespace-nowrap py-2 text-[12px]
    font-semibold uppercase tracking-[0.15em]
    transition-colors duration-300
    ${
      isActive(path)
        ? 'text-[#2E5836]'
        : 'text-[#50392F] hover:text-[#2E5836]'
    }
    after:absolute after:bottom-0 after:left-0
    after:h-[2px] after:bg-[#2E5836]
    after:transition-all after:duration-300
    ${isActive(path) ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
  `

  return (
    <header className="sticky top-0 z-50">

      {/* Announcement strip */}
      <div
        className={`overflow-hidden bg-[#2E5836]
          transition-all duration-300 ease-in-out
          ${
            isScrolled
              ? 'max-h-0 opacity-0'
              : 'max-h-10 opacity-100'
          }`}
      >
        <div className="mx-auto flex h-9 max-w-7xl
          items-center justify-center gap-2 px-4"
        >
          <Leaf
            size={12}
            className="shrink-0 text-[#D7DFC9]"
          />

          <p className="text-center text-[9px] font-medium
            uppercase tracking-[0.16em] text-[#F8F6F0]
            sm:text-[10px] sm:tracking-[0.19em]"
          >
            A little pause, a lot of flavour.
          </p>

          <span className="hidden text-[#A9BEA4] sm:inline">
            ·
          </span>

          <p className="hidden text-[9px] font-medium
            uppercase tracking-[0.16em] text-[#D7DFC9]
            sm:block"
          >
            Crafted with care 🍝, Made with Love ❤️☕️
          </p>
        </div>
      </div>

      {/* Floating header */}
      <div className={`px-3 transition-all duration-300
        sm:px-5 lg:px-8
        ${isScrolled ? 'pt-2' : 'pt-3'}
      `}>
        <div
          className={`relative mx-auto max-w-7xl
            border border-[#E8E1D6]
            bg-[#F8F6F0]/95 backdrop-blur-xl
            transition-all duration-300 ease-in-out
            ${
              isScrolled
                ? 'rounded-xl shadow-[0_8px_30px_rgba(46,88,54,0.10)]'
                : 'rounded-2xl shadow-[0_5px_25px_rgba(70,55,40,0.06)]'
            }
          `}
        >

          {/* Main header row */}
          <div className={`relative flex items-center
            justify-between gap-3 px-4 transition-all
            duration-300 sm:px-7
            ${isScrolled ? 'min-h-[66px]' : 'min-h-[88px]'}
          `}>

            {/* LEFT: Logo and wordmark */}
            <Link
              to="/"
              aria-label="Basils & Brew Home"
              className="relative z-10 flex shrink-0
                items-center gap-2.5"
            >
              <img
                src="/basils-brew-logo.png"
                alt="Basils & Brew logo"
                className={`block h-10 w-10 shrink-0
                  object-contain transition-all duration-300
                  sm:h-12 sm:w-12
                  ${isScrolled ? 'sm:!h-10 sm:!w-10' : ''}`}
              />

              <div className="flex flex-col justify-center">
                <span
                  className={`whitespace-nowrap font-semibold
                    leading-none tracking-tight text-[#50392F]
                    transition-all duration-300
                    ${isScrolled ? 'text-xl' : 'text-xl sm:text-2xl'}
                  `}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Basils & Brew
                </span>

                <span
                  className="mt-1 whitespace-nowrap text-[7px]
                    font-medium uppercase tracking-[0.13em]
                    text-[#858078] sm:text-[8px]
                    sm:tracking-[0.16em]"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  Coffee · Pasta · Concierge
                </span>
              </div>
            </Link>

            {/* CENTER: Desktop navigation */}
            <nav
              className="absolute left-1/2 hidden
                -translate-x-1/2 items-center gap-6
                lg:flex xl:gap-9"
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={navLinkClass(item.path)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* RIGHT: Desktop actions */}
            <div className="relative z-10 ml-auto hidden
              shrink-0 items-center gap-4 lg:flex xl:gap-6"
            >
              <Link
                to="/cart"
                aria-label={`Shopping cart, ${totalItems} items`}
                className={`relative flex items-center
                  justify-center rounded-full p-2.5
                  transition-colors hover:bg-[#EAEDE4]
                  ${
                    isActive('/cart')
                      ? 'text-[#2E5836]'
                      : 'text-[#50392F]'
                  }`}
              >
                <ShoppingBag size={21} strokeWidth={1.6} />

                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5
                    flex h-[17px] min-w-[17px] items-center
                    justify-center rounded-full bg-[#2E5836]
                    px-1 text-[9px] font-semibold text-white"
                  >
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                className={`flex items-center gap-2
                  rounded-full px-3 py-2 text-sm font-medium
                  transition-colors hover:bg-[#EAEDE4]
                  ${
                    isActive('/profile')
                      ? 'text-[#2E5836]'
                      : 'text-[#50392F]'
                  }`}
              >
                <UserRound size={19} strokeWidth={1.6} />
                <span>Account</span>
              </Link>
            </div>

{/* RIGHT: Mobile actions */}
<div className="relative z-20 ml-auto flex shrink-0
  items-center gap-2 lg:hidden"
>
  {/* Cart */}
  <Link
    to="/cart"
    aria-label={`Shopping cart, ${totalItems} items`}
    className="relative rounded-full p-2
      text-[#50392F] transition-colors hover:bg-[#EAEDE4]"
  >
    <ShoppingBag size={21} strokeWidth={1.7} />

    {totalItems > 0 && (
      <span className="absolute right-0 top-0
        flex h-4 min-w-4 items-center justify-center
        rounded-full bg-[#2E5836] px-1
        text-[9px] font-semibold text-white"
      >
        {totalItems}
      </span>
    )}
  </Link>

  {/* Account */}
  <Link
    to="/profile"
    aria-label="Account"
    className={`rounded-full p-2 transition-colors
      hover:bg-[#EAEDE4]
      ${
        isActive('/profile')
          ? 'text-[#2E5836]'
          : 'text-[#50392F]'
      }`}
  >
    <UserRound size={21} strokeWidth={1.7} />
  </Link>

  {/* Menu toggle */}
  <button
    type="button"
    onClick={() => setMobileOpen((prev) => !prev)}
    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={mobileOpen}
    className="rounded-full bg-[#EAEDE4] p-3
      text-[#50392F] transition-colors
      hover:bg-[#DDE5D8]"
  >
    {mobileOpen ? <X size={23} /> : <Menu size={23} />}
  </button>
</div>
{/* Mobile expandable navigation */}
{mobileOpen && (
  <div className="absolute left-0 right-0 top-full z-50
    mt-3 overflow-hidden rounded-2xl border
    border-[#E8E1D6] bg-[#F8F6F0]
    shadow-[0_12px_30px_rgba(70,55,40,0.12)]
    lg:hidden"
  >
    <nav className="flex flex-col px-5 py-3">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`border-b border-[#E8E1D6]/70
            py-4 text-sm font-semibold
            transition-colors last:border-0
            ${
              isActive(item.path)
                ? 'text-[#2E5836]'
                : 'text-[#50392F] hover:text-[#2E5836]'
            }`}
        >
          {item.label}
        </Link>
      ))}

      <Link
        to="/profile"
        className={`flex items-center gap-2 py-4
          text-sm font-semibold
          ${
            isActive('/profile')
              ? 'text-[#2E5836]'
              : 'text-[#50392F] hover:text-[#2E5836]'
          }`}
      >
        <UserRound size={18} />
        Account
      </Link>
    </nav>
  </div>
)}

          </div>
        </div>
      </div>
    </header>
  )
}
