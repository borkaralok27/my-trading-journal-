import { useMemo } from 'react'
import { useData, calcStats } from '../store/data'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function monthKey(d: string) { return d.slice(0,7) }

export default function MonthlySummaryPage() {
  const { state } = useData()
  const month = monthKey(new Date().toISOString())
  const monthTrades = state.trades.filter(t => monthKey(t.date) === month)
  const stats = calcStats(monthTrades)
  const patternGroups: Record<string, number> = {}
  monthTrades.forEach(t => { patternGroups[t.setup] = (patternGroups[t.setup]||0) + t.pnl })
  const data = Object.entries(patternGroups).map(([k,v]) => ({ pattern: k||'N/A', pnl: v }))
  return (
    <div className="grid cols-2">
      <div className="card">
        <h3>Monthly Summary</h3>
        <div className="row-3" style={{marginTop:12}}>
          <div className="card"><div className="muted">Monthly P/L</div><div style={{fontSize:24,fontWeight:600,color:stats.totalPnl>=0? 'var(--success)':'var(--danger)'}}>${stats.totalPnl.toFixed(2)}</div></div>
          <div className="card"><div className="muted">Win rate</div><div style={{fontSize:24,fontWeight:600}}>{stats.winRate}%</div></div>
          <div className="card"><div className="muted">Best trade</div><div style={{fontSize:24,fontWeight:600}}>${Math.max(0,...monthTrades.map(t=>t.pnl)).toFixed(2)}</div></div>
        </div>
        <div className="card" style={{marginTop:12}}>
          <div className="muted">Risk management score</div>
          <div style={{fontSize:22}}>{Math.min(100, Math.max(0, 50 + (stats.winRate-50)))} / 100</div>
        </div>
      </div>
      <div className="card">
        <h3>Pattern performance</h3>
        <div style={{height:300}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="pattern" stroke="var(--muted)"/>
              <YAxis stroke="var(--muted)"/>
              <Tooltip contentStyle={{background:'#0e1628',border:'1px solid var(--border)'}}/>
              <Bar dataKey="pnl" fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

