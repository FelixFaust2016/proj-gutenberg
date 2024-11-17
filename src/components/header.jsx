export const Header = ({ children }) => {
  return (
    <header className="w-full h-auto lg:h-20 md:h-20 py-5 md:py-0 lg:py-0 bg-white fixed top-0 z-50">
      {children}
    </header>
  );
};
