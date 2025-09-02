import React, {useState} from 'react';
import api from '../services/apiClient';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [msg,setMsg]=useState(null);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setMsg(null);
    try{
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      nav('/dashboard');
    }catch(err){
      setMsg(err?.response?.data?.error || 'Erro');
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Criar Conta</h2>
        <form onSubmit={submit}>
          <div><label>Nome</label><input value={name} onChange={e=>setName(e.target.value)} /></div>
          <div><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div><label>Senha</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
          {msg && <div style={{color:'red'}}>{msg}</div>}
          <div style={{marginTop:12}}><button className="button" type="submit">Criar Conta</button></div>
        </form>
      </div>
    </div>
  );
}
