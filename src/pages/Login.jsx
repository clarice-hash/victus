import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost/victus/api/auth/login.php';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Credenciais inválidas. Tente novamente.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('Erro ao conectar com o servidor. Verifique o XAMPP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Entra na tua conta</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="exemploemail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Palavra-passe</label>
            <input
              id="password"
              type="password"
              placeholder="Inserir palavra-passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <a href="/recover" className="recover-link">
          Esqueceste-te da palavra-passe? <strong>Recuperar</strong>
        </a>
        <p className="terms">
          Ao utilizares a Victus, aceitas os nossos <a href="/termos">Termos</a> e{' '}
          <a href="/privacidade">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  );
}