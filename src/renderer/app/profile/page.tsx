import { useEffect, useState } from 'react'
import { GameProfile } from '@common/games'
import { Transition } from '@tailwindui/react'
import { FileQuestionMark } from 'lucide-react'
import { useParams } from 'react-router'
import { getProfile } from '@renderer/api/game'

export default function ProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState<GameProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile(id).then((result) => {
      setProfile(result)
      setLoading(false)
    })
  }, [id])

  /*
   * Render nothing when no current profile is set.
   */
  if (profile === null && !loading) {
    return null
  }

  return <main className="w-full px-4 pt-12 overflow-hidden">
    <Transition
      show={!loading}
      enter="transition-opacity duration-500 ease-in-out"
      enterFrom="opacity-0 pointer-events-none"
      enterTo="opacity-100 pointer-events-none"
    >
      {profile && (
        <div className="flex flex-col gap-5">
          <h1 className="font-bold text-3xl">{profile.name}</h1>
          <div className="w-full bg-background-800 h-[2px]" />

          <div className="w-full rounded-2xl bg-background-800 min-h-16 border-2 border-background-700/80">
            {profile.mods.length === 0 && (
              <div className="flex flex-col gap-4 items-center justify-center h-32">
                <div className="flex flex-row items-center gap-2">
                  <FileQuestionMark />
                  <h1 className="font-semibold text-2xl">No Mods installed</h1>
                </div>
                <h2 className="font-medium text-xl brightness-75">It seems that no mods are installed on this
                  profile.</h2>
              </div>
            )}

            {profile.mods.map((mod) => (
              <div className="w-full h-16" key={mod.id}>
                <p>{mod.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Transition>
  </main>
}
