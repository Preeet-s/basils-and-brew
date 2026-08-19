import { motion } from 'framer-motion'

export default function About() {
  return (
    <main className="relative overflow-hidden bg-[var(--cream)] pb-28">

      {/* Background Watermark */}
      <img
        src="/logo-mark.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8vw] top-[420px] z-0 w-[42vw] max-w-[620px] opacity-[0.035]"
      />

      {/* HERO */}
      <section className="relative">

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-20 md:pb-28 md:pt-28">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >

            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--basil)]">
              Our Story
            </p>

            <h1 className="mt-5 text-5xl leading-[1.05] text-[var(--espresso)] md:text-7xl lg:text-8xl">
              More than coffee.
              <br />
              More than pasta.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
              Basils & Brew was created around a simple idea:
              great food does not need to be complicated.
              It needs to be fresh, thoughtful, and made with care.
            </p>

          </motion.div>

        </div>

      </section>

      {/* STORY */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16">

        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--basil)]">
              The Beginning
            </p>

            <h2 className="mt-4 text-4xl leading-tight text-[var(--espresso)] md:text-5xl">
              Born from a love of slow food and good coffee.
            </h2>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >

            <p className="text-lg leading-relaxed text-gray-600">
              We wanted to create the feeling of a neighbourhood café
              without needing a neighbourhood storefront.
            </p>

            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              So Basils & Brew brings together two things we believe belong
              at the same table: carefully brewed coffee and comforting,
              freshly prepared pasta.
            </p>

            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Everything is designed around freshness, simplicity,
              and the small details that turn an ordinary meal into
              something worth remembering.
            </p>

          </motion.div>

        </div>

      </section>

      {/* PHILOSOPHY */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16">

        <div className="rounded-[36px] bg-[var(--espresso)] px-7 py-12 text-white md:px-12 md:py-16">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--sage)]">
              The Basil Philosophy
            </p>

            <h2 className="mt-4 text-4xl leading-tight md:text-5xl">
              Simple ingredients.
              <br />
              Considered combinations.
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Basil is more than an ingredient for us.
              It represents freshness, character, and the idea that
              one thoughtful element can completely change a dish.
            </p>

          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">

            <div className="rounded-3xl bg-white/10 p-7">
              <p className="text-3xl">01</p>
              <h3 className="mt-5 text-xl">
                Freshness
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Coffee brewed to order and pasta prepared with care.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-7">
              <p className="text-3xl">02</p>
              <h3 className="mt-5 text-xl">
                Balance
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Bold flavours balanced with thoughtful combinations.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-7">
              <p className="text-3xl">03</p>
              <h3 className="mt-5 text-xl">
                Character
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Familiar café favourites with a distinct Basils & Brew touch.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* COFFEE + PASTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16">

        <div className="grid gap-6 md:grid-cols-2">

          <div className="rounded-[32px] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.06)] md:p-10">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--basil)]">
              Coffee
            </p>

            <h3 className="mt-4 text-3xl text-[var(--espresso)] md:text-4xl">
              Brewed with intention.
            </h3>

            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              From concentrated espresso to creamy signature lattes
              and refreshing cold brews, our coffee menu is designed
              around flavour, texture, and balance.
            </p>

          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.06)] md:p-10">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--basil)]">
              Pasta
            </p>

            <h3 className="mt-4 text-3xl text-[var(--espresso)] md:text-4xl">
              Made for comfort.
            </h3>

            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Creamy classics, tomato favourites, pesto creations,
              and signature combinations built around fresh,
              comforting flavours.
            </p>

          </div>

        </div>

      </section>

      {/* STATS */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16">

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-3xl bg-white p-7 text-center">
            <p className="text-4xl text-[var(--espresso)]">
              20+
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Coffee creations
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 text-center">
            <p className="text-4xl text-[var(--espresso)]">
              20+
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Pasta dishes
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 text-center">
            <p className="text-4xl text-[var(--espresso)]">
              Fresh
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Prepared to order
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 text-center">
            <p className="text-4xl text-[var(--espresso)]">
              Daily
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Small-batch preparation
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-16">

        <div className="rounded-[36px] bg-[var(--basil)] px-7 py-14 text-center text-white md:px-12">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
            Come hungry
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl md:text-6xl">
            Find your next favourite.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            Explore our coffee, discover your pasta,
            and let Basils AI Concierge help you build the perfect meal.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <a
              href="/coffee"
              className="rounded-full bg-white px-7 py-3 font-semibold text-[var(--basil)] transition hover:scale-105"
            >
              Explore Coffee
            </a>

            <a
              href="/pasta"
              className="rounded-full border border-white/60 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Explore Pasta
            </a>

          </div>

        </div>

      </section>

    </main>
  )
}