import { createBrowserRouter } from 'react-router-dom'
import { Completed } from '../components/pages/Completed'
import { Top } from '../components/pages/Top'
export const router = createBrowserRouter([
  { path: '/', element: <Top /> },
  {path: '/completed', element: <Completed /> },
])