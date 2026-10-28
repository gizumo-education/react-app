import { createBrowserRouter } from 'react-router-dom'
import { Top } from '../components/pages/Top'
import { Completed } from '../components/pages/completed'

export const router = createBrowserRouter([
  { path: '/', element: <Top /> },
  { path: '/completed', element: <Completed />}
])