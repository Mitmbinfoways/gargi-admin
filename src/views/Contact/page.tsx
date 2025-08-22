import { useEffect, useState } from "react";
import NoDataFound from "src/components/NoDataFound";
import { getAllQuarys } from "src/AxiosConfig/AxiosConfig";
import Spinner from "../../components/Spinner";
import Pagination from "src/components/Pagination"; // ✅ Import Pagination
import { Select } from "flowbite-react";

interface Quarries {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const Page = () => {
  const [data, setData] = useState<Quarries[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchData = async (page = 1, perPage = limit) => {
    setLoading(true);
    try {
      const params = { page, limit: perPage };
      const response = await getAllQuarys(params);
      setData(response.data.data.queries || response.data.data || []);
      setTotalPages(response.data.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, limit);
  }, [currentPage, limit]);

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="mb-3">
        <h1 className="text-2xl font-bold mb-3">Queries</h1>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-md">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-blue-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Index</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <Spinner className="h-[60vh]" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <NoDataFound />
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item?.firstName} {item?.lastName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{item?.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item?.phone}</td>
                  <td className="px-4 py-3">{item?.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center p-4">
          <div />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
          <div className="px-12">
            <Select value={limit} onChange={handleLimitChange}>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
