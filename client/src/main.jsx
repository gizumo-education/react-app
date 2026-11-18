import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { router } from './routes'
import './styles/reset.css'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ToastContainer />
    <RouterProvider router={router} />
  </>
)

// createBrowserRouterで定義したrouterをReactアプリに適用し
// 対応する画面を表示するコンポーネント
// Topを削除して置き換えたのはrouterに分割代入されているため
