import { useEffect, useState } from "react";
import { InvalidPath } from "../components/InvalidPath";
import { SampleFilters } from "../components/SampleFilters";
import { Settings } from "../components/Settings";

export const Home = () => {
  const [validPath, setValidPath] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <Settings onValidPath={valid => setValidPath(valid)} />
      {validPath ? <SampleFilters /> : <InvalidPath /> }
    </div>
  );
};
