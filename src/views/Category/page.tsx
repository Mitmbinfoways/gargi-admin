import { Button, TextInput, ToggleSwitch, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import NoDataFound from "src/components/NoDataFound";
import {
    getAllCategorys,
    createCategory,
    updateCategory,
    deleteCategory,
} from "src/AxiosConfig/AxiosConfig";
import DeleteDialog from "src/components/DeleteDialog";
import useDebounce from "src/Hook/useDebounce";

interface Category {
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

const Page: React.FC = () => {
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [categoryInput, setCategoryInput] = useState<string>("");
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
    const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
    const [editInput, setEditInput] = useState<string>("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

    const search = useDebounce(searchTerm, 300)

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = {
                search: search,
                isAction: true,
            };
            const res = await getAllCategorys(data);
            if (res?.data) {
                const sorted = (res.data.data || []).sort(
                    (a: Category, b: Category) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setCategoryList(sorted);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!categoryInput.trim()) {
            setError((prev) => ({ ...prev, create: "Category name is required!" }));
            return;
        }
        try {
            setLoadingStates((prev) => ({ ...prev, create: true }));
            setError((prev) => ({ ...prev, create: "" }));

            const res = await createCategory({ name: categoryInput.trim() });
            if (res?.status === 201 || res?.status === 200) {
                const newCategory: Category = res.data.data || res.data;
                setCategoryList((prev) => [newCategory, ...prev]);
                setCategoryInput("");
                setShowCategoryForm(false);
            }
        } catch (err: any) {
            console.error("Error creating category:", err);
            setError((prev) => ({
                ...prev,
                create: err?.response?.data?.message || "Failed to create category!",
            }));
        } finally {
            setLoadingStates((prev) => ({ ...prev, create: false }));
        }
    };

    const handleEditClick = (category: Category) => {
        setEditCategoryId(category._id);
        setEditInput(category.name);
        setError((prev) => ({ ...prev, update: "" }));
    };

    const handleUpdateCategory = async (id: string) => {
        if (!editInput.trim()) {
            setError((prev) => ({ ...prev, update: "Category name is required!" }));
            return;
        }
        try {
            setLoadingStates((prev) => ({ ...prev, update: id }));
            const res = await updateCategory({ name: editInput.trim(), id: id });
            if (res?.status === 200) {
                setCategoryList((prev) =>
                    prev.map((cat) =>
                        cat._id === id ? { ...cat, name: editInput.trim() } : cat
                    )
                );
                setEditCategoryId(null);
                setEditInput("");
            }
        } catch (err: any) {
            console.error("Error updating category:", err);
            setError((prev) => ({
                ...prev,
                update: err?.response?.data?.message || "Failed to update category!",
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

    const confirmDeleteCategory = async () => {
        if (!selectedDeleteId) return;
        try {
            setLoadingStates((prev) => ({ ...prev, delete: selectedDeleteId }));
            const res = await deleteCategory(selectedDeleteId);
            if (res?.status === 200) {
                setCategoryList((prev) =>
                    prev.filter((cat) => cat._id !== selectedDeleteId)
                );
                setIsDeleteDialogOpen(false);
                setSelectedDeleteId(null);
            }
        } catch (err: any) {
            console.error("Error deleting category:", err);
            setError((prev) => ({
                ...prev,
                delete: err?.response?.data?.message || "Failed to delete category!",
            }));
        } finally {
            setLoadingStates((prev) => ({ ...prev, delete: null }));
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            setLoadingStates((prev) => ({ ...prev, toggle: id }));
            const res = await updateCategory({ id, isActive: !currentStatus });
            if (res?.status === 200) {
                setCategoryList((prev) =>
                    prev.map((cat) =>
                        cat._id === id ? { ...cat, isActive: !currentStatus } : cat
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
        fetchCategories();
    }, [search]);

    return (
        <div>
            <div className="mb-4 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Category</h2>
                    <Button
                        color="primary"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => setShowCategoryForm((prev) => !prev)}
                    >
                        {showCategoryForm ? "Cancel" : "Create New Category"}
                    </Button>
                </div>
                <div>
                    <TextInput
                        className="w-full sm:w-1/3"
                        placeholder="Search Category"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded flex justify-center items-center h-[60vh] w-full">
                    <Spinner size="xl" />
                </div>
            ) : showCategoryForm ? (
                <form
                    onSubmit={handleCategorySubmit}
                    className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 flex flex-col mb-4 gap-5 bg-white shadow-md rounded-lg p-4 sm:p-6"
                >
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Create Category</h2>
                    <div>
                        <TextInput
                            value={categoryInput}
                            onChange={(e) => {
                                if (error.create) {
                                    setError((prev) => ({ ...prev, create: "" }));
                                }
                                setCategoryInput(e.target.value);
                            }}
                            placeholder="Enter category name"
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
                        {loadingStates.create ? "Creating..." : "Create Category"}
                    </Button>
                </form>
            ) : categoryList.length === 0 ? (
                <div className="bg-white rounded-md">
                    <NoDataFound />
                </div>
            ) : (
                <ul className="bg-white shadow-md rounded-md divide-y">
                    {categoryList.map((category, index: number) => (
                        <li
                            key={category._id}
                            className="p-4 text-black hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
                        >
                            {editCategoryId === category._id ? (
                                <div className="flex items-center gap-3 w-full">
                                    <TextInput
                                        value={editInput}
                                        onChange={(e) => setEditInput(e.target.value)}
                                        className="w-2/3 lg:w-full"
                                        disabled={loadingStates.update === category._id}
                                    />
                                    <Button
                                        size="xs"
                                        color="primary"
                                        disabled={loadingStates.update === category._id}
                                        onClick={() => handleUpdateCategory(category._id)}
                                    >
                                        {loadingStates.update === category._id ? "Updating..." : "Save"}
                                    </Button>
                                    <Button
                                        size="xs"
                                        color="gray"
                                        onClick={() => setEditCategoryId(null)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <span className="flex gap-5"> <span>{index + 1}</span>{category.name}</span>
                                    <div className="flex gap-3 items-center">
                                        <MdModeEdit
                                            onClick={() => handleEditClick(category)}
                                            className="text-black cursor-pointer hover:text-blue-600 transition"
                                            size={18}
                                            title="Edit"
                                        />
                                        <MdDelete
                                            onClick={() => handleOpenDeleteDialog(category._id)}
                                            className="text-red-600 cursor-pointer hover:text-red-800 transition"
                                            size={18}
                                            title="Delete"
                                        />
                                        <ToggleSwitch
                                            checked={category.isActive}
                                            onChange={() =>
                                                handleToggleStatus(category._id, category.isActive)
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
                onDelete={confirmDeleteCategory}
                onCancel={handleCancelDelete}
                message={"Are you sure you want to delete this Category?"}
            />
        </div>
    );
};

export default Page;
