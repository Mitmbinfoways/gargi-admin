import { Button, TextInput, ToggleSwitch, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import NoDataFound from "src/components/NoDataFound";
import DeleteDialog from "src/components/DeleteDialog";
import useDebounce from "src/Hook/useDebounce";
import { createSize, deleteSize, getAllSize, updateSize } from "src/AxiosConfig/AxiosConfig";

interface Size {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ErrorState {
  create: string;
  update: string;
  delete: string;
}

interface LoadingState {
  create: boolean;
  update: string | null;
  delete: string | null;
  toggle: string | null;
}

const page: React.FC = () => {
  const [sizeList, setSizeList] = useState<Size[]>([]);
  const [sizeInput, setSizeInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState<LoadingState>({
    create: false,
    update: null,
    delete: null,
    toggle: null,
  });
  const [error, setError] = useState<ErrorState>({
    create: "",
    update: "",
    delete: "",
  });
  const [showSizeForm, setShowSizeForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editSizeId, setEditSizeId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const search = useDebounce(searchTerm, 300);

  const fetchSizes = async () => {
    setLoading(true);
    try {
      const res = await getAllSize({ search, isAction: true });
      if (res?.status === 200) {
        const sorted = (res.data.data || []).sort(
          (a: Size, b: Size) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSizeList(sorted);
      } else {
        setSizeList([]);
      }
    } catch (err) {
      console.error("Error fetching sizes:", err);
      setSizeList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSizeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sizeInput.trim()) {
      setError((prev) => ({ ...prev, create: "Size name is required!" }));
      return;
    }
    try {
      setLoadingStates((prev) => ({ ...prev, create: true }));
      setError((prev) => ({ ...prev, create: "" }));

      const res = await createSize({ name: sizeInput.trim() });
      if (res?.status === 201 || res?.status === 200) {
        const newSize: Size = res.data.data || res.data;
        setSizeList((prev) => [newSize, ...prev]);
        setSizeInput("");
        setShowSizeForm(false);
      }
    } catch (err: any) {
      console.error("Error creating size:", err);
      setError((prev) => ({
        ...prev,
        create: err?.response?.data?.errorData || "Failed to create size!",
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, create: false }));
    }
  };

  const handleEditClick = (size: Size) => {
    setEditSizeId(size._id);
    setEditInput(size.name);
    setError((prev) => ({ ...prev, update: "" }));
  };

  const handleUpdateSize = async (id: string) => {
    if (!editInput.trim()) {
      setError((prev) => ({ ...prev, update: "Size name is required!" }));
      return;
    }
    try {
      setLoadingStates((prev) => ({ ...prev, update: id }));
      const res = await updateSize({ name: editInput.trim(), id });
      if (res?.status === 200) {
        setSizeList((prev) =>
          prev.map((sz) =>
            sz._id === id ? { ...sz, name: editInput.trim() } : sz
          )
        );
        setEditSizeId(null);
        setEditInput("");
      }
    } catch (err: any) {
      console.error("Error updating size:", err);
      setError((prev) => ({
        ...prev,
        update: err?.response?.data?.message || "Failed to update size!",
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, update: null }));
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    setSelectedDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSelectedDeleteId(null);
  };

  const confirmDeleteSize = async () => {
    if (!selectedDeleteId) return;
    try {
      setLoadingStates((prev) => ({ ...prev, delete: selectedDeleteId }));
      const res = await deleteSize(selectedDeleteId);
      if (res?.status === 200) {
        setSizeList((prev) =>
          prev.filter((sz) => sz._id !== selectedDeleteId)
        );
        setIsDeleteDialogOpen(false);
        setSelectedDeleteId(null);
      }
    } catch (err: any) {
      console.error("Error deleting size:", err);
      setError((prev) => ({
        ...prev,
        delete: err?.response?.data?.message || "Failed to delete size!",
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, delete: null }));
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setLoadingStates((prev) => ({ ...prev, toggle: id }));
      const res = await updateSize({ id, isActive: !currentStatus });
      if (res?.status === 200) {
        setSizeList((prev) =>
          prev.map((sz) =>
            sz._id === id ? { ...sz, isActive: !currentStatus } : sz
          )
        );
      }
    } catch (err: any) {
      console.error("Error updating status:", err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, toggle: null }));
    }
  };

  useEffect(() => {
    fetchSizes();
  }, [search]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Size</h2>
          <Button
            color="primary"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => setShowSizeForm((prev) => !prev)}
          >
            {showSizeForm ? "Cancel" : "Create New Size"}
          </Button>
        </div>
        <div>
          <TextInput
            className="w-full sm:w-1/3"
            placeholder="Search Size"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded flex justify-center items-center h-[60vh] w-full">
          <Spinner size="xl" />
        </div>
      ) : showSizeForm ? (
        <form
          onSubmit={handleSizeSubmit}
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 flex flex-col mb-4 gap-5 bg-white shadow-md rounded-lg p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Create Size</h2>
          <div>
            <TextInput
              value={sizeInput}
              onChange={(e) => {
                if (error.create) {
                  setError((prev) => ({ ...prev, create: "" }));
                }
                setSizeInput(e.target.value);
              }}
              placeholder="Enter size name"
              disabled={loadingStates.create}
            />
            {error.create && <div className="text-red-600 mt-1">{error.create}</div>}
          </div>
          <Button
            color="primary"
            type="submit"
            size="sm"
            disabled={loadingStates.create}
            className="w-full sm:w-auto"
          >
            {loadingStates.create ? "Creating..." : "Create Size"}
          </Button>
        </form>
      ) : sizeList.length === 0 ? (
        <div className="bg-white rounded-md">
          <NoDataFound />
        </div>
      ) : (
        <ul className="bg-white shadow-md rounded-md divide-y">
          {sizeList.map((size, index: number) => (
            <li
              key={size._id}
              className="p-4 text-black hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
            >
              {editSizeId === size._id ? (
                <div className="flex items-center gap-3 w-full">
                  <TextInput
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    className="w-2/3 lg:w-full"
                    disabled={loadingStates.update === size._id}
                  />
                  <Button
                    size="xs"
                    color="primary"
                    disabled={loadingStates.update === size._id}
                    onClick={() => handleUpdateSize(size._id)}
                  >
                    {loadingStates.update === size._id ? "Updating..." : "Save"}
                  </Button>
                  <Button
                    size="xs"
                    color="gray"
                    onClick={() => setEditSizeId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <span className="flex gap-5">
                    <span>{index + 1}</span>{size.name}
                  </span>
                  <div className="flex gap-3 items-center">
                    <MdModeEdit
                      onClick={() => handleEditClick(size)}
                      className="text-black cursor-pointer hover:text-blue-600 transition"
                      size={18}
                      title="Edit"
                    />
                    <MdDelete
                      onClick={() => handleOpenDeleteDialog(size._id)}
                      className="text-red-600 cursor-pointer hover:text-red-800 transition"
                      size={18}
                      title="Delete"
                    />
                    <ToggleSwitch
                      checked={size.isActive}
                      onChange={() =>
                        handleToggleStatus(size._id, size.isActive)
                      }
                    />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onDelete={confirmDeleteSize}
        onCancel={handleCancelDelete}
        message={"Are you sure you want to delete this Size?"}
      />
    </div>
  );
};

export default page;
