import { useState, useEffect } from "react";

export default function HoverVideoMobileFirst({ src, poster, frameTime = 0 }) {
  const [playing, setPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile once on mount
    const mobileCheck = window.matchMedia("(hover: none)").matches;
    setIsMobile(mobileCheck);
  }, []);

  const handleInteraction = () => {
    // On mobile → toggle play/pause on tap
    if (isMobile) {
      setPlaying((prev) => !prev);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        cursor: isMobile ? "pointer" : "default",
        overflow: "hidden",
      }}
      onMouseEnter={() => !isMobile && setPlaying(true)}
      onMouseLeave={() => !isMobile && setPlaying(false)}
      onClick={handleInteraction} // Tap for mobile
    >
    {!playing && 
    <h3 style={{position:"absolute", bottom:"-15px", right:"5px", fontFamily:"cursive"}}>TAP</h3>
    }
    
      {!playing ? (
        <img
          src={poster}
          alt="Frozen frame"
          style={{ width: "100%", display: "block" }}
        />
      ) : (
        <video
          src={src + `#t=${frameTime}`}
          autoPlay
          playsInline
          loop={!isMobile} // Loop only on desktop
          style={{ width: "100%", display: "block" }}
        />
      )}
    </div>
  );
}
