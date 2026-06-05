export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <span className="text-xl font-bold text-indigo-600">Roomio</span>
        <div className="flex gap-3">
          <a href="/login" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
            Prihlásiť sa
          </a>
          <a href="/register" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Registrovať sa
          </a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Nájdi spolubývajúceho<br />
          <span className="text-indigo-600">v Bratislave</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Prehľadná alternatíva k Facebook skupinám. Profily, fotky, filtre — všetko na jednom mieste.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/hladam" className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-medium hover:bg-indigo-700">
            Hľadám izbu
          </a>
          <a href="/ponukam" className="px-8 py-4 border border-gray-200 text-gray-700 rounded-xl text-lg font-medium hover:bg-gray-50">
            Ponúkam izbu
          </a>
        </div>
      </main>
    </div>
  );
}