import { useState } from "react";
import { sampleTree } from "../../models/filter";
import { RuleType } from "../../models/rules";
import { QueryGroup } from "../components/querybuilder/QueryGroup";
import { Node, Group } from "../../models/filter";
import { cloneDeep } from "lodash";
import { ResultTable } from "../components/querybuilder/ResultTable";
import { CircularProgress } from "@mui/material";
import { Settings } from "../components/Settings";
import { FilterResponse } from "../../models/api";
import { QueryLimit } from "../components/querybuilder/QueryLimit";
import { useStickyState } from "../hooks/stickystate";
import { DownloadSettings } from "../components/DownloadSettings";
import { toast } from "react-toastify";
import { InvalidPath } from "../components/InvalidPath";

export const Query = () => {
  const [validPath, setValidPath] = useState(false)
  const [tree, setTree] = useStickyState<Node>(sampleTree, "tree");
  const [result, setResult] = useState<FilterResponse>(null);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState<number | null>(null);
  const [existing, setExisting] = useState<number[]>([]);

  const exportData = async () => {
    setResult(null);
    setLoading(true);

    const map = new Map<RuleType, string>([
      [RuleType.STATUS, "Text"],
      [RuleType.GENRE, "Text"],
      [RuleType.MODE, "Text"],
      [RuleType.LANGUAGE, "Text"],
      [RuleType.DATE, "Numeric"],
      [RuleType.NUMBER, "Numeric"],
      [RuleType.TEXT, "Text"],
      [RuleType.BOOLEAN, "Numeric"],
    ]);

    // replace all rule types with the correct string from the Map
    const replaceRuleType = (node: Node) => {
      if ("rule" in node) {
        node.rule.type = map.get(node.rule.type as RuleType);
        if (node.rule.field === "LastUpdate") {
          node.rule.value = node.rule.value.slice(0, -3)
        }
      }
      if ("group" in node) {
        node.group.children.forEach(replaceRuleType);
      }
    };

    const clone = cloneDeep(tree);
    replaceRuleType(clone);
    const res = await window.electron.query(clone, limit);
    if (typeof res === "string") {
      toast.error(res);
    } else {
      toast.success(`Query successful: ${res.Ids.length} results`);
      setResult(res);
    }

    setLoading(false);
  };

  const updateTree = (group: Group) => {
    setTree({ ...tree, group });
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <Settings onValidPath={valid => setValidPath(valid)} onBeatmapsLoaded={(ids) => setExisting(ids)} />
      {!validPath ? <InvalidPath /> : (
        <div className="bg-white dark:bg-monokai-dark rounded shadow p-6 mt-0 flex flex-col gap-4">
          <span className="font-bold text-lg dark:text-white">Query Builder</span>
          <span>
            Large queries (queries that will return a lot of results) may take a
            lot of time (1-2mins) to load. Consider using a limit, or make your
            query more specific to get it loading faster.
          </span>
          <QueryGroup
            group={tree.group}
            id={tree.id}
            updateParent={(child) => updateTree(child)}
          />
          <QueryLimit limit={limit} updateLimit={(limit) => setLimit(limit)} />
          <div className="flex gap-2 items-center">
            <button
              disabled={loading}
              className="bg-blue-600 self-start rounded hover:bg-blue-700 transition duration-150 px-2 py-1 text-white font-medium"
              onClick={exportData}
            >
              Search
            </button>
            {loading && <CircularProgress size={25} />}
          </div>
        </div>
      )}
      {(result?.Ids??[]).length ? (
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-monokai-dark rounded shadow p-6">
            <DownloadSettings result={result} existing={existing} />
          </div>
          <div className="bg-white dark:bg-monokai-dark rounded shadow p-6 mt-0 flex flex-col gap-4">
            <span className="font-bold text-lg dark:text-white">Results</span>
            <ResultTable result={result} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
