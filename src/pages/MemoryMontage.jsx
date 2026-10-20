import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { FaArrowDown, FaArrowLeft, FaArrowUp, FaCheck, FaHeart, FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa"
import "../styles/MemoryMontage.css"

const clips = [
  {
    id: "silhouette-of-us",
    title: "Silhouette of Us",
    file: "01-silhouette-of-us.mp4",
    poster: "01-silhouette-of-us.jpg",
    note: "A little piece of our story, wrapped in blue light.",
    mood: "Dreamy cut",
  },
  {
    id: "double-exposure",
    title: "Double Exposure",
    file: "02-double-exposure.mp4",
    poster: "02-double-exposure.jpg",
    note: "One memory layered gently over another.",
    mood: "Soft focus",
  },
  {
    id: "filmstrip-memories",
    title: "Filmstrip Memories",
    file: "03-filmstrip-memories.mp4",
    poster: "03-filmstrip-memories.jpg",
    note: "Little scenes from all the moments I keep close.",
    mood: "35 mm memories",
  },
  {
    id: "vintage-photo-diary",
    title: "Vintage Photo Diary",
    file: "04-vintage-photo-diary.mp4",
    poster: "04-vintage-photo-diary.jpg",
    note: "A moving scrapbook page, with a few windswept cuts.",
    mood: "Old-film glow",
  },
  {
    id: "eye-of-memories",
    title: "Eye of Memories",
    file: "05-eye-of-memories.mp4",
    poster: "05-eye-of-memories.jpg",
    note: "The little things I see when I look at us.",
    mood: "A little wonder",
  },
  {
    id: "dream-double-exposure",
    title: "Dream Double Exposure",
    file: "06-dream-double-exposure.mp4",
    poster: "06-dream-double-exposure.jpg",
    note: "Our favourite fragments, floating together.",
    mood: "Dream reel",
  },
]

const videoPath = (file) => `/videos/anniversary/${file}`
const posterPath = (file) => `/images/montage/${file}`
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"
const watchedStorageKey = "anniversaryMontageWatched"
const savedWatchedClips = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(watchedStorageKey) || "[]")
    return Array.isArray(parsed) ? parsed.filter((id) => clips.some((clip) => clip.id === id)) : []
  } catch (error) {
    return []
  }
}

const formatTime = (time) => {
  if (!Number.isFinite(time)) return "0:00"
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60).toString().padStart(2, "0")
  return `${minutes}:${seconds}`
}

export default function MemoryMontage() {
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [watchedClips, setWatchedClips] = useState(savedWatchedClips)
  const [ranking, setRanking] = useState(clips.map((item) => item.id))
  const [rankingStatus, setRankingStatus] = useState("")
  const [savingRanking, setSavingRanking] = useState(false)
  const playerRef = useRef(null)
  const lastPlaybackPosition = useRef(null)
  const watchedSeconds = useRef({})
  const clip = clips[selected]
  const allWatched = clips.every((item) => watchedClips.includes(item.id))

  useEffect(() => {
    localStorage.setItem(watchedStorageKey, JSON.stringify(watchedClips))
  }, [watchedClips])

  useEffect(() => {
    let active = true
    fetch(`${backendUrl}/api/memories/video-rankings/latest`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load the saved ranking.")
        return response.json()
      })
      .then((data) => {
        if (active && Array.isArray(data.ranking) && data.ranking.length === clips.length) {
          setRanking(data.ranking)
        }
      })
      .catch(() => {
        // The ranking page remains usable if the backend is temporarily offline.
      })
    return () => { active = false }
  }, [])

  const markClipWatched = () => {
    setWatchedClips((current) => current.includes(clip.id) ? current : [...current, clip.id])
  }

  const trackPlayback = (event) => {
    const video = event.currentTarget
    const currentTime = video.currentTime
    const previousTime = lastPlaybackPosition.current
    if (previousTime !== null && !video.paused) {
      const playedSeconds = currentTime - previousTime
      if (playedSeconds > 0 && playedSeconds <= 2) {
        watchedSeconds.current[clip.id] = Math.min(duration || video.duration, (watchedSeconds.current[clip.id] || 0) + playedSeconds)
      }
    }
    lastPlaybackPosition.current = currentTime
    setTime(currentTime)
    const videoDuration = duration || video.duration
    if (videoDuration > 0 && currentTime >= videoDuration - .25 && (watchedSeconds.current[clip.id] || 0) >= videoDuration * .9) {
      markClipWatched()
    }
  }

  const chooseClip = (index) => {
    lastPlaybackPosition.current = null
    setSelected(index)
    setTime(0)
    setDuration(0)
    setPlaying(false)
  }

  const togglePlayback = async () => {
    if (!playerRef.current) return
    if (playerRef.current.paused) {
      try {
        await playerRef.current.play()
      } catch (error) {
        setPlaying(false)
      }
    } else {
      playerRef.current.pause()
    }
  }

  const seek = (event) => {
    const nextTime = Number(event.target.value)
    if (!playerRef.current) return
    playerRef.current.currentTime = nextTime
    lastPlaybackPosition.current = nextTime
    setTime(nextTime)
  }

  const moveRank = (index, direction) => {
    setRanking((current) => {
      const next = [...current]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setRankingStatus("")
  }

  const saveRanking = async () => {
    setSavingRanking(true)
    setRankingStatus("")
    try {
      const response = await fetch(`${backendUrl}/api/memories/video-rankings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ranking, watchedVideos: clips.map((item) => item.id) }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || "Could not save your ranking.")
      setRankingStatus("Your ranking is saved. I’ll keep this order close. ♡")
    } catch (error) {
      setRankingStatus(error.message || "Could not reach the ranking database. Please try again.")
    } finally {
      setSavingRanking(false)
    }
  }

  return (
    <main className="montage-page">
      <div className="montage-orb montage-orb-one" aria-hidden="true" />
      <div className="montage-orb montage-orb-two" aria-hidden="true" />

      <div className="montage-shell">
        <header className="montage-header">
          <Link to="/" className="montage-back"><FaArrowLeft /> <span>Back home</span></Link>
          <div className="montage-brand"><span className="montage-brand-dot" /> our little memory studio</div>
          <span className="montage-header-note"><FaHeart /> made with love</span>
        </header>

        <section className="montage-intro">
          <p className="montage-eyebrow">OUR ANNIVERSARY FILM ROLL · 06 CLIPS</p>
          <h1>Our little reel room</h1>
          <p>Pick a memory and let it play. Six tiny films, all about us.</p>
        </section>

        <section className="montage-editor" aria-label="Memory video editor">
          <div className="montage-editor-bar">
            <div className="montage-window-dots" aria-hidden="true"><i /><i /><i /></div>
            <span className="montage-bar-title">anniversary-reel / preview</span>
            <span className="montage-save-state"><span /> all memories loaded</span>
          </div>

          <div className="montage-workspace">
            <div className="montage-preview-column">
              <div className="montage-preview-topline">
                <span><b className="montage-live-dot" /> PREVIEWING CLIP {String(selected + 1).padStart(2, "0")}</span>
                <span className="montage-preview-format">ORIGINAL SOUND · MP4</span>
              </div>
              <div className="montage-player-wrap">
                <video
                  key={clip.file}
                  ref={playerRef}
                  className="montage-player"
                  src={videoPath(clip.file)}
                  poster={posterPath(clip.poster)}
                  controls
                  playsInline
                  preload="metadata"
                  muted={muted}
                  onPlay={() => setPlaying(true)}
                  onPlayCapture={(event) => { lastPlaybackPosition.current = event.currentTarget.currentTime }}
                  onPause={() => { setPlaying(false); lastPlaybackPosition.current = null }}
                  onTimeUpdate={trackPlayback}
                  onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                  onSeeking={() => { lastPlaybackPosition.current = null }}
                  onSeeked={(event) => { lastPlaybackPosition.current = event.currentTarget.currentTime }}
                  onEnded={(event) => {
                    setPlaying(false)
                    lastPlaybackPosition.current = null
                    if ((watchedSeconds.current[clip.id] || 0) >= event.currentTarget.duration * .9) markClipWatched()
                  }}
                  aria-label={`Preview ${clip.title}`}
                />
                <div className="montage-preview-caption"><span>{clip.title}</span><span>{String(selected + 1).padStart(2, "0")} / 06</span></div>
              </div>

              <div className="montage-transport">
                <button type="button" className="montage-round-control" onClick={() => chooseClip((selected + clips.length - 1) % clips.length)} aria-label="Previous clip">‹</button>
                <button type="button" className="montage-play-control" onClick={togglePlayback} aria-label={playing ? "Pause video" : "Play video"}>
                  {playing ? <FaPause /> : <FaPlay />}
                </button>
                <button type="button" className="montage-round-control" onClick={() => chooseClip((selected + 1) % clips.length)} aria-label="Next clip">›</button>
                <div className="montage-scrubber">
                  <span>{formatTime(time)}</span>
                  <input aria-label="Seek through selected video" type="range" min="0" max={duration || 0} step="0.1" value={Math.min(time, duration || 0)} onChange={seek} style={{ "--montage-progress": `${duration ? (time / duration) * 100 : 0}%` }} />
                  <span>{formatTime(duration)}</span>
                </div>
                <button type="button" className="montage-mute-control" onClick={() => setMuted((value) => !value)} aria-label={muted ? "Turn sound on" : "Mute video"}>
                  {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
              </div>
            </div>

            <aside className="montage-clip-info">
              <div className="montage-info-kicker">NOW ON THE DECK</div>
              <div className="montage-current-number">{String(selected + 1).padStart(2, "0")}<span> / 06</span></div>
              <h2>{clip.title}</h2>
              <p>{clip.note}</p>
              <div className="montage-mood-chip"><span>✦</span> {clip.mood}</div>
              <div className="montage-info-divider" />
              <p className="montage-info-hint">Choose any clip below to switch the preview.</p>
            </aside>
          </div>

          <div className="montage-timeline-head">
            <div><span className="montage-timeline-icon">▤</span><div><b>Memory timeline</b><small>YOUR FILM ROLL · 6 CLIPS</small></div></div>
            <span className="montage-total-time">SELECT A FRAME TO PREVIEW</span>
          </div>
          <div className="montage-timeline" role="list" aria-label="Choose a video">
            {clips.map((item, index) => (
              <button
                type="button"
                role="listitem"
                key={item.file}
                className={`montage-timeline-clip ${index === selected ? "is-selected" : ""}`}
                onClick={() => chooseClip(index)}
                aria-pressed={index === selected}
                aria-label={`Play ${item.title}`}
              >
                <span className="montage-thumb-wrap"><img src={posterPath(item.poster)} alt="" /><span className="montage-thumb-play"><FaPlay /></span></span>
                <span className="montage-clip-index">CLIP {String(index + 1).padStart(2, "0")}</span>
                <span className="montage-clip-title">{item.title}</span>
              </button>
            ))}
          </div>

          <section className={`montage-ranking ${allWatched ? "is-unlocked" : "is-locked"}`} aria-labelledby="montage-ranking-title">
            <div className="montage-ranking-heading">
              <div className="montage-ranking-icon">{allWatched ? <FaHeart /> : <span>♡</span>}</div>
              <div>
                <p className="montage-info-kicker">A LITTLE AFTER-CREDITS QUESTION</p>
                <h2 id="montage-ranking-title">Rank our memories</h2>
                <p>{allWatched ? "Move your favourites to the top, from most loved to least." : "Watch all six films to unlock your personal ranking."}</p>
              </div>
              <div className="montage-watch-progress"><b>{watchedClips.length}<span> / 6</span></b><small>WATCHED</small></div>
            </div>

            {!allWatched ? (
              <div className="montage-locked-note">
                <div className="montage-watch-dots" aria-label={`${watchedClips.length} of 6 clips watched`}>
                  {clips.map((item, index) => <span key={item.id} className={watchedClips.includes(item.id) ? "is-watched" : ""}>{watchedClips.includes(item.id) ? <FaCheck /> : String(index + 1).padStart(2, "0")}</span>)}
                </div>
                <p>Each film needs a proper watch before the ranking opens. You can come back later; watched clips stay remembered on this device.</p>
              </div>
            ) : (
              <>
                <ol className="montage-ranking-list">
                  {ranking.map((clipId, index) => {
                    const item = clips.find((entry) => entry.id === clipId)
                    if (!item) return null
                    return (
                      <li className="montage-ranking-row" key={item.id}>
                        <span className="montage-rank-number">{String(index + 1).padStart(2, "0")}</span>
                        <img src={posterPath(item.poster)} alt="" />
                        <span className="montage-ranked-title">{item.title}<small>{index === 0 ? "your number one" : `rank ${index + 1}`}</small></span>
                        <div className="montage-rank-actions">
                          <button type="button" onClick={() => moveRank(index, -1)} disabled={index === 0} aria-label={`Move ${item.title} up`}><FaArrowUp /></button>
                          <button type="button" onClick={() => moveRank(index, 1)} disabled={index === ranking.length - 1} aria-label={`Move ${item.title} down`}><FaArrowDown /></button>
                        </div>
                      </li>
                    )
                  })}
                </ol>
                <div className="montage-ranking-submit">
                  <p role="status">{rankingStatus}</p>
                  <button type="button" onClick={saveRanking} disabled={savingRanking}>
                    {savingRanking ? "Saving your order…" : "Save my ranking"} <span>♡</span>
                  </button>
                </div>
              </>
            )}
          </section>
        </section>

        <footer className="montage-footer"><span>♡ a little archive of us</span><span>press play, stay awhile</span></footer>
      </div>
    </main>
  )
}
