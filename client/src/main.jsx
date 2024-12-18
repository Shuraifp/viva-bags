import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import ScrollToHash from './components/ScrollToHash.jsx'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <ScrollToHash />
    <Toaster />
    <App />
    </BrowserRouter>
)
