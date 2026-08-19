import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { pastaItems } from '../data/menuItems'
import ProductCard from '../components/product/ProductCard'

const filters = [
  'All',
  'Creamy',
  'Tomato',
  'Pesto',
  'Signature',
]

export default function Pasta() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredPasta = useMemo(() => {
    if (activeFilter === 'All') {
      return pastaItems
    }

    return pastaItems.filter((item) => {
      const category = String(item.category || '').toLowerCase()
      const subcategory = String(item.subcategory || '').toLowerCase()

      const tags = Array.isArray(item.tags)
        ? item.tags.map((tag) => String(tag).toLowerCase())
        : []

      const filter = activeFilter.toLowerCase()

      return (
        category === filter ||
        subcategory === filter ||
        tags.includes(filter)
      )
    })
  }, [activeFilter])

  const heroImage = pastaItems[0]?.image

  return (
    <main className="bg-[var(--cream)] pb-28">

      {/* Hero */}
      <section className="relative h-[380px] overflow-hidden">

        <img
          src={heroImage}
          alt="Handmade Pasta"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-5">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >

            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">
              Handmade Pasta
            </p>

            <h1 className="mt-3 text-5xl text-white md:text-7xl">
              Freshly basil-ed.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
              Italian classics, creamy comfort bowls, fresh basil
              pesto, and signature pasta creations made fresh for
              every order.
            </p>

          </motion.div>

        </div>

      </section>

      {/* Menu */}
      <section className="mx-auto max-w-7xl px-5 py-12">

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--basil)]">
              Pasta Menu
            </p>

            <h2 className="mt-2 text-3xl text-[var(--espresso)] md:text-4xl">
              Choose your pasta
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">

            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? 'bg-[var(--basil)] text-white'
                    : 'bg-white text-[var(--espresso)] shadow-sm hover:bg-[var(--sage)]'
                }`}
              >
                {filter}
              </button>
            ))}

          </div>

        </div>

        {/* Products */}
        {filteredPasta.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredPasta.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>
        ) : (
          <div className="rounded-[28px] bg-white p-12 text-center shadow-sm">

            <p className="text-lg text-[var(--espresso)]">
              No pasta found in this category.
            </p>

            <button
              type="button"
              onClick={() => setActiveFilter('All')}
              className="mt-4 rounded-full bg-[var(--basil)] px-5 py-3 text-sm font-semibold text-white"
            >
              View all pasta
            </button>

          </div>
        )}

      </section>

    </main>
  )
}