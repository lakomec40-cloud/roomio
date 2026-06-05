'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profile)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <span className="text-xl font-bold text-indigo-600">Roomio</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Ahoj, {profile?.meno || user.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Odhlásiť sa
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Môj dashboard</h1>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <a href="/inzerat/novy" className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 transition-colors">
            <div className="text-2xl mb-2">🏠</div>
            <h2 className="font-semibold text-gray-900">Pridať inzerát</h2>
            <p className="text-sm text-gray-500 mt-1">Ponúkni izbu alebo hľadaj spolubývajúceho</p>
          </a>
          <a href="/inzeraty" className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 transition-colors">
            <div className="text-2xl mb-2">🔍</div>
            <h2 className="font-semibold text-gray-900">Hľadať izbu</h2>
            <p className="text-sm text-gray-500 mt-1">Prezri si dostupné inzeráty v Bratislave</p>
          </a>
        </div>

        <div className="p-6 bg-white border border-gray-100 rounded-2xl">
          <h2 className="font-semibold text-gray-900 mb-4">Môj profil</h2>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <p><span className="text-gray-400">Meno:</span> {profile?.meno || '—'}</p>
            <p><span className="text-gray-400">Email:</span> {user.email}</p>
            <p><span className="text-gray-400">Mesto:</span> {profile?.mesto || 'Bratislava'}</p>
          </div>
          <a href="/profil/upravit" className="inline-block mt-4 text-sm text-indigo-600 hover:underline">
            Upraviť profil →
          </a>
        </div>
      </main>
    </div>
  )
}