import React, { createContext, useContext, useEffect, useReducer } from 'react'

export type Trade = {
  id: string
  date: string
  pair: string
  session: string
  setup: string
  entry: number
  exit: number
  sl: number
  tp: number
  riskPct: number
  lotSize: number
  rr: number
  pnl: number
  notes?: string
  beforeImg?: string
  afterImg?: string
}

export type PsychologyDay = {
  id: string
  date: string
  mood: number
  fomo: boolean
  overtrading: boolean
  revenge: boolean
  followedRules: boolean
  mistakes: string
  emotions: string
}

export type Rules = {
  blueberryDailyDD: number
  blueberryMaxLoss: number
  minTradingDays: number
  scalpingMaxMinutes: number
  personalRules: string
  riskGuidelines: string
}

export type Note = {
  id: string
  date: string
  type: 'daily'|'weekly'|'monthly'|'lesson'|'goal'
  content: string
}

export type HabitState = {
  date: string
  items: Record<string, boolean>
}

type State = {
  trades: Trade[]
  psychology: PsychologyDay[]
  rules: Rules
  notes: Note[]
  habits: HabitState[]
}

type Action =
  | { type: 'add-trade', trade: Trade }
  | { type: 'edit-trade', trade: Trade }
  | { type: 'delete-trade', id: string }
  | { type: 'log-psych', day: PsychologyDay }
  | { type: 'update-rules', rules: Rules }
  | { type: 'add-note', note: Note }
  | { type: 'toggle-habit', date: string, key: string, value: boolean }

const initialState: State = {
  trades: [],
  psychology: [],
  rules: {
    blueberryDailyDD: 0,
    blueberryMaxLoss: 0,
    minTradingDays: 0,
    scalpingMaxMinutes: 5,
    personalRules: '',
    riskGuidelines: ''
  },
  notes: [],
  habits: []
}

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null)

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add-trade':
      return { ...state, trades: [...state.trades, action.trade] }
    case 'edit-trade':
      return { ...state, trades: state.trades.map(t => t.id === action.trade.id ? action.trade : t) }
    case 'delete-trade':
      return { ...state, trades: state.trades.filter(t => t.id !== action.id) }
    case 'log-psych':
      return { ...state, psychology: [...state.psychology.filter(p=>p.date!==action.day.date), action.day] }
    case 'update-rules':
      return { ...state, rules: action.rules }
    case 'add-note':
      return { ...state, notes: [...state.notes, action.note] }
    case 'toggle-habit': {
      const idx = state.habits.findIndex(h => h.date === action.date)
      let habits = [...state.habits]
      if (idx === -1) habits.push({ date: action.date, items: { [action.key]: action.value } })
      else habits[idx] = { date: action.date, items: { ...habits[idx].items, [action.key]: action.value } }
      return { ...state, habits }
    }
    default:
      return state
  }
}

const KEY = 'ATJ_STATE_V1'

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? JSON.parse(raw) as State : init
    } catch { return init }
  })

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(state)) }, [state])

  return React.createElement(Ctx.Provider, { value: { state, dispatch } }, children)
}

export function useData() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Data context missing')
  return ctx
}

export function calcStats(trades: Trade[]) {
  const total = trades.length
  const wins = trades.filter(t => t.pnl > 0).length
  const winRate = total ? Math.round((wins / total) * 100) : 0
  const totalPnl = trades.reduce((a, b) => a + b.pnl, 0)
  const avgRR = total ? (trades.reduce((a,b)=>a+b.rr,0)/total) : 0
  return { total, wins, winRate, totalPnl, avgRR }
}

export function equitySeries(trades: Trade[]) {
  let acc = 0
  return trades
    .sort((a,b)=> a.date.localeCompare(b.date))
    .map(t => { acc += t.pnl; return { date: t.date, equity: acc } })
}
