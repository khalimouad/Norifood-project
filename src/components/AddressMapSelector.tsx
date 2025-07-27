import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Check } from 'lucide-react';
import { toast } from 'sonner';

interface AddressMapSelectorProps {
  onAddressSelect: (address: string, city: string, postalCode?: string, latitude?: number, longitude?: number) => void;
  initialAddress?: string;
}

export const AddressMapSelector: React.FC<AddressMapSelectorProps> = ({
  onAddressSelect,
  initialAddress = ""
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(initialAddress);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);

  // Initialize map when token is provided
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-7.6166, 33.5731], // Casablanca, Morocco default
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add click handler for address selection
    map.current.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      
      // Remove existing marker
      if (marker.current) {
        marker.current.remove();
      }
      
      // Add new marker
      marker.current = new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Reverse geocode to get address
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&language=fr&country=ma`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const address = feature.place_name || feature.text || 'Adresse sélectionnée';
          
          // Extract city and postal code from context
          let city = '';
          let postalCode = '';
          
          if (feature.context) {
            const cityContext = feature.context.find((c: any) => c.id.includes('place'));
            const postCodeContext = feature.context.find((c: any) => c.id.includes('postcode'));
            
            city = cityContext?.text || '';
            postalCode = postCodeContext?.text || '';
          }
          
          setSelectedAddress(address);
          setSelectedCoordinates({ lat, lng });
          toast.success('Adresse sélectionnée sur la carte');
        }
      } catch (error) {
        console.error('Erreur lors de la géocodification inverse:', error);
        toast.error('Impossible de récupérer l\'adresse');
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  const handleConfirmAddress = () => {
    if (selectedAddress && selectedCoordinates) {
      // Extract basic city and postal code from the address string
      const addressParts = selectedAddress.split(',');
      const city = addressParts.length > 1 ? addressParts[addressParts.length - 2].trim() : '';
      
      onAddressSelect(selectedAddress, city, undefined, selectedCoordinates.lat, selectedCoordinates.lng);
      setIsMapVisible(false);
      toast.success('Adresse confirmée');
    }
  };

  const searchAddress = async (query: string) => {
    if (!mapboxToken || !query.trim()) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&country=ma&language=fr&limit=1`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lng, lat] = feature.center;
        
        if (map.current) {
          map.current.flyTo({ center: [lng, lat], zoom: 15 });
          
          // Remove existing marker
          if (marker.current) {
            marker.current.remove();
          }
          
          // Add new marker
          marker.current = new mapboxgl.Marker({ color: '#3b82f6' })
            .setLngLat([lng, lat])
            .addTo(map.current);
            
          setSelectedAddress(feature.place_name);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast.error('Erreur lors de la recherche d\'adresse');
    }
  };

  if (!isMapVisible) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsMapVisible(true)}
          className="w-full flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          Choisir l'adresse sur la carte
        </Button>
        {selectedAddress && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Adresse sélectionnée :</p>
            <p className="text-sm font-medium">{selectedAddress}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Sélectionner votre adresse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!mapboxToken ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pour utiliser la carte, veuillez entrer votre token Mapbox :
            </p>
            <Input
              placeholder="Token Mapbox (pk.xxx...)"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Obtenez votre token gratuit sur <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <Input
                placeholder="Rechercher une adresse..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    searchAddress(e.currentTarget.value);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Rechercher une adresse..."]') as HTMLInputElement;
                  if (input) searchAddress(input.value);
                }}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <div 
              ref={mapContainer} 
              className="w-full h-[300px] rounded-lg border overflow-hidden"
            />
            
            {selectedAddress && (
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Adresse sélectionnée :</p>
                  <p className="text-sm font-medium">{selectedAddress}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleConfirmAddress}
                    className="flex-1 flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Confirmer cette adresse
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsMapVisible(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Cliquez sur la carte pour sélectionner une adresse précise
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};