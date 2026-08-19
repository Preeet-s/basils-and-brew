import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import AIConcierge from './components/ai/AIConcierge'
import FloatingAIButton from './components/ai/FloatingAIButton'
import SplashScreen from './components/SplashScreen'

import Navbar from './components/layout/Navbar'
import BottomNav from './components/layout/BottomNav'

import Home from './pages/Home'
import Coffee from './pages/Coffee'
import Pasta from './pages/Pasta'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import About from './pages/About'

export default function App() {
  const [chatOpen, setChatOpen] = useState(false)
  const [showSplash, setShowSplash] = useState(true)

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen
            onComplete={() => setShowSplash(false)}
          />
        )}
      </AnimatePresence>

      {!showSplash && (
        <div className="min-h-screen bg-[var(--cream)]">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coffee" element={<Coffee />} />
            <Route path="/pasta" element={<Pasta />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
          </Routes>

          <BottomNav />

          <FloatingAIButton
            onClick={() => setChatOpen(true)}
          />

          <AIConcierge
            open={chatOpen}
            onClose={() => setChatOpen(false)}
          />
        </div>
      )}
    </BrowserRouter>
  )
}