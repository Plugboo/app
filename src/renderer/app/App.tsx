import { HashRouter, Route, Routes } from 'react-router'
import TopBar from '../components/app/TopBar'
import HomePage from './page'
import GamePage from './game/page'
import ProfilePage from './game/profile/page'
import ModsPage from '@renderer/app/game/profile/mods/page'
import ModPage from '@renderer/app/game/profile/mods/[modId]/page'
import { ToastContainer } from 'react-toastify'
import SettingsPage from '@renderer/app/settings/page'

export default function App() {
    return (
        <HashRouter>
            <div className="text-text-50 w-screen max-h-screen h-screen antialiased flex overflow-hidden flex-col bg-background-800/70">
                <TopBar />
                <div className="w-full overflow-hidden grow p-4 pb-0">
                    <div className="bg-background-default h-full w-full overflow-y-auto rounded-t-2xl p-4 pb-0">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/settings" element={<SettingsPage />} />
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
                    draggable
                    pauseOnHover
                />
            </div>
        </HashRouter>
    )
}
