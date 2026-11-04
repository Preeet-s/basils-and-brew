
import { useState } from 'react'
import { useCart } from '../store/cartStore.jsx'
import { supabase } from '../lib/supabase.js'
import {
  MapPin,
  CreditCard,
  Wallet,
  CircleCheck,
  LoaderCircle,
} from 'lucide-react'

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:3001'
).replace(/\/$/, '')

const initialDelivery = {
  name: '',
  phone: '',
  street: '',
  city: '',
  postcode: '',
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()

  const deliveryFee = subtotal > 0 ? 40 : 0
  const taxes = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryFee + taxes

  const [payment, setPayment] = useState('upi')
  const [delivery, setDelivery] = useState(initialDelivery)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [placed, setPlaced] = useState(null)

  
const handleDeliveryChange = (event) => {
  const { name, value } = event.target

  setDelivery((prev) => ({
    ...prev,
    [name]: value,
  }))

  setFieldErrors((prev) => ({
    ...prev,
    [name]: '',
  }))
}


  const handlePlaceOrder = async (event) => {
    event.preventDefault()

    if (loading) return
    
const errors = {}

if (delivery.name.trim().length < 2) {
  errors.name = 'Please enter your full name.'
}

const phone = delivery.phone.trim().replace(/[\s()-]/g, '')

if (!/^(?:\+[1-9]\d{7,14}|[6-9]\d{9})$/.test(phone)) {
  errors.phone = 'Please enter a valid phone number.'
}

if (delivery.street.trim().length < 5) {
  errors.street = 'Please enter a valid street address.'
}

if (delivery.city.trim().length < 2) {
  errors.city = 'Please enter a valid city.'
}

if (!/^\d{6}$/.test(delivery.postcode.trim())) {
  errors.postcode = 'Please enter a valid 6-digit PIN code.'
}

setFieldErrors(errors)

if (Object.keys(errors).length > 0) {
  return
}

    if (!items.length) {
      setError('Your cart is empty. Please add something first.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Get the currently logged-in customer
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        throw new Error(
          'Please log in before placing your order.'
        )
      }

      // Send the cart and delivery details to Express
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
          paymentMethod: payment,
          delivery,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.field) {
          setFieldErrors((prev) => ({
            ...prev,
            [result.field]: result.error,
          }))
        } else {
          setError(result.error || 'Unable to place your order.')
        }

        return
      }

      // Save the server confirmation before clearing the cart
      setPlaced(result)
      clearCart()
    } catch (err) {
      console.error('CHECKOUT ERROR:', err)

      setError(
        err.message ||
          'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // --------------------------------------------------------
  // ORDER CONFIRMATION
  // --------------------------------------------------------

  if (placed) {
    return (
      <main className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center px-5 py-16">
        <div className="w-full rounded-[32px] bg-white p-8 text-center shadow-[0_18px_48px_rgba(0,0,0,0.08)] md:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--sage)] text-[var(--basil)]">
            <CircleCheck size={42} />
          </div>

          <h1 className="mt-6 text-4xl text-[var(--espresso)] font-heading">
            Order confirmed
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Your order has been saved successfully.
          </p>

          <div className="mt-8 rounded-3xl bg-[var(--cream)] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--basil)]">
              Order ID
            </p>

            <p className="mt-2 break-all text-sm font-semibold text-[var(--espresso)]">
              {placed.orderId}
            </p>

            <div className="my-5 border-t border-gray-200" />

            <p className="text-sm uppercase tracking-[0.25em] text-[var(--basil)]">
              Order total
            </p>

            <p className="mt-2 text-3xl font-semibold text-[var(--espresso)]">
              ₹{placed.total}
            </p>

            <div className="my-5 border-t border-gray-200" />

            <p className="text-sm uppercase tracking-[0.2em] text-[var(--basil)]">
              Estimated delivery
            </p>

            <p className="mt-2 text-2xl font-semibold text-[var(--espresso)]">
              22 to 28 minutes
            </p>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Demo checkout: no real payment has been charged.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Payment status: {placed.paymentStatus}
          </p>
        </div>
      </main>
    )
  }

  // --------------------------------------------------------
  // EMPTY CART
  // --------------------------------------------------------

  if (!items.length) {
    return (
      <main className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
        <h1 className="text-4xl text-[var(--espresso)] font-heading">
          Your cart is empty
        </h1>

        <p className="mt-3 text-gray-500">
          Add something delicious before checking out.
        </p>
      </main>
    )
  }

  // --------------------------------------------------------
  // CHECKOUT
  // --------------------------------------------------------

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

      <form onSubmit={handlePlaceOrder} noValidate>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">

            
        {/* DELIVERY ADDRESS */}

        <section className="rounded-[28px] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
          <div className="mb-6 flex items-center gap-3">
            <MapPin className="text-[var(--basil)]" />

            <h2 className="text-2xl text-[var(--espresso)] font-heading">
              Delivery address
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {/* FULL NAME */}
            <div>
              <input
                name="name"
                value={delivery.name}
                onChange={handleDeliveryChange}
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                className={`w-full rounded-2xl border ${
                  fieldErrors.name ? 'border-red-500' : 'border-gray-200'
                } bg-[var(--cream)] px-4 py-3 outline-none focus:border-[var(--basil)]`}
                placeholder="Full name"
              />
              {fieldErrors.name && (
                <p className="mt-2 text-sm text-red-600">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <input
                name="phone"
                value={delivery.phone}
                onChange={handleDeliveryChange}
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={16}
                className={`w-full rounded-2xl border ${
                  fieldErrors.phone ? 'border-red-500' : 'border-gray-200'
                } bg-[var(--cream)] px-4 py-3 outline-none focus:border-[var(--basil)]`}
                placeholder="Phone number (+country code)"
              />
              {fieldErrors.phone && (
                <p className="mt-2 text-sm text-red-600">
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            {/* STREET ADDRESS */}
            <div className="md:col-span-2">
              <input
                name="street"
                value={delivery.street}
                onChange={handleDeliveryChange}
                required
                minLength={5}
                maxLength={250}
                autoComplete="street-address"
                className={`w-full rounded-2xl border ${
                  fieldErrors.street ? 'border-red-500' : 'border-gray-200'
                } bg-[var(--cream)] px-4 py-3 outline-none focus:border-[var(--basil)]`}
                placeholder="Street address"
              />
              {fieldErrors.street && (
                <p className="mt-2 text-sm text-red-600">
                  {fieldErrors.street}
                </p>
              )}
            </div>

            {/* CITY */}
            <div>
              <input
                name="city"
                value={delivery.city}
                onChange={handleDeliveryChange}
                required
                minLength={2}
                maxLength={100}
                autoComplete="address-level2"
                className={`w-full rounded-2xl border ${
                  fieldErrors.city ? 'border-red-500' : 'border-gray-200'
                } bg-[var(--cream)] px-4 py-3 outline-none focus:border-[var(--basil)]`}
                placeholder="City"
              />
              {fieldErrors.city && (
                <p className="mt-2 text-sm text-red-600">
                  {fieldErrors.city}
                </p>
              )}
            </div>

            {/* PIN CODE */}
            <div>
              <input
                name="postcode"
                value={delivery.postcode}
                onChange={handleDeliveryChange}
                required
                pattern="[0-9]{6}"
                inputMode="numeric"
                maxLength={6}
                autoComplete="postal-code"
                className={`w-full rounded-2xl border ${
                  fieldErrors.postcode ? 'border-red-500' : 'border-gray-200'
                } bg-[var(--cream)] px-4 py-3 outline-none focus:border-[var(--basil)]`}
                placeholder="PIN code"
              />
              {fieldErrors.postcode && (
                <p className="mt-2 text-sm text-red-600">
                  {fieldErrors.postcode}
                </p>
              )}
            </div>

          </div>
        </section>


            {/* PAYMENT METHOD */}

            <section className="rounded-[28px] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
              <div className="mb-6 flex items-center gap-3">
                <Wallet className="text-[var(--basil)]" />

                <h2 className="text-2xl text-[var(--espresso)] font-heading">
                  Payment method
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    id: 'upi',
                    label: 'UPI / Google Pay / PhonePe',
                  },
                  {
                    id: 'card',
                    label: 'Credit / Debit Card',
                  },
                  {
                    id: 'cod',
                    label: 'Cash on Delivery',
                  },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
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

                    <div
                      className={`h-5 w-5 rounded-full border ${
                        payment === method.id
                          ? 'border-[var(--basil)] bg-[var(--basil)]'
                          : 'border-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Demo checkout only. No real payment will be processed.
              </p>
            </section>
          </div>

          {/* ORDER SUMMARY */}

          <aside className="h-fit rounded-[28px] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)] lg:sticky lg:top-24">
            <h2 className="text-2xl text-[var(--espresso)] font-heading">
              Order summary
            </h2>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
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

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--basil)] px-6 py-4 text-lg font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={20} className="animate-spin" />
                  Placing order...
                </>
              ) : (
                'Place order'
              )}
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              Your order will be saved to your account.
            </p>
          </aside>
        </div>
      </form>
    </main>
  )
}
