import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { coffeeItems } from '../data/menuItems'
import ProductCard from '../components/product/ProductCard'

const filters = ['All', 'Hot', 'Cold', 'Signature', 'Seasonal']

export default function Coffee() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredCoffee = useMemo(() => {
    if (activeFilter === 'All') return coffeeItems
    return coffeeItems.filter((item) => item.category === activeFilter)
  }, [activeFilter])

  return (
    <main className="bg-[var(--cream)] pb-28">
      {/* Hero */}
      <section className="relative h-[380px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80"
          alt="Coffee"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">
              Specialty Coffee
            </p>
            <h1 className="mt-3 text-5xl text-white md:text-7xl">
              Brewed with intention.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
              From bold espresso to our signature basil-inspired creations,
              every cup is crafted slowly and served fresh.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Menu */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--basil)]">
              Coffee Menu
            </p>
            <h2 className="mt-2 text-3xl text-[var(--espresso)] md:text-4xl">
              Choose your brew
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? 'bg-[var(--basil)] text-white'
                    : 'bg-white text-[var(--espresso)] shadow-sm hover:bg-[var(--sage)] hover:text-[var(--espresso)]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCoffee.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}