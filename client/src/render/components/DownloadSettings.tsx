import { FilterResponse } from "../../models/api"
import Switch from 'react-switch'
import { useState } from 'react'

interface PropTypes {
  result: FilterResponse
  existing: number[]
}

export const DownloadSettings = ({ result, existing }: PropTypes) => {
  const [force, setForce] = useState(false)
  const [collection, setCollection] = useState(false)
  const [collectionName, setCollectionName] = useState("")

  const download = () => {
    window.electron.download(result.SetIds)
  }

  const matching = (condition: boolean) => {
    // find number of ids in result.SetIds that are not in existing
    const newIds = result.SetIds.filter(id => {
      if (condition) {
        return existing.includes(id)
      } else {
        return !existing.includes(id)
      }
    })
    return newIds.length
  }

  const calculateSize = () => {
    let totalSize = 0

    // the response map is actually a raw object, so it needs to be converted to a map object
    const map = new Map<string, number>(Object.entries(result.SizeMap))
    if (force) {
      map.forEach(size => totalSize += size)
    } else {
      map.forEach((size, setId) => {
        if (!existing.includes(parseInt(setId))) {
          totalSize += size
        }
      })
    }

    if (totalSize === 0) {
      return "N/A"
    }

    // totalSize is in bytes. Return a human readable string for kb, mb, gb etc.
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(totalSize) / Math.log(1024))
    return `${(totalSize / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  }

  return (
    <div className="flex flex-col gap-4">
      <span className="font-bold text-lg dark:text-white">Download</span>
      <div className="flex flex-col gap-1">
        <span className="font-medium">Summary</span>
        <div className="flex flex-col gap-0">
          <span>{result.Ids.length} Beatmaps - {result.SetIds.length} Beatmap Sets</span>
          <span>{matching(true)} Sets already downloaded</span>
          <span>{force ? result.SetIds.length : matching(false)} Sets to download</span>
          <span>Total Size: {calculateSize()}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-medium">Settings</span>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span>Force Download All Maps</span>
            <Switch checked={force} onChange={(e) => setForce(e)} />
          </div>
          <div className="flex items-center gap-2">
            <span>Create Collection</span>
            <Switch checked={collection} onChange={(e) => setCollection(e)} />
            {collection &&
              <input
                className="input-height p-2 w-40 border-gray-300 border rounded focus:outline-blue-500"
                type="number"
                placeholder="Name"
                value={collectionName}
                onChange={e => setCollectionName(e.target.value)}
              />
            }
          </div>
        </div>

      </div>
      <button onClick={download} className="bg-green-500 hover:bg-green-400 text-white transition duration-150 px-2 py-1 rounded text-lg font-medium self-start">Download</button>
    </div>
  )
}

