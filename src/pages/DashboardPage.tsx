import { useData, calcStats, equitySeries } from '../store/data'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const { state } = useData()
  const stats = calcStats(state.trades)
  const series = equitySeries(state.trades)
  const nav = useNavigate()
  return (
    <div className="grid cols-2">
      <div className="card">
        <h3>Alok Trading Journal</h3>
        <div className="muted">Weekly performance summary</div>
        <div className="row-3" style={{marginTop:12}}>
          <div className="card"><div className="muted">Win rate</div><div style={{fontSize:24,fontWeight:600}}>{stats.winRate}%</div></div>
          <div className="card"><div className="muted">Total trades</div><div style={{fontSize:24,fontWeight:600}}>{stats.total}</div></div>
          <div className="card"><div className="muted">P/L</div><div style={{fontSize:24,fontWeight:600,color:stats.totalPnl>=0? 'var(--success)':'var(--danger)'}}>${stats.totalPnl.toFixed(2)}</div></div>
        </div>
        <div style={{display:'flex',gap:8,marginTop:16}}>
          <button className="btn primary" onClick={()=> nav('/trades#add')}>Add Trade</button>
          <button className="btn" onClick={()=> nav('/notes')}>Add Journal Note</button>
          <button className="btn" onClick={()=> nav('/rules')}>Review Rules</button>
        </div>
      </div>
      <div className="card">
        <h3>Equity curve</h3>
        <div style={{height:300}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <XAxis dataKey="date" stroke="var(--muted)"/>
              <YAxis stroke="var(--muted)"/>
              <Tooltip contentStyle={{background:'#0e1628',border:'1px solid var(--border)'}}/>
              <Line type="monotone" dataKey="equity" stroke="var(--accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

