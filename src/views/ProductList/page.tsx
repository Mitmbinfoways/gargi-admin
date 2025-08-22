import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoDataFound from "src/components/NoDataFound";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { deleteProduct, getProducts, UpdateProduct } from "src/AxiosConfig/AxiosConfig";
import { Select, ToggleSwitch } from "flowbite-react";
import DeleteDialog from "src/components/DeleteDialog";
import Pagination from "src/components/Pagination";
import { Toast } from "src/components/Toast";
import Spinner from "../../components/Spinner";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10); // ✅ NEW: limit state
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async (page: number = 1, perPage: number = limit) => {
    setLoading(true);
    try {
      const params = { page, limit: perPage }; // ✅ Pass dynamic limit
      const res = await getProducts(params);
      setData(res.data.data.products || []);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch data when page or limit changes
  useEffect(() => {
    fetchData(currentPage, limit);
  }, [currentPage, limit]);

  const handleEdit = (id: string) => {
    navigate("/create-product", { state: { id } });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      const newData = data.filter((item) => item._id !== id);
      setData(newData);
      setOpen(false);
      if (newData.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchData(currentPage, limit);
      }
      Toast({ message: "Product deleted successfully", type: "success" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (id: string, checked: boolean) => {
    setData((prev) =>
      prev.map((item) => (item._id === id ? { ...item, isActive: checked } : item))
    );
    try {
      await UpdateProduct(id, { isActive: checked.toString() });
    } catch (error) {
      console.error(error);
      setData((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isActive: !checked } : item))
      );
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setCurrentPage(1); // ✅ Reset to page 1 when limit changes
  };

  return (
    <div className="relative min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="bg-white shadow-md rounded-md overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-blue-800">
            <tr>
              <th className="px-4 py-3">Index</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Material</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  <Spinner className="h-[60vh]" />
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((product, index) => (
                <tr key={product._id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {(currentPage - 1) * limit + index + 1} 
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.image?.[0] ? (
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="h-10 w-10 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/fallback-image.jpg";
                        }}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{product.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{product.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{product.material}</td>
                  <td className="px-4 py-3 whitespace-nowrap max-w-xs truncate">
                    {product.quantityPerPack || "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-3 items-center">
                      <MdModeEdit
                        size={18}
                        className="cursor-pointer"
                        title="Edit"
                        onClick={() => handleEdit(product._id)}
                      />
                      <MdDelete
                        size={18}
                        className="text-red-600 cursor-pointer"
                        title="Delete"
                        onClick={() => {
                          setDeleteId(product._id);
                          setOpen(true);
                        }}
                      />
                      <ToggleSwitch
                        checked={String(product.isActive).toLowerCase() === "true"}
                        onChange={(checked) => handleToggle(product._id, checked)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>
                  <NoDataFound />
                </td>
              </tr>
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

      {deleteId && (
        <DeleteDialog
          isOpen={open}
          onDelete={() => handleDelete(deleteId)}
          onCancel={() => {
            setOpen(false);
            setDeleteId(null);
          }}
        />
      )}
    </div>
  );
};

export default Page;
