'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

export default function UpravitProfil() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    meno: '',
    vek: '',
    povolanie: '',
    o_mne: '',
    mesto: 'Bratislava',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setForm({
          meno: data.meno || '',
          vek: data.vek || '',
          povolanie: data.povolanie || '',
          o_mne: data.o_mne || '',
          mesto: data.mesto || 'Bratislava',
        })
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        meno: form.meno,
        vek: parseInt(form.vek) || null,
        povolanie: form.povolanie,
        o_mne: form.o_mne,
        mesto: form.mesto,
      })
      .eq('id', user.id)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Profil uložený!')
      setTimeout(() => window.location.href = '/dashboard', 1000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <a href="/dashboard" className="text-xl font-bold text-indigo-600">Roomio</a>
        <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">← Späť</a>
      </nav>

      <main className="max-w-2xl mx-auto px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Upraviť profil</h1>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col gap-6">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-medium text-indigo-600">
            {form.meno?.[0]?.toUpperCase() || '?'}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Meno</label>
            <input
              type="text"
              placeholder="Tvoje meno"
              value={form.meno}
              onChange={e => setForm({...form, meno: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Vek</label>
              <input
                type="number"
                placeholder="napr. 25"
                value={form.vek}
                onChange={e => setForm({...form, vek: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Povolanie</label>
              <input
                type="text"
                placeholder="napr. Programátor"
                value={form.povolanie}
                onChange={e => setForm({...form, povolanie: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">O mne</label>
            <textarea
              placeholder="Napíš niečo o sebe — životný štýl, záujmy, čo hľadáš v spolubývajúcom..."
              value={form.o_mne}
              onChange={e => setForm({...form, o_mne: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400 resize-none"
            />
          </div>

          {message && (
            <p className={`text-sm text-center ${message.includes('!') ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Ukladám...' : 'Uložiť profil'}
          </button>
        </div>
      </main>
    </div>
  )
}