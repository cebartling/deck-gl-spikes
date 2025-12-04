import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">deck.gl Spike Project</h1>
      <p className="text-lg text-gray-300 mb-8">
        A React + TypeScript spike project for experimenting with deck.gl
        visualization library.
      </p>
      <nav className="space-y-4">
        <Link
          to="/earthquakes"
          className="block text-blue-400 hover:text-blue-300 text-lg"
        >
          Earthquake Map Visualization
        </Link>
        <Link
          to="/about"
          className="block text-blue-400 hover:text-blue-300 text-lg"
        >
          About
        </Link>
      </nav>
    </div>
  );
}

export default Home;
