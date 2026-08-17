import { useState } from 'react'
import { useCart } from '../store/cartStore.jsx'
import { MapPin, Phone, CreditCard, Wallet, CircleCheck } from 'lucide-react'

export default function Checkout() {
  const { items, subtotal } = useCart()

  const deliveryFee = subtotal > 0 ? 40 : 0
  const taxes = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryFee + taxes

  const [payment, setPayment] = useState('upi')
  const [placed, setPlaced] = useState(false)

  if (placed) {
    return (
      <main className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center px-5 py-16">
        <div className="w-full rounded-[32px] bg-white p-10 text-center shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--sage)] text-[var(--basil)]">
            <CircleCheck size={42} />
          </div>
          <h1 className="mt-6 text-4xl text-[var(--espresso)] font-heading">
            Order confirmed
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Your order has been placed successfully.
          </p>
          <div className="mt-8 rounded-3xl bg-[var(--cream)] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--basil)]">
              Estimated delivery
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--espresso)]">
              22 to 28 minutes
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 pb-28">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--basil)]">
          Secure Checkout
        </p>
        <h1 className="mt-2 text-5xl text-[var(--espresso)] font-heading">
          Complete your order
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-[28px] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
            <div className="mb-6 flex items-center gap-3">
              <MapPin className="text-[var(--basil)]" />
              <h2 className="text-2xl text-[var(--espresso)] font-heading">
                Delivery address
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-2xl border border-gray-200 bg-[var(--cream)] px-4 py-3 outline-none focus:border-[var(--basil)]" placeholder="Full name" />
              <input className="rounded-2xl border border-gray-200 bg-[var(--cream)] px-4 py-3 outline-none focus:border-[var(--basil)]" placeholder="Phone number" />
              <input className="md:col-span-2 rounded-2xl border border-gray-200 bg-[var(--cream)] px-4 py-3 outline-none focus:border-[var(--basil)]" placeholder="Street address" />
              <input className="rounded-2xl border border-gray-200 bg-[var(--cream)] px-4 py-3 outline-none focus:border-[var(--basil)]" placeholder="City" />
              <input className="rounded-2xl border border-gray-200 bg-[var(--cream)] px-4 py-3 outline-none focus:border-[var(--basil)]" placeholder="PIN code" />
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
            <div className="mb-6 flex items-center gap-3">
              <Wallet className="text-[var(--basil)]" />
              <h2 className="text-2xl text-[var(--espresso)] font-heading">
                Payment method
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { id: 'upi', label: 'UPI / Google Pay / PhonePe' },
                { id: 'card', label: 'Credit / Debit Card' },
                { id: 'cod', label: 'Cash on Delivery' },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPayment(method.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-5 transition ${
                    payment === method.id
                      ? 'border-[var(--basil)] bg-[var(--sage)]/30'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-[var(--basil)]" />
                    <span className="font-medium text-[var(--espresso)]">
                      {method.label}
                    </span>
                  </div>
                  <div className={`h-5 w-5 rounded-full border ${
                    payment === method.id
                      ? 'border-[var(--basil)] bg-[var(--basil)]'
                      : 'border-gray-300'
                  }`} />
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="rounded-[28px] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)] lg:sticky lg:top-24 h-fit">
          <h2 className="text-2xl text-[var(--espresso)] font-heading">
            Order summary
          </h2>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--espresso)]">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-[var(--espresso)]">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="my-6 border-t border-gray-200" />

          <div className="space-y-3 text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>₹{taxes}</span>
            </div>
          </div>

          <div className="my-6 border-t border-gray-200" />

          <div className="flex items-center justify-between text-xl font-semibold text-[var(--espresso)]">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={() => setPlaced(true)}
            className="mt-6 flex w-full items-center justify-center rounded-full bg-[var(--basil)] px-6 py-4 text-lg font-semibold text-white transition hover:brightness-110"
          >
            Place order
          </button>
        </aside>
      </div>
    </main>
  )
}