import { motion } from 'framer-motion'
import CategoryCard from '../components/home/CategoryCard'

export default function Home() {
  return (
    <main className="bg-[var(--cream)]">

      {/* =====================================================
          HERO SECTION
          ===================================================== */}
      <section
        className="
          relative
          min-h-[620px]
          overflow-hidden
          md:min-h-[680px]
          lg:min-h-[720px]
        "
      >

        {/* =================================================
            RESPONSIVE FADED BRAND WATERMARK

            Positioned explicitly on the RIGHT side.
            It stays behind the hero content.
            ================================================= */}
        <img
          src="/basils-brew-logo.png"
          alt=""
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            z-0
            select-none
            object-contain
          "
          style={{
            right: '1vw',
            top: '60%',
            width: 'clamp(240px, 60vw, 650px)',
            transform: 'translateY(-50%)',
            opacity: 0.055,
          }}
        />

        {/* =================================================
            HERO CONTENT
            ================================================= */}
        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[620px]
            max-w-7xl
            items-center
            px-5
            py-16
            md:min-h-[680px]
            md:py-20
            lg:min-h-[720px]
          "
        >

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-3xl"
          >

            {/* Eyebrow */}
            <p
              className="
                mb-4
                text-sm
                font-semibold
                uppercase
                tracking-[0.35em]
                text-[var(--basil)]
              "
            >
              Specialty Coffee • Handmade Pasta
            </p>

            {/* Main Heading */}
            <h1
              className="
                max-w-4xl
                text-5xl
                leading-[1.02]
                text-[var(--basil)]
                md:text-7xl
                lg:text-8xl
              "
            >
              Where basil meets brew.
            </h1>

            {/* Description */}
            <p
              className="
                mt-6
                max-w-2xl
                text-lg
                leading-relaxed
                text-gray-600
                md:text-xl
              "
            >
              A premium cloud kitchen where artisan coffee and fresh
              basil-inspired pasta are crafted slowly, prepared in small
              batches, and delivered with the warmth of an Italian café.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">

              <a
                href="/coffee"
                className="
                  rounded-full
                  bg-[var(--basil)]
                  px-6
                  py-3
                  font-semibold
                  text-white
                  transition
                  duration-300
                  hover:brightness-110
                "
              >
                Explore Coffee
              </a>

              <a
                href="/pasta"
                className="
                  rounded-full
                  border
                  border-[var(--basil)]
                  px-6
                  py-3
                  font-semibold
                  text-[var(--basil)]
                  transition
                  duration-300
                  hover:bg-[var(--basil)]
                  hover:text-white
                "
              >
                Explore Pasta
              </a>

            </div>

          </motion.div>
        </div>
      </section>

      {/* =====================================================
          SPLIT CATEGORIES
          ===================================================== */}
      <section className="mx-auto max-w-7xl px-5 pb-16">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[var(--basil)]
              "
            >
              Our Menu
            </p>

            <h2
              className="
                mt-2
                text-3xl
                text-[var(--espresso)]
                md:text-4xl
              "
            >
              Two worlds. One kitchen.
            </h2>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-8">

          <CategoryCard
            title="Coffee"
            description="Espresso, signature lattes, cold brews, and seasonal creations inspired by specialty coffee culture."
            image="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
            link="/coffee"
            dark
          />

          <CategoryCard
            title="Pasta"
            description="Fresh basil pasta, Italian classics, handmade comfort, and bold contemporary flavors."
            image="https://images.unsplash.com/photo-1516100882582-96c3a05fe590?auto=format&fit=crop&w=1200&q=80"
            link="/pasta"
          />

        </div>

      </section>

      {/* =====================================================
          BRAND SECTION
          ===================================================== */}
      <section className="mx-auto max-w-7xl px-5 pb-24">

        <div
          className="
            rounded-[32px]
            bg-white
            p-8
            shadow-[0_18px_48px_rgba(0,0,0,0.08)]
            md:p-12
          "
        >

          <div
            className="
              grid
              gap-10
              md:grid-cols-2
              md:items-center
            "
          >

            {/* Brand Story */}
            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-[var(--basil)]
                "
              >
                Crafted Daily
              </p>

              <h3
                className="
                  mt-3
                  text-4xl
                  leading-tight
                  text-[var(--espresso)]
                "
              >
                Small batches. Fresh ingredients. Fast delivery.
              </h3>

              <p
                className="
                  mt-5
                  text-lg
                  leading-relaxed
                  text-gray-600
                "
              >
                Every coffee is brewed to order. Every pasta is finished
                fresh. We combine café-quality beverages with restaurant-style
                comfort food, delivered in under 30 minutes across the city.
              </p>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-3xl bg-[var(--cream)] p-6">
                <p className="text-3xl font-bold text-[var(--espresso)]">
                  25 min
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Average delivery time
                </p>
              </div>

              <div className="rounded-3xl bg-[var(--cream)] p-6">
                <p className="text-3xl font-bold text-[var(--espresso)]">
                  Daily
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Freshly prepared in small batches
                </p>
              </div>

              <div className="rounded-3xl bg-[var(--cream)] p-6">
                <p className="text-3xl font-bold text-[var(--espresso)]">
                  20+
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Signature coffee creations
                </p>
              </div>

              <div className="rounded-3xl bg-[var(--cream)] p-6">
                <p className="text-3xl font-bold text-[var(--espresso)]">
                  20+
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Handmade pasta dishes
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}