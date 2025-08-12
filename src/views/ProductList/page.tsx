import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoDataFound from "src/components/NoDataFound";
import { MdDelete, MdModeEdit } from "react-icons/md";
import Spinner from "../spinner/Spinner";
import { deleteProduct, getProducts, UpdateProduct } from "src/AxiosConfig/AxiosConfig";
import { ToggleSwitch } from "flowbite-react";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setData(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate("/create-product", { state: { id } });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (id: string, checked: boolean) => {
    setData((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, isActive: checked } : item
      )
    );
    try {
      const data = {
        isActive: checked.toString()
      }
      await UpdateProduct(id, data);
    } catch (error) {
      console.error(error);
      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isActive: !checked } : item
        )
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
              <th className="px-4 py-3">Price/Pack</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Material</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  <Spinner />
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((product, index) => (
                <tr key={product._id}>
                  <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.image?.[0] ? (
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="h-10 w-10 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/fallback-image.jpg";
                        }}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{product.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    ₹{product.pricePerPack}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{product.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{product.material}</td>
                  <td className="px-4 py-3 whitespace-nowrap max-w-xs truncate">
                    {product.description || "—"}
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
                        onClick={() => handleDelete(product._id)}
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
                <td colSpan={9}>
                  <NoDataFound />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
