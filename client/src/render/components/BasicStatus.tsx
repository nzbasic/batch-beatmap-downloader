import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Metrics } from "../../models/metrics"

export const BasicStatus = () => {
  const [status, setStatus] = useState(false)
  const [metrics, setMetrics] = useState<Metrics>(null)

  const collectMetrics = () => {
    window.electron.getMetrics().then(([online, data]) => {
      setStatus(online)
      setMetrics(data)
    })
  }

  useEffect(() => {
    collectMetrics()
    const interval = setInterval(() => collectMetrics(), 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white dark:bg-monokai-dark rounded shadow p-6 flex flex-col dark:text-white w-full">
      <div className="flex flex-col gap-2">
        <span className="font-bold text-lg">Basic Status</span>
        <div className="flex flex-col">
          <span className={`${status ? 'text-green-500' : 'text-red-500'}`}>Server connection: {status ? "Online" : "Offline"}</span>
          {metrics && (
            <div className="flex flex-col">
              <span>Active downloads: {(metrics.Download?.CurrentDownloads??[]).filter(i => !i.Ended).length}</span>
              <span>Ranked beatmaps available: {metrics.Database.NumberStoredRanked}</span>
              <span>Loved beatmaps available: {metrics.Database.NumberStoredLoved}</span>
              <span>Unranked beatmaps available: {metrics.Database.NumberStoredUnranked}</span>
              <span>Last beatmap added: {new Date(metrics.Database.LastBeatmapAdded).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <Link to="/status" className="text-blue-500 font-medium">See more stats</Link>
      </div>
    </div>
  )
}
