import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/shared/NavBar";
import { AssistantPage } from "./components/assistant/AssistantPage";
import { VocabularyPage } from "./components/vocabulary/VocabularyPage";
import { FlashcardsPage } from "./components/flashcards/FlashcardsPage";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<AssistantPage />} />
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}