import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SplitPdf from './pages/SplitPdf'
import MergePdf from './pages/MergePdf'
import EditPdf from './pages/EditPdf'
import { Footer } from './components/layout'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/split-pdf" element={<SplitPdf />} />
            <Route path="/merge-pdf" element={<MergePdf />} />
            <Route path="/edit-pdf" element={<EditPdf />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}
