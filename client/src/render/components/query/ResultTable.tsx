import React from "react";
import { useEffect, useState } from "react";
import { BeatmapDetails, DownloadDetails } from "../../../models/api";
import { toast } from "react-toastify";
import { TableHeader } from "../../types/table";
import Table from "../util/Table";
import Button from "../util/Button";

interface PropTypes {
  result: DownloadDetails;
  orderBy?: string;
}

const headers: TableHeader[] = [
  { title: "Artist", key: "Artist" },
  { title: "Title", key: "Title" },
  { title: "Difficulty", key: "Version" },
  { title: "Mapper", key: "Creator" },
];

const pageSize = 25;
export const ResultTable = ({ result }: PropTypes) => {
  const [beatmaps, setBeatmaps] = useState<BeatmapDetails[]>([])
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    window.electron.getBeatmapDetails(pageNumber, pageSize).then(res => {
      if (typeof res === "string" || res === undefined) {
        toast.error(res);
        setBeatmaps([])
      } else {
        setBeatmaps(res)
      }
    })
  }, [result, pageNumber])

  return (
    <div className="w-full flex flex-col pb-6">
      <Table headers={headers} data={beatmaps} className="border-b dark:border-black" />

      <div className="flex justify-center items-center gap-2 mt-6">
        <Button
          color="blue"
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          Prev
        </Button>
        {pageNumber}/{Math.ceil(result.beatmaps / pageSize)}
        <Button
          color="blue"
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber === Math.ceil(result.beatmaps / pageSize)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
