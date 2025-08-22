import { Icon } from '@iconify/react/dist/iconify.js';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from "../../components/Spinner";
import { getCounts } from 'src/AxiosConfig/AxiosConfig';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    products: 0,
    category: 0,
    material: 0,
  });

  const [loading, setLoading] = useState(false);

  const cardData = [
    {
      title: 'Products',
      value: stats.products,
      icon: 'solar:box-linear',
      bg: 'bg-blue-100',
      textColor: 'text-blue-700',
      link: '/products',
    },
    {
      title: 'Category',
      value: stats.category,
      icon: 'solar:layers-minimalistic-linear',
      bg: 'bg-purple-100',
      textColor: 'text-purple-700',
      link: '/category',
    },
    {
      title: 'Materials',
      value: stats.material,
      icon: 'solar:archive-minimalistic-linear',
      bg: 'bg-green-100',
      textColor: 'text-green-700',
      link: '/material',
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getCounts();

      setStats({
        products: res.data?.data?.products || 0,
        category: res.data?.data?.categories || 0,
        material: res.data?.data?.materials || 0,
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
    <div className="relative">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {loading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cardData.map((card, index: number) => (
            <div
              key={index}
              className={`rounded-xl shadow-md p-6 flex flex-col justify-between h-full ${card.bg}`}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-white mr-4">
                  <Icon icon={card.icon} width={28} className={card.textColor} />
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
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
