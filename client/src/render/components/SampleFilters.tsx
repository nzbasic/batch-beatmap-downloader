import { Link } from "react-router-dom";
import {
  allRankedOsu,
  allLoved,
  allSotarks,
  allRanked7Star,
  Node,
} from "../../models/filter";

interface Filter {
  name: string;
  tree: Node;
  colour: string;
}

const filters: Filter[] = [
  { name: "All Ranked osu! Maps", tree: allRankedOsu, colour: "#ff5370" },
  { name: "Every Loved Map", tree: allLoved, colour: "#fd971f" },
  { name: "Sotarks Maps", tree: allSotarks, colour: "#b267e6" },
  { name: "Every Ranked 7*", tree: allRanked7Star, colour: "#ff6600" },
];

export const SampleFilters = () => {
  const loadFilter = (filter: Filter) => {
    // load the filter tree into localstorage before redirecting
    localStorage.setItem("tree", JSON.stringify(filter.tree));
  };

  return (
    <div className="bg-white dark:bg-monokai-dark rounded shadow p-6 flex flex-col dark:text-white w-full">
      <span className="font-bold text-lg mb-4">Load a Preset Filter</span>
      <div className="flex flex-row flex-wrap gap-4">
        {filters.map((filter) => (
          <Link
            onClick={() => loadFilter(filter)}
            to={"/query"}
            key={filter.name}
            style={{ backgroundColor: filter.colour }}
            className="hover:saturate-200 dark:hover:saturate-200 transition duration-150 flex flex-col items-center justify-center w-52 h-20 rounded text-white"
          >
            <span className="font-medium text-xl text-center">
              {filter.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
