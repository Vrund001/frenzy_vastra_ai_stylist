import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AdminSidebar from '../../components/ui/AdminSidebar';
import KPICard from './components/KPICard';
import ChartContainer from './components/ChartContainer';
import FilterControls from './components/FilterControls';
import DataTable from './components/DataTable';
import Icon from '../../components/AppIcon';

const AnalyticsDashboard = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filters, setFilters] = useState({
    dateRange: '7d',
    occasion: 'all',
    metric: 'all'
  });

  // Mock KPI data
  const kpiData = [
    {
      title: "Total Photo Analyses",
      value: "12,847",
      change: "+23.5%",
      changeType: "positive",
      icon: "Camera",
      description: "Photos analyzed this period"
    },
    {
      title: "Popular Occasion",
      value: "Casual",
      change: "42.3%",
      changeType: "neutral",
      icon: "TrendingUp",
      description: "Most requested styling occasion"
    },
    {
      title: "Conversion Rate",
      value: "18.7%",
      change: "+4.2%",
      changeType: "positive",
      icon: "Target",
      description: "Analysis to purchase conversion"
    },
    {
      title: "User Engagement",
      value: "8.4 min",
      change: "-1.2%",
      changeType: "negative",
      icon: "Clock",
      description: "Average session duration"
    }
  ];

  // Mock chart data
  const occasionPopularityData = [
    { name: 'Casual', value: 4247 },
    { name: 'Office', value: 2891 },
    { name: 'Party', value: 2156 },
    { name: 'Sports', value: 1834 },
    { name: 'Wedding', value: 1289 },
    { name: 'Travel', value: 430 }
  ];

  const bodyTypeDistributionData = [
    { name: 'Athletic', value: 3245 },
    { name: 'Slim', value: 2876 },
    { name: 'Regular', value: 3421 },
    { name: 'Plus Size', value: 2105 },
    { name: 'Tall', value: 1200 }
  ];

  const recommendationAccuracyData = [
    { name: 'Jan', value: 85 },
    { name: 'Feb', value: 87 },
    { name: 'Mar', value: 89 },
    { name: 'Apr', value: 91 },
    { name: 'May', value: 88 },
    { name: 'Jun', value: 93 },
    { name: 'Jul', value: 95 }
  ];

  const productPerformanceData = [
    { name: 'T-Shirts', value: 8947 },
    { name: 'Polo Shirts', value: 5632 },
    { name: 'Tank Tops', value: 3421 },
    { name: 'Long Sleeve', value: 2156 },
    { name: 'Graphic Tees', value: 4789 }
  ];

  // Mock table data
  const topProductsData = [
    {
      id: 1,
      name: "Classic Cotton T-Shirt",
      sku: "TSH-001",
      recommendations: 1247,
      conversions: 234,
      conversionRate: "18.8%",
      revenue: "$4,680"
    },
    {
      id: 2,
      name: "Premium Polo Shirt",
      sku: "POL-002",
      recommendations: 987,
      conversions: 198,
      conversionRate: "20.1%",
      revenue: "$5,940"
    },
    {
      id: 3,
      name: "Athletic Tank Top",
      sku: "TNK-003",
      recommendations: 834,
      conversions: 145,
      conversionRate: "17.4%",
      revenue: "$2,900"
    },
    {
      id: 4,
      name: "Graphic Design Tee",
      sku: "GRA-004",
      recommendations: 756,
      conversions: 167,
      conversionRate: "22.1%",
      revenue: "$3,340"
    },
    {
      id: 5,
      name: "Long Sleeve Shirt",
      sku: "LSL-005",
      recommendations: 623,
      conversions: 89,
      conversionRate: "14.3%",
      revenue: "$2,670"
    }
  ];

  const userSessionData = [
    {
      id: 1,
      date: "2025-01-02",
      sessions: 1247,
      avgDuration: "8.4 min",
      bounceRate: "23.5%",
      conversions: 234,
      revenue: "$4,680"
    },
    {
      id: 2,
      date: "2025-01-01",
      sessions: 1156,
      avgDuration: "7.8 min",
      bounceRate: "25.1%",
      conversions: 198,
      revenue: "$3,960"
    },
    {
      id: 3,
      date: "2024-12-31",
      sessions: 1089,
      avgDuration: "8.1 min",
      bounceRate: "24.3%",
      conversions: 187,
      revenue: "$3,740"
    },
    {
      id: 4,
      date: "2024-12-30",
      sessions: 1234,
      avgDuration: "8.7 min",
      bounceRate: "22.8%",
      conversions: 245,
      revenue: "$4,900"
    },
    {
      id: 5,
      date: "2024-12-29",
      sessions: 967,
      avgDuration: "7.2 min",
      bounceRate: "26.4%",
      conversions: 156,
      revenue: "$3,120"
    }
  ];

  const productTableColumns = [
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'recommendations', label: 'Recommendations', sortable: true },
    { key: 'conversions', label: 'Conversions', sortable: true },
    { key: 'conversionRate', label: 'Conv. Rate', sortable: true },
    { key: 'revenue', label: 'Revenue', sortable: true }
  ];

  const sessionTableColumns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'sessions', label: 'Sessions', sortable: true },
    { key: 'avgDuration', label: 'Avg Duration', sortable: true },
    { key: 'bounceRate', label: 'Bounce Rate', sortable: true },
    { key: 'conversions', label: 'Conversions', sortable: true },
    { key: 'revenue', label: 'Revenue', sortable: true }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleRefresh = () => {
    setLoading(true);
    setLastUpdated(new Date());
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = (type) => {
    console.log(`Exporting ${type} data...`);
    // Mock export functionality
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AdminSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={handleSidebarToggle}
      />
      <main className={`pt-16 transition-layout ${
        location?.pathname?.startsWith('/admin') 
          ? sidebarCollapsed 
            ? 'lg:ml-16' :'lg:ml-64' :''
      }`}>
        <div className="p-4 lg:p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="BarChart3" size={20} color="var(--color-accent)" />
              </div>
              <h1 className="text-2xl font-bold text-primary">Analytics Dashboard</h1>
            </div>
            <p className="text-text-secondary">
              Comprehensive insights into user behavior, popular occasions, and recommendation performance metrics.
            </p>
          </div>

          {/* Filter Controls */}
          <FilterControls
            onDateRangeChange={(value) => handleFilterChange('dateRange', value)}
            onOccasionFilter={(value) => handleFilterChange('occasion', value)}
            onMetricChange={(value) => handleFilterChange('metric', value)}
            onRefresh={handleRefresh}
            lastUpdated={lastUpdated}
          />

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData?.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                change={kpi?.change}
                changeType={kpi?.changeType}
                icon={kpi?.icon}
                description={kpi?.description}
                loading={loading}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartContainer
              title="Occasion Popularity Over Time"
              data={occasionPopularityData}
              type="bar"
              height={300}
              onExport={() => handleExport('occasion-popularity')}
              loading={loading}
            />
            
            <ChartContainer
              title="Body Type Distribution"
              data={bodyTypeDistributionData}
              type="pie"
              height={300}
              onExport={() => handleExport('body-type-distribution')}
              loading={loading}
            />
            
            <ChartContainer
              title="Recommendation Accuracy Rates"
              data={recommendationAccuracyData}
              type="line"
              height={300}
              onExport={() => handleExport('recommendation-accuracy')}
              loading={loading}
            />
            
            <ChartContainer
              title="Product Performance Metrics"
              data={productPerformanceData}
              type="bar"
              height={300}
              onExport={() => handleExport('product-performance')}
              loading={loading}
            />
          </div>

          {/* Data Tables Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <DataTable
              title="Top Performing Products"
              data={topProductsData}
              columns={productTableColumns}
              onExport={() => handleExport('top-products')}
              loading={loading}
              showPagination={true}
              itemsPerPage={5}
            />
            
            <DataTable
              title="User Session Patterns"
              data={userSessionData}
              columns={sessionTableColumns}
              onExport={() => handleExport('user-sessions')}
              loading={loading}
              showPagination={true}
              itemsPerPage={5}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;