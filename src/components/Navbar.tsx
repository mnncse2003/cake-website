import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cake, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-pink-50 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Cake className="h-8 w-8 text-pink-600" />
            <span className="text-2xl font-bold text-pink-600">Sweet Delights</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/category/cheesecakes" className="text-gray-700 hover:text-pink-600 transition-colors duration-200">Cheesecakes</Link>
            <Link to="/category/chocolate" className="text-gray-700 hover:text-pink-600 transition-colors duration-200">Chocolate</Link>
            <Link to="/category/red-velvet" className="text-gray-700 hover:text-pink-600 transition-colors duration-200">Red Velvet</Link>
            <Link to="/category/fruit" className="text-gray-700 hover:text-pink-600 transition-colors duration-200">Fruit</Link>
            <Link to="/category/custom" className="text-gray-700 hover:text-pink-600 transition-colors duration-200">Custom</Link>
            <Link to="/admin/login" className="flex items-center space-x-1 text-gray-700 hover:text-pink-600 transition-colors duration-200">
              <User className="h-5 w-5" />
              <span>Admin</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-pink-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-pink-50 pb-4 px-4 shadow-inner">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/category/cheesecakes" 
                className="text-gray-700 hover:text-pink-600 py-2 border-b border-pink-100"
                onClick={toggleMobileMenu}
              >
                Cheesecakes
              </Link>
              <Link 
                to="/category/chocolate" 
                className="text-gray-700 hover:text-pink-600 py-2 border-b border-pink-100"
                onClick={toggleMobileMenu}
              >
                Chocolate
              </Link>
              <Link 
                to="/category/red-velvet" 
                className="text-gray-700 hover:text-pink-600 py-2 border-b border-pink-100"
                onClick={toggleMobileMenu}
              >
                Red Velvet
              </Link>
              <Link 
                to="/category/fruit" 
                className="text-gray-700 hover:text-pink-600 py-2 border-b border-pink-100"
                onClick={toggleMobileMenu}
              >
                Fruit
              </Link>
              <Link 
                to="/category/custom" 
                className="text-gray-700 hover:text-pink-600 py-2 border-b border-pink-100"
                onClick={toggleMobileMenu}
              >
                Custom
              </Link>
              <Link 
                to="/admin/login" 
                className="flex items-center space-x-1 text-gray-700 hover:text-pink-600 py-2"
                onClick={toggleMobileMenu}
              >
                <User className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;