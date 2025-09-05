import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import SessionContextIndicator from '../../components/ui/SessionContextIndicator';
import ProductImageGallery from './components/ProductImageGallery';
import ProductInfo from './components/ProductInfo';
import StylingTips from './components/StylingTips';
import ActionButtons from './components/ActionButtons';

const ProductDetailModal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams?.get('id');
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Mock product data
  const mockProduct = {
    id: productId || "tshirt-001",
    name: "Premium Cotton Crew Neck T-Shirt",
    sku: "TSH-001-BLK-M",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.5,
    reviewCount: 127,
    description: `Crafted from 100% premium cotton, this crew neck t-shirt offers the perfect blend of comfort and style. The soft, breathable fabric ensures all-day comfort while maintaining its shape and color after multiple washes. Features include reinforced seams, pre-shrunk fabric, and a classic fit that works for any occasion.`,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop"
    ],
    availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
    availableColors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy", hex: "#1E3A8A" },
      { name: "Gray", hex: "#6B7280" },
      { name: "Olive", hex: "#65A30D" }
    ],
    fitType: "Regular Fit",
    fitDescription: "Classic comfortable fit with room to move",
    features: [
      "100% Premium Cotton",
      "Pre-shrunk fabric",
      "Reinforced seams",
      "Machine washable",
      "Fade-resistant colors",
      "Tagless comfort"
    ],
    sizeStock: {
      "XS": 5,
      "S": 12,
      "M": 8,
      "L": 15,
      "XL": 6,
      "XXL": 3
    },
    stock: 49,
    occasion: "casual"
  };

  // Mock user analysis data
  const mockUserAnalysis = {
    bodyType: "Athletic",
    recommendedSize: "M",
    occasion: "casual",
    analysisDate: new Date()?.toISOString()
  };

  // Mock AI styling tips
  const mockAiTips = [
    "Based on your athletic build, this regular fit will complement your physique perfectly",
    "The cotton fabric will provide comfort during your active lifestyle",
    "Consider the navy or olive colors to enhance your natural skin tone",
    "This style works great for your casual occasion preference"
  ];

  // Mock current session
  const mockCurrentSession = {
    id: "session-001",
    recommendationCount: 12,
    analysisComplete: true
  };

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    // Auto-select recommended size if available
    if (mockUserAnalysis?.recommendedSize && !selectedSize) {
      setSelectedSize(mockUserAnalysis?.recommendedSize);
    }
  }, [mockUserAnalysis, selectedSize]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const handleAddToCart = async (cartItem) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Adding to cart:', cartItem);
    
    // Show success message or redirect
    alert(`Added ${cartItem?.quantity}x ${cartItem?.product?.name} (${cartItem?.size}, ${cartItem?.color}) to cart!`);
    
    setIsLoading(false);
  };

  const handleAddToWishlist = async (product) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Adding to wishlist:', product);
    alert(`Added ${product?.name} to your wishlist!`);
  };

  const handleShare = (platform) => {
    console.log(`Shared on ${platform}`);
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const tabItems = [
    { id: 'details', label: 'Details', icon: 'Info' },
    { id: 'styling', label: 'Styling', icon: 'Sparkles' },
    { id: 'actions', label: 'Purchase', icon: 'ShoppingCart' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SessionContextIndicator 
        currentSession={mockCurrentSession} 
        onViewResults={() => console.log('View results clicked')} 
      />
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-100 bg-black/50 flex items-center justify-center p-4 pt-20">
        <div className="bg-surface rounded-lg shadow-modal max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
            <h1 className="text-lg font-semibold text-primary truncate">
              {mockProduct?.name}
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileTabs(!showMobileTabs)}
                className="lg:hidden"
                aria-label="Toggle tabs"
              >
                <Icon name="Menu" size={16} />
              </Button>
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

          {/* Mobile Tab Navigation */}
          {showMobileTabs && (
            <div className="lg:hidden border-b border-border">
              <div className="flex">
                {tabItems?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => {
                      setActiveTab(tab?.id);
                      setShowMobileTabs(false);
                    }}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-smooth ${
                      activeTab === tab?.id
                        ? 'text-accent border-b-2 border-accent bg-accent/5' :'text-text-secondary hover:text-primary'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
            {/* Desktop Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="hidden lg:flex absolute top-4 right-4 z-10 bg-surface/80 hover:bg-surface"
              aria-label="Close modal"
            >
              <Icon name="X" size={16} />
            </Button>

            {/* Left Section - Image Gallery */}
            <div className={`lg:w-1/2 ${activeTab === 'details' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
              <div className="p-6 h-full overflow-y-auto">
                <ProductImageGallery
                  images={mockProduct?.images}
                  productName={mockProduct?.name}
                  currentImageIndex={currentImageIndex}
                  onImageChange={handleImageChange}
                />
              </div>
            </div>

            {/* Right Section - Content */}
            <div className="lg:w-1/2 flex flex-col">
              <div className="flex-1 overflow-y-auto">
                {/* Product Info Tab */}
                <div className={`${activeTab === 'details' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
                  <div className="p-6">
                    <ProductInfo
                      product={mockProduct}
                      selectedSize={selectedSize}
                      selectedColor={selectedColor}
                      selectedQuantity={selectedQuantity}
                      onSizeSelect={setSelectedSize}
                      onColorSelect={setSelectedColor}
                      onQuantityChange={setSelectedQuantity}
                      userAnalysis={mockUserAnalysis}
                    />
                  </div>
                </div>

                {/* Styling Tips Tab */}
                <div className={`${activeTab === 'styling' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
                  <div className="p-6 border-t border-border lg:border-t-0">
                    <StylingTips
                      occasion={mockProduct?.occasion}
                      bodyType={mockUserAnalysis?.bodyType}
                      product={mockProduct}
                      aiTips={mockAiTips}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`${activeTab === 'actions' || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
                <div className="p-6 border-t border-border bg-muted/30">
                  <ActionButtons
                    product={mockProduct}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                    selectedQuantity={selectedQuantity}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    onShare={handleShare}
                    onClose={handleClose}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;