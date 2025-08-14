// music-frontend/src/pages/Callback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    if (token) {
      localStorage.setItem("spotify_access_token", token);
    }
    navigate("/"); // back to home
  }, [navigate]);

  return <div>Completing login…</div>;
}
