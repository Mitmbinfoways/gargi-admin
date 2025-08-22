import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FaPlus, FaTrash, FaTimes, FaImage } from "react-icons/fa";
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import ImageUpload from "src/components/ImageUpload";
import { createBlog, getBlogById, UpdateBlogs } from "src/AxiosConfig/AxiosConfig";
import { useLocation, useNavigate } from "react-router";
import Spinner from "../../components/Spinner";

function Page() {
  const location = useLocation();
  const id = location.state?.id;
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<(File | string)[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [contentBlockImages, setContentBlockImages] = useState<{
    [key: number]: { file: File; preview: string };
  }>({});

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      content: [{ icon: "", title: "", description: "" }],
    },
  });

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = form;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "content",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getBlogById(id);
      const blog = res.data.data;

      replace(blog.content || [{ icon: "", title: "", description: "" }]);

      reset({
        title: blog.title,
        description: blog.description,
        content: blog.content || [{ icon: "", title: "", description: "" }],
      });

      setSelectedImages(blog.images || []);
      setImagePreviews(blog.images || []);
    } catch (error) {
      console.error("Error loading blog data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onNewImagesAdded = (files: File[]) => {
    setSelectedImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) =>
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleContentBlockImageChange = (
    blockIndex: number,
    file: File,
    input: HTMLInputElement
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setContentBlockImages((prev) => ({
        ...prev,
        [blockIndex]: { file, preview: e.target?.result as string },
      }));
    };
    reader.readAsDataURL(file);
    input.value = "";
  };

  const removeContentBlockImage = (blockIndex: number) => {
    setContentBlockImages((prev) => {
      const updated = { ...prev };
      delete updated[blockIndex];
      return updated;
    });
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const data = {
        title: values.title,
        description: values.description,
        images: selectedImages,
        content: values.content,
      };
      if (id) {
        await UpdateBlogs(id, data, contentBlockImages);
      } else {
        await createBlog(data, contentBlockImages);
      }
      reset();
      setSelectedImages([]);
      setImagePreviews([]);
      setContentBlockImages({});
      navigate("/blogs")
    } catch (err) {
      console.error("Error submitting blog:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 border-b pb-2">
        {id ? "Edit Blog" : "Create New Blog"}
      </h1>
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-end gap-8">
          <div>
            <Label className="mb-2 block text-base font-semibold">Images</Label>
            <ImageUpload
              multiple
              previewUrls={imagePreviews}
              onFilesChange={onNewImagesAdded}
              onRemove={removeImage}
              height="h-28"
            />
          </div>
          <div className="space-y-4">
            <div>
              <Label className="mb-1 block">Title</Label>
              <TextInput
                placeholder="Enter blog title"
                {...register("title", { required: "Title is required" })}
                aria-invalid={errors.title ? "true" : "false"}
                color={errors.title ? "failure" : undefined}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Label className="mb-1 block">Description</Label>
              <Textarea
                placeholder="Enter blog description"
                rows={5}
                {...register("description", { required: "Description is required" })}
                aria-invalid={errors.description ? "true" : "false"}
                color={errors.description ? "failure" : undefined}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content blocks */}
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-6">
                {/* Block Image */}
                <div>
                  <Label className="mb-1 block">Block Image</Label>
                  {contentBlockImages[index] ? (
                    <div className="my-2">
                      <img
                        src={contentBlockImages[index].preview}
                        alt={`Block ${index + 1} preview`}
                        className="w-24 h-24 object-cover rounded border"
                      />
                    </div>
                  ) : field.icon && typeof field.icon === "string" && field.icon ? (
                    <div className="my-2">
                      <img
                        src={field.icon}
                        alt={`Block ${index + 1} preview`}
                        className="w-24 h-24 object-cover rounded border"
                      />
                    </div>
                  ) : null}
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      id={`block-image-${index}`}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleContentBlockImageChange(index, file, e.target);
                        }
                      }}
                    />
                    <label
                      htmlFor={`block-image-${index}`}
                      className="flex items-center justify-center w-full h-10 px-3 py-2 text-sm border rounded-md cursor-pointer bg-white hover:bg-gray-100"
                    >
                      <FaImage className="h-4 w-4 mr-2" />
                      {contentBlockImages[index] || (field.icon && typeof field.icon === "string" && field.icon)
                        ? "Change Image"
                        : "Upload Image"}
                    </label>
                    {(contentBlockImages[index] || (field.icon && typeof field.icon === "string" && field.icon)) && (
                      <Button
                        type="button"
                        size="sm"
                        color="failure"
                        className="ml-2"
                        onClick={() => removeContentBlockImage(index)}
                      >
                        <FaTimes className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Block Title */}
                <div>
                  <Label className="mb-1 block">Block Title</Label>
                  <TextInput
                    placeholder="Enter block title"
                    {...register(`content.${index}.title` as const)}
                  />
                </div>
              </div>

              {/* Block Description */}
              <div>
                <Label className="mb-1 block">Block Description</Label>
                <Textarea
                  placeholder="Enter block description"
                  rows={2}
                  {...register(`content.${index}.description` as const)}
                />
              </div>
              {fields.length > 1 && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    color="failure"
                    onClick={() => remove(index)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              )}
            </div>
          ))}

          <Button
            type="button"
            color="light"
            size="sm"
            onClick={() => append({ icon: "", title: "", description: "" })}
          >
            <FaPlus className="h-4 w-4 mr-2" />
            Add Block
          </Button>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <Button type="submit" color="primary">
            {id ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Page;