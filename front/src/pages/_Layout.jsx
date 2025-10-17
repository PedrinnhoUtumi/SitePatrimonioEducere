import { Outlet } from "react-router-dom";
import { MenuTop } from "../componentes/Layout/menuTop";
import { Footer } from "../componentes/Layout/Footer";

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-white">
      <MenuTop />
      <main className="flex flex-col flex-1 w-full max-w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
