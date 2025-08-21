import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from './routes/Router';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { getAllCategorys, getAllMaterial, getAllSize } from './AxiosConfig/AxiosConfig';
import { setCategory, setMaterial, setSize } from './Store/Slices/ProductOptions.Slice';

function App() {
  const dispatch = useDispatch();

  const fetchOptions = async () => {
    try {
      const [categoryRes, materialRes, sizeRes] = await Promise.all([
        getAllCategorys(),
        getAllMaterial(),
        getAllSize(),
      ]);
      dispatch(setCategory(categoryRes.data.data || []));
      dispatch(setMaterial(materialRes.data.data || []));
      dispatch(setSize(sizeRes.data.data || []));
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

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
