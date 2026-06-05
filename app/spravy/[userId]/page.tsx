'use client'
import { useState, useEffect, use } from 'react'
import { supabase } from '../../supabase'

export default function Spravy({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const [user, setUser] = useState<any>(null)
  const [druhaOsoba, setDruhaOsoba] = useState<any>(null)
  const [spravy, setSpravy] = useState<any[]>([])
  const [novaSprava, setNovaSprava] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)

      const { data: profil } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setDruhaOsoba(profil)

      const { data: spravy } = await supabase
        .from('spravy')
        .select('*')
        .or(`od_user_id.eq.${user.id},pre_user_id.eq.${user.id}`)
        .or(`od_user_id.eq.${userId},pre_user_id.eq.${userId}`)
        .order('created_at', { ascending: true })
      setSpravy(spravy || [])
    }
    fetchData()
  }, [userId])

  const poslat = async () => {
    if (!novaSprava.trim()) return
    setLoading(true)
    const { data, error } = await supabase.from('spravy').insert({
      od_user_id: user.id,
      pre_user_id: userId,
      obsah: novaSprava,
    }).select().single()

    if (!error && data) {
      setSpravy([...spravy, data])
      setNovaSprava('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <a href="/" className="text-xl font-bold text-indigo-600">Roomio</a>
        <a href="/inzeraty" className="text-sm text-gray-500 hover:text-gray-900">← Späť</a>
      </nav>

      <main className="max-w-2xl mx-auto px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-medium text-indigo-600">
            {druhaOsoba?.meno?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{druhaOsoba?.meno || 'Používateľ'}</p>
            {druhaOsoba?.povolanie && <p className="text-xs text-gray-400">{druhaOsoba.povolanie}</p>}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4 min-h-64 flex flex-col gap-3">
          {spravy.length === 0 && (
            <p className="text-gray-400 text-sm text-center my-auto">Zatiaľ žiadne správy. Napíš prvú!</p>
          )}
          {spravy.map(s => (
            <div key={s.id} className={`flex ${s.od_user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${s.od_user_id === user?.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                {s.obsah}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Napíš správu..."
            value={novaSprava}
            onChange={e => setNovaSprava(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && poslat()}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-400"
          />
          <button
            onClick={poslat}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            Poslať
          </button>
        </div>
      </main>
    </div>
  )
}