import { useState } from 'react'
import { useData, type PsychologyDay } from '../store/data'

export default function PsychologyPage() {
  const { state, dispatch } = useData()
  const [form, setForm] = useState<PsychologyDay>({
    id: '', date: new Date().toISOString().slice(0,10), mood: 5,
    fomo: false, overtrading: false, revenge: false,
    followedRules: true, mistakes: '', emotions: ''
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    dispatch({ type:'log-psych', day: { ...form, id: form.date } })
  }

  const today = state.psychology.find(p=>p.date===form.date)

  return (
    <div className="grid cols-2">
      <div className="card">
        <h3>Psychology & Discipline</h3>
        <form onSubmit={submit} className="grid" style={{gap:10}}>
          <div className="row">
            <input className="input" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
            <input className="input" type="range" min={1} max={10} value={form.mood} onChange={e=>setForm(f=>({...f,mood:Number(e.target.value)}))} />
            <div className="badge">Mood {form.mood}/10</div>
            <div className="badge">Followed rules: {form.followedRules ? 'Yes':'No'}</div>
          </div>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <label className="badge"><input type="checkbox" checked={form.fomo} onChange={e=>setForm(f=>({...f,fomo:e.target.checked}))}/> FOMO</label>
            <label className="badge"><input type="checkbox" checked={form.overtrading} onChange={e=>setForm(f=>({...f,overtrading:e.target.checked}))}/> Overtrading</label>
            <label className="badge"><input type="checkbox" checked={form.revenge} onChange={e=>setForm(f=>({...f,revenge:e.target.checked}))}/> Revenge</label>
            <label className="badge"><input type="checkbox" checked={form.followedRules} onChange={e=>setForm(f=>({...f,followedRules:e.target.checked}))}/> Followed rules</label>
          </div>
          <textarea className="textarea" rows={3} placeholder="Mistakes log" value={form.mistakes} onChange={e=>setForm(f=>({...f,mistakes:e.target.value}))}></textarea>
          <textarea className="textarea" rows={3} placeholder="Emotional notes" value={form.emotions} onChange={e=>setForm(f=>({...f,emotions:e.target.value}))}></textarea>
          <button className="btn primary" type="submit">Save Day</button>
        </form>
      </div>
      <div className="card">
        <h3>Did I follow my rules today?</h3>
        <div className="muted">{today ? (today.followedRules? 'Yes' : 'No') : 'No data saved for today'}</div>
        <h3 style={{marginTop:16}}>Recent days</h3>
        <table className="table">
          <thead><tr><th>Date</th><th>Mood</th><th>FOMO</th><th>Overtrading</th><th>Revenge</th><th>Followed</th></tr></thead>
          <tbody>
            {[...state.psychology].slice(-10).reverse().map(p => (
              <tr key={p.id}><td>{p.date}</td><td>{p.mood}</td><td>{p.fomo?'Yes':'No'}</td><td>{p.overtrading?'Yes':'No'}</td><td>{p.revenge?'Yes':'No'}</td><td>{p.followedRules?'Yes':'No'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

