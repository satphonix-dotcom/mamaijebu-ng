
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="ml-2 lg:ml-0 flex items-center">
              <span className="text-xl font-semibold text-gray-900">LottoGaze</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost">Dashboard</Button>
            <Button variant="ghost">Search</Button>
            <Button variant="ghost">History</Button>
            <Button variant="default" className="bg-primary-400 hover:bg-primary-500">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
