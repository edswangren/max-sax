import { createHashRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './components/Landing'
import TopicList from './components/TopicList'
import PracticeSession from './components/PracticeSession'
import SessionHistory from './components/SessionHistory'
import WeakSpots from './components/WeakSpots'
import Settings from './components/Settings'
import Metronome from './components/Metronome'

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'category/:catId', element: <TopicList /> },
      { path: 'practice/:topicId', element: <PracticeSession /> },
      { path: 'history', element: <SessionHistory /> },
      { path: 'weak-spots', element: <WeakSpots /> },
      { path: 'settings', element: <Settings /> },
      { path: 'metronome', element: <Metronome /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
