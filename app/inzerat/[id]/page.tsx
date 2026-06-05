'use client'
import { useState, useEffect, use } from 'react'
import { supabase } from '../../supabase'

export default function InzeratDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [inzerat, setInzerat] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data } = await supabase
        .from('inzeraty')
        .select('*, profiles(meno, fotka_url, povolanie, vek, o_mne)')
        .eq('id', id)
        .single()

      setInzerat(data)
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Načítavam...</p>
    </div>
  )

  if (!inzerat) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Inzerát neexistuje</p>
    </div>
  )

  const spravy_href = "/spravy/" + inzerat.user_id

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <a href="/" className="text-xl font-bold text-indigo-600">Roomio</a>
        <a href="/inzeraty" className="text-sm text-gray-500 hover:text-gray-900">← Späť na inzeráty</a>
      </nav>

      <main className="max-w-3xl mx-auto px-8 py-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={inzerat.typ === 'hladam' ? 'text-xs px-2 py-1 rounded-full font-medium bg-blue-50 text-blue-600' : 'text-xs px-2 py-1 rounded-full font-medium bg-green-50 text-green-600'}>
              {inzerat.typ === 'hladam' ? 'Hľadám izbu' : 'Ponúkam izbu'}
            </span>
            <span className="text-xs text-gray-400">{inzerat.lokalita}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{inzerat.nazov}</h1>

          <div className="flex gap-6 mb-6">
            <div>
              <p className="text-3xl font-bold text-indigo-600">{inzerat.cena} €</p>
              <p className="text-xs text-gray-400">/mesiac</p>
            </div>
            {inzerat.plocha_m2 && (
              <div>
                <p className="text-3xl font-bold text-gray-700">{inzerat.plocha_m2}</p>
                <p className="text-xs text-gray-400">m²</p>
              </div>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{inzerat.popis}</p>
          {inzerat.fotky && inzerat.fotky.length > 0 && (
  <div className="flex gap-3 mt-6 flex-wrap">
    {inzerat.fotky.map((url: string, i: number) => (
      <img key={i} src={url} className="w-full rounded-xl object-cover max-h-80" />
    ))}
  </div>
)}
        </div>
{user && user.id === inzerat.user_id && (
  <button
    onClick={async () => {
      if (!confirm('Naozaj chceš odstrániť tento inzerát?')) return
      await supabase.from('inzeraty').delete().eq('id', inzerat.id)
      window.location.href = '/inzeraty'
    }}
    className="mt-6 px-4 py-2 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50"
  >
    Odstrániť inzerát
  </button>
)}
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="font-semibold text-gray-900 mb-4">O inzerentovi</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-medium text-indigo-600">
              {inzerat.profiles?.meno?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-medium text-gray-900">{inzerat.profiles?.meno || 'Anonymný užívateľ'}</p>
              {inzerat.profiles?.povolanie && <p className="text-sm text-gray-500">{inzerat.profiles.povolanie}</p>}
              {inzerat.profiles?.vek && <p className="text-sm text-gray-500">{inzerat.profiles.vek} rokov</p>}
            </div>
          </div>
          {inzerat.profiles?.o_mne && <p className="text-gray-600 text-sm">{inzerat.profiles.o_mne}</p>}

          {user && user.id !== inzerat.user_id && (
            <a href={spravy_href} className="mt-6 w-full block text-center py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
              Napísať správu
            </a>
          )}

          {!user && (
            <a href="/login" className="mt-6 w-full block text-center py-3 border border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50">
              Prihlásiť sa pre kontakt
            </a>
          )}
        </div>
      </main>
    </div>
  )
}