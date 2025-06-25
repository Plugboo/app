import { MemoryRouter, Routes, Route } from 'react-router'
import TopBar from '../components/TopBar'
import HomePage from './page'
import GamePage from './game/page'
import { useEffect, useState } from 'react'
import { getAppTitleBar } from '../api/app'
import ProfilePage from './profile/page'
import SideBar from '@renderer/components/SideBar'

export default function App() {
  const [topBarEnabled, setTopBarEnabled] = useState(true)

  useEffect(() => {
    getAppTitleBar().then((result) => {
      setTopBarEnabled(result === 'custom')
    })
  }, [])

  return (
    <MemoryRouter>
      <div className="bg-background-800 text-text-50 w-screen h-screen antialiased flex overflow-hidden flex-col">
        {topBarEnabled && <TopBar />}
        <div className="w-full h-full flex">
          <SideBar />
          <div className="bg-background-900 rounded-tl-2xl border-t-2 border-l-2 border-background-700/75 w-full h-full scrollbar-none">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>
        </div>
      </div>
    </MemoryRouter>
  )
}
