import { motion } from 'framer-motion';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  selectedImage: number;
  onSelectImage: (index: number) => void;
}

export const ProductImageGallery = ({
  images,
  productName,
  selectedImage,
  onSelectImage,
}: ProductImageGalleryProps) => {
  // Filter out empty/null images and ensure we have at least one
  const validImages = images?.filter(Boolean).length > 0 
    ? images.filter(Boolean) 
    : ['/placeholder-product.jpg'];

  return (
    <motion.div 
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border shadow-2xl">
        <motion.img
          key={selectedImage}
          src={validImages[selectedImage]}
          alt={productName}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
          }}
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Image counter badge */}
        {validImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
            {selectedImage + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails - Only show if multiple images */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {validImages.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => onSelectImage(index)}
              className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-primary shadow-lg shadow-primary/30"
                  : "border-border hover:border-primary/50"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                }}
              />
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
};