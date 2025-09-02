import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './VideoPlayer.css';

export default function VideoPlayer() {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson');

  useEffect(() => {
    if (lessonId) {
      fetchVideoData();
    }
  }, [lessonId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;
      
      if (duration > 0) {
        const progressPercentage = (currentTime / duration) * 100;
        setProgress(progressPercentage);
        setWatchTime(Math.floor(currentTime));
        
        // Salvar progresso a cada 10 segundos
        if (Math.floor(currentTime) % 10 === 0) {
          saveProgress(progressPercentage, Math.floor(currentTime));
        }
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      saveProgress(100, Math.floor(video.duration));
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoData]);

  const fetchVideoData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost/victus/api/player/video.php?lesson_id=${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar dados do vídeo');
      }

      const data = await response.json();
      setVideoData(data);
      setProgress(data.lesson.progress_percentage || 0);
      setWatchTime(data.lesson.watch_time || 0);
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (progressPercentage, currentWatchTime) => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) return;

      await fetch('http://localhost/victus/api/player/progress.php', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lesson_id: lessonId,
          progress_percentage: Math.round(progressPercentage),
          watch_time: currentWatchTime
        })
      });
    } catch (err) {
      console.error('Erro ao salvar progresso:', err);
    }
  };

  const handleNavigation = (direction) => {
    if (direction === 'previous' && videoData?.navigation?.previous) {
      navigate(`/curso/${courseId}/player?lesson=${videoData.navigation.previous.id}`);
    } else if (direction === 'next' && videoData?.navigation?.next) {
      navigate(`/curso/${courseId}/player?lesson=${videoData.navigation.next.id}`);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="video-player-page">
        <div className="loading">A carregar vídeo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-player-page">
        <div className="error">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="video-player-page">
      {/* Header */}
      <div className="player-header">
        <button className="back-btn" onClick={() => navigate(`/curso/${courseId}`)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="lesson-info">
          <h1>{videoData?.lesson?.title}</h1>
          <span className="course-title">{videoData?.lesson?.course_title}</span>
        </div>
        <div className="header-actions">
          <button className="bookmark-btn">
            <i className="far fa-bookmark"></i>
          </button>
          <button className="share-btn">
            <i className="fas fa-share"></i>
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="video-container">
        <video
          ref={videoRef}
          controls
          poster={videoData?.lesson?.thumbnail}
          className="video-element"
        >
          <source src={videoData?.lesson?.video_url} type="video/mp4" />
          Seu navegador não suporta o elemento de vídeo.
        </video>
        
        {/* Progress Overlay */}
        <div className="progress-overlay">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{Math.round(progress)}% completo</span>
        </div>
      </div>

      {/* Video Info */}
      <div className="video-info">
        <div className="video-details">
          <h2>{videoData?.lesson?.title}</h2>
          <p>{videoData?.lesson?.description}</p>
          <div className="video-meta">
            <span className="duration">
              <i className="fas fa-clock"></i>
              {videoData?.lesson?.duration}
            </span>
            <span className="watch-time">
              <i className="fas fa-eye"></i>
              Assistido: {formatDuration(watchTime)}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="lesson-navigation">
          <button 
            className="nav-btn prev"
            onClick={() => handleNavigation('previous')}
            disabled={!videoData?.navigation?.previous}
          >
            <i className="fas fa-chevron-left"></i>
            <span>
              {videoData?.navigation?.previous ? (
                <>
                  <small>Anterior</small>
                  <span>{videoData.navigation.previous.title}</span>
                </>
              ) : (
                'Primeira lição'
              )}
            </span>
          </button>

          <button 
            className="nav-btn next"
            onClick={() => handleNavigation('next')}
            disabled={!videoData?.navigation?.next}
          >
            <span>
              {videoData?.navigation?.next ? (
                <>
                  <small>Próxima</small>
                  <span>{videoData.navigation.next.title}</span>
                </>
              ) : (
                'Última lição'
              )}
            </span>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Access Info */}
      {!videoData?.access?.is_enrolled && !videoData?.lesson?.is_free && (
        <div className="access-warning">
          <i className="fas fa-lock"></i>
          <p>Inscreva-se no curso para ter acesso completo a todas as lições.</p>
          <button className="enroll-btn">Inscrever-se</button>
        </div>
      )}
    </div>
  );
}
