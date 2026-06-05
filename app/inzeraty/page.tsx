'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function Inzeraty() {
  const [inzeraty, setInzeraty] = useState<any[]>([])
  const [filter, setFilter] = useState('vsetky')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  useEffect(() => {
    const fetchInzeraty = async () => {
      setLoading(true)
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
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <a href="/" className="text-xl font-bold text-indigo-600">Roomio</a>
        <div className="flex items-center gap-3">
          {user ? (
            <a href="/dashboard" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Môj účet</a>
          ) : (
            <>
              <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">Prihlásiť sa</a>
              <a href="/register" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Registrovať sa</a>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inzeráty na Slovensku</h1>
            <p className="text-sm text-gray-400 mt-1">{inzeraty.length} inzerátov</p>
          </div>
          <a href="/inzerat/novy" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            + Pridať inzerát
          </a>
        </div>

        <div className="flex gap-2 mb-8">
          {[
            { key: 'vsetky', label: 'Všetky' },
            { key: 'hladam', label: 'Hľadám izbu' },
            { key: 'ponukam', label: 'Ponúkam izbu' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f.key ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/4 mb-3"></div>
                <div className="h-6 bg-gray-100 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && inzeraty.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-4">🏠</p>
            <p className="text-gray-500 font-medium">Zatiaľ žiadne inzeráty</p>
            <a href="/inzerat/novy" className="mt-4 inline-block text-indigo-600 text-sm hover:underline">Pridaj prvý inzerát →</a>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {inzeraty.map(inzerat => (
            <a key={inzerat.id} href={"/inzerat/" + inzerat.id} className="block bg-white border border-gray-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${inzerat.typ === 'hladam' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {inzerat.typ === 'hladam' ? 'Hľadám izbu' : 'Ponúkam izbu'}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      📍 {inzerat.lokalita}
                    </span>
                  </div>
                  {inzerat.fotky && inzerat.fotky[0] && (
  <img src={inzerat.fotky[0]} className="w-full h-48 object-cover rounded-xl mb-3" />
)}
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 truncate">{inzerat.nazov}</h2>
                  <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{inzerat.popis}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold text-indigo-600">{inzerat.cena} €</p>
                  <p className="text-xs text-gray-400">/mesiac</p>
                  {inzerat.plocha_m2 && (
                    <p className="text-xs text-gray-400 mt-1">{inzerat.plocha_m2} m²</p>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                    {inzerat.profiles?.meno?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-xs text-gray-400">{inzerat.profiles?.meno || 'Anonymný užívateľ'}</span>
                </div>
                <span className="text-xs text-indigo-500 font-medium">Zobraziť detail →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}