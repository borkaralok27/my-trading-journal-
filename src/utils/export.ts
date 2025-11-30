import { jsPDF } from 'jspdf'
import type { Trade } from '../store/data'

export function exportCSV(trades: Trade[]) {
  const headers = ['Date','Pair','Session','Setup','Entry','Exit','SL','TP','Risk%','Lot','RR','PnL','Notes']
  const rows = trades.map(t => [t.date, t.pair, t.session, t.setup, t.entry, t.exit, t.sl, t.tp, t.riskPct, t.lotSize, t.rr, t.pnl, t.notes?.replace(/\n/g,' ')||''])
  const csv = [headers.join(','), ...rows.map(r=> r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'trades.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function exportPDF(trades: Trade[]) {
  const doc = new jsPDF({ orientation: 'landscape' })
  doc.setFont('helvetica','normal')
  doc.setFontSize(14)
  doc.text('Alok Trading Journal — Trade Report', 14, 18)
  doc.setFontSize(10)
  const headers = ['Date','Pair','Session','Setup','Entry','Exit','SL','TP','Risk%','Lot','RR','PnL']
  let y = 30
  doc.text(headers.join('  |  '), 14, y)
  y += 6
  trades.forEach(t => {
    const row = [t.date, t.pair, t.session, t.setup, t.entry, t.exit, t.sl, t.tp, t.riskPct, t.lotSize, t.rr, t.pnl].join('  |  ')
    doc.text(row, 14, y)
    y += 6
    if (y > 190) { doc.addPage(); y = 20 }
  })
  doc.save('trades.pdf')
}

