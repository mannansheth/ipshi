let deviceId = null;
let player = null;
const URL = process.env.REACT_APP_BACKEND_URL
export async function initSpotify(accessToken) {
  return new Promise((resolve, reject) => {
    // Define the global callback **before loading the SDK**
    window.onSpotifyWebPlaybackSDKReady = () => {
      player = new window.Spotify.Player({
        name: "m-ipshi18 player",
        getOAuthToken: (cb) => cb(accessToken),
        volume: 0.8,
      });

      player.addListener("ready", ({ device_id }) => {
        deviceId = device_id;
        resolve({ player, deviceId });
      });

      player.addListener("initialization_error", ({ message }) => reject(message));
      player.addListener("authentication_error", ({ message }) => reject(message));
      player.addListener("account_error", ({ message }) => reject(message));
      player.addListener("playback_error", ({ message }) => console.error(message));

      player.connect();
    };

    // Now inject the script **after** the callback is defined
    if (!window.Spotify) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // SDK already loaded, call the callback manually
      window.onSpotifyWebPlaybackSDKReady();
    }
  });
}

export async function transferPlayback(accessToken) {
  await fetch(`${URL}/api/spotify/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ device_id: deviceId, access_token: accessToken }),
  });
}

export const playPlaylist = async (accessToken) => {
  await fetch(`${URL}/api/spotify/playPlaylist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_token: accessToken,
      device_id: deviceId,
      context_uri: "spotify:playlist:3GfADBwMQQJGgkMVwDKjHx",
      offset: { position: 0 },
      position_ms: 0,
    }),
  });
};

export async function playUris(accessToken, uris = null) {
  // Build payload conditionally to avoid spreading `undefined`
  const payload = Object.assign({ access_token: accessToken, device_id: deviceId }, uris ? { uris } : {});
  await fetch(`${URL}/api/spotify/play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function pause(accessToken) {
  await fetch(`${URL}/api/spotify/pause`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token: accessToken }),
  });
}

export async function getCurrentDetails(accessToken) {
  const r = await fetch(`${URL}/api/spotify/current`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (r.status === 204) return {};
  // await the json() so callers receive the parsed object
  return await r.json();
}

export async function searchTracks(accessToken, q) {
  const r = await fetch(`${URL}/api/spotify/search?q=${encodeURIComponent(q)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return r.json();
}

export function getDeviceId() { return deviceId; }
export function getPlayer() { return player; }