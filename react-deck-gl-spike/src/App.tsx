import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Earthquakes from './pages/Earthquakes';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/earthquakes" element={<Earthquakes />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
