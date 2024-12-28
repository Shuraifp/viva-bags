import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import ScrollToHash from './components/ScrollToHash.jsx'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'


createRoot(document.getElementById('root')).render(
  <Provider store={store}> 
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ScrollToHash />
        <Toaster />
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
