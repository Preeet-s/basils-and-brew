import { useState } from 'react'
import { X, Send, Sparkles, ShoppingCart } from 'lucide-react'
import ChatMessage from './ChatMessage'
import { useAIConcierge } from '../../hooks/useAIConcierge.js'
import { useCart } from '../../store/cartStore.jsx'

export default function AIConcierge({ open, onClose }) {
  const [input, setInput] = useState('')

  const {
    addItem,
    removeByName,
    updateQuantity,
    clearCart,
    items,
  } = useCart()

  const {
    messages,
    sendMessage,
    loading,
    recommendedMeal,
    addRecommendedMeal,
  } = useAIConcierge(
    addItem,
    removeByName,
    items,
    updateQuantity,
    clearCart
  )

  if (!open) {
    return null
  }

  const handleSubmit = () => {
    if (!input.trim() || loading) {
      return
    }

    sendMessage(input)

    setInput('')
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-[100dvh] w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex items-center justify-between border-b border-gray-200 p-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--basil)] text-white">
              <Sparkles size={20} />
            </div>

            <div>
              <h2 className="text-2xl text-[var(--espresso)] font-heading">
                Basils AI Concierge
              </h2>

              <p className="text-sm text-gray-500">
                Your coffee & pasta assistant
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition"
            aria-label="Close AI Concierge"
          >
            <X size={22} />
          </button>
        </div>

        {/* =====================================================
            MESSAGES
        ====================================================== */}

        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-3">
          {messages.map((msg, index) => (
            <ChatMessage
              key={`${index}-${msg.role}`}
              role={msg.role}
              text={msg.text}
            />
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-[#f7f2ed] px-4 py-3 text-sm text-[var(--espresso)]">
                <div className="flex items-center gap-1">
                  <span className="animate-pulse">•</span>
                  <span
                    className="animate-pulse"
                    style={{ animationDelay: '150ms' }}
                  >
                    •
                  </span>
                  <span
                    className="animate-pulse"
                    style={{ animationDelay: '300ms' }}
                  >
                    •
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            RECOMMENDED MEAL ACTION
        ====================================================== */}

        {recommendedMeal && (
          <div className="shrink-0 border-t border-gray-200 bg-[#faf8f5] p-4">
            <div className="mb-3 rounded-2xl border border-[#e6e0d8] bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles
                  size={17}
                  className="text-[var(--basil)]"
                />

                <span className="font-semibold text-[var(--espresso)]">
                  Recommended Meal
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between gap-3">
                  <span>
                    {recommendedMeal.coffee.name}
                  </span>

                  <span className="font-medium">
                    ₹{recommendedMeal.coffee.price}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>
                    {recommendedMeal.pasta.name}
                  </span>

                  <span className="font-medium">
                    ₹{recommendedMeal.pasta.price}
                  </span>
                </div>

                <div className="mt-2 border-t border-gray-100 pt-2 flex justify-between font-semibold text-[var(--espresso)]">
                  <span>Total</span>
                  <span>
                    ₹{recommendedMeal.total}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={addRecommendedMeal}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--basil)] px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart size={18} />

              Add Meal to Cart
            </button>
          </div>
        )}

        {/* =====================================================
            INPUT
        ====================================================== */}

        <div
          className="shrink-0 border-t border-gray-200 bg-white p-4"
          style={{
            paddingBottom:
              'calc(env(safe-area-inset-bottom, 0px) + 16px)',
          }}
        >
          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSubmit()
                }
              }}
              disabled={loading}
              placeholder="Ask for a recommendation..."
              className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--basil)] focus:ring-2 focus:ring-[var(--sage)]/40 disabled:bg-gray-50"
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--basil)] text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}