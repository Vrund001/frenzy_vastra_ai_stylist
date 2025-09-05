import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AdminSidebar from '../../components/ui/AdminSidebar';
import Button from '../../components/ui/Button';


// Import all components
import ProductTable from './components/ProductTable';
import ProductFilters from './components/ProductFilters';
import BulkActions from './components/BulkActions';
import ProductFormModal from './components/ProductFormModal';
import BulkImportModal from './components/BulkImportModal';
import AnalyticsSummary from './components/AnalyticsSummary';
import ConfirmationModal from './components/ConfirmationModal';

const AdminProductManagement = () => {
  // State management
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    occasion: '',
    status: '',
    fit: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [showProductModal, setShowProductModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Mock products data
  const [products, setProducts] = useState([
    {
      id: 1,
      sku: 'TSH001',
      name: 'Classic White T-Shirt',
      description: 'Comfortable cotton t-shirt perfect for everyday wear',
      price: 19.99,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#FFFFFF', '#000000', '#808080'],
      fit: 'regular',
      occasions: ['casual', 'office'],
      status: 'active',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop'
    },
    {
      id: 2,
      sku: 'POL002',
      name: 'Navy Blue Polo',
      description: 'Premium polo shirt for professional occasions',
      price: 29.99,
      sizes: ['M', 'L', 'XL'],
      colors: ['#000080', '#FFFFFF', '#FF0000'],
      fit: 'slim',
      occasions: ['office', 'casual'],
      status: 'active',
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop'
    },
    {
      id: 3,
      sku: 'TSH003',
      name: 'Black Casual Tee',
      description: 'Versatile black t-shirt for any occasion',
      price: 24.99,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['#000000', '#808080', '#FFFFFF'],
      fit: 'regular',
      occasions: ['casual', 'party', 'travel'],
      status: 'active',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=300&h=300&fit=crop'
    },
    {
      id: 4,
      sku: 'SPT004',
      name: 'Gray Sports Shirt',
      description: 'Moisture-wicking sports shirt for active lifestyle',
      price: 34.99,
      sizes: ['M', 'L', 'XL'],
      colors: ['#808080', '#000000', '#0000FF'],
      fit: 'loose',
      occasions: ['sports', 'casual'],
      status: 'active',
      image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300&h=300&fit=crop'
    },
    {
      id: 5,
      sku: 'TSH005',
      name: 'Red Party Shirt',
      description: 'Bold red shirt perfect for parties and events',
      price: 27.99,
      sizes: ['S', 'M', 'L'],
      colors: ['#FF0000', '#000000', '#FFFFFF'],
      fit: 'slim',
      occasions: ['party', 'wedding'],
      status: 'inactive',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&h=300&fit=crop'
    },
    {
      id: 6,
      sku: 'TSH006',
      name: 'Green Travel Tee',
      description: 'Lightweight travel-friendly t-shirt',
      price: 22.99,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#008000', '#000000', '#808080'],
      fit: 'regular',
      occasions: ['travel', 'casual'],
      status: 'draft',
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=300&h=300&fit=crop'
    }
  ]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products?.filter(product => {
      const matchesSearch = !filters?.search || 
        product?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        product?.sku?.toLowerCase()?.includes(filters?.search?.toLowerCase());
      
      const matchesCategory = !filters?.category || 
        product?.occasions?.includes(filters?.category);
      
      const matchesOccasion = !filters?.occasion || 
        product?.occasions?.includes(filters?.occasion);
      
      const matchesStatus = !filters?.status || 
        product?.status === filters?.status;
      
      const matchesFit = !filters?.fit || 
        product?.fit === filters?.fit;
      
      const matchesMinPrice = !filters?.minPrice || 
        product?.price >= parseFloat(filters?.minPrice);
      
      const matchesMaxPrice = !filters?.maxPrice || 
        product?.price <= parseFloat(filters?.maxPrice);

      return matchesSearch && matchesCategory && matchesOccasion && 
             matchesStatus && matchesFit && matchesMinPrice && matchesMaxPrice;
    });

    // Sort products
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (sortConfig?.key === 'price') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [products, filters, sortConfig]);

  // Event handlers
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleProductSelect = (productId, selected) => {
    setSelectedProducts(prev => 
      selected 
        ? [...prev, productId]
        : prev?.filter(id => id !== productId)
    );
  };

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      setSelectedProducts(filteredAndSortedProducts?.map(p => p?.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedProducts([]);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedProducts([]); // Clear selection when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      occasion: '',
      status: '',
      fit: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (productData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingProduct) {
        // Update existing product
        setProducts(prev => prev?.map(p => 
          p?.id === editingProduct?.id ? { ...productData, id: editingProduct?.id } : p
        ));
      } else {
        // Add new product
        setProducts(prev => [...prev, { ...productData, id: Date.now() }]);
      }
      
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = (productId) => {
    const product = products?.find(p => p?.id === productId);
    setConfirmAction({
      type: 'delete',
      title: 'Delete Product',
      message: `Are you sure you want to delete "${product?.name}"? This action cannot be undone.`,
      data: productId
    });
    setShowConfirmModal(true);
  };

  const handleBulkAction = (action) => {
    const selectedCount = selectedProducts?.length;
    const actionLabels = {
      activate: 'Activate',
      deactivate: 'Deactivate',
      delete: 'Delete',
      export: 'Export',
      duplicate: 'Duplicate'
    };

    setConfirmAction({
      type: action,
      title: `${actionLabels?.[action]} Products`,
      message: `Are you sure you want to ${action?.toLowerCase()} ${selectedCount} selected product${selectedCount !== 1 ? 's' : ''}?`,
      data: selectedProducts
    });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (confirmAction?.type) {
        case 'delete':
          if (Array.isArray(confirmAction?.data)) {
            // Bulk delete
            setProducts(prev => prev?.filter(p => !confirmAction?.data?.includes(p?.id)));
            setSelectedProducts([]);
          } else {
            // Single delete
            setProducts(prev => prev?.filter(p => p?.id !== confirmAction?.data));
          }
          break;
          
        case 'activate':
          setProducts(prev => prev?.map(p => 
            confirmAction?.data?.includes(p?.id) ? { ...p, status: 'active' } : p
          ));
          setSelectedProducts([]);
          break;
          
        case 'deactivate':
          setProducts(prev => prev?.map(p => 
            confirmAction?.data?.includes(p?.id) ? { ...p, status: 'inactive' } : p
          ));
          setSelectedProducts([]);
          break;
          
        case 'duplicate':
          const productsToDuplicate = products?.filter(p => confirmAction?.data?.includes(p?.id));
          const duplicatedProducts = productsToDuplicate?.map(p => ({
            ...p,
            id: Date.now() + Math.random(),
            sku: `${p?.sku}-COPY`,
            name: `${p?.name} (Copy)`
          }));
          setProducts(prev => [...prev, ...duplicatedProducts]);
          setSelectedProducts([]);
          break;
          
        case 'export':
          // Mock export functionality
          console.log('Exporting products:', confirmAction?.data);
          setSelectedProducts([]);
          break;
      }
      
      setShowConfirmModal(false);
      setConfirmAction(null);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = (results) => {
    console.log('Import results:', results);
    // In a real app, you would refresh the products list here
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AdminSidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      {/* Main Content */}
      <main className={`pt-16 transition-layout ${
        sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      }`}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">Product Management</h1>
              <p className="text-text-secondary">
                Manage your T-shirt catalog with comprehensive CRUD operations
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowImportModal(true)}
                iconName="Upload"
                iconPosition="left"
              >
                <span className="hidden sm:inline">Bulk Import</span>
                <span className="sm:hidden">Import</span>
              </Button>
              
              <Button
                variant="default"
                onClick={handleAddProduct}
                iconName="Plus"
                iconPosition="left"
              >
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          {/* Analytics Summary */}
          <AnalyticsSummary 
            isExpanded={analyticsExpanded}
            onToggleExpanded={() => setAnalyticsExpanded(!analyticsExpanded)}
          />

          {/* Filters */}
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            resultsCount={filteredAndSortedProducts?.length}
          />

          {/* Bulk Actions */}
          {selectedProducts?.length > 0 && (
            <BulkActions
              selectedCount={selectedProducts?.length}
              onBulkAction={handleBulkAction}
              onClearSelection={handleClearSelection}
              isProcessing={isLoading}
            />
          )}

          {/* Products Table */}
          <ProductTable
            products={filteredAndSortedProducts}
            selectedProducts={selectedProducts}
            onProductSelect={handleProductSelect}
            onSelectAll={handleSelectAll}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            sortConfig={sortConfig}
            onSort={handleSort}
          />

          {/* Quick Actions */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="font-semibold text-primary mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                fullWidth
                onClick={handleAddProduct}
                iconName="Plus"
                iconPosition="left"
              >
                Add Product
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowImportModal(true)}
                iconName="Upload"
                iconPosition="left"
              >
                Bulk Import
              </Button>
              
              <Link to="/analytics-dashboard" className="w-full">
                <Button
                  variant="outline"
                  fullWidth
                  iconName="BarChart3"
                  iconPosition="left"
                >
                  View Analytics
                </Button>
              </Link>
              
              <Button
                variant="outline"
                fullWidth
                onClick={() => handleBulkAction('export')}
                disabled={filteredAndSortedProducts?.length === 0}
                iconName="Download"
                iconPosition="left"
              >
                Export All
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Modals */}
      <ProductFormModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
        isLoading={isLoading}
      />
      <BulkImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        isProcessing={isLoading}
      />
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setConfirmAction(null);
        }}
        onConfirm={handleConfirmAction}
        title={confirmAction?.title}
        message={confirmAction?.message}
        type={confirmAction?.type === 'delete' ? 'destructive' : 'default'}
        confirmText={confirmAction?.type === 'delete' ? 'Delete' : 'Confirm'}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminProductManagement;