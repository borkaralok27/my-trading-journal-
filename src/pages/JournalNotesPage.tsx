import { useState } from 'react'
import { useData, type Note } from '../store/data'

export default function JournalNotesPage() {
  const { state, dispatch } = useData()
  const [note, setNote] = useState<Note>({ id:'', date: new Date().toISOString().slice(0,10), type:'daily', content:'' })

  function add(e: React.FormEvent) {
    e.preventDefault()
    dispatch({ type:'add-note', note: { ...note, id: crypto.randomUUID() } })
    setNote({ id:'', date: new Date().toISOString().slice(0,10), type:'daily', content:'' })
  }

  return (
    <div className="grid cols-2">
      <div className="card">
        <h3>Journal Notes</h3>
        <form onSubmit={add} className="grid" style={{gap:10}}>
          <div className="row-3">
            <input className="input" type="date" value={note.date} onChange={e=>setNote(n=>({...n,date:e.target.value}))}/>
            <select className="select" value={note.type} onChange={e=>setNote(n=>({...n,type:e.target.value as Note['type']}))}>
              <option value="daily">Daily notes</option>
              <option value="weekly">Weekly review</option>
              <option value="monthly">Monthly summary</option>
              <option value="lesson">Key lessons</option>
              <option value="goal">Goals checklist</option>
            </select>
            <button className="btn primary" type="submit">Add Note</button>
          </div>
          <textarea className="textarea" rows={6} placeholder="Write here..." value={note.content} onChange={e=>setNote(n=>({...n,content:e.target.value}))}></textarea>
        </form>
      </div>
      <div className="card">
        <h3>Notes</h3>
        <table className="table">
          <thead><tr><th>Date</th><th>Type</th><th>Content</th></tr></thead>
          <tbody>
            {[...state.notes].reverse().map(n => (
              <tr key={n.id}><td>{n.date}</td><td>{n.type}</td><td>{n.content}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

