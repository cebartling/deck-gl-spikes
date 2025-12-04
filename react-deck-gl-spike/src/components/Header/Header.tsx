import { NavLink } from 'react-router-dom';
import { NavDropdown } from './NavDropdown';

const SPIKES_ITEMS = [
  { label: 'Earthquakes', to: '/earthquakes' },
  { label: 'County Voting', to: '/county-voting' },
];

function Header() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-gray-700 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-gray-800 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-white font-bold text-lg">deck.gl Spike</span>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            <NavDropdown label="Spikes" items={SPIKES_ITEMS} />
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
