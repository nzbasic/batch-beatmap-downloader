import { useEffect, useState } from "react";
import { BeatmapDetails, FilterResponse } from "../../../models/api";
import { Beatmap } from "./Beatmap";
import { toast } from "react-toastify";
import React from "react";

interface PropTypes {
  result: FilterResponse;
}

const pageSize = 25;
export const ResultTable = ({ result }: PropTypes) => {
  const [page, setPage] = useState<BeatmapDetails[]>([]);
  const [pageNumber, setPageNumber] = useState(1);

  const getNewPage = async (): Promise<BeatmapDetails[]> => {
    const ids = result.Ids.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    const res = await window.electron.getBeatmapDetails(ids);
    if (typeof res === "string") {
      toast.error(res);
      return [];
    } else {
      return res ?? [];
    }
  };

  useEffect(() => {
    if (pageNumber != 1) {
      setPageNumber(1);
    } else {
      getNewPage().then((res) => {
        setPage(res);
      });
    }
  }, [result]);

  useEffect(() => {
    getNewPage().then((res) => {
      setPage(res);
    });
  }, [pageNumber]);

  return (
    <div className="w-full">
      {page.map((map) => (
        <Beatmap key={map.Id} details={map} />
      ))}

      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          className="w-24 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          Previous
        </button>
        {pageNumber}/{Math.ceil(result.Ids.length / pageSize)}
        <button
          className="w-24 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber === Math.ceil(result.Ids.length / pageSize)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
