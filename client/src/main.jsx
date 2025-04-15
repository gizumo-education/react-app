import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Top } from './components/pages/Top'
import './styles/reset.css'
import './styles/globals.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ToastContainer />
    <RouterProvider router = {router} />
  </>
)
