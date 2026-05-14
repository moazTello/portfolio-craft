import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="font-sans text-gray-900 bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-100">
        <div className="font-serif text-xl">
          Portfolio<span className="text-indigo-600">Craft</span>
        </div>
        <div className="hidden md:flex gap-7">
          {["features", "examples", "pricing", "faq"].map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="text-sm text-gray-500 hover:text-gray-900 transition capitalize"
            >
              {s}
            </a>
          ))}
        </div>
        <Link
          href="/register"
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          Get started free
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-10 py-20 text-center bg-linear-to-b from-indigo-50 to-white border-b border-gray-100">
        <div className="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
          Used by 1,200+ professionals
        </div>
        <h1 className="font-serif text-4xl md:text-6xl leading-tight text-gray-950 max-w-2xl mx-auto mb-5">
          Your portfolio,{" "}
          <em className="italic text-indigo-600">beautifully</em> crafted
        </h1>
        <p className="text-base md:text-lg text-gray-500 max-w-md mx-auto mb-9 font-light leading-relaxed">
          Build a stunning professional portfolio in minutes. No code needed.
          Share your work, get hired, and grow your freelance business.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-7 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
          >
            Start for free
          </Link>
          <a
            href="#examples"
            className="bg-white text-gray-700 px-7 py-3 rounded-xl text-sm border border-gray-200 hover:bg-gray-50 transition"
          >
            See examples →
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-10 mt-12 pt-8 border-t border-gray-100">
          {[
            ["1,200+", "Portfolios created"],
            ["12", "Beautiful themes"],
            ["5 min", "Setup time"],
          ].map(([num, label]) => (
            <div key={label}>
              <span className="font-serif text-3xl text-gray-950 block">
                {num}
              </span>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 md:px-10 py-16">
        <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-2">
          Features
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-gray-950 mb-3">
          Everything you need to stand out
        </h2>
        <p className="text-gray-400 text-sm mb-10 font-light">
          All the tools to build a professional online presence — in one place.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            [
              "🎨",
              "12 premium themes",
              "From minimal to bold — choose a design that matches your personal brand.",
            ],
            [
              "🌐",
              "Custom domain",
              "Connect your own domain like moaz.com for a truly professional look.",
            ],
            [
              "📅",
              "Booking system",
              "Let clients book appointments directly from your portfolio page.",
            ],
            [
              "📄",
              "CV PDF export",
              "Export your portfolio as a polished PDF resume in one click.",
            ],
            [
              "📊",
              "Analytics",
              "See who's visiting your portfolio and track your growth over time.",
            ],
            [
              "✍️",
              "Built-in blog",
              "Share your thoughts and expertise with a fully featured blog section.",
            ],
          ].map(([icon, title, desc]) => (
            <div
              key={title as string}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6"
            >
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Examples */}
      <section id="examples" className="px-6 md:px-10 py-16">
        <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-2">
          Examples
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-gray-950 mb-3">
          See what people build
        </h2>
        <p className="text-gray-400 text-sm mb-10 font-light">
          Real portfolios from real professionals across different fields.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              bg: "#0f172a",
              accent: "#7C3AED",
              label: "Creative Dev",
              name: "Moaz T.",
              role: "React Developer",
              href: "https://www.eng-moaz-tello.com",
            },
            {
              bg: "#f8f4ef",
              accent: "#1a1a1a",
              label: "Designer",
              name: "Coming Soon",
              role: "UI/UX Designer",
              href: null,
            },
            {
              bg: "#EEF2FF",
              accent: "#4338CA",
              label: "Consultant",
              name: "Coming Soon",
              role: "Business Consultant",
              href: null,
            },
          ].map(({ bg, accent, label, name, role, href }) => (
            <div
              key={bg}
              className="border border-gray-100 rounded-2xl overflow-hidden"
            >
              <div
                className="h-36 flex items-center justify-center"
                style={{ background: bg }}
              >
                <span
                  className="font-serif text-lg italic"
                  style={{ color: accent }}
                >
                  {label}
                </span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {name}
                  </div>
                  <div className="text-xs text-gray-400">{role}</div>
                </div>
                {href ? (
                  <Link
                    href={href}
                    target="_blank"
                    className="text-xs text-indigo-500 hover:underline"
                  >
                    View →
                  </Link>
                ) : (
                  <span className="text-xs text-gray-300">Soon</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Pricing */}
      <section id="pricing" className="px-6 md:px-10 py-16">
        <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-2">
          Pricing
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-gray-950 mb-3">
          Simple, transparent pricing
        </h2>
        <p className="text-gray-400 text-sm mb-10 font-light">
          Start free, upgrade when you're ready.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: "Free",
              price: "$0",
              period: "forever",
              annual: null,
              saving: null,
              desc: "Perfect for getting started",
              features: [
                "1 theme",
                "6 gallery photos",
                "portfoliocraft.com/you",
                "Basic analytics",
              ],
              featured: false,
            },
            {
              name: "Pro",
              price: "$5",
              period: "per month",
              annual: "$48/year",
              saving: "Save $12",
              desc: "For freelancers & job seekers",
              features: [
                "6 premium themes",
                "Custom domain",
                "30 gallery photos",
                "Blog system",
              ],
              featured: true,
            },
            {
              name: "Business",
              price: "$12",
              period: "per month",
              annual: "$99/year",
              saving: "Save $45",
              desc: "For growing professionals",
              features: [
                "All 12 themes",
                "Booking system",
                "PDF CV export",
                "Unlimited gallery",
              ],
              featured: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 ${plan.featured ? "border-2 border-indigo-500" : "border border-gray-100"}`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                  Most popular
                </div>
              )}
              <div className="text-xs font-medium text-gray-400 mb-1">
                {plan.name}
              </div>
              <div className="font-serif text-4xl text-gray-950 mb-1">
                {plan.price}{" "}
                <span className="font-sans text-sm text-gray-400">
                  / {plan.period}
                </span>
              </div>
              {plan.annual ? (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-gray-400">or</span>
                  <span className="text-xs font-medium text-gray-900">
                    {plan.annual}
                  </span>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                    {plan.saving}
                  </span>
                </div>
              ) : (
                <div className="mb-4 h-5" />
              )}
              <div className="text-xs text-gray-400 mb-5 font-light">
                {plan.desc}
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <span className="text-indigo-500 font-medium">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`block w-full py-2.5 rounded-xl text-xs font-medium text-center transition ${plan.featured ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
              >
                {plan.name === "Free"
                  ? "Get started free"
                  : `Upgrade to ${plan.name}`}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* FAQ */}
      <section id="faq" className="px-6 md:px-10 py-16">
        <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-2">
          FAQ
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-gray-950 mb-3">
          Common questions
        </h2>
        <p className="text-gray-400 text-sm mb-10 font-light">
          Everything you need to know before you start.
        </p>
        <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
          {[
            [
              "Do I need coding skills?",
              "Not at all. PortfolioCraft is fully no-code. Just fill in your info, pick a theme, and publish. Your portfolio is live in minutes.",
            ],
            [
              "Can I use my own domain?",
              "Yes — on the Pro and Business plans you can connect any custom domain you own. Just add a CNAME record and you're done.",
            ],
            [
              "Can I cancel anytime?",
              "Yes, you can cancel your subscription at any time. Your portfolio stays active until the end of your billing period.",
            ],
            [
              "What payment methods do you accept?",
              "We accept credit cards via Stripe, PayPal, and ShamCash for users in Syria and the region.",
            ],
            [
              "Is my data secure?",
              "Your data is stored securely and never shared with third parties. We use industry-standard encryption for all sensitive information.",
            ],
          ].map(([q, a]) => (
            <div key={q as string} className="bg-gray-50 px-5 py-4">
              <p className="text-sm font-medium text-gray-900 mb-2">{q}</p>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                {a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-950 px-6 md:px-10 py-20 text-center">
        <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">
          Ready to build yours?
        </h2>
        <p className="text-gray-400 text-sm mb-8 font-light">
          Join 1,200+ professionals who already have a portfolio that works for
          them.
        </p>
        <Link
          href="/register"
          className="bg-indigo-600 text-white px-9 py-3.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition inline-block"
        >
          Get started for free
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="font-serif text-base">
          Portfolio<span className="text-indigo-600">Craft</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <Link
            href="/privacy"
            className="text-xs text-gray-400 hover:text-gray-600 transition"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-xs text-gray-400 hover:text-gray-600 transition"
          >
            Terms of Service
          </Link>
          <span className="text-xs text-gray-400">© 2026 PortfolioCraft</span>
        </div>
      </footer>
    </div>
  );
}
