import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  console.log("Rendering Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground mb-4 md:mb-0">
          &copy; {currentYear} TradePlatform. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
            Terms of Service
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
            Privacy Policy
          </Link>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;