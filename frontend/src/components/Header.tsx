import { Link } from "react-router";
import { Ticket } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
            <Link to="/events" className="text-xl font-bold flex items-center gap-2">
              <Ticket className="w-6 h-6" />
              Ticketer
            </Link>
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link
                  to="/events"
                  className="text-sm font-medium hover:text-primary"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm font-medium hover:text-primary"
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 
