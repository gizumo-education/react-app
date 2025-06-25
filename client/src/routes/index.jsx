import { createBrowserRouter } from 'react-router-dom'

import { Top } from '../components/pages/Top'
import { Completed } from '../components/pages/Completed'

// pathプロパティには、ルーティングのパスを文字列で指定
// elementプロパティには、pathプロパティで指定したパスに
// アクセスしたときに表示するコンポーネントを指定。
export const router = createBrowserRouter([
  { path: '/', element: <Top /> },
  { path: '/Completed', element: <Completed />}
])