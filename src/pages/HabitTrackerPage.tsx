import { useData } from '../store/data'

const HABITS = [
  'Chart marking','Trade journaling','Backtesting','No impulsive trades',
  'Water intake','Clean room','Study 1 hour','Read 10 pages','Sleep on time'
]

function dayKey(date = new Date()) {
  return date.toISOString().slice(0,10)
}

export default function HabitTrackerPage() {
  const { state, dispatch } = useData()
  const date = dayKey()
  const today = state.habits.find(h=>h.date===date)

  function toggle(k: string, v: boolean) {
    dispatch({ type:'toggle-habit', date, key: k, value: v })
  }

  return (
    <div className="card">
      <h3>Habit Tracker</h3>
      <div className="grid" style={{gap:12}}>
        {HABITS.map(h => {
          const checked = !!today?.items[h]
          return (
            <label key={h} className="badge" style={{justifyContent:'space-between'}}>
              <span>{h}</span>
              <input type="checkbox" checked={checked} onChange={e=>toggle(h,e.target.checked)} />
            </label>
          )
        })}
      </div>
    </div>
  )
}

