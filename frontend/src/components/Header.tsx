import { Link } from "react-router";
import { Ticket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/Button";
import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";

const NavItem = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <li>
      <Link to={to} className="text-sm font-medium hover:text-primary">
        <Button variant="link" className="px-2">
          {children}
        </Button>
      </Link>
    </li>
  );
};

export function Header() {
  const { accessToken } = useAuth();
  const { mutate: logout, isLoading } = useLogout();

  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link
            to="/events"
            className="text-xl font-bold flex items-center gap-2"
          >
            <Ticket className="w-6 h-6" />
            Ticketer
          </Link>
          <nav>
            <ul className="flex gap-4 items-center">
              <NavItem to="/events">Events</NavItem>

              {!!accessToken && (
                <NavItem to="/create-event">Create Event</NavItem>
              )}
              {!!accessToken ? (
                <Button 
                  variant="ghost" 
                  className="gap-1" 
                  onClick={() => logout()}
                  isLoading={isLoading}
                >
                  <LogOut />
                  Logout
                </Button>
              ) : (
                <NavItem to="/login">Login</NavItem>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
