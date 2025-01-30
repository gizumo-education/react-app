import { createBrowserRouter } from 'react-router-dom' //React Routerのルーティングを設定する関数

import { Top } from '../components/pages/Top'

import { Completed } from '../components/pages/Completed'

export const router = createBrowserRouter([
  { path: '/', element: <Top />},
  { path: '/completed', element: <Completed/>}
]) //createBrowserRouter関数の引数にオブジェクトの配列を渡すことで、ルーティングの設定が可能になる