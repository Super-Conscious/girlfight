import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Splash from './Splash'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/splash" element={<Splash />} />
      </Routes>
    </BrowserRouter>
  )
}
