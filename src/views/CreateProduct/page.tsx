import { useEffect, useState } from 'react';
import { Button, Label, Textarea, TextInput, Select, ToggleSwitch } from 'flowbite-react'; // ✅ Use ToggleSwitch instead of Checkbox
import ImageUpload from 'src/components/ImageUpload';
import { createProduct, getProductById, UpdateProduct } from 'src/AxiosConfig/AxiosConfig';
import { useLocation, useNavigate } from 'react-router';
import { Toast } from 'src/components/Toast';
import Spinner from '../../components/Spinner';
import { useSelector } from 'react-redux';
import { RootState } from 'src/Store/Store';

interface ProductFormData {
  name: string;
  category: string;
  material: string;
  size?: string;
  color?: string;
  quantityPerPack: string;
  stock?: number;
  description?: string;
  isActive: boolean;
  existingImages: string[];
  images: File[];
}

function Page() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    material: '',
    size: '',
    quantityPerPack: '',
    description: '',
    isActive: true,
    existingImages: [],
    images: [],
  });

  const [isEdit, setIsEdit] = useState(false);
  const location = useLocation();
  const { id } = location.state || {};
  const navigate = useNavigate();

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { category, material } = useSelector((state: RootState) => state.options);

  console.log(category)

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleImageChange = (files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) =>
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const previewToRemove = imagePreviews[index];

    if (formData.existingImages.includes(previewToRemove)) {
      setFormData((prev) => ({
        ...prev,
        existingImages: prev.existingImages.filter((img) => img !== previewToRemove),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2)
      newErrors.name = 'Name must be at least 2 characters';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.material) newErrors.material = 'Material is required';
    if (formData.images.length === 0 && formData.existingImages.length === 0)
      newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      quantityPerPack: Number(formData.quantityPerPack),
    };

    try {
      setLoading(true);
      if (isEdit) {
        await UpdateProduct(id, submitData);
        Toast({ message: 'Product Updated successfully', type: 'success' });
      } else {
        await createProduct(submitData);
        Toast({ message: 'Product Created successfully', type: 'success' });
      }
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductById(id);
      if (res?.data) {
        const p = res.data.data;
        setFormData({
          name: p.name || '',
          category: p.category || '',
          material: p.material || '',
          size: p.size || '',
          quantityPerPack: String(p.quantityPerPack || ''),
          description: p.description || '',
          isActive: p.isActive ?? true,
          existingImages: p.image || [],
          images: [],
        });
        setImagePreviews(p.image || []);
        setIsEdit(true);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 border-b pb-2">
        {isEdit ? 'Edit Product' : 'Create New Product'}
      </h1>

      {loading ? (
        <div className="bg-white rounded">
          <Spinner className="h-[60vh]" />
        </div>
      ) : (
        <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit} noValidate>
          {/* Images + Basic Info */}
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            <div className="w-full md:w-1/2">
              <Label className="mb-2 block text-base font-semibold">
                Images <span className="text-red-600">*</span>
              </Label>
              <ImageUpload
                multiple
                previewUrls={imagePreviews}
                onFilesChange={handleImageChange}
                onRemove={removeImage}
                height="h-28"
              />
              {errors.images && (
                <p className="text-red-600 mt-1 text-sm">{errors.images}</p>
              )}
            </div>

            <div className="w-full md:w-1/2 space-y-4">
              <div>
                <Label className="mb-1 block">
                  Name <span className="text-red-600">*</span>
                </Label>
                <TextInput
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  color={errors.name ? 'failure' : undefined}
                />
                {errors.name && (
                  <p className="text-red-600 mt-1 text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <Label className="mb-1 block">
                  Category <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  color={errors.category ? 'failure' : undefined}
                >
                  <option value="">Select category</option>
                  {category && category.length > 0 && category.map((c: any, i: number) => (
                    <option key={i} value={c?.name}>
                      {c?.name}
                    </option>
                  ))}
                </Select>
                {errors.category && (
                  <p className="text-red-600 mt-1 text-sm">{errors.category}</p>
                )}
              </div>

              <div>
                <Label className="mb-1 block">
                  Material <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={formData.material}
                  onChange={(e) => handleChange('material', e.target.value)}
                  color={errors.material ? 'failure' : undefined}
                >
                  <option value="">Select material</option>
                  {material && material.length > 0 && material.map((c: any, i: number) => (
                    <option key={i} value={c?.name}>
                      {c?.name}
                    </option>
                  ))}
                </Select>
                {errors.material && (
                  <p className="text-red-600 mt-1 text-sm">{errors.material}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex gap-6">
            {/* Left Column */}
            <div className="flex flex-col gap-4 w-1/2">
              {/* Quantity Per Pack */}
              <div>
                <Label className="mb-1 block">
                  Quantity Per Pack
                </Label>
                <TextInput
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantityPerPack}
                  onChange={(e) => handleChange("quantityPerPack", e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  color={errors.quantityPerPack ? "failure" : undefined}
                />
                {errors.quantityPerPack && (
                  <p className="text-red-600 mt-1 text-sm">{errors.quantityPerPack}</p>
                )}
              </div>

              {/* Size Text Field */}
              <div>
                <Label className="mb-1 block">Size</Label>
                <TextInput
                  type="text"
                  placeholder="Enter size"
                  value={formData.size}
                  onChange={(e) => handleChange("size", e.target.value)}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1">
              <Label className="mb-1 block">Description</Label>
              <Textarea
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={5}
              />
            </div>
          </div>

          {/* Active Toggle Switch */}
          <div className="flex flex-col items-start gap-3">
            <div className='flex items-center gap-4'>
              <span className='text-black font-semibold'>{formData.isActive ? "Active" : "Inactive"}</span>
              <ToggleSwitch
                checked={formData.isActive}
                onChange={(checked) => handleChange('isActive', checked)}
              />
            </div>
            <p className="text-xs text-gray-500">
              {formData.isActive ? (
                <>
                  <span className="text-red-600">*</span> When active is ON, the product will be visible to users.
                </>
              ) : (
                "When inactive, the product will stay hidden from users."
              )}
            </p>

          </div>

          <div className="flex gap-2 justify-end pt-2 sm:pt-4">
            {isEdit && (
              <button
                type="button"
                onClick={() => {
                  navigate('/products');
                }}
                className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 border border-gray-300 transition"
              >
                Cancel
              </button>
            )}
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? 'Submitting...' : isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Page;
