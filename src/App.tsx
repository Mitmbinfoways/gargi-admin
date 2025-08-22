import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from './routes/Router';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategorys, getAllMaterial } from './AxiosConfig/AxiosConfig';
import { setCategory, setMaterial } from './Store/Slices/ProductOptions.Slice';
import { RootState } from './Store/Store';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const fetchOptions = async () => {
    try {
      const [categoryRes, materialRes] = await Promise.all([
        getAllCategorys(),
        getAllMaterial(),
      ]);
      dispatch(setCategory(categoryRes.data.data.categories || []));
      dispatch(setMaterial(materialRes.data.data.materials || []));
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOptions();
    }
  }, [isAuthenticated]);

  return (
    <>
      <ThemeModeScript />
      <Flowbite theme={{ theme: customTheme }}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              padding: '12px 16px',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              style: {
                background: '#22c55e',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
        <RouterProvider router={router} />
      </Flowbite>
    </>
  );
}

export default App;
