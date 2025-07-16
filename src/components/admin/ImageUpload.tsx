import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  currentImage?: string;
}

export const ImageUpload = ({ onImageSelect, currentImage }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageSelect(result);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageSelect('');
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image-upload">Image du produit</Label>
      
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Aperçu" 
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Cliquez pour télécharger une image
          </p>
        </div>
      )}

      <Input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        disabled={uploading}
        className="cursor-pointer"
      />
      
      {uploading && (
        <p className="text-sm text-blue-600">Upload en cours...</p>
      )}
    </div>
  );
};