import Link from "next/link";

export default function LandingPage() {
  return (
    <div
      style={{
        fontFamily: "DM Sans, sans-serif",
        color: "#1a1a1a",
        background: "#fff",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div style={{ fontFamily: "Georgia, serif", fontSize: "20px" }}>
          Portfolio<span style={{ color: "#4F46E5" }}>Craft</span>
        </div>
        <div style={{ display: "flex", gap: "28px" }}>
          <a
            href="#features"
            style={{ fontSize: "13px", color: "#555", textDecoration: "none" }}
          >
            Features
          </a>
          <a
            href="#examples"
            style={{ fontSize: "13px", color: "#555", textDecoration: "none" }}
          >
            Examples
          </a>
          <a
            href="#pricing"
            style={{ fontSize: "13px", color: "#555", textDecoration: "none" }}
          >
            Pricing
          </a>
          <a
            href="#faq"
            style={{ fontSize: "13px", color: "#555", textDecoration: "none" }}
          >
            FAQ
          </a>
        </div>
        <Link
          href="/register"
          style={{
            background: "#4F46E5",
            color: "#fff",
            padding: "8px 20px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "500",
            textDecoration: "none",
          }}
        >
          Get started free
        </Link>
      </nav>

      {/* Hero */}
      <section
        style={{
          padding: "80px 40px 60px",
          textAlign: "center",
          background: "linear-gradient(180deg, #f8f7ff 0%, #fff 100%)",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#EEF2FF",
            color: "#4338CA",
            fontSize: "11px",
            fontWeight: "500",
            padding: "4px 12px",
            borderRadius: "100px",
            marginBottom: "24px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Used by 1,200+ professionals
        </div>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "52px",
            lineHeight: "1.1",
            color: "#0f0f0f",
            maxWidth: "600px",
            margin: "0 auto 20px",
          }}
        >
          Your portfolio,{" "}
          <em style={{ fontStyle: "italic", color: "#4F46E5" }}>beautifully</em>{" "}
          crafted
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#666",
            maxWidth: "480px",
            margin: "0 auto 36px",
            lineHeight: "1.7",
            fontWeight: "300",
          }}
        >
          Build a stunning professional portfolio in minutes. No code needed.
          Share your work, get hired, and grow your freelance business.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link
            href="/register"
            style={{
              background: "#4F46E5",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "none",
            }}
          >
            Start for free
          </Link>
          <a
            href="#examples"
            style={{
              background: "#fff",
              color: "#333",
              padding: "12px 28px",
              borderRadius: "10px",
              fontSize: "14px",
              border: "1px solid #e5e5e5",
              textDecoration: "none",
            }}
          >
            See examples →
          </a>
        </div>
        <div
          style={{
            display: "flex",
            gap: "40px",
            justifyContent: "center",
            marginTop: "48px",
            paddingTop: "32px",
            borderTop: "1px solid #eee",
          }}
        >
          {[
            ["1,200+", "Portfolios created"],
            ["12", "Beautiful themes"],
            ["5 min", "Setup time"],
          ].map(([num, label]) => (
            <div key={label}>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "28px",
                  color: "#0f0f0f",
                  display: "block",
                }}
              >
                {num}
              </span>
              <span style={{ fontSize: "12px", color: "#999" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "64px 40px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "500",
            color: "#4F46E5",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "10px",
          }}
        >
          Features
        </div>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "36px",
            color: "#0f0f0f",
            marginBottom: "10px",
          }}
        >
          Everything you need to stand out
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "#777",
            marginBottom: "40px",
            fontWeight: "300",
          }}
        >
          All the tools to build a professional online presence — in one place.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
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
              key={title}
              style={{
                background: "#fafafa",
                border: "1px solid #f0f0f0",
                borderRadius: "14px",
                padding: "24px",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "14px" }}>
                {icon}
              </div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                  marginBottom: "6px",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "#888",
                  lineHeight: "1.6",
                  fontWeight: "300",
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid #f0f0f0" }} />

      {/* Examples */}
      <section id="examples" style={{ padding: "64px 40px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "500",
            color: "#4F46E5",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "10px",
          }}
        >
          Examples
        </div>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "36px",
            color: "#0f0f0f",
            marginBottom: "10px",
          }}
        >
          See what people build
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "#777",
            marginBottom: "40px",
            fontWeight: "300",
          }}
        >
          Real portfolios from real professionals across different fields.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {[
            [
              "#0f172a",
              "#7C3AED",
              "white",
              "Creative Dev",
              "Sarah K.",
              "Full-Stack Developer",
            ],
            [
              "#f8f4ef",
              "#1a1a1a",
              "#1a1a1a",
              "Designer",
              "Moaz T.",
              "UI/UX Designer",
            ],
            [
              "#EEF2FF",
              "#4338CA",
              "#4338CA",
              "Consultant",
              "Ali H.",
              "Business Consultant",
            ],
          ].map(([bg, accent, textColor, label, name, role]) => (
            <div
              key={name}
              style={{
                border: "1px solid #eee",
                borderRadius: "14px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "140px",
                  background: bg as string,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "18px",
                    color: accent as string,
                    fontStyle: "italic",
                  }}
                >
                  {label}
                </span>
              </div>
              <div
                style={{ padding: "14px 16px", borderTop: "1px solid #eee" }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#1a1a1a",
                  }}
                >
                  {name}
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>{role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid #f0f0f0" }} />

      {/* Pricing */}
      <section id="pricing" style={{ padding: "64px 40px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "500",
            color: "#4F46E5",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "10px",
          }}
        >
          Pricing
        </div>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "36px",
            color: "#0f0f0f",
            marginBottom: "10px",
          }}
        >
          Simple, transparent pricing
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "#777",
            marginBottom: "40px",
            fontWeight: "300",
          }}
        >
          Start free, upgrade when you're ready.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {[
            {
              name: "Free",
              price: "$0",
              period: "forever",
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
              style={{
                border: plan.featured ? "2px solid #4F46E5" : "1px solid #eee",
                borderRadius: "16px",
                padding: "28px 24px",
                position: "relative",
              }}
            >
              {plan.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: "-11px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#4F46E5",
                    color: "#fff",
                    fontSize: "11px",
                    padding: "3px 12px",
                    borderRadius: "100px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Most popular
                </div>
              )}
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#888",
                  marginBottom: "6px",
                }}
              >
                {plan.name}
              </div>
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "36px",
                  color: "#0f0f0f",
                  marginBottom: "4px",
                }}
              >
                {plan.price}{" "}
                <span
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    color: "#999",
                  }}
                >
                  / {plan.period}
                </span>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#888",
                  marginBottom: "20px",
                  fontWeight: "300",
                }}
              >
                {plan.desc}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: "0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "24px",
                }}
              >
                {plan.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      fontSize: "13px",
                      color: "#555",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: "#4F46E5" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "11px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "500",
                  textAlign: "center",
                  textDecoration: "none",
                  background: plan.featured ? "#4F46E5" : "#fff",
                  color: plan.featured ? "#fff" : "#333",
                  border: plan.featured ? "none" : "1px solid #e5e5e5",
                  boxSizing: "border-box",
                }}
              >
                {plan.name === "Free"
                  ? "Get started free"
                  : `Upgrade to ${plan.name}`}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid #f0f0f0" }} />

      {/* FAQ */}
      <section id="faq" style={{ padding: "64px 40px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "500",
            color: "#4F46E5",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "10px",
          }}
        >
          FAQ
        </div>
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "36px",
            color: "#0f0f0f",
            marginBottom: "10px",
          }}
        >
          Common questions
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "#777",
            marginBottom: "40px",
            fontWeight: "300",
          }}
        >
          Everything you need to know before you start.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            border: "1px solid #eee",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
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
            <div
              key={q}
              style={{
                background: "#fafafa",
                padding: "16px 20px",
                borderBottom: "1px solid #eee",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                  marginBottom: "8px",
                }}
              >
                {q}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "#777",
                  lineHeight: "1.6",
                  fontWeight: "300",
                }}
              >
                {a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "#0f0f1a",
          padding: "64px 40px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "40px",
            color: "#fff",
            marginBottom: "14px",
          }}
        >
          Ready to build yours?
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "#888",
            marginBottom: "32px",
            fontWeight: "300",
          }}
        >
          Join 1,200+ professionals who already have a portfolio that works for
          them.
        </p>
        <Link
          href="/register"
          style={{
            background: "#4F46E5",
            color: "#fff",
            padding: "14px 36px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "500",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Get started for free
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "24px 40px",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontFamily: "Georgia, serif", fontSize: "16px" }}>
          Portfolio<span style={{ color: "#4F46E5" }}>Craft</span>
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Link
            href="/privacy"
            style={{ fontSize: "12px", color: "#bbb", textDecoration: "none" }}
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            style={{ fontSize: "12px", color: "#bbb", textDecoration: "none" }}
          >
            Terms of Service
          </Link>
          <p style={{ fontSize: "12px", color: "#bbb", margin: 0 }}>
            © 2026 PortfolioCraft
          </p>
        </div>
      </footer>
    </div>
  );
}
