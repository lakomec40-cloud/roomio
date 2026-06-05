'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Inzeraty() {
  const [inzeraty, setInzeraty] = useState<any[]>([])
  const [filter, setFilter] = useState('vsetky')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInzeraty = async () => {
      let query = supabase
        .from('inzeraty')
        .select('*, profiles(meno, fotka_url)')
        .order('created_at', { ascending: false })

      if (filter !== 'vsetky') {
        query = query.eq('typ', filter)
      }

      const { data } = await query
      setInzeraty(data || [])
      setLoading(false)
    }
    fetchInzeraty()
  }, [filter])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <a href="/" className="text-xl font-bold text-indigo-600">Roomio</a>
        <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Môj účet</a>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Inzeráty v Bratislave</h1>
          <a href="/inzerat/novy" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
            + Pridať inzerát
          </a>
        </div>

        <div className="flex gap-2 mb-8">
          {['vsetky', 'hladam', 'ponukam'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'}`}
            >
              {f === 'vsetky' ? 'Všetky' : f === 'hladam' ? 'Hľadám izbu' : 'Ponúkam izbu'}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-400 text-center py-12">Načítavam...</p>}

        {!loading && inzeraty.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Žiadne inzeráty</p>
            <a href="/inzerat/novy" className="mt-4 inline-block text-indigo-600 hover:underline">Pridaj prvý inzerát →</a>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {inzeraty.map(inzerat => (
            <a key={inzerat.id} href={`/inzerat/${inzerat.id}`} className="block bg-white border border-gray-100 rounded-2xl p-6 hover:border-indigo-200 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${inzerat.typ === 'hladam' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                      {inzerat.typ === 'hladam' ? 'Hľadám izbu' : 'Ponúkam izbu'}
                    </span>
                    <span className="text-xs text-gray-400">{inzerat.lokalita}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">{inzerat.nazov}</h2>
                  <p className="text-gray-500 text-sm line-clamp-2">{inzerat.popis}</p>
                </div>
                <div className="text-right ml-6">
                  <p className="text-xl font-bold text-indigo-600">{inzerat.cena} €</p>
                  <p className="text-xs text-gray-400">/mesiac</p>
                  {inzerat.plocha_m2 && <p className="text-xs text-gray-400 mt-1">{inzerat.plocha_m2} m²</p>}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                  {inzerat.profiles?.meno?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="text-xs text-gray-400">{inzerat.profiles?.meno || 'Anonymný užívateľ'}</span>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}