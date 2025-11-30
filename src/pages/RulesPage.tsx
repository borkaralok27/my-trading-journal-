import { useData, type Rules } from '../store/data'
import { useState } from 'react'

export default function RulesPage() {
  const { state, dispatch } = useData()
  const [rules, setRules] = useState<Rules>(state.rules)

  function save(e: React.FormEvent) {
    e.preventDefault()
    dispatch({ type: 'update-rules', rules })
  }

  return (
    <div className="grid cols-2">
      <div className="card">
        <h3>Blueberry funded account rules</h3>
        <form onSubmit={save} className="grid" style={{gap:10}}>
          <div className="row-2">
            <input className="input" type="number" placeholder="Daily drawdown $" value={rules.blueberryDailyDD} onChange={e=>setRules(r=>({...r,blueberryDailyDD:Number(e.target.value)}))}/>
            <input className="input" type="number" placeholder="Max loss $" value={rules.blueberryMaxLoss} onChange={e=>setRules(r=>({...r,blueberryMaxLoss:Number(e.target.value)}))}/>
          </div>
          <div className="row-2">
            <input className="input" type="number" placeholder="Minimum trading days" value={rules.minTradingDays} onChange={e=>setRules(r=>({...r,minTradingDays:Number(e.target.value)}))}/>
            <input className="input" type="number" placeholder="Scalping max minutes" value={rules.scalpingMaxMinutes} onChange={e=>setRules(r=>({...r,scalpingMaxMinutes:Number(e.target.value)}))}/>
          </div>
          <textarea className="textarea" rows={4} placeholder="Your personal rules" value={rules.personalRules} onChange={e=>setRules(r=>({...r,personalRules:e.target.value}))}></textarea>
          <textarea className="textarea" rows={4} placeholder="Risk management guidelines" value={rules.riskGuidelines} onChange={e=>setRules(r=>({...r,riskGuidelines:e.target.value}))}></textarea>
          <button className="btn primary" type="submit">Save Rules</button>
        </form>
      </div>
      <div className="card">
        <h3>Trackers</h3>
        <div className="row-3">
          <div className="card"><div className="muted">Daily DD</div><div style={{fontSize:24}}>${state.rules.blueberryDailyDD}</div></div>
          <div className="card"><div className="muted">Max loss</div><div style={{fontSize:24}}>${state.rules.blueberryMaxLoss}</div></div>
          <div className="card"><div className="muted">Min days</div><div style={{fontSize:24}}>{state.rules.minTradingDays}</div></div>
        </div>
      </div>
    </div>
  )
}

