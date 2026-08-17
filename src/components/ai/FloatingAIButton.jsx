import { Sparkles } from 'lucide-react'

export default function FloatingAIButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-5 z-[60] flex h-16 w-16 items-center justify-center rounded-full bg-[var(--basil)] text-white shadow-[0_20px_50px_rgba(46,125,50,0.35)] transition hover:scale-105 hover:brightness-110 md:bottom-8 md:right-8"
    >
      <Sparkles size={28} />
    </button>
  )
}