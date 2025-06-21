import { MemoryRouter, Routes, Route } from 'react-router'
import TopBar from '../components/TopBar'
import HomePage from './page'
import GamePage from './game/page'
import { useEffect, useState } from 'react'
import { getAppTitleBar } from '../api/app'

export default function App() {
  const [topBarEnabled, setTopBarEnabled] = useState(true)

  useEffect(() => {
    getAppTitleBar().then((result) => {
      setTopBarEnabled(result === 'custom')
    })
  }, [])

  return (
    <MemoryRouter>
      <div className="bg-background-900 text-text-50 min-h-screen antialiased">
        {topBarEnabled && <TopBar />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:id" element={<GamePage />} />
        </Routes>
      </div>
    </MemoryRouter>
  )
}
