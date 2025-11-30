import { useEffect, useMemo, useRef, useState } from 'react'
import { useData, type Trade } from '../store/data'
import { exportCSV, exportPDF } from '../utils/export'

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = () => res(reader.result as string)
    reader.onerror = (e) => rej(e)
    reader.readAsDataURL(file)
  })
}

export default function TradeLogPage() {
  const { state, dispatch } = useData()
  const [form, setForm] = useState<Partial<Trade>>({ date: new Date().toISOString().slice(0,10), riskPct: 1, lotSize: 1 })
  const beforeRef = useRef<HTMLInputElement>(null)
  const afterRef = useRef<HTMLInputElement>(null)
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => {
    if (location.hash === '#add') setEditId(null)
  }, [])

  const rr = useMemo(() => {
    const sl = form.sl ?? 0, tp = form.tp ?? 0, entry = form.entry ?? 0, exit = form.exit ?? 0
    const risk = Math.abs(entry - sl)
    const reward = Math.abs(exit - entry)
    return risk ? Number((reward / risk).toFixed(2)) : 0
  }, [form])

  function reset() {
    setForm({ date: new Date().toISOString().slice(0,10), riskPct: 1, lotSize: 1 })
    setEditId(null)
    if (beforeRef.current) beforeRef.current.value = ''
    if (afterRef.current) afterRef.current.value = ''
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const id = editId ?? crypto.randomUUID()
    const beforeFile = beforeRef.current?.files?.[0]
    const afterFile = afterRef.current?.files?.[0]
    const beforeImg = beforeFile ? await toBase64(beforeFile) : form.beforeImg
    const afterImg = afterFile ? await toBase64(afterFile) : form.afterImg
    const pnl = ((form.exit ?? 0) - (form.entry ?? 0)) * (form.lotSize ?? 1)
    const trade: Trade = {
      id,
      date: form.date!, pair: form.pair||'', session: form.session||'', setup: form.setup||'',
      entry: form.entry||0, exit: form.exit||0, sl: form.sl||0, tp: form.tp||0,
      riskPct: form.riskPct||0, lotSize: form.lotSize||0, rr,
      pnl: Number(pnl.toFixed(2)), notes: form.notes||'', beforeImg, afterImg
    }
    dispatch({ type: editId ? 'edit-trade' : 'add-trade', trade })
    reset()
  }

  function edit(t: Trade) {
    setEditId(t.id)
    setForm(t)
  }

  function del(id: string) { dispatch({ type: 'delete-trade', id }) }

  return (
    <div className="grid cols-2">
      <div className="card">
        <h3>{editId ? 'Edit Trade' : 'Add Trade'}</h3>
        <form onSubmit={onSubmit} className="grid" style={{gap:10}}>
          <div className="row">
            <input className="input" type="date" value={form.date||''} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
            <input className="input" placeholder="Pair" value={form.pair||''} onChange={e=>setForm(f=>({...f,pair:e.target.value}))} />
            <input className="input" placeholder="Session" value={form.session||''} onChange={e=>setForm(f=>({...f,session:e.target.value}))} />
            <input className="input" placeholder="Setup type" value={form.setup||''} onChange={e=>setForm(f=>({...f,setup:e.target.value}))} />
          </div>
          <div className="row">
            <input className="input" type="number" step="0.0001" placeholder="Entry" value={form.entry??''} onChange={e=>setForm(f=>({...f,entry:Number(e.target.value)}))} />
            <input className="input" type="number" step="0.0001" placeholder="Exit" value={form.exit??''} onChange={e=>setForm(f=>({...f,exit:Number(e.target.value)}))} />
            <input className="input" type="number" step="0.0001" placeholder="Stop loss" value={form.sl??''} onChange={e=>setForm(f=>({...f,sl:Number(e.target.value)}))} />
            <input className="input" type="number" step="0.0001" placeholder="Take profit" value={form.tp??''} onChange={e=>setForm(f=>({...f,tp:Number(e.target.value)}))} />
          </div>
          <div className="row">
            <input className="input" type="number" step="0.1" placeholder="Risk %" value={form.riskPct??''} onChange={e=>setForm(f=>({...f,riskPct:Number(e.target.value)}))} />
            <input className="input" type="number" step="0.01" placeholder="Lot size" value={form.lotSize??''} onChange={e=>setForm(f=>({...f,lotSize:Number(e.target.value)}))} />
            <input className="input" disabled value={`RR ${rr}`} />
            <input className="input" disabled value={`PnL $${(((form.exit??0)-(form.entry??0))*(form.lotSize??0)).toFixed(2)}`} />
          </div>
          <textarea className="textarea" rows={3} placeholder="Notes" value={form.notes||''} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}></textarea>
          <div className="row">
            <div>
              <div className="muted">Upload before</div>
              <input ref={beforeRef} className="input" type="file" accept="image/*" />
            </div>
            <div>
              <div className="muted">Upload after</div>
              <input ref={afterRef} className="input" type="file" accept="image/*" />
            </div>
            <div style={{display:'flex',alignItems:'flex-end',gap:8}}>
              <button type="submit" className="btn primary">{editId ? 'Save' : 'Add Trade'}</button>
              {editId && <button type="button" className="btn" onClick={reset}>Cancel</button>}
            </div>
          </div>
        </form>
      </div>
      <div className="card">
        <h3>Trade Log</h3>
        <div style={{display:'flex',gap:8,marginBottom:8}}>
          <button className="btn" onClick={()=> exportCSV(state.trades)}>Export CSV</button>
          <button className="btn" onClick={()=> exportPDF(state.trades)}>Export PDF</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th><th>Pair</th><th>Session</th><th>Setup</th>
              <th>Entry</th><th>Exit</th><th>SL</th><th>TP</th>
              <th>Risk%</th><th>Lot</th><th>RR</th><th>P/L</th>
              <th>Notes</th><th>Before</th><th>After</th><th></th>
            </tr>
          </thead>
          <tbody>
            {state.trades.map(t => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.pair}</td>
                <td>{t.session}</td>
                <td>{t.setup}</td>
                <td>{t.entry}</td>
                <td>{t.exit}</td>
                <td>{t.sl}</td>
                <td>{t.tp}</td>
                <td>{t.riskPct}</td>
                <td>{t.lotSize}</td>
                <td>{t.rr}</td>
                <td style={{color:t.pnl>=0? 'var(--success)':'var(--danger)'}}>${t.pnl.toFixed(2)}</td>
                <td style={{maxWidth:200}}>{t.notes}</td>
                <td>{t.beforeImg && <img className="thumb" src={t.beforeImg} />}</td>
                <td>{t.afterImg && <img className="thumb" src={t.afterImg} />}</td>
                <td>
                  <button className="btn" onClick={()=> edit(t)}>Edit</button>
                  <button className="btn" onClick={()=> del(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

