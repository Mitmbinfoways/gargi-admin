import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const Login = async (data: any) => {
  return axiosInstance.post(`/api/v1/admin/login`, data);
};

export const createProduct = async (data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key !== 'images' && data[key] !== undefined && data[key] !== null) {
      formData.append(key, String(data[key]));
    }
  });
  if (Array.isArray(data.images)) {
    data.images.forEach((file: File) => {
      formData.append('images', file);
    });
  }
  return axiosInstance.post('/api/v1/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getProducts = async (data: any) => {
  return axiosInstance.get(`/api/v1/products?page=${data.page}&limit=${data.limit}`);
};

export const UpdateProduct = async (id: string, data: any) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (
      key !== 'images' &&
      key !== 'existingImages' &&
      data[key] !== undefined &&
      data[key] !== null
    ) {
      formData.append(key, String(data[key]));
    }
  });

  if (Array.isArray(data.existingImages)) {
    data.existingImages.forEach((url: string) => {
      formData.append('existingImages', url);
    });
  }

  if (Array.isArray(data.images)) {
    data.images.forEach((file: File) => {
      if (file instanceof File) {
        formData.append('images', file);
      }
    });
  }

  return axiosInstance.put(`/api/v1/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getProductById = async (id: any) => {
  return axiosInstance.get(`/api/v1/products/${id}`);
};

export const deleteProduct = async (id: any) => {
  return axiosInstance.delete(`/api/v1/products/${id}`);
};

export const createBlog = async (
  data: any,
  contentBlockImages: { [key: number]: { file: File } },
) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key !== 'images' && key !== 'content' && data[key] !== undefined && data[key] !== null) {
      formData.append(key, String(data[key]));
    }
  });

  if (Array.isArray(data.images)) {
    data.images.forEach((file: File) => {
      formData.append('images', file);
    });
  }

  if (Array.isArray(data.content)) {
    data.content.forEach((block: any, index: number) => {
      formData.append(`content[${index}][title]`, block.title || '');
      formData.append(`content[${index}][description]`, block.description || '');

      if (contentBlockImages && contentBlockImages[index]?.file) {
        formData.append(`content[${index}][icon]`, contentBlockImages[index].file);
      } else {
        formData.append(`content[${index}][icon]`, block.icon || '');
      }
    });
  }

  return axiosInstance.post('/api/v1/blogs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getBlogs = async () => {
  return axiosInstance.get('/api/v1/blogs');
};

export const UpdateBlogs = async (
  id: string,
  data: any,
  contentBlockImages?: { [key: number]: { file: File } },
) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key !== 'images' && key !== 'content' && data[key] !== undefined && data[key] !== null) {
      formData.append(key, String(data[key]));
    }
  });

  if (Array.isArray(data.images)) {
    data.images.forEach((item: any) => {
      if (typeof item === 'string') {
        formData.append('existingImages[]', item);
      } else if (item instanceof File) {
        formData.append('images', item);
      }
    });
  }

  if (Array.isArray(data.content)) {
    data.content.forEach((block: any, index: number) => {
      formData.append(`content[${index}][title]`, block.title || '');
      formData.append(`content[${index}][description]`, block.description || '');
      if (contentBlockImages && contentBlockImages[index]?.file) {
        formData.append(`content[${index}][icon]`, contentBlockImages[index].file);
      } else {
        formData.append(`content[${index}][icon]`, block.icon || '');
      }
    });
  }

  return axiosInstance.put(`/api/v1/blogs/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getBlogById = async (id: any) => {
  return axiosInstance.get(`/api/v1/blogs/${id}`);
};

export const getUserProfile = async (id: any) => {
  return axiosInstance.get(`/api/v1/profile/${id}`);
};

export const updateUserProfile = async (data: any) => {
  return axiosInstance.put(`/api/v1/profile`, data);
};

export const deleteBlogs = async (id: any) => {
  return axiosInstance.delete(`/api/v1/blogs/${id}`);
};
export const getCounts = () => {
  return axiosInstance.get(`api/v1/products/dashboard/counts`);
};

export const getAllQuarys = () => {
  return axiosInstance.get("/api/v1/contact")
}

export const createCategory = (data: any) => {
  return axiosInstance.post("/api/v1/category", data)
}

export const getAllCategorys = (data: any) => {
  const { search, isActive } = data
  return axiosInstance.get(`/api/v1/category?search=${search}&isActive=${isActive}`)
}

export const updateCategory = (data: any) => {
  const { id } = data
  return axiosInstance.put(`/api/v1/category/${id}`, data)
}

export const deleteCategory = (id: any) => {
  return axiosInstance.delete(`/api/v1/category/${id}`)
}

export const createMaterial = (data: any) => {
  return axiosInstance.post("/api/v1/material", data)
}

export const getAllMaterial = (data: any) => {
  const { search, isActive } = data
  return axiosInstance.get(`/api/v1/material?search=${search}&isActive=${isActive}`)
}

export const updateMaterial = (data: any) => {
  const { id } = data
  return axiosInstance.put(`/api/v1/material/${id}`, data)
}

export const deleteMaterial = (id: String) => {
  return axiosInstance.delete(`/api/v1/material/${id}`)
}

export const createSize = (data: any) => {
  return axiosInstance.post("/api/v1/size", data)
}

export const getAllSize = (data: any) => {
  const { search, isActive } = data
  return axiosInstance.get(`/api/v1/size?search=${search}&isActive=${isActive}`)
}

export const updateSize = (data: any) => {
  const { id } = data
  return axiosInstance.put(`/api/v1/size/${id}`, data)
}

export const deleteSize = (id: String) => {
  return axiosInstance.delete(`/api/v1/size/${id}`,)
}