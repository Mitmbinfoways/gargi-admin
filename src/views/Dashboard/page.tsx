import { Icon } from '@iconify/react/dist/iconify.js';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from "../spinner/Spinner";
import { getCounts } from 'src/AxiosConfig/AxiosConfig';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    products: 0,
    blogs: 0,
  });

  const [loading, setLoading] = useState(false);

  const cardData = [
    {
      title: 'Products',
      value: stats.products || 0,
      icon: 'solar:box-linear',
      bg: 'bg-blue-100',
      textColor: 'text-blue-700',
      link: '/products',
    },
    // {
    //   title: 'Blogs',
    //   value: stats.blogs || 0,
    //   icon: 'solar:layers-minimalistic-linear',
    //   bg: 'bg-green-100',
    //   textColor: 'text-orange-700',
    //   link: '/blogs',
    // },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getCounts();

      setStats({
        products: res.data?.data?.products || 0,
        blogs: res.data?.data?.blogs || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 relative min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full bg-white rounded">
            <Spinner className='h-[70vh]'/>
          </div>
        ) : (
          cardData.map((card, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-md p-6 flex flex-col justify-between h-full ${card.bg}`}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-white mr-4">
                  <Icon icon={card.icon} width={28} className={`${card.textColor}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${card.textColor}`}>{card.title}</p>
                  <h3 className="text-xl font-bold text-gray-800">{card.value}</h3>
                </div>
              </div>
              <div className="text-right mt-auto">
                <Link
                  to={card.link}
                  className={`inline-flex items-center text-sm font-medium hover:underline ${card.textColor}`}
                >
                  View All
                  <Icon icon="solar:arrow-right-linear" className="ml-1" width={16} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
