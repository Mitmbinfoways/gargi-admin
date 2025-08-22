import { Button, TextInput, ToggleSwitch, Spinner, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import NoDataFound from "src/components/NoDataFound";
import DeleteDialog from "src/components/DeleteDialog";
import useDebounce from "src/Hook/useDebounce";
import { createMaterial, deleteMaterial, getAllMaterial, updateMaterial } from "src/AxiosConfig/AxiosConfig";
import Pagination from "src/components/Pagination";

interface Material {
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

const MaterialPage: React.FC = () => {
  const [materialList, setMaterialList] = useState<Material[]>([]);
  const [materialInput, setMaterialInput] = useState<string>("");
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
  const [showMaterialForm, setShowMaterialForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editMaterialId, setEditMaterialId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const search = useDebounce(searchTerm, 300);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const data = {
        page: currentPage,
        limit,
        search,
        isAction: true
      }
      const res = await getAllMaterial(data);
      if (res?.status === 200) {
        const sorted = (res.data.data.materials || []).sort(
          (a: Material, b: Material) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setMaterialList(sorted);
        setTotalPages(res.data.data.pagination?.totalPages || 1)
      } else {
        setMaterialList([]);
      }
    } catch (err) {
      console.error("Error fetching materials:", err);
      setMaterialList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!materialInput.trim()) {
      setError((prev) => ({ ...prev, create: "Material name is required!" }));
      return;
    }
    try {
      setLoadingStates((prev) => ({ ...prev, create: true }));
      setError((prev) => ({ ...prev, create: "" }));

      const res = await createMaterial({ name: materialInput.trim() });
      if (res?.status === 201 || res?.status === 200) {
        const newMaterial: Material = res.data.data || res.data;
        setMaterialList((prev) => [newMaterial, ...prev]);
        setMaterialInput("");
        setShowMaterialForm(false);
        fetchMaterials()
      }
    } catch (err: any) {
      console.error("Error creating material:", err);
      setError((prev) => ({
        ...prev,
        create: err?.response?.data?.message || "Failed to create material!",
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, create: false }));
    }
  };

  const handleEditClick = (material: Material) => {
    setEditMaterialId(material._id);
    setEditInput(material.name);
    setError((prev) => ({ ...prev, update: "" }));
  };

  const handleUpdateMaterial = async (id: string) => {
    if (!editInput.trim()) {
      setError((prev) => ({ ...prev, update: "Material name is required!" }));
      return;
    }
    try {
      setLoadingStates((prev) => ({ ...prev, update: id }));
      const res = await updateMaterial({ name: editInput.trim(), id });
      if (res?.status === 200) {
        setMaterialList((prev) =>
          prev.map((mat) =>
            mat._id === id ? { ...mat, name: editInput.trim() } : mat
          )
        );
        setEditMaterialId(null);
        setEditInput("");
      }
    } catch (err: any) {
      console.error("Error updating material:", err);
      setError((prev) => ({
        ...prev,
        update: err?.response?.data?.message || "Failed to update material!",
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

  const confirmDeleteMaterial = async () => {
    if (!selectedDeleteId) return;
    try {
      setLoadingStates((prev) => ({ ...prev, delete: selectedDeleteId }));
      const res = await deleteMaterial(selectedDeleteId);
      if (res?.status === 200) {
        setMaterialList((prev) =>
          prev.filter((mat) => mat._id !== selectedDeleteId)
        );
        setIsDeleteDialogOpen(false);
        setSelectedDeleteId(null);
        fetchMaterials()
      }
    } catch (err: any) {
      console.error("Error deleting material:", err);
      setError((prev) => ({
        ...prev,
        delete: err?.response?.data?.message || "Failed to delete material!",
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, delete: null }));
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setLoadingStates((prev) => ({ ...prev, toggle: id }));
      const res = await updateMaterial({ id, isActive: !currentStatus });
      if (res?.status === 200) {
        setMaterialList((prev) =>
          prev.map((mat) =>
            mat._id === id ? { ...mat, isActive: !currentStatus } : mat
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
    fetchMaterials();
  }, [search, currentPage, limit]);

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Material</h2>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          {!showMaterialForm && <TextInput
            className="w-full sm:w-1/3"
            placeholder="Search Material"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />}
          <div className="w-full flex justify-end">
            <Button
              color="primary"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setShowMaterialForm((prev) => !prev)}
            >
              {showMaterialForm ? "Cancel" : "Create New Material"}
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded flex justify-center items-center h-[60vh] w-full">
          <Spinner size="xl" />
        </div>
      ) : showMaterialForm ? (
        <form
          onSubmit={handleMaterialSubmit}
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 flex flex-col mb-4 gap-5 bg-white shadow-md rounded-lg p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Create Material</h2>
          <div>
            <TextInput
              value={materialInput}
              onChange={(e) => {
                if (error.create) {
                  setError((prev) => ({ ...prev, create: "" }));
                }
                setMaterialInput(e.target.value);
              }}
              placeholder="Enter material name"
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
            {loadingStates.create ? "Creating..." : "Create Material"}
          </Button>
        </form>
      ) : materialList.length === 0 ? (
        <div className="bg-white rounded-md">
          <NoDataFound />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-md">
          <ul className="divide-y">
            {materialList.map((material, index: number) => (
              <li
                key={material._id}
                className="p-4 text-black hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
              >
                {editMaterialId === material._id ? (
                  <div className="flex items-center gap-3 w-full">
                    <TextInput
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      className="w-2/3 lg:w-full"
                      disabled={loadingStates.update === material._id}
                    />
                    <Button
                      size="xs"
                      color="primary"
                      disabled={loadingStates.update === material._id}
                      onClick={() => handleUpdateMaterial(material._id)}
                    >
                      {loadingStates.update === material._id ? "Updating..." : "Save"}
                    </Button>
                    <Button
                      size="xs"
                      color="gray"
                      onClick={() => setEditMaterialId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="flex gap-5">
                      <span>{(currentPage - 1) * limit + index + 1}</span>{material.name}
                    </span>
                    <div className="flex gap-3 items-center">
                      <MdModeEdit
                        onClick={() => handleEditClick(material)}
                        className="text-black cursor-pointer hover:text-blue-600 transition"
                        size={18}
                        title="Edit"
                      />
                      <MdDelete
                        onClick={() => handleOpenDeleteDialog(material._id)}
                        className="text-red-600 cursor-pointer hover:text-red-800 transition"
                        size={18}
                        title="Delete"
                      />
                      <ToggleSwitch
                        checked={material.isActive}
                        onChange={() =>
                          handleToggleStatus(material._id, material.isActive)
                        }
                      />
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
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
      )}

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onDelete={confirmDeleteMaterial}
        onCancel={handleCancelDelete}
        message={"Are you sure you want to delete this Material?"}
      />
    </div>
  );
};

export default MaterialPage;
