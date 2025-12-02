export function MapContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen min-h-[400px] md:min-h-[600px]">
      {children}
    </div>
  );
}
