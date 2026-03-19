import { NavLink } from "react-router-dom";
import { useVocabularyStore } from "../../hooks/useVocabularyStore";
import "./NavBar.css";

export function NavBar() {
  const { getWordsDueForReview } = useVocabularyStore();
  const dueCount = getWordsDueForReview().length;

  return (
    <nav className="navbar">
      <div className="navbar-brand">SpeakEasy</div>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Assistant
        </NavLink>
        <NavLink to="/vocabulary" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Vocabulary
        </NavLink>
        <NavLink to="/flashcards" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Flashcards
          {dueCount > 0 && <span className="nav-due-badge">{dueCount}</span>}
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Dashboard
        </NavLink>
      </div>
    </nav>
  );
}
