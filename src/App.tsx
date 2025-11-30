import { NavLink, Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import TradeLogPage from './pages/TradeLogPage'
import PsychologyPage from './pages/PsychologyPage'
import RulesPage from './pages/RulesPage'
import JournalNotesPage from './pages/JournalNotesPage'
import HabitTrackerPage from './pages/HabitTrackerPage'
import MonthlySummaryPage from './pages/MonthlySummaryPage'
import { DataProvider } from './store/data'

export default function App() {
  return (
    <DataProvider>
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <img src="/logo.svg" alt="ATJ" />
            <div>
              <div className="title">Alok Trading Journal</div>
              <div className="subtitle">Discipline • Consistency • Funding Focus</div>
            </div>
          </div>
          <nav className="nav">
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/trades">Trade Log</NavLink>
            <NavLink to="/psychology">Psychology</NavLink>
            <NavLink to="/rules">Prop Firm & Rules</NavLink>
            <NavLink to="/notes">Journal Notes</NavLink>
            <NavLink to="/habits">Habit Tracker</NavLink>
            <NavLink to="/monthly">Monthly Summary</NavLink>
          </nav>
        </header>
        <main className="container">
          <Routes>
            <Route path="/" element={<DashboardPage/>} />
            <Route path="/trades" element={<TradeLogPage/>} />
            <Route path="/psychology" element={<PsychologyPage/>} />
            <Route path="/rules" element={<RulesPage/>} />
            <Route path="/notes" element={<JournalNotesPage/>} />
            <Route path="/habits" element={<HabitTrackerPage/>} />
            <Route path="/monthly" element={<MonthlySummaryPage/>} />
          </Routes>
        </main>
        <footer className="footer">© {new Date().getFullYear()} ATJ</footer>
      </div>
    </DataProvider>
  )
}

