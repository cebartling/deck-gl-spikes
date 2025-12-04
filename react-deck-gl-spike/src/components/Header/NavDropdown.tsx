import { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface DropdownItem {
  label: string;
  to: string;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
}

export function NavDropdown({ label, items }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const location = useLocation();

  // Check if any dropdown item is active
  const isAnyItemActive = items.some((item) => location.pathname === item.to);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const openDropdown = useCallback(() => {
    setIsOpen(true);
    setFocusedIndex(0);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, closeDropdown]);

  // Close dropdown on route change
  useEffect(() => {
    closeDropdown();
  }, [location.pathname, closeDropdown]);

  // Focus management for dropdown items
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [isOpen, focusedIndex]);

  const handleButtonKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        event.preventDefault();
        openDropdown();
        break;
      case 'ArrowUp':
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex(items.length - 1);
        break;
      case 'Escape':
        closeDropdown();
        buttonRef.current?.focus();
        break;
    }
  };

  const handleItemKeyDown = (event: React.KeyboardEvent, _index: number) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Escape':
        event.preventDefault();
        closeDropdown();
        buttonRef.current?.focus();
        break;
      case 'Tab':
        closeDropdown();
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
    }
  };

  const handleItemClick = () => {
    closeDropdown();
  };

  const buttonClass = `px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1 ${
    isAnyItemActive
      ? 'bg-gray-700 text-white'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
  }`;

  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `block w-full px-4 py-2 text-sm transition-colors ${
      isActive
        ? 'bg-gray-600 text-white'
        : 'text-gray-300 hover:bg-gray-600 hover:text-white'
    }`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        className={buttonClass}
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        onKeyDown={handleButtonKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="spikes-dropdown-menu"
      >
        {label}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          id="spikes-dropdown-menu"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="spikes-dropdown-button"
          className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="py-1">
            {items.map((item, index) => (
              <NavLink
                key={item.to}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                to={item.to}
                role="menuitem"
                tabIndex={focusedIndex === index ? 0 : -1}
                className={itemClass}
                onClick={handleItemClick}
                onKeyDown={(e) => handleItemKeyDown(e, index)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
