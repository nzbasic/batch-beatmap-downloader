import React, { useEffect, useState } from 'react';
import Switch from 'react-switch';
import { Browse } from './Browse';
import Button from './util/Button';
import { Tooltip } from './util/Tooltip';

export const Temporary = () => {
  const [temp, setTemp] = useState(true);
  const [tempCount, setTempCount] = useState(0);
  const [tempPath, setTempPath] = useState("");
  const [tempAuto, setTempAuto] = useState(false);
  const [moving, setMoving] = useState(false);
  const [tempValid, setTempValid] = useState(true);
  const [isWindows, setIsWindows] = useState(true)

  const updateData = () => {
    window.electron.getTempData().then((data) => {
      setTemp(data.enabled);
      setTempPath(data.path);
      setTempCount(data.count);
      setTempValid(data.valid)
      setTempAuto(data.auto);
    });
  };

  useEffect(() => {
    updateData();

    window.electron.getPlatform().then(res => {
      setIsWindows(res === "win32")
    })
  }, []);

  const handleToggle = () => {
    window.electron.setSetting("temp", !temp).then(() => updateData());
  };

  const handleSetTempPath = (path: string) => {
    window.electron.setSetting("tempPath", path).then(() => updateData());
  };

  const handleResetPath = () => {
    window.electron.resetTempPath().then(() => updateData());
  };

  const handleSetTempAuto = (auto: boolean) => {
    window.electron.setSetting("autoTemp", auto).then(() => updateData());
  }

  const handleMoveDownloads = () => {
    setMoving(true)
    window.electron.moveTempDownloads().then(() => {
      updateData();
      setMoving(false);
    });
  };

  return (
    <div className="content-box flex flex-col items-start gap-6">
      <h1 className="font-bold text-lg">Temporary Folder</h1>
      <div className="flex flex-col">
        <span>Sends all beatmap downloads to a temporary folder until downloads are finished.</span>
        <span>This prevents each download from interrupting your game during in song selection.</span>
      </div>

      <span className="font-bold text-orange-500">The temp folder MUST be on the same disk / partition as your songs folder.</span>

      {!isWindows && (
        <span className="font-bold text-red-500">You aren't on Windows so I assume you know what you are doing.</span>
      )}

      <span>There are currently {tempCount} downloads in the temp folder.</span>

      <div>
        <div className="flex items-center gap-2">
          <span className="w-52">Enabled</span>
          <Switch checked={temp} onChange={handleToggle} />
        </div>
        {temp && (
          <>
            <div className="flex items-center mt-4 gap-2">
              <span className="w-52">Temp Path</span>
              <Browse path={tempPath} update={handleSetTempPath} />
              <Button onClick={handleResetPath}>Reset</Button>
              {!tempValid && (
                <span className="text-red-500">Invalid Path</span>
              )}
            </div>
            <div className="flex items-center mt-4 gap-2">
              <span className="w-52">
                Auto Transfer
                <Tooltip title="Automatically move downloads from the temp folder to your songs folder when downloads are finished." />
              </span>
              <Switch checked={tempAuto} onChange={handleSetTempAuto} />
            </div>
          </>
        )}
      </div>

      <Button disabled={tempCount === 0 || moving} onClick={handleMoveDownloads}>Move Contents</Button>
    </div>
  );
};
