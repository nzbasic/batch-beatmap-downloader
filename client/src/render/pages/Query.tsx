import React, { useState } from "react";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";
import ReactDOM from "react-dom";
import { CircularProgress } from "@mui/material";

import { sampleTree } from "../../models/filter";
import { RuleType } from "../../models/rules";
import { Node, Group } from "../../models/filter";
import { Settings } from "../components/Settings";
import { DownloadDetails, QueryOrder } from "../../models/api";
import { useStickyState } from "../hooks/useStickyState";
import { DownloadSettings } from "../components/DownloadSettings";
import { InvalidPath } from "../components/InvalidPath";
import { SimpleFilter } from "../components/query/SimpleFilter";
import { AdvancedFilter } from "../components/query/AdvancedFilter";
import Button from "../components/util/Button";
import { treeIsCompatibleWithSimpleMode } from "../../models/simple";
import { QuerySettings } from "../components/query/QuerySettings";
import { useSettings } from "../context/SettingsProvider";
import { ResultTable } from "../components/query/ResultTable";

export const Query = () => {
  const { settings } = useSettings()
  const { validPath } = settings;
  const [tree, setTree] = useStickyState<Node>(sampleTree, "tree");
  const [result, setResult] = useState<DownloadDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState<number>();
  const [order, setOrder] = useState<QueryOrder>();
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
      8: "Text",
      9: "Numeric",
      10: "Numeric",
    };

    // replace all rule types with the correct string from the Map
    const replaceRuleType = (node: Node) => {
      if ("rule" in node) {
        if (!node.rule) return
        node.rule.type = map[node.rule.type as RuleType];
        if (node.rule.field === "LastUpdate") {
          node.rule.value = node.rule.value.slice(0, -3)
        }

        if (node.rule.field === "Special") {
          node.rule.field = node.rule.value;
          node.rule.value = "1"
        }
      }
      if ("group" in node) {
        if (!node.group) return
        node.group.children.forEach(replaceRuleType);
      }
    };

    const clone = cloneDeep(tree);
    replaceRuleType(clone);
    const res = await window.electron.query(clone, limit, order);
    if (!res) return

    if (typeof res === "string") {
      toast.error(res);
    } else {
      toast.success(`Query successful: ${res.beatmaps} results`);
      setResult(res);
    }

    setLoading(false);
  };

  const updateTree = (group: Group) => {
    setTree({ ...tree, group });
  };

  const handleChangeMode = (simple: boolean) => {
    if (!simple) return setSimpleMode(simple)
    if (tree.group && treeIsCompatibleWithSimpleMode(tree.group)) return setSimpleMode(simple)

    const node = document.getElementById('modal')
    if (!node) return
    node.classList.remove('hidden')
    ReactDOM.render(
      <div className="bg-white dark:bg-monokai-light rounded-xl shadow p-8">
        <p className="font-bold text-xl mb-4">Compatibility Error</p>
        <p>Your current query is not compatible with the Simple Mode due to either:</p>
        <ul className="list-disc list-inside">
          <li>Nested rules</li>
          <li>"Not" rules</li>
          <li>"Or" rules</li>
        </ul>
        <p className="my-4">You can have your filter automatically converted, or stay in advanced mode.</p>
        <div className="space-x-2">
          <Button onClick={() => {
            setSimpleMode(true);
            node.classList.add('hidden')
          }}>
            Convert
          </Button>
          <Button onClick={() => node.classList.add('hidden')}>Cancel</Button>
        </div>
      </div>,
      node
    );
  };

  if (!tree.group) return null
  return (
    <div className="flex flex-col w-full gap-4">
      <Settings />
      {!validPath ? <InvalidPath /> : (
        <>
          <div className="flex items-center gap-4">
            <button className={`${simpleMode ? 'box-selector-on' : 'box-selector-off'}`} onClick={() => handleChangeMode(true)}>Simple Mode</button>
            <button className={`${!simpleMode ? 'box-selector-on' : 'box-selector-off'}`} onClick={() => handleChangeMode(false)}>Advanced Mode</button>
          </div>
          {simpleMode ?
            <SimpleFilter tree={tree} updateTree={updateTree} /> :
            <AdvancedFilter tree={tree} updateTree={updateTree} />
          }
          <div className="flex flex-col gap-6 content-box">
            <QuerySettings
              limit={limit}
              updateLimit={(limit) => setLimit(limit)}
              order={order}
              updateOrder={(order) => setOrder(order)}
            />
            <div className="flex gap-2 items-center">
              <Button color="blue" onClick={exportData} disabled={loading}>
                Search
              </Button>
              {loading && <CircularProgress size={25} />}
              {result && result.beatmaps === 0 && <>No results!</>}
            </div>
          </div>
        </>
      )}
      {result && result.beatmaps > 0 && (
        <div className="flex flex-col gap-4">
          <div className="content-box">
            <DownloadSettings result={result} />
          </div>
          <div className="content-box no-pad mt-0 flex flex-col gap-4">
            <span className="font-bold text-lg dark:text-white p-6 pb-2">Results</span>
            <ResultTable result={result} />
          </div>
        </div>
      )}
    </div>
  );
};
