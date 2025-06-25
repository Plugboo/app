import { Transition } from '@tailwindui/react'
import { useEffect, useState } from 'react'
import { getProfiles, selectProfile } from '../../api/game'
import { useNavigate } from 'react-router'
import { GameProfile } from '@common/games'

export default function GamePage() {
  const navigate = useNavigate()
  const [profiles, setProfiles] = useState<GameProfile[]>([])
  const [loading, setLoading] = useState(true)

  const onClickProfile = (id: string) => {
    selectProfile(id).then((result) => {
      if (result) {
        setLoading(true)
        navigate('/profile')
      }
    })
  }

  useEffect(() => {
    getProfiles().then((result) => {
      setProfiles(result)
      setLoading(false)
    })
  }, [])

  return (
    <main className="w-full min-h-screen mx-8 overflow-hidden">
      <Transition
        show={!loading}
        enter="transition-opacity duration-500 ease-in-out"
        enterFrom="opacity-0 pointer-events-none"
        enterTo="opacity-100 pointer-events-none"
      >
        <div className="flex flex-col gap-8">
          <div className="relative w-full h-64 mt-[26px]">
            <div
              className="absolute bottom-0 left-0 w-full h-64 bg-linear-to-t z-1 from-background-900 via-background-900/70 to-background-900/0" />
            <img
              className="w-full h-full object-cover rounded-t-xl"
              src="https://www.lolchampion.de/_wordpress_dev716a/wp-content/2021-riot-daten/skins/Gragas_2.jpg"
              alt={'Banner Test'} />
            <h1 className="absolute bottom-12 left-12 font-semibold text-4xl z-2">Select profile</h1>
          </div>
          <div className="flex flex-col gap-2">
            {profiles.map((profile) => (
              <div
                className="p-5 bg-background-800/40 border-background-700 hover:border-primary-500 transition-color border-2 transition-colors rounded-lg duration-200 ease-in-out cursor-pointer"
                key={profile.id}
                onClick={() => onClickProfile(profile.id)}
              >
                <h2 className="font-semibold text-xl">{profile.name}</h2>
              </div>
            ))}
          </div>
        </div>
      </Transition>
    </main>
  )
}
