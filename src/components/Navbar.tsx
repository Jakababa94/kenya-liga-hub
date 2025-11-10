import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, Trophy, User } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Tournaments", href: "/tournaments" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">TourneyKE</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <User className="mr-2 h-4 w-4" />
            Sign In
          </Button>
          <Button size="sm" className="hidden md:flex">
            Register Team
          </Button>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
                <Button variant="ghost" size="sm" className="justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button size="sm">Register Team</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
