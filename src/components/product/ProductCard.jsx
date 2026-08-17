import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useCart } from '../../store/cartStore.jsx'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-[28px] bg-white shadow-[0_18px_48px_rgba(0,0,0,0.08)]"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--basil)] backdrop-blur">
          {product.category}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl text-[var(--espresso)] font-heading">
              {product.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>
          </div>

          {product.veg && (
            <div className="h-5 w-5 rounded border border-[var(--basil)] p-1">
              <div className="h-full w-full rounded-full bg-[var(--basil)]" />
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-2xl font-semibold text-[var(--espresso)]">
            ₹{product.price}
          </p>

          <button
            onClick={() => addItem(product)}
            className="flex items-center gap-2 rounded-full bg-[var(--basil)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  )
}