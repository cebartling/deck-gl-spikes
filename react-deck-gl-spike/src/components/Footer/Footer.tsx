function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-12">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Pintail Consulting LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
