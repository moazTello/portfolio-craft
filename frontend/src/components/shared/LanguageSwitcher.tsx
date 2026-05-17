'use client'

export function LanguageSwitcher({ current }: { current: string }) {
  function setLocale(l: string) {
    document.cookie = `locale=${l}; path=/; max-age=31536000`
    window.location.reload()
  }

  return (
    <div className="flex gap-1">
      {[
        { code: 'en', label: 'EN' },
        { code: 'ar', label: 'ع' },
        { code: 'de', label: 'DE' },
      ].map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={`text-xs px-2 py-1 rounded-lg transition ${
            current === code
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}