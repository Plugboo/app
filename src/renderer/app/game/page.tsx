import { Transition } from '@tailwindui/react'
import { useEffect, useState } from 'react'
import { getProfiles } from '../../api/game'

export default function GamePage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfiles().then((result) => {
      setProfiles(result)
      setLoading(false)
    })
  }, [])

  return (
    <main className="max-w-7xl min-h-screen mx-auto overflow-hidden">
      <Transition
        show={!loading}
        enter="transition-all duration-600 ease-in-out"
        enterFrom="opacity-0 mt-12 pointer-events-none"
        enterTo="opacity-100 mb-0 pointer-events-none"
      >
        <div className="flex flex-col gap-8">
          <div className="relative w-full h-64 mt-[26px]">
            <div className="absolute bottom-0 left-0 w-full h-64 bg-linear-to-t z-1 from-background-900 via-background-900/70 to-background-900/0" />
            <img
              className="w-full h-full object-cover rounded-t-xl"
              src="https://www.lolchampion.de/_wordpress_dev716a/wp-content/2021-riot-daten/skins/Gragas_2.jpg"
            />
            <h1 className="absolute bottom-12 left-12 font-semibold text-4xl z-2">Select profile</h1>
          </div>
          <div className='flex flex-col gap-2'>
            {profiles.map((profile) => (
              <div className="p-5 bg-background-800/40 rounded-lg hover:bg-background-800/55 transition-colors duration-200 ease-in-out cursor-pointer" key={profile.id}>
                <p>{profile.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Transition>
    </main>
  )
}
