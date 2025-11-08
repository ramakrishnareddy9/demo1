import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">MAHOSTAV 2026</h3>
            <p className="text-gray-400">
              The premier college festival celebrating talent, creativity, and sportsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/sports" className="text-gray-400 hover:text-white transition-colors">
                  Sports Events
                </a>
              </li>
              <li>
                <a href="/cultural" className="text-gray-400 hover:text-white transition-colors">
                  Cultural Events
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-400 hover:text-white transition-colors">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 MAHOSTAV. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
