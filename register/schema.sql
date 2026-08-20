-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  author TEXT DEFAULT 'Admin',
  author_role TEXT DEFAULT 'Travel Specialist',
  author_avatar TEXT,
  cover_query TEXT,
  summary TEXT,
  content_json TEXT NOT NULL, -- JSON storing sections/paragraphs, max 10 pexels image queries, highlights
  faqs_json TEXT,            -- JSON storing up to 10 FAQs
  tags TEXT,                 -- Comma-separated tags
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_location ON blogs(location);
