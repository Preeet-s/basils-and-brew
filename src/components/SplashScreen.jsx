import { motion } from 'framer-motion'

export default function SplashScreen({ onComplete }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <video
        src="/basils-brew-intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={onComplete}
        className="h-full w-full object-cover"
      />

      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 rounded-full bg-black/10 px-4 py-2 text-sm text-black/60 backdrop-blur-md transition hover:bg-black/20"
      >
        Skip
      </button>
    </motion.div>
  )
}