// music-frontend/src/services/appleService.js
let music;
const URL = process.env.REACT_APP_BACKEND_URL

export async function ensureMusicKit() {
  if (window.MusicKit) return;
  await new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js";
    s.async = true;
    s.onload = resolve;
    document.body.appendChild(s);
  });
}

export async function initApple() {
  await ensureMusicKit();
  const devTokenRes = await fetch(`${URL}/apple/dev-token`);
  const { developerToken } = await devTokenRes.json();

  window.MusicKit.configure({
    developerToken,
    app: { name: "Starry Night", build: "1.0.0" },
  });
  music = window.MusicKit.getInstance();
  return music;
}

// Ask user to authorize (she must be signed into Apple ID for full tracks)
export async function authorizeApple() {
  await music.authorize(); // returns a user token internally
}

export async function playAppleCatalogId(id) {
  await music.setQueue({ song: id }); // Apple catalog song id
  await music.play();
}

export async function pauseApple() { await music.pause(); }

export async function searchApple(term, storefront = "in") {
  // Catalog search with developer token (handled by MusicKit instance)
  return music.api.v3.music(`/v1/catalog/${storefront}/search`, {
    term,
    types: "songs",
    limit: 10,
  });
}

export function isAppleAuthorized() {
  return music?.isAuthorized;
}

export function getMusicKit() { return music; }
