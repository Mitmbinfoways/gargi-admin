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
    Product: 'solar:box-linear',
    CreateProduct: 'solar:add-square-linear',
    Query: 'solar:chat-dots-outline',
    Blog: 'solar:book-outline',
    Category: "solar:layers-linear",
    Material: "solar:pen-linear", 
    Size: "solar:ruler-linear",
    Tax: 'solar:calculator-outline',
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
        icon: getIconByName('CreateProduct'),
        id: 'create-product',
        url: '/create-product',
      },
      {
        name: 'Manage Query',
        icon: getIconByName('Query'),
        id: 'manage-query',
        url: '/contact',
      },
      {
        name: 'Manage Category',
        icon: getIconByName('Category'),
        id: 'manage-query',
        url: '/category',
      },
      {
        name: "Manage Material",
        icon: getIconByName("Material"),
        id: "manage-material",
        url: "/material",
      },
      // {
      //   name: 'Manage Size',
      //   icon: getIconByName('Size'),
      //   id: 'manage-query',
      //   url: '/size',
      // },
      // {
      //   name: 'Blogs',
      //   icon: getIconByName('Blog'),
      //   id: 'blogs',
      //   url: '/blogs',
      // },
      // {
      //   name: 'Create Blog',
      //   icon: getIconByName('CreateBlog'),
      //   id: 'create-blog',
      //   url: '/create-blog',
      // },
    ],
  },
];

export default SidebarContent;
