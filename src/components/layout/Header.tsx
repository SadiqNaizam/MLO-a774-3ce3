import React from 'react';
import { Link } from 'react-router-dom';
import NavigationMenu from './NavigationMenu'; // Assuming NavigationMenu is in the same layout folder
import { Button } from '@/components/ui/button';
import { UserCircle, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  console.log("Rendering Header");

  // Placeholder for authentication status and user
  const isAuthenticated = true; // Replace with actual auth state
  const user = { name: "User Name" }; // Replace with actual user data

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/dashboard" className="mr-6 flex items-center space-x-2">
            {/* <img src="/logo.svg" alt="Logo" className="h-6 w-6" /> */}
            <span className="font-bold text-xl">TradePlatform</span>
          </Link>
          <div className="hidden md:block">
            <NavigationMenu />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <UserCircle className="h-7 w-7" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      user@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log('Logout clicked')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button>Login / Sign Up</Button>
            </Link>
          )}
           {/* Mobile Menu Trigger - Implement if needed */}
           {/* <div className="md:hidden"> <Button variant="ghost" size="icon"> <MenuIcon /> </Button> </div> */}
        </div>
      </div>
    </header>
  );
};

export default Header;