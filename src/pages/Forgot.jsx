import React, {useState} from 'react';
import api from '../services/apiClient';

export default function Forgot(){
  const [email,setEmail]=useState('');
  const [info,setInfo]=useState(null);

  async function submit(e){
    e.preventDefault();
    setInfo(null);
    try{
      const res = await api.post('/auth/forgot-password', { email });
      setInfo(res.data);
    }catch(err){
      setInfo({ error: err?.response?.data?.error || 'Erro' });
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Recuperar Senha</h2>
        <form onSubmit={submit}>
          <div><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div style={{marginTop:12}}><button className="button" type="submit">Enviar</button></div>
        </form>
        {info && <pre style={{marginTop:12}}>{JSON.stringify(info,null,2)}</pre>}
      </div>
    </div>
  );
}
