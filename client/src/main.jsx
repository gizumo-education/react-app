import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import { RecoilRoot } from 'recoil'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import 'react-toastify/dist/ReactToastify.css'
import './styles/reset.css'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <RecoilRoot>
    <ToastContainer />
    <RouterProvider router = {router} />
  </RecoilRoot>
)
