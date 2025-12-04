import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="text-white p-8">
      <h1 className="text-4xl font-bold mb-6">deck.gl Spike Project</h1>
      <p className="text-lg text-gray-300 mb-8">
        A React + TypeScript spike project for experimenting with deck.gl
        visualization library.
      </p>
      <div className="mt-8">
        <Link
          to="/earthquakes"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          View Earthquake Map
        </Link>
      </div>
    </div>
  );
}

export default Home;
