import { Menu } from './components/Menu'
import './index.css'
import { Query } from './pages/Query'
import { HashRouter, Route, Routes } from "react-router-dom";
import { Downloads } from './pages/Downloads';
import { Home } from './pages/Home';

const App = () => {
  return (
    <HashRouter>
      <div className="flex w-screen">
        <Menu />
        <div id="" className="main p-4 overflow-auto overflow-x-hidden h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/query" element={<Query />} />
            <Route path="/downloads" element={<Downloads />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  )
}

export default App
