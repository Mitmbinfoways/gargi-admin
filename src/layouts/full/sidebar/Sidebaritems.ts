export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: string;
  children?: ChildItem[];
  item?: any;
  url?: string;
  color?: string;
}

type MenuItem = {
  heading?: string;
  name?: string;
  icon?: string;
  id?: string;
  url?: string;
  children?: MenuItem[];
};

const getIconByName = (name: string): string => {
  const iconMap: Record<string, string> = {
    Dashboard: 'solar:home-2-linear',
    Product: 'solar:text-circle-outline',
    Blog: 'solar:book-outline',
    Tax: 'solar:calculator-outline',
    Login: 'solar:login-2-linear',
    Register: 'solar:shield-user-outline',
    Icons: 'solar:smile-circle-outline',
  };
  return iconMap[name] || 'solar:question-circle-linear';
};

const SidebarContent: MenuItem[] = [
  {
    children: [
      {
        name: 'Dashboard',
        icon: getIconByName('Dashboard'),
        id: 'dashboard',
        url: '/',
      },
      {
        name: 'Products',
        icon: getIconByName('Product'),
        id: 'products',
        url: '/products',
      },
      {
        name: 'Create Product',
        icon: getIconByName('Product'),
        id: 'create-product',
        url: '/create-product',
      },
      {
        name: 'Manage Query',
        icon: getIconByName('Product'),
        id: 'create-product',
        url: '/contact',
      },
      // {
      //   name: 'Blogs',
      //   icon: getIconByName('Blog'),
      //   id: 'blogs',
      //   url: '/blogs',
      // },
      // {
      //   name: 'Create Blog',
      //   icon: getIconByName('Blog'),
      //   id: 'create-blog',
      //   url: '/create-blog',
      // },
    ],
  },
];

export default SidebarContent;
