'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

export default function NovyInzerat() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    typ: 'hladam',
    nazov: '',
    popis: '',
    cena: '',
    plocha_m2: '',
    lokalita: 'Staré Mesto',
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
    }
    getUser()
  }, [])

  const handleSubmit = async () => {
    if (!form.nazov || !form.popis || !form.cena) {
      setMessage('Vyplň všetky povinné polia')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('inzeraty').insert({
      user_id: user.id,
      typ: form.typ,
      nazov: form.nazov,
      popis: form.popis,
      cena: parseInt(form.cena),
      plocha_m2: parseInt(form.plocha_m2) || null,
      lokalita: form.lokalita,
    })
    if (error) { setMessage(error.message); setLoading(false); return }
    window.location.href = '/inzeraty'
    setLoading(false)
  }

  const lokality = ['Staré Mesto', 'Ružinov', 'Petržalka', 'Nové Mesto', 'Dúbravka', 'Karlova Ves', 'Rača', 'Vajnory']

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <a href="/dashboard" className="text-xl font-bold text-indigo-600">Roomio</a>
        <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">← Späť</a>
      </nav>

      <main className="max-w-2xl mx-auto px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Nový inzerát</h1>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Typ inzerátu</label>
            <div className="flex gap-3">
              <button
                onClick={() => setForm({...form, typ: 'hladam'})}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${form.typ === 'hladam' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600'}`}
              >
                Hľadám izbu
              </button>
              <button
                onClick={() => setForm({...form, typ: 'ponukam'})}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${form.typ === 'ponukam' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600'}`}
              >
                Ponúkam izbu
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Názov inzerátu *</label>
            <input
              type="text"
              placeholder="napr. Hľadám izbu v centre BA"
              value={form.nazov}
              onChange={e => setForm({...form, nazov: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Popis *</label>
            <textarea
              placeholder="Opíš čo hľadáš alebo čo ponúkaš..."
              value={form.popis}
              onChange={e => setForm({...form, popis: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Cena (€/mesiac) *</label>
              <input
                type="number"
                placeholder="napr. 450"
                value={form.cena}
                onChange={e => setForm({...form, cena: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Plocha (m²)</label>
              <input
                type="number"
                placeholder="napr. 18"
                value={form.plocha_m2}
                onChange={e => setForm({...form, plocha_m2: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Lokalita</label>
            <select
              value={form.lokalita}
              onChange={e => setForm({...form, lokalita: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
            >
              {lokality.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>

          {message && <p className="text-sm text-red-500">{message}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Ukladám...' : 'Zverejniť inzerát'}
          </button>
        </div>
      </main>
    </div>
  )
}