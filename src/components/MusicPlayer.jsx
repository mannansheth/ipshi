// music-frontend/src/components/MusicPlayer.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaMusic, FaPlay, FaPause, FaSpotify, FaXmark, FaHeart, FaMagnifyingGlassPlus, FaArrowRight, FaPlus, FaCheck, FaStop, FaDiagramNext, FaForward, FaForwardStep } from "react-icons/fa6";
import { RiSearchEyeFill, RiSearchFill } from "react-icons/ri";

export default function MusicPlayer({
  isMusicPlayerOpen,
  setIsMusicPlayerOpen,
  provider,
  ready,
  playerRef,
  currentSongData,
  setCurrentSongData,
  GetCurrentDetails,
  progressIntervalRef,
  isPlaying,
  setIsPlaying
}) {
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const debRef = useRef();

  // Increment progress_ms locally while playing
  useEffect(() => {
    clearInterval(progressIntervalRef.current);
    if (!isPlaying) return;
    progressIntervalRef.current = setInterval(() => {
      setCurrentSongData((prev) => {
        if (!prev?.progress_ms || !prev?.duration_ms) return prev || {};
        const next = Math.min(prev.progress_ms + 10, prev.duration_ms);
        if (next >= prev.duration_ms) clearInterval(progressIntervalRef.current);
        return { ...prev, progress_ms: next };
      });
    }, 10);
    return () => clearInterval(progressIntervalRef.current);
  }, [isPlaying]);

  // Fetch metadata after player is ready
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      GetCurrentDetails();
    }, 800);
    return () => clearTimeout(t);
  }, [ready]);

  // Fetch metadata when play/pause state changes (backend-driven state)
  useEffect(() => {
    if (!ready) return;
    GetCurrentDetails();
  }, [isPlaying, ready]);

  // Debounced search
  async function onSearchChange(e) {
    const val = e.target.value;
    setQuery(val);
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(async () => {
      if (!val) return setResults([]);
      if (!playerRef.current?.search) return;
      try {
        const data = await playerRef.current.search(val);
        if (provider === "spotify") {
          setResults(
            data.tracks?.items?.map((t) => ({
              id: t.id,
              title: t.name,
              artist: t.artists.map((a) => a.name).join(", "),
              uri: t.uri,
              image: t.album?.images?.[0]?.url,
            })) || []
          );
        } else {
          const songs = data?.results?.songs?.data || [];
          setResults(
            songs.map((s) => ({
              id: s.id,
              title: s.attributes?.name,
              artist: s.attributes?.artistName,
              uri: s.id,
              image: s.attributes?.artwork?.url?.replace("{w}x{h}", "200x200"),
            }))
          );
        }
      } catch (err) {
        console.error("search failed:", err);
      }
    }, 200);
  }

  const addToQueue = item => {
    setQueue(prev => [...prev, item.uri])
  }

  useEffect(() => {
    if (queue.length >=1 && currentSongData && currentSongData.progress_ms >= currentSongData.duration_ms) {

        if (currentSongIndex < queue.length - 1) {
            setCurrentSongIndex(prev => prev + 1);
        }
    }
  }, [currentSongData?.progress_ms])


  useEffect(() => {

  // Play whenever currentIndex changes
  if (queue.length > 0) {
    playUri(queue[currentSongIndex]);
  }
}, [currentSongIndex]);

  // Play selected track
  async function playUri(uri) {
  try {
    if (!playerRef.current) return;
    if (provider === "spotify" && playerRef.current.play) {
      await playerRef.current.play([uri]);
    } else if (playerRef.current.play) {
      await playerRef.current.play(uri);
    }
    setIsPlaying(true);
    setTimeout(() => GetCurrentDetails(true), 100);
  } catch (err) {
    console.error("play failed", err);
  }
}

  // Toggle pause/resume using backend state only
  const handlePause = async () => {
    try {
      if (!playerRef.current) return;
      if (isPlaying) {
        setIsPlaying(false);
        await playerRef.current.pause();
      } else if (!isPlaying) {
        setIsPlaying(true);
        await playerRef.current.play();
      }
      setTimeout(() => GetCurrentDetails(), 500);
    } catch (err) {
      console.error("toggle pause/play failed", err);
    }
  };
  const hasSong = Object.keys(currentSongData || {}).length > 0;

  return (
    <div>
      {!isMusicPlayerOpen && !ready && (
        <div className="music-player" onClick={() => setIsMusicPlayerOpen(true)}>
          <div className="music-player-pulse"></div>
          <FaMusic className="music-icon" />
        </div>
      )}

      <div className={`player-shell ${isMusicPlayerOpen ? "revealed" : ""}`}>
        <div className="player-header">
          <h2 className="player-title">Music for Ipshi</h2>
          <button className="close-btn" onClick={() => setIsMusicPlayerOpen(false)}>
            <FaXmark style={{color:"white"}} />
          </button>
        </div>
        {!ready && (
          <div className="login-section">
            <div className="login-card">
              <button
                onClick={() =>
                  (window.location.href = `${process.env.REACT_APP_BACKEND_URL}/spotify/login`)
                }
                className="spotify-login-btn"
              >
                <FaSpotify className="spotify-icon" />
                Connect with Spotify
              </button>
              <p style={{margin:0}}><b>Email:</b> mannan.sheth4@gmail.com</p>
              <b>Pass:</b> Ask your boyfriend
              <p>(im sorry i tried connecting apple music but it costs $99 just to get a developer account 😃)</p>
              
            </div>
          </div>
        )}

        {hasSong && (
          <div className="now-playing">
            <div className="album-art">
              <img src={currentSongData.image_src || "/placeholder.svg"} alt="Album cover" />
              <div className="playing-indicator">
                {isPlaying && <div className="sound-waves">
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                </div>}
              </div>
            </div>
            
            <div className="song-details">
              <h3 className="song-name">{currentSongData.name}</h3>
              <p className="artist-name">{currentSongData.artist}</p>
              
              <div className="progress-section">
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(currentSongData.progress_ms / (currentSongData.duration_ms || 1)) * 100}%`,
                      }}
                    >
                      <FaHeart style={{position:"absolute", left: `${((currentSongData.progress_ms - 1000) / (currentSongData.duration_ms || 1)) * 100}%`, color:"violet", fontSize:"1.3rem", top:"-8px", zIndex:999}} />
                    </div>
                    
                  </div>
                </div>
                <div className="time-info">
                  <span className="current-time">
                    {`${Math.floor(currentSongData.progress_ms / 60000)}:${Math.floor(
                      (currentSongData.progress_ms % 60000) / 1000
                    ).toString().padStart(2, "0")}`}
                  </span>
                  <span className="total-time">
                    {`${Math.floor(currentSongData.duration_ms / 60000)}:${Math.floor(
                      (currentSongData.duration_ms % 60000) / 1000
                    ).toString().padStart(2, "0")}`}
                  </span>
                </div>
              </div>
              
              <div className="controls-section">
                <button className="control-btn favorite-btn">
                  <FaHeart />
                </button>
                <button className="control-btn play-btn" onClick={handlePause}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button className="control-btn" disabled={queue.length === 0 || currentSongIndex >= queue.length} onClick={() => {if (queue.length > 0 && currentSongIndex < queue.length) setCurrentSongIndex(prev=> prev+1)}}>
                  <FaForwardStep />
                </button>
              </div>
            </div>
          </div>
        )}
        {provider === "spotify" && ready && 
        <div className="search-section">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              className="search-input"
              placeholder={`Search ${provider === "spotify" ? "Spotify" : "Apple Music"} for our songs...`}
              value={query}
              onChange={onSearchChange}
            />
          </div>
        </div>
        }

        <div className="results-section">
          {results.map((r) => (
            <button key={`${provider}-${r.id}`} className="track-item" onClick={() => {
              
              playUri(r.uri)
            }}>
              <div className="track-image">
                <img src={r.image || "/placeholder.svg"} alt="" />
              </div>
              <div className="track-info">
                <div className="track-title">{r.title}</div>
                <div className="track-artist">{r.artist}</div>
              </div>
              <div className="play-overlay">
                {queue.slice(currentSongIndex === -1 ? 0 : currentSongIndex).includes(r.uri) ?  <FaCheck /> : <FaPlus onClick={(e) => {e.stopPropagation(); addToQueue(r)}}/>} 
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
