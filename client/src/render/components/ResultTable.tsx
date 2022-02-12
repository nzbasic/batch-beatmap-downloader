import { useEffect, useState } from "react"
import { Row, Table } from "./Table"

interface PropTypes {
  result: number[]
}

export const ResultTable = ({ result }: PropTypes) => {
  const [page, setPage] = useState<Row[]>([])
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState(1)
  const columns = ["Artist", "Song", "Mapper", "Difficulty", "Stars", "AR", "OD", "CS", "HP"]

  const getNewPage = async (): Promise<Row[]> => {
    const ids = result.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
    const res = await window.electron.getBeatmapDetails(ids)
    const rows: (string | number)[][] = []
    for (const beatmap of res) {
      const row: (string | number)[] = []
      row.push(beatmap.Artist)
      row.push(beatmap.Title)
      row.push(beatmap.Creator)
      row.push(beatmap.Version)
      row.push(beatmap.Stars)
      row.push(beatmap.Ar)
      row.push(beatmap.Od)
      row.push(beatmap.Cs)
      row.push(beatmap.Hp)
      rows.push(row)
    }

    return rows
  }

  useEffect(() => {
    if (pageNumber != 1) {
      setPageNumber(1)
    } else {
      getNewPage().then(res => {
        setPage(res)
      })
    }
  }, [result])

  useEffect(() => {
    getNewPage().then(res => {
      setPage(res)
    })
  }, [pageNumber])

  return (
    <div className="p-2 w-full">
      <Table rows={page} columns={columns} />
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          className="w-24 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          Previous
        </button>
        {pageNumber}/{Math.ceil(result.length / pageSize)}
        <button
          className="w-24 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber === Math.ceil(result.length / pageSize)}
        >
          Next
        </button>
      </div>
    </div>
  )

}
