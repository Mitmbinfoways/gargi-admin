import { useEffect, useState } from 'react';
import { Button, Label, Textarea, TextInput, Checkbox, Select } from 'flowbite-react';
import ImageUpload from 'src/components/ImageUpload';
import { createProduct, getProductById, UpdateProduct } from 'src/AxiosConfig/AxiosConfig';
import { useLocation, useNavigate } from 'react-router';
import { set } from 'lodash';

interface ProductFormData {
  name: string;
  category: string;
  material: string;
  size?: string;
  color?: string;
  quantityPerPack: string;
  pricePerPack: string;
  stock?: number;
  description?: string;
  isActive: boolean;
  existingImages: string[];
  images: File[];
}

interface ProductFormProps {
  onSubmit?: (
    data: Omit<ProductFormData, 'pricePerPack' | 'quantityPerPack'> & {
      pricePerPack: number;
      quantityPerPack: number;
    },
  ) => void | Promise<void>;
  isSubmitting?: boolean;
}

function Page({ isSubmitting = false }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    material: '',
    size: '',
    quantityPerPack: '',
    pricePerPack: '',
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
      reader.onload = (e) => setImagePreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const previewToRemove = imagePreviews[index];

    // If the preview is an old image URL
    if (formData.existingImages.includes(previewToRemove)) {
      setFormData((prev) => ({
        ...prev,
        existingImages: prev.existingImages.filter((img) => img !== previewToRemove),
      }));
    } else {
      // Remove from newly uploaded files
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => {
          const filePreview = URL.createObjectURL(prev.images[i]);
          return filePreview !== previewToRemove;
        }),
      }));
    }

    // Remove from preview list
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    const priceNum = Number(formData.pricePerPack);
    const qtyNum = Number(formData.quantityPerPack);

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.material) newErrors.material = 'Material is required';
    if (!formData.pricePerPack || priceNum <= 0)
      newErrors.pricePerPack = 'Price must be greater than 0';
    if (!formData.quantityPerPack || qtyNum < 1)
      newErrors.quantityPerPack = 'Quantity must be greater than 0';
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
      pricePerPack: Number(formData.pricePerPack),
      quantityPerPack: Number(formData.quantityPerPack),
    };

    try {
      setLoading(true);
      if (isEdit) {
        await UpdateProduct(id, submitData);
        setLoading(false);
      } else {
        await createProduct(submitData);
        setLoading(false);
      }
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await getProductById(id);
      if (res?.data) {
        const p = res.data.data;
        setFormData({
          name: p.name || '',
          category: p.category || '',
          material: p.material || '',
          size: p.size || '',
          quantityPerPack: String(p.quantityPerPack || ''),
          pricePerPack: String(p.pricePerPack || ''),
          description: p.description || '',
          isActive: p.isActive ?? true,
          existingImages: p.image || [],
          images: [],
        });
        setImagePreviews(p.image || []);
        setIsEdit(true);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 border-b pb-2">
        {isEdit ? 'Edit Product' : 'Create New Product'}
      </h1>

      <form className="space-y-8" onSubmit={handleSubmit} noValidate>
        <div className="flex items-start gap-8">
          <div className="w-full">
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
            {errors.images && <p className="text-red-600 mt-1 text-sm">{errors.images}</p>}
          </div>

          <div className="w-full space-y-4">
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
              {errors.name && <p className="text-red-600 mt-1 text-sm">{errors.name}</p>}
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
                <option value="Plates">Plates</option>
                <option value="Bowls">Bowls</option>
                <option value="Spoons">Spoons</option>
                <option value="Forks">Forks</option>
                <option value="Knives">Knives</option>
                <option value="Cups">Cups</option>
                <option value="Trays">Trays</option>
                <option value="Straws">Straws</option>
                <option value="Napkins & Tissues">Napkins & Tissues</option>
                <option value="Containers">Containers</option>
              </Select>
              {errors.category && <p className="text-red-600 mt-1 text-sm">{errors.category}</p>}
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
                <option value="Paper">Paper</option>
                <option value="Plastic">Plastic</option>
                <option value="Foam">Foam</option>
                <option value="Biodegradable">Biodegradable</option>
                <option value="Palm Leaf">Palm Leaf</option>
                <option value="Bamboo">Bamboo</option>
              </Select>
              {errors.material && <p className="text-red-600 mt-1 text-sm">{errors.material}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">
                Price Per Pack <span className="text-red-600">*</span>
              </Label>
              <TextInput
                type="number"
                placeholder="Enter price"
                value={formData.pricePerPack}
                onChange={(e) => handleChange('pricePerPack', e.target.value)}
                color={errors.pricePerPack ? 'failure' : undefined}
              />
              {errors.pricePerPack && (
                <p className="text-red-600 mt-1 text-sm">{errors.pricePerPack}</p>
              )}
            </div>
            <div>
              <Label className="mb-1 block">
                Quantity Per Pack <span className="text-red-600">*</span>
              </Label>
              <TextInput
                type="number"
                placeholder="Enter quantity"
                value={formData.quantityPerPack}
                onChange={(e) => handleChange('quantityPerPack', e.target.value)}
                color={errors.quantityPerPack ? 'failure' : undefined}
              />
              {errors.quantityPerPack && (
                <p className="text-red-600 mt-1 text-sm">{errors.quantityPerPack}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">Size</Label>
              <Select value={formData.size} onChange={(e) => handleChange('size', e.target.value)}>
                <option value="">Select size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Extra Large">Extra Large</option>
              </Select>
            </div>
            <div>
              <Label className="mb-1 block">Description</Label>
              <Textarea
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              id="isActive"
            />
            <Label htmlFor="isActive" className="mb-0">
              Active
            </Label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" color="primary" disabled={loading}>
            {loading ? 'Submitting...' : isEdit ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Page;
