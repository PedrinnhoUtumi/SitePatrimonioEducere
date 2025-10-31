export function Pagina({ children, row = false, className = "" }) {
  return (
    <div
      className={`min-h-screen flex flex-col flex-1 w-full ${className}`}
    >
      <main
        className={`flex justify-center items-center ${
          row ? "flex-row" : "flex-col"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
