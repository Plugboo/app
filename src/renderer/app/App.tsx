import { HashRouter as Router } from 'react-router'
import TopBar from '@renderer/components/app/TopBar'
import Notifications from '@renderer/components/app/Notifications'
import PageLayout from '@renderer/app/PageLayout'
import Layout from '@renderer/app/Layout'
import Routes from '@renderer/app/Routes'

export default function App() {
    return (
        <Router>
            <Layout>
                <TopBar />
                <PageLayout>
                    <Routes />
                </PageLayout>
                <Notifications />
            </Layout>
        </Router>
    )
}
