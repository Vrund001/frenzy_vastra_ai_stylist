import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const AdminSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();

  const adminNavigationItems = [
    {
      label: 'Product Management',
      path: '/admin-product-management',
      icon: 'Package',
      description: 'Manage product catalog'
    },
    {
      label: 'Analytics Dashboard',
      path: '/analytics-dashboard',
      icon: 'BarChart3',
      description: 'View performance metrics'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <aside className={`fixed left-0 top-16 bottom-0 z-60 bg-surface border-r border-border transition-layout ${
      isCollapsed ? 'w-16' : 'w-64'
    } lg:translate-x-0 ${
      location?.pathname?.startsWith('/admin') ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={20} color="var(--color-accent)" />
              <span className="font-semibold text-primary">Admin Panel</span>
            </div>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="hidden lg:flex"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={16} />
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {adminNavigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-smooth hover:bg-muted group ${
                isActivePath(item?.path)
                  ? 'bg-accent text-accent-foreground shadow-subtle'
                  : 'text-text-primary hover:text-primary'
              }`}
              title={isCollapsed ? item?.label : ''}
            >
              <Icon 
                name={item?.icon} 
                size={20} 
                color={isActivePath(item?.path) ? 'currentColor' : 'var(--color-text-secondary)'} 
              />
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-sm truncate">{item?.label}</span>
                  <span className="text-xs text-text-secondary truncate">{item?.description}</span>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <div className={`flex items-center space-x-3 px-3 py-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="var(--color-text-secondary)" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-primary truncate">Admin User</span>
                <span className="text-xs text-text-secondary truncate">Administrator</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;