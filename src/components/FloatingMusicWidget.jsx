import React from 'react';
import { FaPlay, FaPause, FaMusic, FaHeart } from 'react-icons/fa6';

export default function FloatingMusicWidget({ 
  currentSongData, 
  isPlaying, 
  handlePause, 
  setIsMusicPlayerOpen 
}) {
  const hasSong = Object.keys(currentSongData || {}).length > 0;

  if (!hasSong) return null;

  return (
    <div className="floating-music-widget">
      <div className="widget-content" onClick={() => setIsMusicPlayerOpen(true)}>
        <div className="song-image">
          {currentSongData.image_src ? (
            <img src={currentSongData.image_src || "/placeholder.svg"} alt="Current song" />
          ) : (
            <div className="placeholder-image">
              <FaMusic />
            </div>
          )}
          <div className="playing-indicator">
                {isPlaying && <div className="sound-waves">
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                </div>}
              </div>
        </div>
        
        <div className="song-info">
          <div className="song-title">{currentSongData.name || 'Unknown Song'}</div>
          <div className="song-artist">{currentSongData.artist || 'Unknown Artist'}</div>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(currentSongData.progress_ms / (currentSongData.duration_ms || 1)) * 100}%`,
                }}
              >
                <FaHeart style={{position:"absolute", left: `${(currentSongData.progress_ms / (currentSongData.duration_ms || 1)) * 100}%`, color:"white", fontSize:"1rem", top:"-5px", zIndex:999}} />
              </div>
            </div>
            <div className="time-display">
              {`${Math.floor(currentSongData.progress_ms / 60000)}:${Math.floor(
                (currentSongData.progress_ms % 60000) / 1000
              ).toString().padStart(2, "0")}`}
            </div>
          </div>
        </div>
        
        <button 
          className="play-pause-btn" 
          onClick={(e) => {
            e.stopPropagation();
            handlePause();
          }}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
    </div>
  );
}
