import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import "@renderer/index.css";

import HomePage from "@renderer/page/home";
import GameOverviewPage from "@renderer/page/game/overview";

createRoot(document.getElementById("root")).render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/overview" element={<GameOverviewPage />} />
        </Routes>
    </HashRouter>
);
