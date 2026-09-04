-- 1. ENUM'LAR
CREATE TYPE difficulty_level AS ENUM ('junior', 'mid', 'senior');
CREATE TYPE question_type AS ENUM ('technical', 'system_design', 'behavioral', 'coding');
CREATE TYPE session_status AS ENUM ('in_progress', 'completed', 'abandoned');

-- 2. KULLANICI PROFİLLERİ (Supabase Auth ile senkron)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    target_role TEXT DEFAULT 'Software Engineer',
    target_level difficulty_level DEFAULT 'mid',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. KATEGORİLER
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MÜLAKAT SORULARI
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    question_text TEXT NOT NULL,
    ideal_answer TEXT NOT NULL,
    hints TEXT[] DEFAULT '{}',
    key_points TEXT[] DEFAULT '{}',
    difficulty difficulty_level NOT NULL DEFAULT 'mid',
    q_type question_type NOT NULL DEFAULT 'technical',
    tags TEXT[] DEFAULT '{}',
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MÜLAKAT SİMÜLASYON OTURUMLARI
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    status session_status DEFAULT 'in_progress',
    duration_seconds INT DEFAULT 0,
    total_questions INT DEFAULT 5,
    score_percentage NUMERIC(5,2),
    feedback_notes TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 6. OTURUM CEVAPLARI VE DEĞERLENDİRME
CREATE TABLE IF NOT EXISTS session_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    user_notes TEXT,
    self_rating INT CHECK (self_rating >= 1 AND self_rating <= 5),
    time_spent_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. KAYDEDİLEN / FAVORİ SORULAR (Bookmarks)
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- 8. İNDEKSLER (Performans Optimizasyonu)
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);

-- 9. ROW LEVEL SECURITY (RLS) POLİTİKALARI
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Kategoriler ve Sorular herkese açık (Okuma)
CREATE POLICY "Public categories read" ON categories FOR SELECT USING (true);
CREATE POLICY "Public questions read" ON questions FOR SELECT USING (true);

-- Profil: Kullanıcı kendi profilini okur ve günceller
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Oturumlar: Kullanıcı sadece kendi mülakatlarını görür ve yönetir
CREATE POLICY "Users manage own sessions" ON interview_sessions FOR ALL USING (auth.uid() = user_id);

-- Cevaplar: Kullanıcı sadece kendi oturum cevaplarını yönetir
CREATE POLICY "Users manage own answers" ON session_answers FOR ALL USING (
    EXISTS (SELECT 1 FROM interview_sessions WHERE id = session_answers.session_id AND user_id = auth.uid())
);

-- Bookmarks: Kullanıcı kendi favorilerini yönetir
CREATE POLICY "Users manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);
