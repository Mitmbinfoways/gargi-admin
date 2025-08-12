import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoDataFound from "src/components/NoDataFound";
import { MdDelete, MdModeEdit } from "react-icons/md";
import Spinner from "../spinner/Spinner";
import { getBlogs, UpdateBlogs, deleteBlogs } from "src/AxiosConfig/AxiosConfig";
import { ToggleSwitch } from "flowbite-react";

interface BlogContent {
  _id: string;
  icon: string;
  title: string;
  description: string;
}

interface Blog {
  _id: string;
  images: string[];
  title: string;
  description: string;
  content: BlogContent[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Blog[]>([]);
  const [togglingIds, setTogglingIds] = useState<string[]>([]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getBlogs();
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (blogId: string, currentState: boolean) => {
    setTogglingIds((prev) => [...prev, blogId]);
    try {
      // Pass isActive as string to UpdateBlogs API which expects form-data
      await UpdateBlogs(blogId, { isActive: (!currentState).toString() });
      setData((prevData) =>
        prevData.map((blog) =>
          blog._id === blogId ? { ...blog, isActive: !currentState } : blog
        )
      );
    } catch (error) {
      console.error("Toggle isActive failed", error);
    } finally {
      setTogglingIds((prev) => prev.filter((id) => id !== blogId));
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingIds((prev) => [...prev, id]);
    try {
      await deleteBlogs(id);
      setData((prevData) => prevData.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Delete blog failed", error);
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }
  };

  const handleEdit = (id: string) => {
    navigate("/create-blog", { state: { id } });
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Blogs</h1>
      <div className="bg-white shadow-md rounded-md overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-blue-800">
            <tr>
              <th className="px-4 py-3">Index</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 h-full">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <Spinner />
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((blog, index) => (
                <tr key={blog._id}>
                  <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {blog.images && blog.images.length > 0 ? (
                      <img
                        src={blog.images[0]}
                        alt={blog.title}
                        className="h-10 w-10 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/fallback-image.jpg";
                        }}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{blog.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap truncate max-w-xs">
                    {blog.description || "No description"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-3 items-center">
                      <MdModeEdit
                        size={18}
                        className={`cursor-pointer ${togglingIds.includes(blog._id) || deletingIds.includes(blog._id)
                          ? "opacity-50 pointer-events-none"
                          : ""
                          }`}
                        title="Edit"
                        onClick={() => handleEdit(blog._id)}
                      />
                      <MdDelete
                        size={18}
                        className={`text-red-600 cursor-pointer ${deletingIds.includes(blog._id) ? "opacity-50 pointer-events-none" : ""
                          }`}
                        title="Delete"
                        onClick={() => handleDelete(blog._id)}
                      />
                      <ToggleSwitch
                        checked={blog.isActive}
                        disabled={togglingIds.includes(blog._id) || deletingIds.includes(blog._id)}
                        onChange={() => handleToggle(blog._id, blog.isActive)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
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
