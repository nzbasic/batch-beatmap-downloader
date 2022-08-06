import { useState } from "react";
import { sampleTree } from "../../models/filter";
import { RuleType } from "../../models/rules";
import { Node, Group } from "../../models/filter";
import { cloneDeep } from "lodash";
import { ResultTable } from "../components/query/ResultTable";
import { Settings } from "../components/Settings";
import { FilterResponse } from "../../models/api";
import { useStickyState } from "../hooks/useStickyState";
import { DownloadSettings } from "../components/DownloadSettings";
import { toast } from "react-toastify";
import { InvalidPath } from "../components/InvalidPath";
import React from "react";
import { SimpleFilter } from "../components/query/SimpleFilter";
import { AdvancedFilter } from "../components/query/AdvancedFilter";

export const Query = () => {
  const [validPath, setValidPath] = useState(false)
  const [tree, setTree] = useStickyState<Node>(sampleTree, "tree");
  const [result, setResult] = useState<FilterResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState<number | null>(null);
  const [existing, setExisting] = useState<number[]>([]);
  const [simpleMode, setSimpleMode] = useStickyState(true, "simple")

  const exportData = async () => {
    setResult(null);
    setLoading(true);

    const map: Record<RuleType, string> = {
      0: "Text",
      1: "Numeric",
      2: "Text",
      3: "Text",
      4: "Text",
      5: "Text",
      6: "Numeric",
      7: "Numeric",
      8: "Text"
    };

    // replace all rule types with the correct string from the Map
    const replaceRuleType = (node: Node) => {
      if ("rule" in node) {
        if (!node.rule) return
        node.rule.type = map[node.rule.type as RuleType];
        if (node.rule.field === "LastUpdate") {
          node.rule.value = node.rule.value.slice(0, -3)
        }
      }
      if ("group" in node) {
        if (!node.group) return
        node.group.children.forEach(replaceRuleType);
      }
    };

    const clone = cloneDeep(tree);
    replaceRuleType(clone);
    const res = await window.electron.query(clone, limit ?? Number.MAX_SAFE_INTEGER);
    if (!res) return

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

  if (!tree.group) return null
  return (
    <div className="flex flex-col w-full gap-4">
      <Settings onValidPath={valid => setValidPath(valid)} onBeatmapsLoaded={(ids) => setExisting(ids)} />
      {!validPath ? <InvalidPath /> : (
        <>
          <div className="flex items-center gap-4">
            <button className={`${simpleMode ? 'box-selector-on' : 'box-selector-off'}`} onClick={() => setSimpleMode(true)}>Simple Mode</button>
            <button className={`${!simpleMode ? 'box-selector-on' : 'box-selector-off'}`} onClick={() => setSimpleMode(false)}>Advanced Mode</button>
          </div>
          {simpleMode ?
          (
            <SimpleFilter


            />
          ) : (
            <AdvancedFilter
              tree={tree}
              updateTree={updateTree}
              limit={limit}
              setLimit={(limit) => setLimit(limit)}
              loading={loading}
              exportData={exportData}
            />
          )}
        </>
      )}
      {result && (result?.Ids??[]).length ? (
        <div className="flex flex-col gap-4">
          <div className="container">
            <DownloadSettings result={result} existing={existing} />
          </div>
          <div className="container mt-0 flex flex-col gap-4">
            <span className="font-bold text-lg dark:text-white">Results</span>
            <ResultTable result={result} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
