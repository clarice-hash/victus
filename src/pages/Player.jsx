import React, {useEffect, useState, useRef} from 'react';
import api from '../services/apiClient';
import { useParams } from 'react-router-dom';
export default function Player(){
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const videoRef = useRef();
  useEffect(()=>{ api.get('/player/playlist/' + id).then(r=>setMedia(r.data)).catch(()=>{}); },[id]);
  function saveProgress(){ if(!videoRef.current) return; const t = Math.floor(videoRef.current.currentTime); api.post('/player/progress', { media_id: media?.files?.[0]?.id, current_time: t }).catch(()=>{}); }
  return (
    <div className="container">
      <div className="card">
        <h2>Player</h2>
        {media?.files?.[0] ? (<div><h3>{media.title}</h3><video ref={videoRef} controls width="100%" onPause={saveProgress}><source src={media.files[0].file_url} type={media.files[0].mime_type} />Seu browser não suporta vídeo.</video></div>) : <div>Carregando...</div>}
      </div>
    </div>
  );
}
