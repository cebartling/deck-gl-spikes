import type { ReactNode } from 'react';

interface MapContainerProps {
  children: ReactNode;
}

export function MapContainer({ children }: MapContainerProps) {
  return (
    <div className="w-full h-full" data-testid="map-container">
      {children}
    </div>
  );
}
