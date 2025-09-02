# Victus Project Auth

Projeto full‑stack com autenticação via JWT. Backend em PHP (API REST) e frontend em React (Vite). A API expõe rotas de registro, login, recuperação e redefinição de senha, além de rotas auxiliares (user, library, player, dashboard). O frontend consome a API via Axios.

## Stack
- Backend: PHP 8+, Composer, Firebase PHP‑JWT
- Banco: MySQL/MariaDB (PDO)
- Frontend: React 18 + Vite, Axios, React Router

## Estrutura de pastas
- api/
  - public/ → entrypoint da API (index.php)
  - src/controllers/ → controladores (Auth, User, Library, Player, Dashboard)
  - src/models/ → modelos (UserModel)
  - db/ → schema.sql e seeds.php
  - config.php → configuração (DB, JWT, helpers)
  - composer.json → dependências PHP
- app/
  - src/ → páginas React e cliente HTTP (Axios)
  - package.json → scripts do Vite

## Pré‑requisitos
- PHP 8.1+ com extensão pdo_mysql habilitada
- Composer
- MySQL 5.7+/MariaDB 10.4+
- Node.js 18+

## Backend (API PHP)

1) Instalar dependências
```
cd api
composer install
```

2) Configurar variáveis de ambiente
A API lê variáveis de ambiente com fallbacks padrão em `api/config.php`:
- DB_HOST (default: 127.0.0.1)
- DB_NAME (default: victus_db)
- DB_USER (default: root)
- DB_PASS (default: vazio)
- DB_CHARSET (default: utf8mb4)
- JWT_SECRET (default: change-this-secret) — troque em produção
- JWT_TTL (default: 86400 segundos)

Como definir variáveis (exemplos locais):
- Windows (PowerShell):
  - `$env:DB_HOST = "127.0.0.1"`
  - `$env:JWT_SECRET = "sua-chave-secreta-segura"`
- Windows (CMD):
  - `set DB_HOST=127.0.0.1`
  - `set JWT_SECRET=sua-chave-secreta-segura`

3) Criar banco e schema
Importe o schema:
```
mysql -u root -p < api/db/schema.sql
```

4) Popular com dados de exemplo (seeds)
```
php api/db/seeds.php
```
Cria um usuário admin (admin@example.com / admin123) e alguns itens na biblioteca.

5) Rodar a API em desenvolvimento
```
cd api
php -S 127.0.0.1:8000 -t public
```
A API ficará disponível em http://127.0.0.1:8000 (endpoints sob prefixo /api).

## Frontend (React + Vite)

1) Instalar dependências
```
cd app
npm install
```

2) Base URL do cliente HTTP
O Axios está configurado com `baseURL: '/api'` (`app/src/services/apiClient.js`). Para desenvolvimento usando Vite em porta diferente da API, use um proxy no Vite para encaminhar `/api` para a API.

Crie `app/vite.config.js` (se ainda não existir) com:
```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
```
Instale o plugin se necessário: `npm i -D @vitejs/plugin-react`.

Alternativa: sem proxy, altere temporariamente o `baseURL` para `http://127.0.0.1:8000/api` durante o desenvolvimento.

3) Rodar o frontend
```
cd app
npm run dev
```
Aplicação em http://127.0.0.1:5173

## Endpoints de Autenticação

Headers comuns
- Content-Type: application/json

- POST /api/auth/register
  - Body: `{ "name": "Seu Nome", "email": "email@exemplo.com", "password": "senha" }`
  - 201: `{ user: { id, name, email }, token }`

- POST /api/auth/login
  - Body: `{ "email": "email@exemplo.com", "password": "senha" }`
  - 200: `{ user: { id, name, email }, token }`

- POST /api/auth/forgot-password
  - Body: `{ "email": "email@exemplo.com" }`
  - 200: `{ message }` e, em modo de dev, retorna `token` para testes

- POST /api/auth/reset-password
  - Body: `{ "token": "<token recebido>", "new_password": "novaSenha" }`
  - 200: `{ message }`

- GET /api/user/me
  - Header: `Authorization: Bearer <token>`
  - 200: `{ user }`

Exemplos cURL
```
# Registro
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'

# Login
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret"}'

# Me (substitua <TOKEN>)
curl http://127.0.0.1:8000/api/user/me \
  -H "Authorization: Bearer <TOKEN>"
```

## Outros Endpoints (dados de exemplo)
- GET /api/library?page=1&per=20 — lista itens da biblioteca
- GET /api/library/{id} — detalhes de um item + arquivos
- GET /api/player/playlist/{id} — playlist (ex.: vídeo)
- POST /api/player/progress — salva progresso do player
- GET /api/dashboard/overview — visão geral (contagens e atividades)

Obs.: Algumas rotas podem exigir ajustes conforme ambiente/servidor. Em produção, prefira um roteador/servidor web (Apache/Nginx) configurado para apontar para `api/public`.

## Fluxo de Autenticação (JWT)
- Após registrar/logar, o backend retorna `token` (JWT HS256)
- O frontend armazena o token (ex.: localStorage) e envia `Authorization: Bearer <token>`
- O backend valida o token com `JWT_SECRET` e TTL `JWT_TTL`

## Segurança e Produção
- Defina `JWT_SECRET` com valor forte e mantenha fora do controle de versão
- Use HTTPS em produção
- Ative e restrinja CORS conforme sua origem
- Garanta que o `public/` sirva apenas arquivos públicos; demais pastas fora do docroot
- Utilize servidor web (Nginx/Apache) com rewrite para `api/public/index.php`

## Troubleshooting
- 404 ao chamar `/api` via Vite: configure o proxy no `vite.config.js` ou use baseURL absoluto para a API
- Erro de conexão com DB: verifique `DB_HOST`, usuário/senha e se a extensão `pdo_mysql` está habilitada
- `Class "Firebase\JWT\JWT" not found`: rode `composer install` dentro de `api/`
- `Access-Control-Allow-Origin`: configure CORS/reverse proxy/servidor

## Licença
Uso livre para fins educacionais. Ajuste conforme a necessidade do seu projeto.
