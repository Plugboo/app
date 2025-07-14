import { Routes, Route, HashRouter } from 'react-router'
import TopBar from '../components/TopBar'
import HomePage from './page'
import GamePage from './game/page'
import { useEffect, useState } from 'react'
import { getAppTitleBar } from '../api/app'
import ProfilePage from './game/profile/page'
import SideBar from '@renderer/components/SideBar'
import ModsPage from '@renderer/app/game/profile/mods/page'
import ModPage from '@renderer/app/game/profile/mods/[modId]/page'
import SettingsModal from '@renderer/components/modals/SettingsModal'

export default function App() {
    const [topBarEnabled, setTopBarEnabled] = useState(true)
    const [settingsModalOpen, setSettingsModalOpen] = useState(false)

    useEffect(() => {
        getAppTitleBar().then((result) => {
            setTopBarEnabled(result === 'custom')
        })
    }, [])

    return (
        <HashRouter>
            <div
                className="dark bg-background-800 text-text-50 w-screen h-screen antialiased flex overflow-hidden flex-col">
                <SideBar onClickSettings={() => setSettingsModalOpen(true)} />
                {topBarEnabled && <TopBar />}
                <SettingsModal open={settingsModalOpen} onChangeOpen={setSettingsModalOpen} />

                <div className={`w-full h-full flex pl-16 ${topBarEnabled ? 'pt-9.5' : ''}`}>
                    <div className="fixed right-0 top-0 bottom-0 w-3.5 bg-background-800/35 pointer-events-none" />
                    <div className="bg-background-900 border-background-700/75 w-full h-full overflow-hidden overflow-y-auto scrollbar-gutter-stable">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/game/:gameId" element={<GamePage />} />
                            <Route path="/game/:gameId/profile/:profileId" element={<ProfilePage />} />
                            <Route path="/game/:gameId/profile/:profileId/mods" element={<ModsPage />} />
                            <Route path="/game/:gameId/profile/:profileId/mods/:modId" element={<ModPage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </HashRouter>
    )
}
