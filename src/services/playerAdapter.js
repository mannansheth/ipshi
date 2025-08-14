// music-frontend/src/services/playerAdapter.js
import * as spotify from "./spotifyService";
import * as apple from "./appleService";
const URL = process.env.REACT_APP_BACKEND_URL
export async function detectProvider() {
  // Prefer Spotify if you already pre-authorized (you can refine this)
  try {
    const r = await fetch(`${URL}/api/spotify/check-user`);
    if (r.ok) return "spotify";
  } catch {}
  return "apple";
}

export async function initPlayer(provider, token) {
  if (provider === "spotify") {
    await spotify.initSpotify(token);
    await spotify.transferPlayback(token);
    return { provider, 
        play: (uris) => spotify.playUris(token, uris), 
        pause: () => spotify.pause(token), 
        search: (q) => spotify.searchTracks(token, q),
        getCurrent : () => spotify.getCurrentDetails(token),
        playPlaylist : () => spotify.playPlaylist(token) };
  } else {
    const mk = await apple.initApple();
    if (!apple.isAppleAuthorized()) await apple.authorizeApple();
    return { provider, play: (appleSongId) => apple.playAppleCatalogId(appleSongId), pause: () => apple.pauseApple(), search: (term) => apple.searchApple(term) };
  }
}
