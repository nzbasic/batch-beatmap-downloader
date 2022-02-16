import { Menu } from './components/Menu'
import './index.css'
import { Home } from './pages/Home'

const App = () => {
  return (
    <div className="flex w-screen">
      <Menu />
      <div id="" className="main p-4 overflow-auto overflow-x-hidden h-screen">
        <Home />
      </div>

    </div>
  )
}

export default App
