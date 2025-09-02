import React, {useState} from 'react';
import api from '../services/apiClient';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('admin@example.com');
  const [password,setPassword]=useState('admin123');
  const [error,setError]=useState(null);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setError(null);
    try{
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      nav('/dashboard');
    }catch(err){
      setError(err?.response?.data?.error || 'Erro');
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Entrar</h2>
        <form onSubmit={submit}>
          <div><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div><label>Senha</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
          {error && <div style={{color:'red'}}>{error}</div>}
          <div style={{marginTop:12}}><button className="button" type="submit">Entrar</button></div>
          <div className="small-links"><Link className="link" to="/forgot">Esqueci a senha</Link><Link className="link" to="/register">Criar conta</Link></div>
        </form>
      </div>
    </div>
  );
}
