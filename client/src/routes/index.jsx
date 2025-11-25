import { createBrowserRouter } from 'react-router-dom' //ルーティング設定

import { Top } from '../components/pages/Top'
import { Completed } from '../components/pages/Completed'

export const router = createBrowserRouter([
  { path: '/', element: <Top /> },

  //section20 練習問題 オブジェクト追加
  { path: '/completed', element: <Completed /> }
])