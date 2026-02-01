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
  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-lg overflow-hidden bg-muted/50">
        <img
          src={images[selectedImage]}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index ? "border-primary" : "border-border"
              }`}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
