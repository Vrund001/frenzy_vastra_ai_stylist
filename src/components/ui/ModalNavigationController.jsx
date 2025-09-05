import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ModalNavigationController = ({ 
  isOpen = false,
  onClose,
  product = null,
  relatedProducts = [],
  onProductChange,
  onAddToCart,
  onViewSimilar
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageGallery, setShowImageGallery] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const productImages = product?.images || [product?.image];

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? productImages?.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === productImages?.length - 1 ? 0 : prev + 1
    );
  };

  const handleImageSelect = (index) => {
    setCurrentImageIndex(index);
    setShowImageGallery(false);
  };

  const handleProductSelect = (selectedProduct) => {
    if (onProductChange) {
      onProductChange(selectedProduct);
    }
    setCurrentImageIndex(0);
  };

  const handleClose = () => {
    setCurrentImageIndex(0);
    setShowImageGallery(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-200 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-modal max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-primary truncate">
              {product?.name}
            </h2>
            <span className="text-sm text-text-secondary">
              ${product?.price}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {productImages?.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowImageGallery(!showImageGallery)}
                aria-label="Toggle image gallery"
              >
                <Icon name="Grid3X3" size={16} />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Image Section */}
          <div className="lg:w-1/2 relative bg-muted">
            {/* Main Image */}
            <div className="relative aspect-square">
              <img
                src={productImages?.[currentImageIndex]}
                alt={`${product?.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
              
              {/* Image Navigation */}
              {productImages?.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-surface/80 hover:bg-surface"
                    onClick={handlePreviousImage}
                    aria-label="Previous image"
                  >
                    <Icon name="ChevronLeft" size={20} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-surface/80 hover:bg-surface"
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    <Icon name="ChevronRight" size={20} />
                  </Button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {productImages?.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-smooth ${
                          index === currentImageIndex ? 'bg-accent' : 'bg-surface/60'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Image Gallery */}
            {showImageGallery && productImages?.length > 1 && (
              <div className="absolute inset-0 bg-surface/95 p-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {productImages?.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-smooth ${
                        index === currentImageIndex 
                          ? 'border-accent' :'border-transparent hover:border-border'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product?.name} - Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/assets/images/no_image.png';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {product?.name}
                  </h3>
                  <p className="text-2xl font-bold text-accent">
                    ${product?.price}
                  </p>
                </div>

                {product?.description && (
                  <div>
                    <h4 className="font-medium text-primary mb-2">Description</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {product?.description}
                    </p>
                  </div>
                )}

                {product?.features && (
                  <div>
                    <h4 className="font-medium text-primary mb-2">Features</h4>
                    <ul className="space-y-1">
                      {product?.features?.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-text-secondary">
                          <Icon name="Check" size={14} color="var(--color-success)" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Related Products */}
                {relatedProducts?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-primary mb-3">Similar Items</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {relatedProducts?.slice(0, 4)?.map((relatedProduct) => (
                        <button
                          key={relatedProduct?.id}
                          onClick={() => handleProductSelect(relatedProduct)}
                          className="text-left p-2 rounded-lg border border-border hover:border-accent transition-smooth hover-scale"
                        >
                          <img
                            src={relatedProduct?.image}
                            alt={relatedProduct?.name}
                            className="w-full aspect-square object-cover rounded mb-2"
                            onError={(e) => {
                              e.target.src = '/assets/images/no_image.png';
                            }}
                          />
                          <p className="text-xs font-medium text-primary truncate">
                            {relatedProduct?.name}
                          </p>
                          <p className="text-xs text-accent">${relatedProduct?.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-border">
              <div className="flex space-x-3">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => onAddToCart && onAddToCart(product)}
                  iconName="ShoppingCart"
                  iconPosition="left"
                >
                  Add to Cart
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => onViewSimilar && onViewSimilar(product)}
                  iconName="Search"
                >
                  <span className="hidden sm:inline">Similar</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNavigationController;