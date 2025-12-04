export function MapContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[600px]">
      {children}
    </div>
  );
}
