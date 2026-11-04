
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const [mode, setMode] = useState('login')
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')

  const [profileName, setProfileName] = useState('')
  const [phone, setPhone] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [editing, setEditing] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Order history state
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  const [expandedOrder, setExpandedOrder] = useState(null)

  // Authentication listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load customer profile
  useEffect(() => {
    if (!user) {
      setProfileName('')
      setPhone('')
      return
    }

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Profile loading error:', error.message)
        return
      }

      setProfileName(
        data.full_name || user.user_metadata?.full_name || ''
      )
      setPhone(data.phone || '')
    }

    loadProfile()
  }, [user])

  // Load customer's order history
  useEffect(() => {
    if (!user || activeTab !== 'orders') return

    let isMounted = true

    const loadOrders = async () => {
      setOrdersLoading(true)
      setOrdersError('')

      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            payment_method,
            payment_status,
            order_status,
            created_at,
            delivery_name,
            delivery_phone,
            delivery_street,
            delivery_city,
            delivery_postcode,
            order_items (
              id,
              product_id,
              product_name,
              quantity,
              unit_price
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        if (isMounted) {
          setOrders(data || [])
        }
      } catch (err) {
        console.error('Order history error:', err.message)

        if (isMounted) {
  setOrdersError(err.message || 'Unable to load your orders.')
}
      } finally {
        if (isMounted) {
          setOrdersLoading(false)
        }
      }
    }

    loadOrders()

    return () => {
      isMounted = false
    }
  }, [user, activeTab])

  // Login and signup
  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setMessage('')

    const cleanEmail = email.trim().toLowerCase()

    // Signup validations
    if (mode === 'signup') {
      if (fullName.trim().length < 2) {
        setError('Please enter a name with at least 2 characters.')
        return
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!emailPattern.test(cleanEmail)) {
        setError('Please enter a valid email address.')
        return
      }

      if (password.length < 8) {
        setError('Your password must contain at least 8 characters.')
        return
      }

      if (password !== confirmPassword) {
        setError('Your passwords do not match. Please try again.')
        return
      }
    }

    if (mode === 'login' && (!cleanEmail || !password)) {
      setError('Please enter your email address and password.')
      return
    }

    setLoading(true)

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        })

        if (error) throw error

        setPassword('')
        setConfirmPassword('')

        if (data.session) {
          setMessage('Your account has been created successfully!')
        } else {
          setMode('login')
          setMessage(
            'Account created! Please check your email and verify your address before signing in.'
          )
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        })

        if (error) throw error

        setPassword('')
        setConfirmPassword('')
        setMessage('Welcome back!')
      }
    } catch (err) {
      const errorMessage = err.message || ''

      if (errorMessage.toLowerCase().includes('already registered')) {
        setError('An account with this email already exists. Please sign in.')
      } else if (errorMessage.toLowerCase().includes('invalid login')) {
        setError('Incorrect email or password. Please try again.')
      } else {
        setError(errorMessage || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Save profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault()

    if (!profileName.trim() || profileName.trim().length < 2) {
      setError('Please enter a name with at least 2 characters.')
      return
    }

    setProfileLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileName.trim(),
          phone: phone.trim(),
        })
        .eq('id', user.id)

      if (error) throw error

      setEditing(false)
      setMessage('Your profile has been updated successfully!')
    } catch (err) {
      setError(err.message || 'Unable to update your profile.')
    } finally {
      setProfileLoading(false)
    }
  }

  // Logout
  const handleLogout = async () => {
    setError('')

    const { error } = await supabase.auth.signOut()

    if (error) {
      setError(error.message)
    } else {
      setMessage('You have been signed out successfully.')
      setEditing(false)
      setMode('login')
      setPassword('')
      setConfirmPassword('')
      setOrders([])
      setActiveTab('profile')
    }
  }

  // Switch between login and signup
  const changeMode = (nextMode) => {
    setMode(nextMode)
    setError('')
    setMessage('')
    setPassword('')
    setConfirmPassword('')
  }

  // Format currency
  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString('en-IN')}`

  // Format order date
  const formatDate = (date) =>
    new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })

  // Format status labels
  const formatStatus = (status) =>
    (status || 'unknown')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase())

  return (
    <main className="relative min-h-[80vh] overflow-hidden bg-[var(--cream)] px-5 py-20">
      <img
        src="/logo-mark.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-40 w-[420px] opacity-[0.035]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--basil)]">
            Your Table Awaits
          </p>

          <h1 className="mt-5 text-5xl leading-tight text-[var(--espresso)] md:text-6xl">
            {user ? 'Welcome back.' : 'A little more personal.'}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            {user
              ? 'Your Basils & Brew experience, all in one place.'
              : 'Create your account and make every visit feel familiar.'}
          </p>
        </motion.div>

        {/* Account tabs */}
        {user && (
          <div className="mx-auto mt-10 flex max-w-md rounded-full bg-white p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setActiveTab('profile')
                setError('')
                setMessage('')
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition ${
                activeTab === 'profile'
                  ? 'bg-[var(--basil)] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-[var(--cream)]'
              }`}
            >
              <span>♙</span>
              My Profile
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('orders')
                setError('')
                setMessage('')
                setEditing(false)
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition ${
                activeTab === 'orders'
                  ? 'bg-[var(--basil)] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-[var(--cream)]'
              }`}
            >
              <span>▤</span>
              My Orders
            </button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className={`mx-auto mt-8 rounded-[32px] bg-white p-7 shadow-[0_18px_48px_rgba(0,0,0,0.06)] md:p-10 ${
            user && activeTab === 'orders'
              ? 'max-w-4xl'
              : 'max-w-md'
          }`}
        >
          {user ? (
            activeTab === 'profile' ? (
              <div>
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--cream)] text-3xl font-semibold text-[var(--basil)]">
                    {(profileName || user.email || 'U')
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <h2 className="mt-6 text-3xl text-[var(--espresso)]">
                    {profileName || 'Your Profile'}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Manage your personal details.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--espresso)]">
                      Full Name
                    </label>

                    <input
                      type="text"
                      required
                      minLength={2}
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      disabled={!editing}
                      className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[var(--basil)] disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--espresso)]">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={user.email || ''}
                      readOnly
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--espresso)]">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!editing}
                      placeholder="Enter your phone number"
                      className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-[var(--basil)] disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div className="rounded-2xl bg-[var(--cream)] p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--basil)]">
                      Account Status
                    </p>

                    <p className="mt-2 text-sm text-[var(--espresso)]">
                      {user.email_confirmed_at
                        ? 'Email verified'
                        : 'Verification pending'}
                    </p>
                  </div>

                  {!editing ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(true)
                        setMessage('')
                        setError('')
                      }}
                      className="w-full rounded-full bg-[var(--basil)] px-6 py-4 font-medium text-white transition hover:bg-[var(--espresso)]"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="rounded-full bg-[var(--basil)] px-4 py-4 font-medium text-white transition hover:bg-[var(--espresso)] disabled:opacity-60"
                      >
                        {profileLoading ? 'Saving...' : 'Save Changes'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false)
                          setError('')
                          setMessage('')
                        }}
                        className="rounded-full border border-gray-300 px-4 py-4 font-medium text-gray-600 transition hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {error && (
                    <p
                      role="alert"
                      className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
                    >
                      {error}
                    </p>
                  )}

                  {message && (
                    <p
                      role="status"
                      className="rounded-xl bg-green-50 p-4 text-sm text-green-700"
                    >
                      {message}
                    </p>
                  )}
                </form>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-5 w-full rounded-full border border-red-200 px-6 py-4 font-medium text-red-600 transition hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              /* My Orders tab */
              <div>
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--basil)]">
                    Your Orders
                  </p>

                  <h2 className="mt-3 text-3xl text-[var(--espresso)]">
                    Order History
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Every good meal deserves a little memory.
                  </p>
                </div>

                {ordersLoading ? (
                  <div className="py-16 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--basil)]" />

                    <p className="mt-5 text-sm text-gray-500">
                      Brewing your order history...
                    </p>
                  </div>
                ) : ordersError ? (
                  <div className="rounded-2xl bg-red-50 p-6 text-center">
                    <p className="text-sm text-red-700">
                      {ordersError}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setOrdersError('')
                        setActiveTab('profile')
                        setActiveTab('orders')
                      }}
                      className="mt-4 rounded-full bg-[var(--basil)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--espresso)]"
                    >
                      Try Again
                    </button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="rounded-3xl bg-[var(--cream)] px-6 py-14 text-center">
                    <div className="text-5xl">☕</div>

                    <h3 className="mt-5 text-2xl text-[var(--espresso)]">
                      No orders yet
                    </h3>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
                      Your next favourite coffee or pasta is waiting.
                      Place your first order and it will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
                      </p>
                    </div>

                    {orders.map((order) => {
                      const isExpanded = expandedOrder === order.id
                      const items = order.order_items || []

                      return (
                        <div
                          key={order.id}
                          className="overflow-hidden rounded-3xl border border-gray-200 transition hover:border-[var(--basil)]/40"
                        >
                          <div className="p-5 md:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--basil)]">
                                  Order placed
                                </p>

                                <p className="mt-2 font-medium text-[var(--espresso)]">
                                  {formatDate(order.created_at)}
                                </p>

                                <p className="mt-2 break-all text-xs text-gray-400">
                                  ID: {order.id}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  Order Total
                                </p>

                                <p className="mt-1 text-xl font-semibold text-[var(--espresso)]">
                                  {formatCurrency(order.total_amount)}
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                              <span className="rounded-full bg-[var(--cream)] px-4 py-2 text-xs font-medium text-[var(--espresso)]">
                                {formatStatus(order.order_status)}
                              </span>

                              <span className="rounded-full bg-green-50 px-4 py-2 text-xs font-medium text-green-700">
                                Payment: {formatStatus(order.payment_status)}
                              </span>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                              <p className="text-sm text-gray-500">
                                {items.length} {items.length === 1 ? 'item' : 'items'}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedOrder(
                                    isExpanded ? null : order.id
                                  )
                                }
                                aria-expanded={isExpanded}
                                className="flex items-center gap-2 text-sm font-semibold text-[var(--basil)] transition hover:text-[var(--espresso)]"
                              >
                                {isExpanded ? 'Hide Details' : 'View Details'}

                                <span>
                                  {isExpanded ? '↑' : '↓'}
                                </span>
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="border-t border-gray-100 bg-[var(--cream)] p-5 md:p-6">
                              <h3 className="text-lg font-semibold text-[var(--espresso)]">
                                Items in this order
                              </h3>

                              {items.length > 0 ? (
                                <div className="mt-4 space-y-3">
                                  {items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4"
                                    >
                                      <div>
                                        <p className="font-medium text-[var(--espresso)]">
                                          {item.product_name}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                          Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                                        </p>
                                      </div>

                                      <p className="font-semibold text-[var(--espresso)]">
                                        {formatCurrency(
                                          Number(item.quantity) *
                                          Number(item.unit_price)
                                        )}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="mt-3 text-sm text-gray-500">
                                  No item details are available for this order.
                                </p>
                              )}

                              <div className="mt-6 border-t border-gray-200 pt-5">
                                <h3 className="font-semibold text-[var(--espresso)]">
                                  Delivery Details
                                </h3>

                                <div className="mt-3 space-y-2 text-sm text-gray-600">
                                  <p>{order.delivery_name}</p>
                                  <p>{order.delivery_phone}</p>
                                  <p>
                                    {[
                                      order.delivery_street,
                                      order.delivery_city,
                                      order.delivery_postcode,
                                    ]
                                      .filter(Boolean)
                                      .join(', ')}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-5 rounded-2xl bg-white p-4">
                                <div className="flex justify-between gap-3 text-sm">
                                  <span className="text-gray-500">
                                    Payment Method
                                  </span>

                                  <span className="font-medium text-[var(--espresso)]">
                                    {formatStatus(order.payment_method)}
                                  </span>
                                </div>

                                <div className="mt-3 flex justify-between gap-3 text-sm">
                                  <span className="text-gray-500">
                                    Order Status
                                  </span>

                                  <span className="font-medium text-[var(--espresso)]">
                                    {formatStatus(order.order_status)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-8 w-full rounded-full border border-red-200 px-6 py-4 font-medium text-red-600 transition hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            )
          ) : (
            <>
              <div className="mb-8 grid grid-cols-2 rounded-full bg-[var(--cream)] p-1">
                <button
                  type="button"
                  onClick={() => changeMode('login')}
                  className={`rounded-full py-3 text-sm font-medium transition ${
                    mode === 'login'
                      ? 'bg-[var(--basil)] text-white shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => changeMode('signup')}
                  className={`rounded-full py-3 text-sm font-medium transition ${
                    mode === 'signup'
                      ? 'bg-[var(--basil)] text-white shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <h2 className="text-3xl text-[var(--espresso)]">
                {mode === 'login' ? 'Welcome back' : 'Join our table'}
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {mode === 'login'
                  ? 'Sign in to continue your Basils & Brew experience.'
                  : 'A few details and you are all set.'}
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {mode === 'signup' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--espresso)]">
                      Full Name
                    </label>

                    <input
                      type="text"
                      required
                      minLength={2}
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 outline-none transition focus:border-[var(--basil)]"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--espresso)]">
                    Email Address
                  </label>

                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 outline-none transition focus:border-[var(--basil)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--espresso)]">
                    Password
                  </label>

                  <input
                    type="password"
                    required
                    minLength={mode === 'signup' ? 8 : undefined}
                    autoComplete={
                      mode === 'login'
                        ? 'current-password'
                        : 'new-password'
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      mode === 'signup'
                        ? 'At least 8 characters'
                        : 'Enter your password'
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 outline-none transition focus:border-[var(--basil)]"
                  />
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--espresso)]">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 outline-none transition focus:border-[var(--basil)]"
                    />
                  </div>
                )}

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
                  >
                    {error}
                  </p>
                )}

                {message && (
                  <p
                    role="status"
                    className="rounded-xl bg-green-50 p-4 text-sm text-green-700"
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[var(--basil)] px-6 py-4 font-medium text-white transition hover:bg-[var(--espresso)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? 'Please wait...'
                    : mode === 'login'
                      ? 'Sign In'
                      : 'Create My Account'}
                </button>
              </form>

              <p className="mt-6 text-center text-xs leading-relaxed text-gray-400">
                By continuing, you agree to use your account responsibly.
                Your details are handled securely through Supabase.
              </p>
            </>
          )}
        </motion.div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Crafted with care, served with warmth.
        </p>
      </div>
    </main>
  )
}

// batesey112@drtall.com
