import React, { useState, useMemo } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import Button from "../components/snippets/button";
import {
  Sparkles,
  Search,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  CreditCard,
  Building,
  Plane,
  Headphones,
  Phone,
  ArrowRight,
} from "lucide-react";

interface FaqItem {
  id: string;
  category: "booking" | "concierge" | "payment" | "cancellation" | "flights";
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  // Booking & Reservations
  {
    id: "b1",
    category: "booking",
    question: "How does Discovery Convoy guarantee the best luxury rates?",
    answer:
      "We partner directly with leading 5-star hotel chains, boutique luxury collections, and private villa owners worldwide. In addition, our real-time Google Flights & Hotels search engine aggregates competitive rates so you never overpay for high-end luxury stays.",
  },
  {
    id: "b2",
    category: "booking",
    question: "Can Discovery Convoy design a bespoke multi-destination itinerary?",
    answer:
      "Yes. Our private travel designers specialize in customized, multi-city journeys across Europe, the Middle East, Asia, and the Americas. Simply submit an inquiry via our Contact Desk with your desired destinations and timeframe.",
  },
  {
    id: "b3",
    category: "booking",
    question: "How far in advance should I reserve private villas and high-season resorts?",
    answer:
      "For peak holiday seasons (such as Christmas/New Year in the Maldives, ski season in the Swiss Alps, or summer on the Amalfi Coast), we recommend reserving 3 to 6 months in advance to secure preferred suites and villas.",
  },

  // Concierge Privileges
  {
    id: "c1",
    category: "concierge",
    question: "What services are included with the 24/7 Dedicated Concierge?",
    answer:
      "Our 24/7 Concierge desk handles private airport transfers, Michelin-starred dining reservations, private yacht or helicopter charters, bespoke excursion guides, luxury spa appointments, and any on-trip urgent requirements.",
  },
  {
    id: "c2",
    category: "concierge",
    question: "How do VIP room upgrades and hotel perks work?",
    answer:
      "Through our luxury hospitality partnerships, Discovery Convoy guests receive exclusive privileges where available, including complimentary daily breakfast, early check-in/late check-out, room upgrades, and resort credits.",
  },
  {
    id: "c3",
    category: "concierge",
    question: "How do I reach my personal concierge during my trip?",
    answer:
      "You can contact our concierge desk directly via telephone (+91 9319300560), WhatsApp, or email (support@discoveryconvoy.com) at any hour of the day or night.",
  },

  // Payments & Taxes
  {
    id: "p1",
    category: "payment",
    question: "Which payment methods are accepted on Discovery Convoy?",
    answer:
      "We accept all major international and domestic credit/debit cards (Visa, MasterCard, American Express, Diners Club), Net Banking, UPI, and verified corporate bank wire transfers.",
  },
  {
    id: "p2",
    category: "payment",
    question: "Can I obtain a formal tax invoice with GST for corporate travel?",
    answer:
      "Yes. Formal tax invoices with valid GST details are automatically generated and emailed for all bookings upon completion. Corporate accounts can also input GSTIN at checkout.",
  },
  {
    id: "p3",
    category: "payment",
    question: "Are there any hidden booking fees or surcharge costs?",
    answer:
      "No. All pricing displayed in our fare breakdown and confirmation receipts includes applicable hotel taxes, GST, and service charges with 100% transparency.",
  },

  // Cancellation & Refunds
  {
    id: "x1",
    category: "cancellation",
    question: "What is your standard cancellation policy?",
    answer:
      "Most properties offer Free Cancellation up to 24 to 48 hours before the scheduled check-in date. The specific cancellation timeline for each property is clearly shown on the stay details card before booking.",
  },
  {
    id: "x2",
    category: "cancellation",
    question: "How quickly are refunds processed upon cancellation?",
    answer:
      "Once a qualified cancellation is submitted, refunds are initiated immediately and credited to your original payment method within 3 to 7 business days depending on your banking provider.",
  },

  // Flights & Aviation
  {
    id: "f1",
    category: "flights",
    question: "How does the real-time flight search work?",
    answer:
      "Our flight search engine directly queries live global airline inventory, comparing non-stop and connecting routes across major airlines worldwide to present optimal schedules and fares.",
  },
  {
    id: "f2",
    category: "flights",
    question: "Can I book private jet charters through Discovery Convoy?",
    answer:
      "Yes. For private aviation, helicopter transfers, and luxury jet charters, please contact our concierge team directly for customized flight plans and quotes.",
  },
];

const CATEGORIES = [
  { key: "all", label: "All Questions", icon: <HelpCircle size={15} /> },
  { key: "booking", label: "Booking & Stays", icon: <Building size={15} /> },
  { key: "concierge", label: "Concierge & VIP", icon: <Headphones size={15} /> },
  { key: "payment", label: "Payments & GST", icon: <CreditCard size={15} /> },
  { key: "cancellation", label: "Cancellation & Refund", icon: <ShieldCheck size={15} /> },
  { key: "flights", label: "Flights & Aviation", icon: <Plane size={15} /> },
];

interface FaqPageProps {
  onBackHome?: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onBackHome }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    b1: true,
    c1: true,
  });

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="tp-page-wrapper bg-white min-vh-100 d-flex flex-column">
      <Header />

      <main className="flex-grow-1">
        {/* ── 1. Hero Section ────────────────────────────────────────────── */}
        <section
          className="tp-faq-hero position-relative text-white text-center d-flex align-items-center justify-content-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%), url('https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover no-repeat",
            padding: "100px 20px 80px",
          }}
        >
          <div className="container" style={{ maxWidth: "820px" }}>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-20 text-white mb-3">
              <Sparkles size={14} style={{ color: "#84C418" }} />
              <span className="fw-semibold" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                HELP CENTER & FREQUENTLY ASKED QUESTIONS
              </span>
            </div>

            <h1 className="display-5 fw-bold text-white mb-3" style={{ letterSpacing: "-0.5px" }}>
              How Can We Help You Today?
            </h1>

            <p className="text-white text-opacity-85 mx-auto mb-4" style={{ fontSize: "16px", lineHeight: "1.7", maxWidth: "640px" }}>
              Find instant answers to inquiries regarding luxury reservations, concierge privileges, flight booking, and payment policies.
            </p>

            {/* Instant Search Bar */}
            <div className="position-relative mx-auto" style={{ maxWidth: "560px" }}>
              <span
                className="position-absolute text-muted"
                style={{ left: "16px", top: "50%", transform: "translateY(-50%)" }}
              >
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control form-control-lg border-0 shadow-lg ps-5 fw-semibold"
                placeholder="Search topics (e.g. cancellation, concierge, refunds, GST)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ height: "54px", borderRadius: "16px", fontSize: "14.5px" }}
              />
            </div>
          </div>
        </section>

        {/* ── 2. Category Filter & Accordion List ─────────────────────────── */}
        <section className="py-5 bg-light">
          <div className="container" style={{ maxWidth: "940px" }}>
            {/* Category Navigation Pills */}
            <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`btn btn-sm px-3 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-2 transition-all ${
                    activeCategory === cat.key
                      ? "tp-btn-universal-bg text-white shadow-sm"
                      : "bg-white text-dark border hover-bg-light"
                  }`}
                  style={{ fontSize: "13px" }}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Accordion Container */}
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 border p-4">
                <HelpCircle size={40} className="text-muted mb-2 d-inline-block opacity-50" />
                <h5 className="fw-bold text-dark mb-1">No Matching Questions Found</h5>
                <p className="text-muted small mb-3">
                  Try searching with different terms or contact our concierge directly.
                </p>
                <Button
                  variant="background"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {filteredFaqs.map((item) => {
                  const isOpen = !!openItems[item.id];
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-4 border shadow-sm overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="w-100 text-start p-4 bg-white border-0 d-flex align-items-center justify-content-between gap-3 text-dark fw-bold"
                        style={{ fontSize: "15.5px", cursor: "pointer" }}
                      >
                        <span className="d-flex align-items-center gap-2">
                          <HelpCircle size={18} style={{ color: "#84C418", flexShrink: 0 }} />
                          {item.question}
                        </span>
                        <ChevronDown
                          size={18}
                          className="text-muted flex-shrink-0 transition-transform"
                          style={{
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                          }}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-muted border-top border-light">
                          <p className="mb-0 lh-base" style={{ fontSize: "14px", color: "#475569" }}>
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── 3. Still Have Questions Card ─────────────────────────────── */}
            <div className="mt-5 p-4 p-md-5 rounded-4 bg-white border shadow-sm text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3 text-dark"
                style={{ background: "rgba(132, 196, 24, 0.15)", color: "#5c8f0a" }}
              >
                <Headphones size={28} />
              </div>
              <h3 className="fw-bold text-dark mb-2">Still Need Assistance?</h3>
              <p className="text-muted mx-auto mb-4" style={{ maxWidth: "520px", fontSize: "14.5px" }}>
                Our 24/7 dedicated private concierge is available around the clock to assist you with booking customization, cancellations, or special arrangements.
              </p>
              <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
                <Button
                  variant="background"
                  size="md"
                  href="tel:+919319300560"
                  icon={<Phone size={15} />}
                  iconPosition="left"
                >
                  Call +91 9319300560
                </Button>
                <Button
                  variant="stroke"
                  size="md"
                  onClick={() => navigateTo("/contact")}
                  icon={<ArrowRight size={15} />}
                  iconPosition="right"
                >
                  Open Inquiry Desk
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FaqPage;
