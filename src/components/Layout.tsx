
import Navbar from "./navbar/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16 min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
};
