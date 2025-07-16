import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fish, Waves, Utensils, Snowflake, Flame, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import salmonImage from '@/assets/salmon.jpg';
import shrimpImage from '@/assets/shrimp.jpg';
import wholeFishImage from '@/assets/whole-fish.jpg';

const categories = [
  {
    id: 'poissons-entiers',
    name: 'Poissons Entiers',
    description: 'Sélection quotidienne de poissons entiers',
    image: wholeFishImage,
    icon: Fish,
    productCount: 15,
    featured: true,
  },
  {
    id: 'filets-poissons',
    name: 'Filets de Poissons',
    description: 'Filets de poissons prêts à cuisiner',
    image: salmonImage,
    icon: Utensils,
    productCount: 12,
    featured: false,
  },
  {
    id: 'crustaces',
    name: 'Crustacés',
    description: 'Crustacés frais et de qualité',
    image: shrimpImage,
    icon: Waves,
    productCount: 8,
    featured: false,
  },
  {
    id: 'cephalopodes',
    name: 'Céphalopodes',
    description: 'Pieuvres, seiches et calmars',
    image: wholeFishImage,
    icon: Package,
    productCount: 20,
    featured: false,
  },
  {
    id: 'poissons-fumes',
    name: 'Poissons Fumés',
    description: 'Poissons fumés artisanaux',
    image: salmonImage,
    icon: Flame,
    productCount: 6,
    featured: false,
  },
  {
    id: 'produits-elabores',
    name: 'Produits Élaborés',
    description: 'Produits transformés et élaborés',
    image: shrimpImage,
    icon: Snowflake,
    productCount: 10,
    featured: false,
  },
];

export const Categories = () => {
  return null;
};