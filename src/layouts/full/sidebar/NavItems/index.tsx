import { Sidebar } from 'flowbite-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ChildItem } from '../Sidebaritems';

interface NavItemsProps {
  item: ChildItem;
}

const NavItems: React.FC<NavItemsProps> = ({ item }) => {
  const location = useLocation();

  const renderIcon = (icon?: string, size: number = 20) =>
    icon ? <Icon icon={icon} width={size} className="mr-3" /> : null;

  // Check if the current item or any child matches the current path
  const isActive = location.pathname === item.url;
  const isChildActive = item.children?.some((child) => child.url === location.pathname);

  if (item.children && item.children.length > 0) {
    return (
      <Sidebar.Collapse
        label={item.name}
        icon={() => renderIcon(item.icon)}
        open={isChildActive} // Auto expand if a child is active
        className={`transition-colors duration-200 ${isChildActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
          }`}
      >
        {item.children.map((child, index) => {
          const isChildSelected = location.pathname === child.url;

          return (
            <Sidebar.Item
              key={index}
              as={Link}
              to={child.url || '#'}
              className={`pl-8 flex items-center transition-all duration-200 rounded-md ${isChildSelected
                  ? 'bg-blue-100 text-blue-600 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-500'
                }`}
            >
              <div className="flex items-center">
                {renderIcon(child.icon, 16)}
                <span>{child.name}</span>
              </div>
            </Sidebar.Item>
          );
        })}
      </Sidebar.Collapse>
    );
  }

  return (
    <Sidebar.Item
      as={Link}
      to={item.url || '#'}
      key={item.id}
      className={`flex items-center transition-all duration-200 rounded-md ${isActive
          ? 'bg-blue-100 text-blue-600 font-semibold '
          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-500'
        }`}
    >
      <div className="flex items-center">
        {renderIcon(item.icon)}
        <span>{item.name}</span>
      </div>
    </Sidebar.Item>
  );
};

export default NavItems;
