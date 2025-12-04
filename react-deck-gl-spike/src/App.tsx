import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Earthquakes from './pages/Earthquakes';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/earthquakes" element={<Earthquakes />} />
    </Routes>
  );
}

export default App;
