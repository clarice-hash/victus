# Victus - Instruções de Setup

## 🚀 Setup Rápido

### 1. Base de Dados
1. Abre **phpMyAdmin** (`http://localhost/phpmyadmin`)
2. Cria base de dados `victus`
3. Importa `victus.sql`

### 2. Backend (API)
- A pasta `api/` já está em `c:\xampp\htdocs\victus\api\`
- Testa: `http://localhost/victus/api/test.php`

### 3. Frontend (React)
```bash
cd app
npm install
npm run dev
```

## 🔐 Credenciais de Teste
- **Email:** `teste@victus.com`
- **Password:** `123456`

## 📡 Endpoints
- `POST /api/auth/login.php` - Login
- `GET /api/test.php` - Teste da API

## 🐛 Troubleshooting

### "Erro de ligação"
1. Verifica se XAMPP está a correr (Apache + MySQL)
2. Testa: `http://localhost/victus/api/test.php`
3. Verifica se a base `victus` existe

### "Credenciais inválidas"
1. Confirma que importaste `victus.sql`
2. Verifica as credenciais: `teste@victus.com` / `123456`

## 📁 Estrutura
```
victus/
├── api/                    # Backend PHP
│   ├── config.php         # Configuração DB
│   ├── auth/login.php     # Login endpoint
│   └── test.php           # Teste da API
├── app/                    # Frontend React
└── victus.sql             # Base de dados
```








