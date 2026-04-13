import { useNavigate } from "react-router-dom";
import { useVocabularyStore } from "../../hooks/useVocabularyStore";
import "./DashboardPage.css";

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DashboardPage() {
  const { words, quizResults, streak, getWordsDueForReview } = useVocabularyStore();
  const navigate = useNavigate();
  const dueWords = getWordsDueForReview();

  const totalCorrect = quizResults.reduce((sum, r) => sum + r.score, 0);
  const totalAnswered = quizResults.reduce((sum, r) => sum + r.total, 0);
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : null;

  return (
    <div className="dashboard-page">
      <h1>Your Progress</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{words.length}</span>
          <span className="stat-label">Words Saved</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{streak}</span>
          <span className="stat-label">Day Streak 🔥</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{quizResults.length}</span>
          <span className="stat-label">Quizzes Taken</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{overallAccuracy !== null ? `${overallAccuracy}%` : "-"}</span>
          <span className="stat-label">Overall Accuracy</span>
        </div>
      </div>

      {dueWords.length > 0 && (
        <div className="review-alert">
          <span className="review-alert-icon">⏰</span>
          <span>
            <strong>{dueWords.length} word{dueWords.length > 1 ? "s" : ""}</strong> due for review today.
          </span>
          <button className="btn-review" onClick={() => navigate("/flashcards")} type="button">
            Practice now
          </button>
        </div>
      )}

      <section className="dashboard-section">
        <h2>Quiz History</h2>
        {quizResults.length === 0 ? (
          <p className="empty-hint">No quizzes completed yet. Head to Flashcards to take your first quiz!</p>
        ) : (
          <div className="quiz-history-list">
            {quizResults.map((r, i) => (
              <div className="quiz-history-row" key={i}>
                <span className="quiz-history-date">{formatDate(r.date)}</span>
                <div className="quiz-history-bar-wrap">
                  <div
                    className="quiz-history-bar"
                    style={{ width: `${r.percentage}%`, background: r.percentage >= 70 ? "#4f6ef7" : "#f59e0b" }}
                  />
                </div>
                <span className="quiz-history-score">
                  {r.score}/{r.total} ({r.percentage}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Saved Words</h2>
        {words.length === 0 ? (
          <p className="empty-hint">No words saved yet. Use the Assistant to get vocabulary suggestions.</p>
        ) : (
          <div className="word-chips">
            {words.map((w) => {
              const isDue = !w.reviewStats || new Date(w.reviewStats.nextReviewDate) <= new Date();
              return (
                <span key={w.id} className={`word-chip ${isDue ? "due" : ""}`} title={w.definition}>
                  {w.word}
                  {isDue && <span className="chip-due-dot" />}
                </span>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
