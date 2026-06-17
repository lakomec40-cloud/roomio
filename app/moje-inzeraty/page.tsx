'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function MojeInzeraty() {
  const [inzeraty, setInzeraty] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)

      const { data } = await supabase
        .from('inzeraty')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setInzeraty(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const odstranit = async (id: string) => {
    if (!confirm('Naozaj chceš odstrániť tento inzerát?')) return
    await supabase.from('inzeraty').delete().eq('id', id)
    setInzeraty(inzeraty.filter(i => i.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <a href="/" className="text-xl font-bold text-indigo-600">Roomio</a>
        <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">← Späť na dashboard</a>
      </nav>

      <main className="max-w-3xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Moje inzeráty</h1>
          <a href="/inzerat/novy" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
            + Nový inzerát
          </a>
        </div>

        {loading && <p className="text-gray-400 text-center py-12">Načítavam...</p>}

        {!loading && inzeraty.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400">Zatiaľ nemáš žiadne inzeráty</p>
            <a href="/inzerat/novy" className="mt-4 inline-block text-indigo-600 text-sm hover:underline">Pridaj prvý inzerát →</a>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {inzeraty.map(inzerat => (
            <div key={inzerat.id} className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <a href={"/inzerat/" + inzerat.id} className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inzerat.typ === 'hladam' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {inzerat.typ === 'hladam' ? 'Hľadám' : 'Ponúkam'}
                    </span>
                    <span className="text-xs text-gray-400">{inzerat.lokalita}</span>
                  </div>
                  <h2 className="font-semibold text-gray-900 hover:text-indigo-600">{inzerat.nazov}</h2>
                  <p className="text-sm text-gray-400 mt-1">{inzerat.cena} €/mesiac</p>
                </a>
                <button
                  onClick={() => odstranit(inzerat.id)}
                  className="px-3 py-2 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 flex-shrink-0"
                >
                  Odstrániť
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}