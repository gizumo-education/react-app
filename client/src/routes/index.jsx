import { createBrowserRouter } from 'react-router-dom'

import { Top } from '../components/pages/Top'
import { Completed } from '../components/pages/Completed'

// createBrowserRouterはURLと表示するコンポーネントの対応表を作っている
export const router = createBrowserRouter([
  { path: '/', element: <Top /> },
  { path: '/completed', element: <Completed /> },
])
