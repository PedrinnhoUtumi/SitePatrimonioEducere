export function Pagina({ children, row = false, className = "" }) {
  return (
    <div
      className={`min-h-screen flex flex-col flex-1 w-full ${className}`}
    >
      <main
        className={`flex flex-1 justify-center items-center p-6 ${
          row ? "flex-row" : "flex-col"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
