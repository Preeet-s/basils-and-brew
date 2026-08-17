import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function CategoryCard({
  title,
  description,
  image,
  link,
  dark = false,
}) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.35 }}
      className="group relative h-[440px] overflow-hidden rounded-[32px] shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div
        className={`absolute inset-0 ${
          dark
            ? 'bg-gradient-to-t from-black/75 via-black/30 to-black/10'
            : 'bg-gradient-to-t from-black/60 via-black/20 to-black/5'
        }`}
      />

      <div className="relative z-10 flex h-full flex-col justify-end p-7">
        <h2 className="text-4xl text-white font-heading">{title}</h2>

        <p className="mt-3 max-w-sm text-base leading-relaxed text-white/90">
          {description}
        </p>

        <Link
          to={link}
          className="mt-6 inline-flex w-fit items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--espresso)] transition hover:bg-[var(--gold)] hover:text-white"
        >
          Explore {title}
        </Link>
      </div>
    </motion.div>
  )
}