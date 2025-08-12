import { RouterProvider } from 'react-router';
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from './routes/Router';
import { Toaster } from 'react-hot-toast';

function App() {


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
