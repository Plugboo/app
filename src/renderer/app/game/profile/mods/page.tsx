import { Link, useParams } from 'react-router'
import React, { useEffect, useState } from 'react'
import { searchMods } from '@renderer/api/mods'
import { Mod } from '@common/service'
import Input from '@renderer/components/Input'
import Button from '@renderer/components/Button'
import { Download, Eye, Heart, LoaderCircle, MessageCircle, RefreshCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import Dropdown from '@renderer/components/Dropdown'

export default function ModsPage() {
  const { gameId, profileId } = useParams()

  const [records, setRecords] = useState<Mod[]>([])
  const [loading, setLoading] = useState(true)

  const [lastInput, setLastInput] = useState('')
  const [input, setInput] = useState('')
  const [sort, setSort] = useState<'new' | 'default' | 'updated'>('default')

  const search = (force: boolean) => {
    if ((loading && !force) || (!force && input === lastInput)) {
      return
    }

    setLoading(true)
    setLastInput(input)
    searchMods(gameId, {
      query: input,
      sort: sort
    }).then((result) => {
      setRecords(result)
      setLoading(false)
    })
  }

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      search(false)
    }
  }

  useEffect(() => {
    search(true)
  }, [gameId])

  return <main className="w-full h-full px-4 pt-12 overflow-hidden overflow-y-auto pb-4">
    <motion.div className="flex flex-col gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex gap-2.5">
        <Input classNames={{
          wrapper: 'w-full'
        }} placeholder="Search mods..." value={input} onChange={(e) => setInput(e.target.value)}
               onKeyDown={onInputKeyDown} />
        <Button type="secondary" onClick={() => search(true)} disabled={loading}>
          <RefreshCcw className={loading ? 'animate-[spin_2s_linear_infinite_reverse]' : ''} />
        </Button>
      </div>

      <div className="flex gap-4 w-full overflow-hidden">
        <div className="p-4 bg-background-800 w-48 shrink-0 rounded-2xl grow-0 flex-none h-[0%]">
          <Dropdown values={[
            {
              value: 'default',
              label: 'Default'
            },
            {
              value: 'new',
              label: 'Newest'
            },
            {
              value: 'updated',
              label: 'Updated'
            }
          ]} onSelect={(value) => {
            setSort(value as any)
            search(true)
          }} />
        </div>
        <div className="w-full">
          {loading && (
            <div className="flex gap-1.5 justify-center items-center p-4 bg-background-800/20 rounded-2xl w-full h-32">
              <LoaderCircle className="animate-spin" />
              <h1>Loading</h1>
            </div>
          )}

          {!loading && records.length === 0 && (
            <div className="flex gap-1.5 justify-center items-center p-4 bg-background-800/20 rounded-2xl w-full h-32">
              <h1>No results found for your query!</h1>
            </div>
          )}

          {!loading && records.length > 0 && (
            <div className="w-full flex flex-col gap-4 h-full">
              {records.map((record: Mod, index) => (
                <motion.div
                  className="w-full h-30 bg-background-800 p-4 rounded-xl drop-shadow-2xl brightness-100 hover:brightness-90 transition-all duration-100 cursor-pointer"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{
                  delay: 0.085 * index
                }}>
                  <Link
                    className="w-full h-full flex gap-4 overflow-hidden"
                    key={record.id}
                    to={`/game/${gameId}/profile/${profileId}/mods/${record.id}`}>
                    <div className="w-32 h-full overflow-hidden rounded-lg shrink-0">
                      <img className={`w-full h-full object-cover ${record.nsfw ? 'blur-sm' : ''}`}
                           src={record.media[0].url}
                           alt={`${record.name}'s screenshot`} />
                    </div>
                    <div className="flex flex-col justify-between min-w-0 overflow-hidden">
                      <div className="flex flex-row gap-1.5">
                        <p className="font-bold text-xl text-nowrap">{record.name}</p>
                        <p className="font-medium text-lg text-text-500 text-nowrap">{`by ${record.author.name}`}</p>
                      </div>
                      <div className="flex gap-1.5 flex-none">
                        {record.nsfw && (
                          <p
                            className="px-2 py-0.5 text-sm rounded-lg text-red-400 min-w-0 bg-red-600/30 grow-0 flex-none flex flex-row gap-4">
                            NSFW
                          </p>
                        )}
                        {record.tags.map((tag: string) => (
                          <p
                            className="px-2 py-0.5 text-sm rounded-lg text-secondary-300 min-w-0 bg-secondary-600/30 grow-0 flex-none flex flex-row gap-4"
                            key={tag}>
                            {tag}
                          </p>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <div className="flex gap-1 items-center">
                          <Heart className="w-4 h-4 text-red-400" />
                          <p className="text-text-400 font-semibold">{record.likes}</p>
                        </div>
                        <div className="flex gap-1 items-center">
                          <MessageCircle className="w-4 h-4 text-primary-400" />
                          <p className="text-text-400 font-semibold">{record.comments}</p>
                        </div>
                        <div className="flex gap-1 items-center">
                          <Eye className="w-4 h-4 text-secondary-200 mt-0.5" />
                          <p className="text-text-400 font-semibold">{record.views}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto h-full flex flex-col gap-2 shrink-0">
                      <Button className="mt-auto flex gap-2">
                        <Download />
                        Install
                      </Button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  </main>
}