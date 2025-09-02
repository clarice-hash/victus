import React, {useEffect, useState} from 'react';
import api from '../services/apiClient';
export default function Dashboard(){
  const [overview, setOverview] = useState(null);
  useEffect(()=>{ api.get('/dashboard/overview').then(r=>setOverview(r.data)).catch(()=>{}); },[]);
  return (
    <div className="container">
      <div className="card"><h2>Dashboard</h2>
      <div>Users: {overview?.users_count ?? '—'}</div>
      <div>Videos: {overview?.videos_count ?? '—'}</div>
      </div>
    </div>
  );
}
