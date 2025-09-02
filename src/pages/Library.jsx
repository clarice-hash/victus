import React, {useEffect, useState} from 'react';
import api from '../services/apiClient';
import { Link } from 'react-router-dom';
export default function Library(){
  const [items,setItems]=useState([]);
  useEffect(()=>{ api.get('/library?per=20').then(r=>setItems(r.data.items || [])).catch(()=>{}); },[]);
  return (
    <div className="container">
      <div className="card"><h2>Biblioteca</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(1,1fr)', gap:12}}>
        {items.map(it=> (<div key={it.id}><h3>{it.title}</h3><p>{it.description}</p><Link to={'/player/'+it.id}>Abrir</Link></div>))}
      </div></div>
    </div>
  );
}
