import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom' //React Routerのルーティングを適用するためのコンポーネント
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { router } from './routes'
import './styles/reset.css'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render( //htmlに表示する処理
  <>
    <ToastContainer />
    <RouterProvider router={router} />
  </>
)
