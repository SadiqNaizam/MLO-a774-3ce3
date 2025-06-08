import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu as ShadcnNavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Home, BarChart2, BookOpen, Wallet, ListOrdered } from 'lucide-react'; // Example icons

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/trading', label: 'Trade', icon: BarChart2 },
  { href: '/orders', label: 'Orders', icon: ListOrdered },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  // Add more navigation items here
];

const NavigationMenu: React.FC = () => {
  console.log("Rendering NavigationMenu");
  const location = useLocation();

  return (
    <ShadcnNavigationMenu>
      <NavigationMenuList className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        {navItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <Link to={item.href}>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "flex items-center gap-2", // For icon and text
                  location.pathname.startsWith(item.href) ? 'bg-accent text-accent-foreground' : ''
                )}
                active={location.pathname.startsWith(item.href)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </ShadcnNavigationMenu>
  );
};

export default NavigationMenu;