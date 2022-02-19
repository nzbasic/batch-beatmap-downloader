interface PropTypes {
  path: string
  update: React.Dispatch<React.SetStateAction<string>>
}

export const Browse = ({ path, update }: PropTypes) => {
  const browse = async () => {
    const res = await window.electron.browse();
    if (!res.canceled) {
      const path = res.filePaths[0]
      update(path);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        value={path}
        disabled={true}
        className="input-height p-2 w-40 border-gray-300 border rounded focus:outline-blue-500"
      />
      <button
        onClick={() => browse()}
        className="bg-blue-600 rounded hover:bg-blue-700 transition duration-150 px-2 py-1 text-white font-medium"
      >
        Browse
      </button>
    </div>
  )
}
