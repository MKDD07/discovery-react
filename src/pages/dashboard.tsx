import React, { useEffect, useState, useRef } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import { getStoredUser, logoutUser, UserProfile } from "../services/auth";
import {
  User,
  Mail,
  Calendar,
  Heart,
  Briefcase,
  LogOut,
  MapPin,
  Settings,
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  FileText,
  HelpCircle,
  Eye,
  Key,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Edit3,
  Trash2,
  Bold,
  Italic,
  List,
  Heading,
  Image,
  Terminal,
  Database,
  Play,
  Copy,
  Layers,
  ListPlus,
  Pause,
  AlertCircle,
  ExternalLink,
  Check,
} from "lucide-react";

interface DashboardPageProps {
  onBackHome?: () => void;
}

export interface BatchBlogItem {
  id: string;
  topic: string;
  status: "pending" | "generating" | "publishing" | "completed" | "error";
  slug?: string;
  title?: string;
  category?: string;
  location?: string;
  sectionsCount?: number;
  errorMsg?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onBackHome }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "saved" | "createBlog" | "sqliteConsole" | "settings">("createBlog");

  // Mode: "single" | "batch"
  const [generatorMode, setGeneratorMode] = useState<"single" | "batch">("single");

  // AI Blog Generator State (Single)
  const [groqKey, setGroqKey] = useState<string>(
    localStorage.getItem("discovery_groq_key") || ""
  );
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("Auto-Detect");
  const [location, setLocation] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<any>(null);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  // Field-level rewriting loading state
  const [rewritingField, setRewritingField] = useState<string | null>(null);

  // Batch Generation State
  const [batchPrompt, setBatchPrompt] = useState<string>("");
  const [batchBrainstorming, setBatchBrainstorming] = useState<boolean>(false);
  const [batchTopicListText, setBatchTopicListText] = useState<string>(
    "Top 7 Luxury Overwater Villas in Maldives\nUltimate 5-Day Glacier Itinerary in Swiss Alps\nSecret Ryokans & Zen Gardens in Kyoto\nDubai's Most Exclusive Desert Resorts 2026\nAmalfi Coast Luxury Yacht & Villa Charter"
  );
  const [batchQueue, setBatchQueue] = useState<BatchBlogItem[]>([]);
  const [batchRunning, setBatchRunning] = useState<boolean>(false);
  const [batchAutoPublish, setBatchAutoPublish] = useState<boolean>(true);
  const isCancelledRef = useRef<boolean>(false);

  // SQLite Console State
  const [sqlQuery, setSqlQuery] = useState<string>(
    "SELECT id, slug, title, category, location, created_at FROM blogs ORDER BY created_at DESC LIMIT 10;"
  );
  const [sqlResults, setSqlResults] = useState<any[] | null>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [sqlMessage, setSqlMessage] = useState<string | null>(null);
  const [sqlRunning, setSqlRunning] = useState<boolean>(false);

  useEffect(() => {
    const authUser = getStoredUser();
    if (authUser) {
      setUser(authUser);
    } else {
      setUser({
        name: "Discovery Traveler",
        email: "traveler@discovery.com",
        joinedAt: "Aug 2026",
        bookingsCount: 2,
        savedToursCount: 5,
      });
    }
  }, []);

  const handleGenerateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      alert("Please enter a blog topic / subject.");
      return;
    }

    setGenerating(true);
    setGeneratedBlog(null);
    setPublishStatus(null);

    try {
      if (groqKey) {
        localStorage.setItem("discovery_groq_key", groqKey.trim());
      }

      const res = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          category,
          location,
          apiKey: groqKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setGeneratedBlog(data.data);
      } else {
        alert(data.error || "Failed to generate blog. Please check your API key.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to communicate with AI generation endpoint.");
    } finally {
      setGenerating(false);
    }
  };

  // Batch / Multi-Topic Brainstorm using AI
  const handleBatchBrainstorm = async () => {
    if (!batchPrompt.trim()) {
      alert("Please enter an idea prompt (e.g. 'Generate 5 luxury holiday guides for Europe').");
      return;
    }
    setBatchBrainstorming(true);
    try {
      if (groqKey) {
        localStorage.setItem("discovery_groq_key", groqKey.trim());
      }
      const res = await fetch("/api/ai-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "heading",
          prompt: `Generate 5 to 7 high-performing luxury travel blog titles based on this request: "${batchPrompt}". Return ONLY the titles separated by newlines. No numbering, no bullets, no quotes. Each title must be strictly max 6 words.`,
          apiKey: groqKey.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.result) {
        const cleanList = data.result
          .split("\n")
          .map((line: string) => line.replace(/^[\d\.\-\*\s"]+|["\s]+$/g, "").trim())
          .filter((line: string) => line.length > 3)
          .join("\n");
        if (cleanList) {
          setBatchTopicListText(cleanList);
        }
      } else {
        alert(data.error || "Failed to brainstorm topics.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to brainstorm topics.");
    } finally {
      setBatchBrainstorming(false);
    }
  };

  // Start Batch Generation Loop (Generates & Publishes One-by-One)
  const handleStartBatchGeneration = async () => {
    const rawTopics = batchTopicListText
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 2);

    if (rawTopics.length === 0) {
      alert("Please provide at least 1 topic in the list.");
      return;
    }

    if (groqKey) {
      localStorage.setItem("discovery_groq_key", groqKey.trim());
    }

    const initialQueue: BatchBlogItem[] = rawTopics.map((topicStr, index) => ({
      id: `batch-${Date.now()}-${index}`,
      topic: topicStr,
      status: "pending",
    }));

    setBatchQueue(initialQueue);
    setBatchRunning(true);
    isCancelledRef.current = false;

    // Loop through topics one by one
    for (let i = 0; i < initialQueue.length; i++) {
      if (isCancelledRef.current) break;

      const currentItem = initialQueue[i];

      // 1. Update status to generating
      setBatchQueue((prev) =>
        prev.map((item, idx) => (idx === i ? { ...item, status: "generating" } : item))
      );

      try {
        // Call AI generator
        const genRes = await fetch("/api/generate-blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: currentItem.topic,
            category: "Auto-Detect",
            location: "Auto-Detect",
            apiKey: groqKey.trim() || undefined,
          }),
        });

        const genData = await genRes.json();
        if (!genRes.ok || !genData.success || !genData.data) {
          throw new Error(genData.error || "Failed to generate blog content.");
        }

        const blogData = genData.data;

        if (batchAutoPublish) {
          // Update status to publishing
          setBatchQueue((prev) =>
            prev.map((item, idx) => (idx === i ? { ...item, status: "publishing", title: blogData.title } : item))
          );

          const slug = blogData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

          const pubRes = await fetch("/api/blogs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug,
              title: blogData.title,
              category: blogData.category || "Adventure",
              location: blogData.location || "Global",
              author: user?.name || "Discovery Travel Editor",
              author_role: "Senior Luxury Editor",
              cover_query: blogData.cover_query,
              summary: blogData.summary,
              content: blogData.sections,
              faqs: blogData.faqs,
              tags: blogData.tags,
            }),
          });

          const pubData = await pubRes.json();
          if (!pubRes.ok || !pubData.success) {
            throw new Error(pubData.error || "Failed to save blog to Cloudflare D1.");
          }

          // Mark as completed with slug
          setBatchQueue((prev) =>
            prev.map((item, idx) =>
              idx === i
                ? {
                    ...item,
                    status: "completed",
                    slug,
                    title: blogData.title,
                    category: blogData.category,
                    location: blogData.location,
                    sectionsCount: blogData.sections?.length || 0,
                  }
                : item
            )
          );
        } else {
          // Generated without auto-publish
          setBatchQueue((prev) =>
            prev.map((item, idx) =>
              idx === i
                ? {
                    ...item,
                    status: "completed",
                    title: blogData.title,
                    category: blogData.category,
                    location: blogData.location,
                    sectionsCount: blogData.sections?.length || 0,
                  }
                : item
            )
          );
        }
      } catch (err: any) {
        setBatchQueue((prev) =>
          prev.map((item, idx) =>
            idx === i
              ? {
                  ...item,
                  status: "error",
                  errorMsg: err.message || "Failed generation step",
                }
              : item
          )
        );
      }

      // Small delay between calls to be gentle with rate limits
      await new Promise((r) => setTimeout(r, 600));
    }

    setBatchRunning(false);
  };

  const handleStopBatch = () => {
    isCancelledRef.current = true;
    setBatchRunning(false);
  };

  // Real-time AI field rewrite
  const handleAiRewriteField = async (
    fieldKey: string,
    type: "heading" | "subheading" | "paragraphs" | "pexelsQuery" | "faq",
    promptContext: string,
    currentVal?: string,
    sectionIndex?: number,
    faqIndex?: number
  ) => {
    setRewritingField(fieldKey);
    try {
      const res = await fetch("/api/ai-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          prompt: promptContext,
          current: currentVal,
          apiKey: groqKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.result) {
        const updated = { ...generatedBlog };

        if (type === "heading") {
          updated.title = data.result.replace(/^"|"$/g, "");
        } else if (type === "subheading" && sectionIndex !== undefined) {
          updated.sections[sectionIndex].heading = data.result.replace(/^"|"$/g, "");
        } else if (type === "pexelsQuery" && sectionIndex !== undefined) {
          updated.sections[sectionIndex].pexelsQuery = data.result.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
        } else if (type === "paragraphs" && sectionIndex !== undefined) {
          updated.sections[sectionIndex].paragraphs = data.result.split("\n\n").filter((p: string) => p.trim());
        } else if (type === "faq" && faqIndex !== undefined) {
          try {
            const parsed = JSON.parse(data.result);
            updated.faqs[faqIndex] = parsed;
          } catch {
            updated.faqs[faqIndex].answer = data.result;
          }
        }

        setGeneratedBlog(updated);
      } else {
        alert(data.error || "Failed to rewrite element.");
      }
    } catch (err: any) {
      alert(err.message || "Rewrite failed.");
    } finally {
      setRewritingField(null);
    }
  };

  // Add new section (up to 10)
  const handleAddSection = () => {
    if (!generatedBlog) return;
    if ((generatedBlog.sections?.length || 0) >= 10) {
      alert("Maximum 10 sections allowed.");
      return;
    }
    const updated = { ...generatedBlog };
    updated.sections = [
      ...(updated.sections || []),
      {
        heading: `New Highlight ${updated.sections.length + 1}`,
        paragraphs: [
          "Add your travel descriptions, insider suggestions, and highlights here directly in the editor.",
        ],
        pexelsQuery: `${location} travel scenery landscape`,
        highlights: ["Tip: Best visited during morning hours."],
      },
    ];
    setGeneratedBlog(updated);
  };

  // Add new FAQ (up to 10)
  const handleAddFaq = () => {
    if (!generatedBlog) return;
    if ((generatedBlog.faqs?.length || 0) >= 10) {
      alert("Maximum 10 FAQs allowed.");
      return;
    }
    const updated = { ...generatedBlog };
    updated.faqs = [
      ...(updated.faqs || []),
      {
        question: "How do I reach the main sights easily?",
        answer: "Local taxis, shared cabs, and private rental cars are readily available throughout the day.",
      },
    ];
    setGeneratedBlog(updated);
  };

  const handlePublishToD1 = async () => {
    if (!generatedBlog) return;
    setPublishStatus("saving");

    try {
      const slug = generatedBlog.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title: generatedBlog.title,
          category: generatedBlog.category || category,
          location: generatedBlog.location || location,
          author: user?.name || "Admin",
          author_role: "Discovery Travel Editor",
          cover_query: generatedBlog.cover_query,
          summary: generatedBlog.summary,
          content: generatedBlog.sections,
          faqs: generatedBlog.faqs,
          tags: generatedBlog.tags,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPublishStatus("published");
      } else {
        alert(data.error || "Failed to save blog to D1 database.");
        setPublishStatus(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to connect to database.");
      setPublishStatus(null);
    }
  };

  const handleExecuteSql = async (customQuery?: string) => {
    const queryToRun = (customQuery || sqlQuery).trim();
    if (!queryToRun) return;

    setSqlRunning(true);
    setSqlError(null);
    setSqlMessage(null);

    try {
      const res = await fetch("/api/sqlite-console", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryToRun }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.results) {
          setSqlResults(data.results);
          setSqlMessage(`Query returned ${data.count ?? data.results.length} rows.`);
        } else {
          setSqlResults(null);
          setSqlMessage(data.message || "Query executed successfully!");
        }
      } else {
        setSqlError(data.error || "Execution failed");
      }
    } catch (err: any) {
      setSqlError(err.message || "Failed to communicate with SQLite console endpoint.");
    } finally {
      setSqlRunning(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="bg-light py-5">
        <div className="container container-1350">
          {/* Breadcrumb / Top greeting */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 pb-2">
            <div>
              <span className="tp-section-subtitle mb-1 d-block text-uppercase fw-600" style={{ fontSize: "12px" }}>
                Member Dashboard
              </span>
              <h2 className="fw-700 text-dark mb-0" style={{ fontSize: "24px" }}>
                Welcome back, {user.name || "Traveler"}! 👋
              </h2>
            </div>
            <div className="d-flex align-items-center gap-2">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, "", "/");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="tp-btn-sm bg-white text-dark border shadow-none"
              >
                <Compass size={14} className="me-1 text-primary" /> Explore Tours
              </a>
              <button
                type="button"
                className="tp-btn-sm bg-danger text-white border-0 shadow-none d-inline-flex align-items-center gap-1"
                onClick={logoutUser}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>

          <div className="row g-4">
            {/* Sidebar Profile Card */}
            <div className="col-lg-3 col-md-4">
              <div className="bg-white rounded-4 border p-4 shadow-sm text-center mb-4">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm"
                  style={{ width: "72px", height: "72px", fontSize: "26px", fontWeight: "bold" }}
                >
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
                <h5 className="fw-500 text-dark mb-1">{user.name || "Traveler"}</h5>
                <p className="text-muted small mb-3">{user.email}</p>
                <div className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill font-monospace small mb-3">
                  <ShieldCheck size={13} className="me-1" /> Verified Member
                </div>

                <div className="border-top pt-3 text-start small text-muted d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between">
                    <span>Member Since:</span>
                    <strong className="text-dark">{user.joinedAt || "Aug 2026"}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Active Bookings:</span>
                    <strong className="text-dark">{user.bookingsCount ?? 2}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Saved Tours:</span>
                    <strong className="text-dark">{user.savedToursCount ?? 5}</strong>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="bg-white rounded-4 border p-2 shadow-sm">
                <nav className="nav flex-column gap-1">
                  <button
                    className={`btn text-start d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 ${
                      activeTab === "createBlog" ? "bg-primary text-white fw-600" : "text-dark bg-transparent"
                    }`}
                    style={{ fontSize: "14px" }}
                    onClick={() => setActiveTab("createBlog")}
                  >
                    <Sparkles size={16} /> AI Blog Creator &amp; Editor
                  </button>
                  <button
                    className={`btn text-start d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 ${
                      activeTab === "sqliteConsole" ? "bg-primary text-white fw-600" : "text-dark bg-transparent"
                    }`}
                    style={{ fontSize: "14px" }}
                    onClick={() => setActiveTab("sqliteConsole")}
                  >
                    <Terminal size={16} /> D1 SQLite Console
                  </button>
                  <button
                    className={`btn text-start d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 ${
                      activeTab === "overview" ? "bg-primary text-white fw-600" : "text-dark bg-transparent"
                    }`}
                    style={{ fontSize: "14px" }}
                    onClick={() => setActiveTab("overview")}
                  >
                    <User size={16} /> Account Overview
                  </button>
                  <button
                    className={`btn text-start d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 ${
                      activeTab === "bookings" ? "bg-primary text-white fw-600" : "text-dark bg-transparent"
                    }`}
                    style={{ fontSize: "14px" }}
                    onClick={() => setActiveTab("bookings")}
                  >
                    <Briefcase size={16} /> My Bookings
                  </button>
                  <button
                    className={`btn text-start d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 ${
                      activeTab === "saved" ? "bg-primary text-white fw-600" : "text-dark bg-transparent"
                    }`}
                    style={{ fontSize: "14px" }}
                    onClick={() => setActiveTab("saved")}
                  >
                    <Heart size={16} /> Saved Wishlist
                  </button>
                  <button
                    className={`btn text-start d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 ${
                      activeTab === "settings" ? "bg-primary text-white fw-600" : "text-dark bg-transparent"
                    }`}
                    style={{ fontSize: "14px" }}
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings size={16} /> Profile Settings
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-lg-9 col-md-8">
              {/* AI Blog Generator & Rich Interactive Editor */}
              {activeTab === "createBlog" && (
                <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <div>
                      <span className="badge bg-primary bg-opacity-10 text-primary font-monospace small mb-1">
                        120B / GPT-4o Real-Time Engine
                      </span>
                      <h4 className="fw-700 text-dark mb-0 d-flex align-items-center gap-2">
                        <Sparkles size={20} className="text-primary" /> AI Blog Generator &amp; Rich Editor
                      </h4>
                    </div>

                    {/* Generator Mode Switcher Pills */}
                    <div className="d-flex align-items-center bg-light p-1 rounded-pill border">
                      <button
                        type="button"
                        onClick={() => setGeneratorMode("single")}
                        className={`btn btn-sm px-3 py-1 rounded-pill fw-bold d-inline-flex align-items-center gap-1 transition-all ${
                          generatorMode === "single"
                            ? "bg-white text-dark shadow-sm"
                            : "text-muted bg-transparent border-0"
                        }`}
                        style={{ fontSize: "12.5px" }}
                      >
                        <Edit3 size={13} /> Single Article
                      </button>
                      <button
                        type="button"
                        onClick={() => setGeneratorMode("batch")}
                        className={`btn btn-sm px-3 py-1 rounded-pill fw-bold d-inline-flex align-items-center gap-1 transition-all ${
                          generatorMode === "batch"
                            ? "tp-btn-universal-bg text-white shadow-sm"
                            : "text-muted bg-transparent border-0"
                        }`}
                        style={{ fontSize: "12.5px" }}
                      >
                        <Layers size={13} /> Batch Multi-Prompt
                      </button>
                    </div>
                  </div>

                  <p className="text-muted small mb-4">
                    {generatorMode === "single"
                      ? "Strict max 5–6 words for headings & subheadings. Generates complete articles, loads query-based Pexels visuals, structured paragraphs, and FAQs with live AI rewrite buttons for each block."
                      : "Batch Generation Queue: Enter a master prompt to brainstorm topics or input multiple topics directly. The engine generates and publishes high-SEO articles one-by-one automatically to Cloudflare D1."}
                  </p>

                  {/* ── Mode 1: Single Article Generator Form ──────────────── */}
                  {generatorMode === "single" && (
                    <form onSubmit={handleGenerateBlog} className="mb-4">
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label small text-muted fw-semibold">
                            OpenAI / Groq API Key (Stored securely in your browser or Worker env)
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <Key size={14} className="text-muted" />
                            </span>
                            <input
                              type="password"
                              className="form-control form-control-sm border-start-0"
                              placeholder="gsk_... or sk-..."
                              value={groqKey}
                              onChange={(e) => setGroqKey(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label small text-muted fw-semibold">
                            Article Topic / Subject *
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="e.g. 5 Secret Beaches in Goa"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            required
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small text-muted fw-semibold d-flex align-items-center justify-content-between">
                            <span>Category</span>
                            <span className="badge bg-primary bg-opacity-10 text-primary py-0 px-1 font-monospace" style={{ fontSize: "10px" }}>AI Auto-Select</span>
                          </label>
                          <select
                            className="form-select form-select-sm"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            <option value="Auto-Detect">✨ Auto-Detect by AI</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Art and culture">Art and culture</option>
                            <option value="Nature">Nature</option>
                            <option value="Beach Trips">Beach Trips</option>
                            <option value="Food & Travel">Food & Travel</option>
                            <option value="Travel Tips">Travel Tips</option>
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small text-muted fw-semibold d-flex align-items-center justify-content-between">
                            <span>Target Location</span>
                            <span className="badge bg-primary bg-opacity-10 text-primary py-0 px-1 font-monospace" style={{ fontSize: "10px" }}>AI Auto-Extract</span>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="✨ Auto-detect (or specify e.g. Bali, Goa)"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          />
                        </div>

                        <div className="col-12 pt-2">
                          <button
                            type="submit"
                            className="tp-btn text-white px-4 py-2 d-inline-flex align-items-center gap-2"
                            disabled={generating}
                            style={{ fontSize: "13px" }}
                          >
                            {generating ? (
                              <>
                                <Loader2 size={16} className="animate-spin" /> Generating Full Article with AI...
                              </>
                            ) : (
                              <>
                                <Sparkles size={16} /> Generate Travel Article (120B)
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* ── Mode 2: Batch Multi-Prompt Generator Queue ──────────── */}
                  {generatorMode === "batch" && (
                    <div className="mb-4">
                      {/* Shared API Key Input */}
                      <div className="mb-3">
                        <label className="form-label small text-muted fw-semibold">
                          OpenAI / Groq API Key
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <Key size={14} className="text-muted" />
                          </span>
                          <input
                            type="password"
                            className="form-control form-control-sm border-start-0"
                            placeholder="gsk_... or sk-..."
                            value={groqKey}
                            onChange={(e) => setGroqKey(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Step 1: AI Topic Brainstormer / Master Prompt */}
                      <div className="p-3 bg-light rounded-3 border mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <label className="form-label small text-dark fw-bold mb-0 d-flex align-items-center gap-1">
                            <Sparkles size={14} className="text-primary" /> AI Topic Brainstormer (Optional)
                          </label>
                          <span className="badge bg-white text-muted border font-monospace" style={{ fontSize: "10px" }}>
                            Auto-Expands Into Topic Queue
                          </span>
                        </div>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control form-control-sm bg-white"
                            placeholder="e.g. Generate 5 luxury honeymoon guides for Asia & Europe..."
                            value={batchPrompt}
                            onChange={(e) => setBatchPrompt(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleBatchBrainstorm();
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-primary text-white d-inline-flex align-items-center gap-1"
                            onClick={handleBatchBrainstorm}
                            disabled={batchBrainstorming || !batchPrompt.trim()}
                          >
                            {batchBrainstorming ? (
                              <>
                                <Loader2 size={13} className="animate-spin" /> Brainstorming...
                              </>
                            ) : (
                              <>
                                <Sparkles size={13} /> Brainstorm Topics
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Step 2: Multi-Line Topic Queue */}
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <label className="form-label small text-dark fw-bold mb-0 d-flex align-items-center gap-1">
                            <ListPlus size={14} className="text-primary" /> Batch Topic Queue (One Topic Per Line) *
                          </label>
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold" style={{ fontSize: "11px" }}>
                              {batchTopicListText.split("\n").filter((t) => t.trim().length > 2).length} Topics Queued
                            </span>
                            <button
                              type="button"
                              className="btn btn-link p-0 text-muted small text-decoration-none"
                              style={{ fontSize: "11.5px" }}
                              onClick={() =>
                                setBatchTopicListText(
                                  "Top 7 Luxury Overwater Villas in Maldives\nUltimate 5-Day Glacier Itinerary in Swiss Alps\nSecret Ryokans & Zen Gardens in Kyoto\nDubai's Most Exclusive Desert Resorts 2026\nAmalfi Coast Luxury Yacht & Villa Charter"
                                )
                              }
                            >
                              Load Sample
                            </button>
                            <button
                              type="button"
                              className="btn btn-link p-0 text-danger small text-decoration-none ms-1"
                              style={{ fontSize: "11.5px" }}
                              onClick={() => setBatchTopicListText("")}
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows={6}
                          className="form-control font-monospace bg-light p-3 border"
                          style={{ fontSize: "13px", lineHeight: "1.6" }}
                          value={batchTopicListText}
                          onChange={(e) => setBatchTopicListText(e.target.value)}
                          placeholder="Type or paste one topic per line (e.g. 5 Secret Beaches in Goa)..."
                          disabled={batchRunning}
                        ></textarea>
                      </div>

                      {/* Step 3: Action Controls */}
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 p-3 bg-light rounded-3 border mb-4">
                        <div className="form-check form-switch mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="autoPublishSwitch"
                            checked={batchAutoPublish}
                            onChange={(e) => setBatchAutoPublish(e.target.checked)}
                            disabled={batchRunning}
                          />
                          <label className="form-check-label small fw-bold text-dark" htmlFor="autoPublishSwitch">
                            Auto-Publish each blog directly to Cloudflare D1 Database
                          </label>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          {batchRunning ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-danger text-white px-3 d-inline-flex align-items-center gap-1 shadow-sm"
                              onClick={handleStopBatch}
                            >
                              <Pause size={14} /> Stop Queue
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="tp-btn text-white px-4 py-2 d-inline-flex align-items-center gap-2 shadow-sm"
                              style={{ fontSize: "13px" }}
                              onClick={handleStartBatchGeneration}
                              disabled={batchTopicListText.split("\n").filter((t) => t.trim().length > 2).length === 0}
                            >
                              <Sparkles size={16} /> Start Batch Generation (One by One)
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Step 4: Real-time Live Progress & Queue Table */}
                      {batchQueue.length > 0 && (
                        <div className="border rounded-3 p-3 bg-white shadow-sm mb-4">
                          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                            <div>
                              <h6 className="fw-700 text-dark mb-0 d-flex align-items-center gap-2">
                                <Layers size={16} className="text-primary" /> Live Batch Generation Progress
                              </h6>
                              <div className="text-muted small">
                                {batchQueue.filter((i) => i.status === "completed").length} of {batchQueue.length} Articles Completed
                              </div>
                            </div>

                            <span className={`badge ${batchRunning ? "bg-warning text-dark" : "bg-success text-white"} px-3 py-1 small`}>
                              {batchRunning ? "⚡ Batch Processing Active" : "✓ Batch Finished"}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="progress mb-3" style={{ height: "8px" }}>
                            <div
                              className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                              role="progressbar"
                              style={{
                                width: `${
                                  (batchQueue.filter((i) => i.status === "completed").length / batchQueue.length) * 100
                                }%`,
                              }}
                            ></div>
                          </div>

                          {/* Queue Items Table */}
                          <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0" style={{ fontSize: "13px" }}>
                              <thead className="table-light">
                                <tr>
                                  <th style={{ width: "40px" }}>#</th>
                                  <th>Topic / Target Subject</th>
                                  <th>Status</th>
                                  <th>Category / Location</th>
                                  <th className="text-end">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {batchQueue.map((item, idx) => (
                                  <tr key={item.id}>
                                    <td className="fw-bold text-muted">{idx + 1}</td>
                                    <td>
                                      <div className="fw-semibold text-dark">{item.title || item.topic}</div>
                                      {item.title && item.title !== item.topic && (
                                        <div className="text-muted small" style={{ fontSize: "11.5px" }}>
                                          Prompt: {item.topic}
                                        </div>
                                      )}
                                    </td>
                                    <td>
                                      {item.status === "pending" && (
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary">
                                          ⏳ In Queue
                                        </span>
                                      )}
                                      {item.status === "generating" && (
                                        <span className="badge bg-warning bg-opacity-20 text-dark d-inline-flex align-items-center gap-1">
                                          <Loader2 size={11} className="animate-spin" /> Generating (120B)...
                                        </span>
                                      )}
                                      {item.status === "publishing" && (
                                        <span className="badge bg-info bg-opacity-20 text-dark d-inline-flex align-items-center gap-1">
                                          <Loader2 size={11} className="animate-spin" /> Saving to D1...
                                        </span>
                                      )}
                                      {item.status === "completed" && (
                                        <span className="badge bg-success text-white d-inline-flex align-items-center gap-1">
                                          <Check size={12} /> Published
                                        </span>
                                      )}
                                      {item.status === "error" && (
                                        <span className="badge bg-danger text-white d-inline-flex align-items-center gap-1" title={item.errorMsg}>
                                          <AlertCircle size={12} /> Error
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {item.category ? (
                                        <div>
                                          <span className="badge bg-light text-dark border me-1">
                                            {item.category}
                                          </span>
                                          {item.location && (
                                            <span className="text-muted small" style={{ fontSize: "11.5px" }}>
                                              {item.location}
                                            </span>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-muted small">—</span>
                                      )}
                                    </td>
                                    <td className="text-end">
                                      {item.slug ? (
                                        <a
                                          href={`/blog/${item.slug}`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            window.history.pushState({}, "", `/blog/${item.slug}`);
                                            window.dispatchEvent(new PopStateEvent("popstate"));
                                          }}
                                          className="btn btn-sm btn-outline-success py-0 px-2 d-inline-flex align-items-center gap-1"
                                          style={{ fontSize: "12px" }}
                                        >
                                          <ExternalLink size={12} /> View Blog
                                        </a>
                                      ) : (
                                        <span className="text-muted small">—</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rich Text Interactive Breakdown */}
                  {generatedBlog && (
                    <div className="border-top pt-4 mt-4">
                      {/* Top Action Bar */}
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4 p-3 bg-light rounded-3 border">
                        <div>
                          <span className="badge bg-success text-white font-monospace small mb-1">
                            ✓ Ready For Direct D1 Publish
                          </span>
                          <h6 className="fw-700 text-dark mb-0">Interactive Rich Text Editor</h6>
                        </div>
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning text-dark d-inline-flex align-items-center gap-1"
                            onClick={handleGenerateBlog}
                            disabled={generating}
                            title="If generation stopped midway, click to re-prompt and continue completion"
                          >
                            <RefreshCw size={14} className={generating ? "animate-spin" : ""} /> Continue / Complete Blog
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                            onClick={handleAddSection}
                          >
                            <PlusCircle size={14} /> Add Section (up to 10)
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                            onClick={handleAddFaq}
                          >
                            <PlusCircle size={14} /> Add FAQ (up to 10)
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-success text-white px-3 d-inline-flex align-items-center gap-1 shadow-sm"
                            onClick={handlePublishToD1}
                            disabled={publishStatus === "published"}
                          >
                            <CheckCircle2 size={15} />
                            {publishStatus === "published"
                              ? "Published to Cloudflare D1!"
                              : publishStatus === "saving"
                              ? "Saving to D1..."
                              : "Publish to D1 Database"}
                          </button>
                        </div>
                      </div>

                      {/* 1. Main Heading & Summary Block */}
                      <div className="card rounded-3 border mb-4 shadow-sm">
                        <div className="card-header bg-white py-3 d-flex align-items-center justify-content-between border-bottom">
                          <div className="d-flex align-items-center gap-2">
                            <Heading size={18} className="text-primary" />
                            <strong className="text-dark">Main Title &amp; Cover Query</strong>
                            <span className="badge bg-light text-muted small">(Max 5–6 words)</span>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-light border d-inline-flex align-items-center gap-1 text-primary small"
                            onClick={() =>
                              handleAiRewriteField(
                                "title",
                                "heading",
                                `Travel article about ${topic} in ${location}`,
                                generatedBlog.title
                              )
                            }
                            disabled={rewritingField === "title"}
                          >
                            {rewritingField === "title" ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <RefreshCw size={13} />
                            )}
                            AI Rewrite Title
                          </button>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-7">
                              <label className="form-label small text-muted fw-semibold">
                                Article Title <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control fw-bold fs-6"
                                value={generatedBlog.title}
                                onChange={(e) =>
                                  setGeneratedBlog({ ...generatedBlog, title: e.target.value })
                                }
                              />
                            </div>
                            <div className="col-md-5">
                              <label className="form-label small text-muted fw-semibold">
                                Main Cover [Pexels Query]
                              </label>
                              <div className="input-group input-group-sm">
                                <span className="input-group-text bg-light text-muted">
                                  <Image size={13} />
                                </span>
                                <input
                                  type="text"
                                  className="form-control font-monospace text-primary"
                                  value={generatedBlog.cover_query}
                                  onChange={(e) =>
                                    setGeneratedBlog({ ...generatedBlog, cover_query: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-12">
                              <label className="form-label small text-muted fw-semibold">
                                2-Sentence Engaging Summary
                              </label>
                              <textarea
                                className="form-control form-control-sm"
                                rows={2}
                                value={generatedBlog.summary}
                                onChange={(e) =>
                                  setGeneratedBlog({ ...generatedBlog, summary: e.target.value })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. Structured Sections (Heading, Paragraphs, Pexels-Query upto 10) */}
                      <h5 className="fw-700 text-dark mb-3 d-flex align-items-center justify-content-between">
                        <span>Content Sections ({generatedBlog.sections?.length || 0}/10)</span>
                        <span className="badge bg-light text-muted small">Max 5-6 words per subheading</span>
                      </h5>

                      <div className="d-flex flex-column gap-3 mb-4">
                        {generatedBlog.sections?.map((sec: any, sIdx: number) => (
                          <div key={sIdx} className="card rounded-3 border shadow-sm">
                            {/* Section Header with Actions */}
                            <div className="card-header bg-light py-2 px-3 d-flex align-items-center justify-content-between">
                              <span className="fw-bold text-dark small">
                                Section #{sIdx + 1}
                              </span>
                              <div className="d-flex align-items-center gap-2">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-white bg-white border text-primary small d-inline-flex align-items-center gap-1 py-1 px-2"
                                  style={{ fontSize: "11px" }}
                                  onClick={() =>
                                    handleAiRewriteField(
                                      `sec_heading_${sIdx}`,
                                      "subheading",
                                      `Subheading for ${sec.heading} about ${topic}`,
                                      sec.heading,
                                      sIdx
                                    )
                                  }
                                  disabled={rewritingField === `sec_heading_${sIdx}`}
                                >
                                  {rewritingField === `sec_heading_${sIdx}` ? (
                                    <Loader2 size={11} className="animate-spin" />
                                  ) : (
                                    <RefreshCw size={11} />
                                  )}
                                  AI Rewrite Heading
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-white bg-white border text-primary small d-inline-flex align-items-center gap-1 py-1 px-2"
                                  style={{ fontSize: "11px" }}
                                  onClick={() =>
                                    handleAiRewriteField(
                                      `sec_para_${sIdx}`,
                                      "paragraphs",
                                      `Write 2 paragraphs about ${sec.heading} in ${location}`,
                                      sec.paragraphs?.join(" "),
                                      sIdx
                                    )
                                  }
                                  disabled={rewritingField === `sec_para_${sIdx}`}
                                >
                                  {rewritingField === `sec_para_${sIdx}` ? (
                                    <Loader2 size={11} className="animate-spin" />
                                  ) : (
                                    <RefreshCw size={11} />
                                  )}
                                  AI Rewrite Paragraphs
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-white bg-white border text-danger small py-1 px-2"
                                  style={{ fontSize: "11px" }}
                                  onClick={() => {
                                    const updated = { ...generatedBlog };
                                    updated.sections.splice(sIdx, 1);
                                    setGeneratedBlog(updated);
                                  }}
                                  title="Delete Section"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            <div className="card-body p-3">
                              <div className="row g-2 mb-2">
                                <div className="col-md-7">
                                  <label className="form-label small text-muted mb-1 fw-semibold">
                                    Subheading (Max 5-6 Words)
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm fw-bold text-dark"
                                    value={sec.heading}
                                    onChange={(e) => {
                                      const updated = { ...generatedBlog };
                                      updated.sections[sIdx].heading = e.target.value;
                                      setGeneratedBlog(updated);
                                    }}
                                  />
                                </div>
                                <div className="col-md-5">
                                  <label className="form-label small text-muted mb-1 fw-semibold">
                                    [Pexels Visual Query]
                                  </label>
                                  <div className="input-group input-group-sm">
                                    <input
                                      type="text"
                                      className="form-control font-monospace text-primary"
                                      value={sec.pexelsQuery}
                                      onChange={(e) => {
                                        const updated = { ...generatedBlog };
                                        updated.sections[sIdx].pexelsQuery = e.target.value;
                                        setGeneratedBlog(updated);
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-outline-secondary"
                                      onClick={() =>
                                        handleAiRewriteField(
                                          `sec_pex_${sIdx}`,
                                          "pexelsQuery",
                                          `Photo of ${sec.heading} ${location}`,
                                          sec.pexelsQuery,
                                          sIdx
                                        )
                                      }
                                      disabled={rewritingField === `sec_pex_${sIdx}`}
                                    >
                                      {rewritingField === `sec_pex_${sIdx}` ? (
                                        <Loader2 size={11} className="animate-spin" />
                                      ) : (
                                        <Sparkles size={11} />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-2">
                                <label className="form-label small text-muted mb-1 fw-semibold">
                                  Section Paragraphs
                                </label>
                                <textarea
                                  className="form-control form-control-sm"
                                  rows={3}
                                  value={sec.paragraphs?.join("\n\n") || ""}
                                  onChange={(e) => {
                                    const updated = { ...generatedBlog };
                                    updated.sections[sIdx].paragraphs = e.target.value
                                      .split("\n\n")
                                      .filter((p) => p.trim());
                                    setGeneratedBlog(updated);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 3. Frequently Asked Questions (upto 10) */}
                      <h5 className="fw-700 text-dark mb-3 d-flex align-items-center justify-content-between">
                        <span>Frequently Asked Questions ({generatedBlog.faqs?.length || 0}/10)</span>
                      </h5>

                      <div className="d-flex flex-column gap-3 mb-4">
                        {generatedBlog.faqs?.map((f: any, fIdx: number) => (
                          <div key={fIdx} className="card rounded-3 border shadow-sm">
                            <div className="card-header bg-light py-2 px-3 d-flex align-items-center justify-content-between">
                              <span className="fw-bold text-dark small">FAQ #{fIdx + 1}</span>
                              <div className="d-flex align-items-center gap-2">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-white bg-white border text-primary small d-inline-flex align-items-center gap-1 py-1 px-2"
                                  style={{ fontSize: "11px" }}
                                  onClick={() =>
                                    handleAiRewriteField(
                                      `faq_${fIdx}`,
                                      "faq",
                                      `Travel question and answer for ${topic} in ${location}`,
                                      f.question,
                                      undefined,
                                      fIdx
                                    )
                                  }
                                  disabled={rewritingField === `faq_${fIdx}`}
                                >
                                  {rewritingField === `faq_${fIdx}` ? (
                                    <Loader2 size={11} className="animate-spin" />
                                  ) : (
                                    <RefreshCw size={11} />
                                  )}
                                  AI Rewrite FAQ
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-white bg-white border text-danger small py-1 px-2"
                                  style={{ fontSize: "11px" }}
                                  onClick={() => {
                                    const updated = { ...generatedBlog };
                                    updated.faqs.splice(fIdx, 1);
                                    setGeneratedBlog(updated);
                                  }}
                                  title="Delete FAQ"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            <div className="card-body p-3">
                              <div className="mb-2">
                                <label className="form-label small text-muted mb-1 fw-semibold">
                                  Question
                                </label>
                                <input
                                  type="text"
                                  className="form-control form-control-sm fw-bold text-dark"
                                  value={f.question}
                                  onChange={(e) => {
                                    const updated = { ...generatedBlog };
                                    updated.faqs[fIdx].question = e.target.value;
                                    setGeneratedBlog(updated);
                                  }}
                                />
                              </div>
                              <div>
                                <label className="form-label small text-muted mb-1 fw-semibold">
                                  Answer
                                </label>
                                <textarea
                                  className="form-control form-control-sm"
                                  rows={2}
                                  value={f.answer}
                                  onChange={(e) => {
                                    const updated = { ...generatedBlog };
                                    updated.faqs[fIdx].answer = e.target.value;
                                    setGeneratedBlog(updated);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Publish Result Banner */}
                      {publishStatus === "published" && (
                        <div className="p-3 bg-success bg-opacity-10 border border-success rounded-3 text-center my-3">
                          <span className="text-success fw-bold me-2">✓ Published directly to Cloudflare D1!</span>
                          <a
                            href={`/blog/${encodeURIComponent(
                              generatedBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
                            )}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const slug = generatedBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                              window.history.pushState({}, "", `/blog/${slug}`);
                              window.dispatchEvent(new PopStateEvent("popstate"));
                            }}
                            className="btn btn-sm btn-primary rounded-pill px-3 ms-2"
                          >
                            <Eye size={14} className="me-1" /> View Live Blog Article
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* D1 SQLite Console Tab */}
              {activeTab === "sqliteConsole" && (
                <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <div>
                      <span className="badge bg-primary bg-opacity-10 text-primary font-monospace small mb-1">
                        Cloudflare D1 Database Engine
                      </span>
                      <h4 className="fw-700 text-dark mb-0 d-flex align-items-center gap-2">
                        <Terminal size={20} className="text-primary" /> D1 SQLite SQL Console
                      </h4>
                    </div>
                    <span className="badge bg-light text-muted font-monospace small border">
                      DB ID: b15e9273-0279-42e7-b909-5cee71b871c0
                    </span>
                  </div>

                  <p className="text-muted small mb-4">
                    Execute raw SQL queries directly against your Cloudflare D1 SQLite database to inspect, query, insert paragraphs, update blogs, or manage tables.
                  </p>

                  {/* Preset Quick SQL Buttons */}
                  <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                    <span className="small text-muted fw-semibold me-1">Quick Queries:</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-light border small font-monospace py-1 px-2"
                      style={{ fontSize: "11.5px" }}
                      onClick={() => {
                        const q = "SELECT id, slug, title, category, location, created_at FROM blogs ORDER BY created_at DESC LIMIT 10;";
                        setSqlQuery(q);
                        handleExecuteSql(q);
                      }}
                    >
                      All Blogs (10)
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-light border small font-monospace py-1 px-2"
                      style={{ fontSize: "11.5px" }}
                      onClick={() => {
                        const q = "PRAGMA table_info(blogs);";
                        setSqlQuery(q);
                        handleExecuteSql(q);
                      }}
                    >
                      Table Schema (blogs)
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-light border small font-monospace py-1 px-2"
                      style={{ fontSize: "11.5px" }}
                      onClick={() => {
                        const q = "SELECT count(*) as total_blogs FROM blogs;";
                        setSqlQuery(q);
                        handleExecuteSql(q);
                      }}
                    >
                      Count Total Blogs
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-light border small font-monospace py-1 px-2"
                      style={{ fontSize: "11.5px" }}
                      onClick={() => {
                        const q = "SELECT slug, title, cover_query, json_array_length(content_json) as sections_count FROM blogs LIMIT 5;";
                        setSqlQuery(q);
                        handleExecuteSql(q);
                      }}
                    >
                      Inspect Sections Count
                    </button>
                  </div>

                  {/* SQL Query Box */}
                  <div className="card rounded-3 border mb-3 overflow-hidden shadow-sm">
                    <div className="card-header bg-dark text-white d-flex align-items-center justify-content-between py-2 px-3">
                      <span className="small font-monospace text-warning d-flex align-items-center gap-1">
                        <Database size={13} /> SQL Command Editor
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-success text-white py-1 px-3 d-inline-flex align-items-center gap-1 fw-semibold"
                        style={{ fontSize: "12px" }}
                        onClick={() => handleExecuteSql()}
                        disabled={sqlRunning}
                      >
                        {sqlRunning ? (
                          <>
                            <Loader2 size={13} className="animate-spin" /> Running...
                          </>
                        ) : (
                          <>
                            <Play size={13} /> Execute Query (Ctrl+Enter)
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      className="form-control border-0 font-monospace bg-light p-3"
                      rows={5}
                      style={{ fontSize: "13px", resize: "vertical", fontFamily: "monospace" }}
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                          handleExecuteSql();
                        }
                      }}
                      placeholder="SELECT * FROM blogs WHERE category = 'Adventure' LIMIT 10;"
                    />
                  </div>

                  {/* Messages / Errors */}
                  {sqlError && (
                    <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center justify-content-between">
                      <span><strong>Error:</strong> {sqlError}</span>
                      <button type="button" className="btn-close" onClick={() => setSqlError(null)}></button>
                    </div>
                  )}

                  {sqlMessage && (
                    <div className="alert alert-success py-2 px-3 small rounded-3 mb-3 d-flex align-items-center justify-content-between">
                      <span>✓ {sqlMessage}</span>
                      <button type="button" className="btn-close" onClick={() => setSqlMessage(null)}></button>
                    </div>
                  )}

                  {/* Query Results Table */}
                  {sqlResults && sqlResults.length > 0 && (
                    <div className="card rounded-3 border shadow-sm overflow-hidden mt-3">
                      <div className="card-header bg-light py-2 px-3 d-flex align-items-center justify-content-between">
                        <strong className="text-dark small">Results ({sqlResults.length} rows)</strong>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary py-0 px-2 small"
                          style={{ fontSize: "11px" }}
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(sqlResults, null, 2));
                            alert("Copied results as JSON to clipboard!");
                          }}
                        >
                          <Copy size={11} className="me-1" /> Copy JSON
                        </button>
                      </div>
                      <div className="table-responsive mb-0" style={{ maxHeight: "360px" }}>
                        <table className="table table-bordered table-striped table-hover mb-0 align-middle small">
                          <thead className="table-dark" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                            <tr>
                              {Object.keys(sqlResults[0] || {}).map((col) => (
                                <th key={col} className="font-monospace fw-semibold" style={{ fontSize: "12px" }}>
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sqlResults.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {Object.keys(sqlResults[0] || {}).map((col, cIdx) => (
                                  <td key={cIdx} className="font-monospace" style={{ fontSize: "11.5px", maxWidth: "300px", wordBreak: "break-word" }}>
                                    {typeof row[col] === "object"
                                      ? JSON.stringify(row[col])
                                      : String(row[col] ?? "NULL")}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "overview" && (
                <div>
                  {/* Quick Stat Cards */}
                  <div className="row g-3 mb-4">
                    <div className="col-sm-4">
                      <div className="bg-white rounded-4 border p-4 shadow-sm">
                        <div className="text-muted small fw-semibold text-uppercase mb-1">Upcoming Trips</div>
                        <div className="fs-3 fw-bold text-primary">2 Trips</div>
                        <div className="text-muted small mt-1">Confirmed & Scheduled</div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="bg-white rounded-4 border p-4 shadow-sm">
                        <div className="text-muted small fw-semibold text-uppercase mb-1">Reward Points</div>
                        <div className="fs-3 fw-bold text-success">1,450 pts</div>
                        <div className="text-muted small mt-1">₹1,450 redeemable balance</div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="bg-white rounded-4 border p-4 shadow-sm">
                        <div className="text-muted small fw-semibold text-uppercase mb-1">AI Articles</div>
                        <div className="fs-3 fw-bold text-danger">Active</div>
                        <div className="text-muted small mt-1">Groq 120B Engine ready</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings Section */}
                  <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 className="fw-700 text-dark mb-0">Upcoming Bookings</h5>
                      <button
                        type="button"
                        className="btn btn-link text-primary text-decoration-none p-0 small fw-semibold"
                        onClick={() => setActiveTab("bookings")}
                      >
                        View All
                      </button>
                    </div>

                    <div className="d-flex flex-column gap-3">
                      <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-3 overflow-hidden"
                            style={{ width: "65px", height: "55px", background: "#ddd" }}
                          >
                            <img
                              src="https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=300"
                              alt=""
                              className="w-100 h-100 object-fit-cover"
                            />
                          </div>
                          <div>
                            <h6 className="fw-500 text-dark mb-1">Kashmir Snow Valley Resort</h6>
                            <span className="text-muted small d-inline-flex align-items-center gap-1">
                              <Calendar size={13} /> 25 Aug – 28 Aug 2026 • 2 Adults
                            </span>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-700 text-dark">₹18,500</div>
                          <span className="badge bg-success bg-opacity-10 text-success small">Confirmed</span>
                        </div>
                      </div>

                      <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-3 overflow-hidden"
                            style={{ width: "65px", height: "55px", background: "#ddd" }}
                          >
                            <img
                              src="https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=300"
                              alt=""
                              className="w-100 h-100 object-fit-cover"
                            />
                          </div>
                          <div>
                            <h6 className="fw-500 text-dark mb-1">Goa Luxury Beachside Villa</h6>
                            <span className="text-muted small d-inline-flex align-items-center gap-1">
                              <Calendar size={13} /> 12 Sep – 15 Sep 2026 • 2 Adults
                            </span>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-700 text-dark">₹24,999</div>
                          <span className="badge bg-success bg-opacity-10 text-success small">Confirmed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "bookings" && (
                <div className="bg-white rounded-4 border p-4 shadow-sm">
                  <h5 className="fw-700 text-dark mb-3">All Trip Bookings</h5>
                  <p className="text-muted small mb-4">Manage your hotel stays, domestic flights, and international tour packages.</p>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr className="small text-muted text-uppercase">
                          <th>Destination</th>
                          <th>Dates</th>
                          <th>Guests</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody className="small">
                        <tr>
                          <td><strong>Kashmir Valley Luxury Package</strong></td>
                          <td>25 Aug – 28 Aug 2026</td>
                          <td>2 Adults</td>
                          <td className="fw-bold">₹18,500</td>
                          <td><span className="badge bg-success">Confirmed</span></td>
                        </tr>
                        <tr>
                          <td><strong>Goa Private Pool Villa</strong></td>
                          <td>12 Sep – 15 Sep 2026</td>
                          <td>2 Adults</td>
                          <td className="fw-bold">₹24,999</td>
                          <td><span className="badge bg-success">Confirmed</span></td>
                        </tr>
                        <tr>
                          <td><strong>Dubai 4N/5D Desert Safari</strong></td>
                          <td>10 Nov – 14 Nov 2026</td>
                          <td>2 Adults, 1 Child</td>
                          <td className="fw-bold">₹78,000</td>
                          <td><span className="badge bg-warning text-dark">Pending</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "saved" && (
                <div className="bg-white rounded-4 border p-4 shadow-sm">
                  <h5 className="fw-700 text-dark mb-3">Saved Destinations & Tours</h5>
                  <p className="text-muted small mb-4">Your personalized bucket list of hotels and experiences.</p>

                  <div className="row g-3">
                    {[
                      { name: "The Oberoi Vanyavilas, Ranthambore", loc: "Rajasthan", price: "₹14,200", img: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400" },
                      { name: "Taj Exotica Resort & Spa", loc: "Goa", price: "₹19,500", img: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=400" },
                      { name: "Khyber Himalayan Resort", loc: "Gulmarg, Kashmir", price: "₹22,000", img: "https://images.pexels.com/photos/2088203/pexels-photo-2088203.jpeg?auto=compress&cs=tinysrgb&w=400" },
                    ].map((item, idx) => (
                      <div key={idx} className="col-md-4">
                        <div className="card rounded-3 border overflow-hidden shadow-sm h-100">
                          <img src={item.img} alt="" style={{ height: "140px", objectFit: "cover" }} />
                          <div className="p-3">
                            <h6 className="fw-500 text-dark mb-1" style={{ fontSize: "13.5px" }}>{item.name}</h6>
                            <span className="text-muted small d-block mb-2"><MapPin size={12} className="text-danger" /> {item.loc}</span>
                            <div className="d-flex justify-content-between align-items-center">
                              <strong className="text-primary">{item.price}</strong>
                              <a
                                href={`/tour/${encodeURIComponent(item.name)}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.history.pushState({}, "", `/tour/${encodeURIComponent(item.name)}`);
                                  window.dispatchEvent(new PopStateEvent("popstate"));
                                }}
                                className="btn btn-sm btn-primary rounded-pill px-3"
                                style={{ fontSize: "11.5px" }}
                              >
                                View Tour
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="bg-white rounded-4 border p-4 shadow-sm">
                  <h5 className="fw-700 text-dark mb-3">Profile & Account Settings</h5>
                  <form onSubmit={(e) => { e.preventDefault(); alert("Profile updated successfully!"); }}>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-semibold">Full Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          defaultValue={user.name || ""}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-semibold">Email Address</label>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          defaultValue={user.email}
                          disabled
                        />
                      </div>
                    </div>
                    <button type="submit" className="tp-btn text-white px-4 py-2" style={{ fontSize: "13px" }}>
                      Save Changes
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DashboardPage;
