import { Link } from 'react-router-dom'
import { useCart } from '../store/cartStore.jsx'

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="text-5xl text-[var(--basil)] font-heading">
          Your Cart
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Your cart is currently empty.
        </p>
        <Link
          to="/coffee"
          className="mt-8 inline-flex rounded-full bg-[var(--basil)] px-6 py-3 font-semibold text-white"
        >
          Explore Coffee
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-16 pb-28">
      <h1 className="text-5xl text-[var(--basil)] font-heading">
        Your Cart
      </h1>

      <div className="mt-10 space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-[24px] bg-white p-6 shadow-[0_18px_48px_rgba(0,0,0,0.08)]"
          >
            <div>
              <h3 className="text-2xl text-[var(--espresso)] font-heading">
                {item.name}
              </h3>
              <p className="mt-1 text-gray-600">₹{item.price}</p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="h-10 w-10 rounded-full bg-[var(--cream)] text-xl"
              >
                −
              </button>

              <span className="w-6 text-center font-semibold">
                {item.quantity}
              </span>

              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="h-10 w-10 rounded-full bg-[var(--basil)] text-xl text-white"
              >
                +
              </button>

              <button
                onClick={() => removeItem(item.id)}
                className="ml-4 text-sm font-semibold text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-[28px] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between text-xl">
          <span>Subtotal</span>
          <span className="font-semibold text-[var(--espresso)]">
            ₹{subtotal}
          </span>
        </div>

        <Link
          to="/checkout"
          className="mt-6 flex w-full items-center justify-center rounded-full bg-[var(--basil)] px-6 py-4 text-lg font-semibold text-white transition hover:brightness-110"
        >
          Proceed to Checkout
        </Link>
      </div>
    </main>
  )
}