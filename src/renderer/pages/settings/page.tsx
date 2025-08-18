import { motion } from 'framer-motion'

export default function SettingsPage() {
    return (
        <motion.main className="w-full p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-bold text-3xl">Settings</h1>
        </motion.main>
    )
}
