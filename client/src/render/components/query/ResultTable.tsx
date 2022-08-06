import { useEffect, useState } from "react";
import { BeatmapDetails, FilterResponse } from "../../../models/api";
import { toast } from "react-toastify";
import React from "react";
import { TableHeader } from "../../types/table";
import Table from "../util/Table";
import Button from "../util/Button";

interface PropTypes {
  result: FilterResponse;
}

const headers: TableHeader[] = [
  { title: "Artist", key: "Artist" },
  { title: "Title", key: "Title" },
  { title: "Difficulty", key: "Version" },
  { title: "Mapper", key: "Creator" },
];

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
    <div className="w-full flex flex-col pb-6">
      <Table headers={headers} data={page} className="border-b dark:border-black" />
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button
          color="blue"
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          Prev
        </Button>
        {pageNumber}/{Math.ceil(result.Ids.length / pageSize)}
        <Button
          color="blue"
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber === Math.ceil(result.Ids.length / pageSize)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
