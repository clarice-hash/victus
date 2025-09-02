-- Criar base de dados Victus
CREATE DATABASE IF NOT EXISTS victus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE victus;

-- Tabela de utilizadores
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NULL,
    bio TEXT NULL,
    weight_goal DECIMAL(5,2) NULL,
    current_weight DECIMAL(5,2) NULL,
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de recuperação de passwords
CREATE TABLE IF NOT EXISTS password_resets (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cursos
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500),
    duration VARCHAR(50),
    level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    instructor VARCHAR(255),
    price DECIMAL(10,2) DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de módulos dos cursos
CREATE TABLE IF NOT EXISTS course_modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    position INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Tabela de aulas/lições
CREATE TABLE IF NOT EXISTS lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    module_id INT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    thumbnail VARCHAR(500),
    duration VARCHAR(50),
    position INT NOT NULL,
    type ENUM('video', 'practical', 'quiz', 'document') DEFAULT 'video',
    is_free BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE SET NULL
);

-- Tabela de progresso do utilizador
CREATE TABLE IF NOT EXISTS user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    lesson_id INT NOT NULL,
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    progress_percentage INT DEFAULT 0,
    watch_time INT DEFAULT 0,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id)
);

-- Tabela de inscrições em cursos
CREATE TABLE IF NOT EXISTS course_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress_percentage INT DEFAULT 0,
    last_accessed TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_course (user_id, course_id)
);

-- Tabela de biblioteca (conteúdos diversos)
CREATE TABLE IF NOT EXISTS library_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('curso', 'workshop', 'masterclass', 'desafio', 'video', 'document') NOT NULL,
    thumbnail VARCHAR(500),
    content_url VARCHAR(500),
    duration VARCHAR(50),
    difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    tags JSON,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de eventos
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NULL,
    type ENUM('masterclass', 'workshop', 'webinar', 'live') NOT NULL,
    thumbnail VARCHAR(500),
    max_participants INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de participações em eventos
CREATE TABLE IF NOT EXISTS event_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_event (user_id, event_id)
);

-- Tabela de lembretes diários
CREATE TABLE IF NOT EXISTS daily_reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    author VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    display_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de estatísticas do dashboard
CREATE TABLE IF NOT EXISTS dashboard_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    stat_type ENUM('weight_loss', 'courses_completed', 'hours_watched', 'streak_days') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    date_recorded DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_stat_date (user_id, stat_type, date_recorded)
);

-- Inserir dados de exemplo

-- Utilizadores de teste
INSERT INTO users (name, email, password, current_weight, weight_goal) VALUES 
('Teste Victus', 'teste@victus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 70.5, 68.0),
('Maria Silva', 'maria@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 65.0, 62.0);

-- Cursos
INSERT INTO courses (title, description, thumbnail, duration, level, instructor, is_featured) VALUES
('Nutrição Clínica Avançada', 'Curso completo de nutrição clínica e dietoterapia para profissionais', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', '120 horas', 'advanced', 'Dr. Ana Santos', TRUE),
('Fundamentos da Alimentação', 'Princípios básicos da nutrição e alimentação saudável', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400', '60 horas', 'beginner', 'Dra. Carla Mendes', TRUE),
('Liberdade Alimentar', 'Desenvolva uma relação saudável com a comida', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', '45 horas', 'intermediate', 'Dra. Sofia Costa', FALSE);

-- Módulos dos cursos
INSERT INTO course_modules (course_id, title, description, position) VALUES
(1, 'Fundamentos Teóricos', 'Base científica da nutrição clínica', 1),
(1, 'Avaliação Nutricional', 'Métodos e técnicas de avaliação', 2),
(1, 'Intervenção Clínica', 'Aplicação prática em diferentes patologias', 3),
(2, 'Macronutrientes', 'Proteínas, carboidratos e lipídios', 1),
(2, 'Micronutrientes', 'Vitaminas e minerais essenciais', 2),
(3, 'Mindful Eating', 'Alimentação consciente e intuitiva', 1),
(3, 'Quebrar Ciclos', 'Superar compulsões e restrições', 2);

-- Lições
INSERT INTO lessons (course_id, module_id, title, description, video_url, thumbnail, duration, position, type, is_free) VALUES
(1, 1, 'Introdução à Nutrição Clínica', 'Conceitos fundamentais e aplicações', 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', '15:30', 1, 'video', TRUE),
(1, 1, 'Metabolismo e Energia', 'Como o corpo processa os nutrientes', 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400', '22:45', 2, 'video', FALSE),
(2, 1, 'Proteínas na Alimentação', 'Fontes e necessidades proteicas', 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', '18:20', 1, 'video', TRUE),
(3, 1, 'O que é Liberdade Alimentar?', 'Conceitos e princípios fundamentais', 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', '12:15', 1, 'video', TRUE);

-- Conteúdo da biblioteca
INSERT INTO library_content (title, description, type, thumbnail, content_url, duration, difficulty, tags, is_featured, view_count) VALUES
('Workshop: Planejamento de Refeições', 'Aprenda a organizar suas refeições semanais', 'workshop', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', '90 min', 'beginner', '["planejamento", "organização", "refeições"]', TRUE, 245),
('Masterclass: Nutrição Esportiva', 'Nutrição para atletas e praticantes de exercício', 'masterclass', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', '120 min', 'advanced', '["esporte", "performance", "atletas"]', TRUE, 189),
('Desafio 30 Dias', 'Transforme seus hábitos alimentares em 30 dias', 'desafio', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400', 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', '30 dias', 'intermediate', '["hábitos", "transformação", "desafio"]', FALSE, 156);

-- Eventos
INSERT INTO events (title, description, event_date, event_time, type, thumbnail, max_participants) VALUES
('Masterclass: Nutrição Anti-inflamatória', 'Descubra os alimentos que combatem a inflamação', '2025-09-15', '19:00:00', 'masterclass', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', 100),
('Workshop: Leitura de Rótulos', 'Aprenda a interpretar informações nutricionais', '2025-09-22', '14:00:00', 'workshop', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400', 50),
('Live: Perguntas e Respostas', 'Tire suas dúvidas sobre nutrição', '2025-09-08', '20:00:00', 'live', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', NULL);

-- Lembretes diários
INSERT INTO daily_reminders (message, author, is_active) VALUES
('É importante agradecer pelo hoje, sem nunca desistir do amanhã!', 'Dra. Ana Santos', TRUE),
('Cada pequeno passo conta na sua jornada de saúde.', 'Equipe Victus', TRUE),
('Lembre-se: você é mais forte do que pensa!', 'Dra. Sofia Costa', TRUE),
('A mudança começa com uma decisão. Você já tomou a sua!', 'Dra. Carla Mendes', TRUE);

-- Inscrições de exemplo
INSERT INTO course_enrollments (user_id, course_id, progress_percentage, last_accessed) VALUES
(1, 1, 25, NOW()),
(1, 2, 60, NOW()),
(1, 3, 10, NOW());

-- Estatísticas do dashboard
INSERT INTO dashboard_stats (user_id, stat_type, value, date_recorded) VALUES
(1, 'weight_loss', 2.0, CURDATE()),
(1, 'courses_completed', 1, CURDATE()),
(1, 'hours_watched', 15.5, CURDATE()),
(1, 'streak_days', 7, CURDATE());
