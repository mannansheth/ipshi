import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import BirthdayCard from "./components/BirthdayCard"
import PhotoGallery from "./pages/PhotoGallery"
import StarryNight from "./pages/StarryNight"
import "./App.css"
import { useEffect, useState, useRef } from "react"
import Login from "./pages/Login"
import { detectProvider, initPlayer } from "./services/playerAdapter";
import MusicPlayer from "./components/MusicPlayer"
import FloatingMusicWidget from "./components/FloatingMusicWidget"
import Callback from "./pages/Callback"

function App() {
  const [isMusicPlayerOpen, setIsMusicPlayerOpen] = useState(false);
  const [provider, setProvider] = useState(null);
  const [ready, setReady] = useState(false);
  const [currentSongData, setCurrentSongData] = useState({});
  const lastFetchedTrackIdRef = useRef(null);
  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    if (localStorage.getItem("code") !== "18-08-2006" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }, []);
  
  const GetCurrentDetails = async (forceImage = false) => {
    try {
      if (!playerRef.current?.getCurrent) return;
      const data = await playerRef.current.getCurrent();
      if (!data) return;

      const reqdData = {
        progress_ms: Number(data.progress_ms) || 0,
        duration_ms: Number(data.item?.duration_ms || data.duration_ms) || 0,
        id: data.item?.id || data.id || null,
        name: data.item?.name || data.name || "",
        artist: data.item?.artists?.[0]?.name || data.artists?.[0]?.name || data.artist || "",
        is_playing: Boolean(data.is_playing),
        image_src:
          forceImage || !currentSongData.image_src
            ? `/images/us/image${Math.floor(Math.random() * 30 + 1)}.jpg`
            : currentSongData.image_src,
        type:data.context === null ? "Track" : "Album"
      };
      if (reqdData.id && lastFetchedTrackIdRef.current === reqdData.id) {
        setCurrentSongData((prev) => ({ ...(prev || {}), ...reqdData }));
      } else {
        lastFetchedTrackIdRef.current = reqdData.id;
        setCurrentSongData(reqdData);
      }
    } catch (err) {
      console.error("GetCurrentDetails failed:", err);
    }
  };

  // Init provider & player once on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      const prov = await detectProvider();
      if (!mounted) return;
      setProvider(prov);

      let token = null;
      if (prov === "spotify") {
        token = localStorage.getItem("spotify_access_token");
        if (!token) {
          try {
            const r = await fetch(`${process.env.REACT_APP_BACKEND_URL}/spotify/refresh`);
            if (r.ok) {
              const data = await r.json();
              token = data.access_token;
              localStorage.setItem("spotify_access_token", token);
            }
          } catch (err) {
            console.error("refresh token failed", err);
          }
        }
      }

      try {
        playerRef.current = await initPlayer(prov, token);
        setReady(true);
      } catch (e) {
        console.error("initPlayer failed", e);
      }
    })();
    return () => {
      mounted = false;
      clearInterval(progressIntervalRef.current);
    };
  }, []);
  const isBirthdayTime = () => {
    const now = new Date()
      return (
        now.getMonth() === 7 &&
        now.getDate() === 18 &&
        now.getHours() === 1 &&
        now.getMinutes() === 45
      )
    }
  // Autoplay playlist on ready (if available)
  // useEffect(() => {
  //   const attemptAutoPlay = async () => {
  //     if (!ready || provider !== "spotify") return;
  //     if (!playerRef.current?.playPlaylist) return;
  //     try {
  //       await new Promise((r) => setTimeout(r, 1500));
  //       await playerRef.current.playPlaylist();
  //       await GetCurrentDetails(true);
  //       setIsPlaying(true);
  //     } catch (err) {
  //       console.warn("autoplay failed:", err);
  //     }
  //   };
  //   attemptAutoPlay();
  // }, [ready, provider]);

  // Added handlePause function for the floating widget
  const handlePause = async () => {
    try {
      if (!playerRef.current) return;
      if (isPlaying) {
        setIsPlaying(false)
        await playerRef.current.pause();
      } else if (!isPlaying) {
        setIsPlaying(true)
        await playerRef.current.play();
      }
      setTimeout(() => GetCurrentDetails(), 500);
    } catch (err) {
      console.error("toggle pause/play failed", err);
    }
  };

  return (
    <Router>
      <div className={`App ${isMusicPlayerOpen ? "blur" : ""}`}>
        <div className="blur-bg"></div>
        <Routes>
          <Route path="/" element={<Home isBirthdayTime={isBirthdayTime} ready={ready}/>} />
          <Route path="/photos" element={<PhotoGallery />} />
          <Route path="/stars" element={<StarryNight isBirthdayTime={isBirthdayTime} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="*" element = {<Login />}/>
        </Routes>
        
        {window.location.pathname !== '/login' && (
          <>
            <MusicPlayer
              isMusicPlayerOpen={isMusicPlayerOpen}
              setIsMusicPlayerOpen={setIsMusicPlayerOpen}
              provider={provider}
              ready={ready}
              playerRef={playerRef}
              currentSongData={currentSongData}
              setCurrentSongData={setCurrentSongData}
              GetCurrentDetails={GetCurrentDetails}
              progressIntervalRef={progressIntervalRef} 
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
            
            <FloatingMusicWidget
              currentSongData={currentSongData}
              isPlaying={isPlaying}
              handlePause={handlePause}
              setIsMusicPlayerOpen={setIsMusicPlayerOpen}
            />
          </>
        )}
      </div>
    </Router>
  )
}

export default App
