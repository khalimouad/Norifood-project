import { Fish, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export const Footer = () => {
  return (
    <footer className="bg-ocean text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Fish className="h-8 w-8 text-seafoam" />
              <span className="text-xl font-bold">Fresh N'Good</span>
            </div>
            <p className="text-white/80 mb-4">
              FRESH N'GOOD a hérité le savoir faire de plus de 20 ans dans le domaine des produits de la mer !
              Nous garantissons les meilleurs produits au meilleur coût.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-white/80 hover:text-seafoam transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#products" className="text-white/80 hover:text-seafoam transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#categories" className="text-white/80 hover:text-seafoam transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a href="#recipes" className="text-white/80 hover:text-seafoam transition-colors">
                  Recipes
                </a>
              </li>
              <li>
                <a href="#about" className="text-white/80 hover:text-seafoam transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-seafoam" />
                <span className="text-white/80">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-seafoam" />
                <span className="text-white/80">orders@seafresh.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-seafoam" />
                <span className="text-white/80">123 Harbor St, Seaside City</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-seafoam" />
                <span className="text-white/80">Mon-Fri: 6AM-8PM</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-white/80 mb-4">
              Subscribe to get updates on fresh arrivals and special offers.
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button className="bg-seafoam hover:bg-seafoam/90 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2024 SeaFresh. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-white/60 hover:text-seafoam text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/60 hover:text-seafoam text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-white/60 hover:text-seafoam text-sm transition-colors">
              Shipping Info
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};