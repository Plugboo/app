import "@renderer/index.css";
import GameOverviewPage from "@renderer/page/game/overview";
import ProfilePage from "@renderer/page/game/profile";
import HomePage from "@renderer/page/home";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";

const root = document.getElementById("root");

if (root === null)
{
    throw new Error("Root element not found");
}

createRoot(root).render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/overview" element={<GameOverviewPage />} />
            <Route path="/game/profile" element={<ProfilePage />} />
        </Routes>
    </HashRouter>
);
