import React, { useState } from "react"
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import Button from "./util/Button";

export const BMACButton = () => {
  const [active, setActive] = useState(false);

  return (
    <div className="">
      {active && (
        <webview
          useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0"
          className="absolute bottom-[20px] right-[20px] h-[645px] w-[600px] border-2 border-black p-1 bg-white rounded"
          src="https://www.buymeacoffee.com/widget/page/nzbasic?description=a&color=#5F7FFF"
        />
      )}
      <Button
        color="blue"
        onClick={() => setActive(prev => !prev)}
        className="absolute bottom-3 right-3 z-50 rounded w-12 h-12"
      >
        {active ? <CloseIcon /> : <FavoriteIcon /> }
      </Button>
    </div>
  )
}
