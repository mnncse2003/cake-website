import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-pink-50 text-gray-700 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p className="flex items-center"><Phone className="h-5 w-5 mr-2" /> +91 9768873133</p>
              <p className="flex items-center"><Mail className="h-5 w-5 mr-2" /> ClintonDanielFerrao@gmail.com</p>
              <p className="flex items-center"><MapPin className="h-5 w-5 mr-2" /> Mumbai, India</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Hours</h3>
            <p>Monday - Friday: 9am - 6pm</p>
            <p>Saturday: 10am - 4pm</p>
            <p>Sunday: Closed</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="space-x-4">
              <a href="#" className="text-pink-600 hover:text-pink-700">Instagram</a>
              <a href="#" className="text-pink-600 hover:text-pink-700">Facebook</a>
              <a href="#" className="text-pink-600 hover:text-pink-700">Pinterest</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-pink-200 text-center">
          <p>&copy; 2025 Sweet Delights. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;