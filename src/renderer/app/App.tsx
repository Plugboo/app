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
import { ToastContainer } from 'react-toastify'

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
            <div className="dark text-text-50 w-screen max-h-screen h-screen antialiased flex overflow-hidden flex-col">
                <SettingsModal open={settingsModalOpen} onChangeOpen={setSettingsModalOpen} />

                {topBarEnabled && <TopBar />}
                <div className="grow flex overflow-hidden">
                    <SideBar onClickSettings={() => setSettingsModalOpen(true)} />

                    <div className="bg-background-800/50 w-full overflow-y-auto scrollbar-gutter-stable">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/game/:gameId" element={<GamePage />} />
                            <Route path="/game/:gameId/profile/:profileId" element={<ProfilePage />} />
                            <Route path="/game/:gameId/profile/:profileId/mods" element={<ModsPage />} />
                            <Route path="/game/:gameId/profile/:profileId/mods/:modId" element={<ModPage />} />
                        </Routes>
                    </div>
                </div>

                <ToastContainer
                    toastClassName="!bg-background-800 !text-text-100"
                    position="bottom-right"
                    hideProgressBar={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </HashRouter>
    )
}
