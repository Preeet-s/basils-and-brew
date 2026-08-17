import { motion } from 'framer-motion'

export default function SplashScreen() {
    
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
    >
      <div className="relative flex flex-col items-center">
        {/* Coffee stream */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 120 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="w-2 rounded-full bg-[var(--espresso)]"
        />

        {/* Cup */}
        <div className="relative mt-2 h-24 w-32 rounded-b-[40px] rounded-t-[18px] border-[6px] border-[var(--espresso)] bg-white">
          <div className="absolute right-[-22px] top-6 h-10 w-10 rounded-full border-[6px] border-[var(--espresso)] bg-white" />
        </div>

        {/* Steam */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.8 }}
          animate={{ opacity: 1, y: -18, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="absolute -top-10 flex flex-col items-center"
        >
          <motion.div
            animate={{ y: [-2, -10, -2] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-14 w-14 rounded-full bg-[var(--basil)]/18 blur-sm"
          />

          <motion.svg
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            width="52"
            height="64"
            viewBox="0 0 52 64"
            className="absolute -top-1"
          >
            <path
              d="M26 2 C38 8 48 22 46 36 C44 52 34 60 26 62 C18 60 8 52 6 36 C4 22 14 8 26 2 Z"
              fill="#2E7D32"
            />
            <path
              d="M26 10 C24 22 22 34 20 48"
              stroke="#A5D6A7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </motion.svg>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <h1 className="text-4xl text-[var(--basil)] font-heading md:text-5xl">
            Basils & Brew
          </h1>
          <p className="mt-2 text-gray-500">
            Where basil meets brew
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}