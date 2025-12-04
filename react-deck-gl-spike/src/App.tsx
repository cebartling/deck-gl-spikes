import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Earthquakes from './pages/Earthquakes';
import './App.css';

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/earthquakes" element={<Earthquakes />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
