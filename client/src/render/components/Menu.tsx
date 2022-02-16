import Logo from '../assets/bbd.svg'

export const Menu = () => {
  const closeApp = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    window.electron.quit()
  }

  return (
    <div id="menu" className="w-52 flex flex-col h-screen bg-monokai-light text-white dark:bg-monokai-dark shadow">
      <img className="m-4" src={Logo} />
      <div className="text-sm self-center items-center flex flex-col">
        <span className="">Batch Beatmap Downloader</span>
        <span>by nzbasic</span>
      </div>
      <div className="flex flex-col justify-between h-full mt-4">
        <div id="menu-button" className="flex flex-col">
          <button className="dark:hover:bg-monokai-light hover:bg-monokai-dark font-medium text-lg py-3">Home</button>
          <button className="dark:hover:bg-monokai-light hover:bg-monokai-dark font-medium text-lg py-3">Downloads</button>
        </div>
        <button onClick={() => closeApp()} id="menu-button" className="hover:bg-red-500 font-medium text-lg py-2">Exit</button>
      </div>
    </div>
  )
}
