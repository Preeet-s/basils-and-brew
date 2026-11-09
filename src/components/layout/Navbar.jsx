
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserRound, Leaf } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)

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

  const isActive = location.pathname === '/profile'

  return (
    <header className="sticky top-0 z-50">

      {/* Announcement strip */}
      <div className="bg-[#2E5836] px-3 py-2.5 sm:px-4">
        <div className="mx-auto flex max-w-7xl flex-col
          items-center justify-center gap-1 sm:flex-row sm:gap-3"
        >
          <div className="flex items-center justify-center gap-2">
            <Leaf
              size={13}
              className="shrink-0 text-[#D7DFC9]"
            />

            <p className="text-center text-[9px] font-medium
              uppercase tracking-[0.13em] text-[#F8F6F0]
              sm:text-[10px] sm:tracking-[0.17em]"
            >
              A little pause, a lot of flavour.
            </p>
          </div>

          <span className="hidden text-[#A9BEA4] sm:inline">
            ·
          </span>

          <p className="text-center text-[8px] font-medium
            uppercase tracking-[0.12em] text-[#D7DFC9]
            sm:text-[9px] sm:tracking-[0.15em]"
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
          className={`mx-auto max-w-7xl border
            border-[#E8E1D6] bg-[#F8F6F0]/95
            backdrop-blur-xl transition-all duration-300
            ${
              isScrolled
                ? 'rounded-xl shadow-[0_8px_30px_rgba(46,88,54,0.10)]'
                : 'rounded-2xl shadow-[0_5px_25px_rgba(70,55,40,0.06)]'
            }
          `}
        >

          {/* Header content */}
          <div className={`flex w-full items-center
            justify-between gap-3 px-4 sm:px-7
            ${isScrolled ? 'min-h-[66px]' : 'min-h-[78px] sm:min-h-[88px]'}
          `}>

            {/* Brand */}
            <Link
              to="/"
              aria-label="Basils & Brew Home"
              className="!flex !flex-none !justify-start
  items-center gap-2.5"
            >
              <img
                src="/basils-brew-logo.png"
                alt="Basils & Brew logo"
                className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
              />

              <div className="flex min-w-0 flex-col justify-center">
                <span
                  className="whitespace-nowrap text-[19px]
                    font-semibold leading-none tracking-tight
                    text-[#50392F] sm:text-2xl"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Basils & Brew
                </span>

                <span
                  className="mt-1 whitespace-nowrap text-[7px]
                    font-medium uppercase tracking-[0.10em]
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

            {/* Account */}
            <Link
              to="/profile"
              aria-label="My Account"
              title="My Account"
              className={`ml-auto flex h-10 w-10 shrink-0
  items-center justify-center rounded-full
  transition-colors hover:bg-[#EAEDE4]
  ${
    isActive
      ? 'bg-[#EAEDE4] text-[#2E5836]'
      : 'text-[#50392F]'
  }`}
            >
              <UserRound size={22} strokeWidth={1.7} />
            </Link>

          </div>
        </div>
      </div>
    </header>
  )
}
