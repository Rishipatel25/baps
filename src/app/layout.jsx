'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/assets/scss/styles.scss';
import { Inter } from 'next/font/google';
import { ToastContainer, toast } from 'react-toastify';
import {
  TOAST_CONFIGURATION,
  TOAST_ERROR,
  TOAST_SUCCESS,
} from '@/utils/constants/default.constants';
import ReduxProvider from '@/components/wrapper/ReduxProvider';

// Import toastify css
import 'react-toastify/dist/ReactToastify.min.css';
import { usePathname } from 'next/navigation';
import { PUBLIC_ROUTES } from '@/utils/constants/routes.constants';
import { useEffect } from 'react';
import AuthWrapper from '@/components/wrapper/AuthWrapper';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <ReduxProvider>
        <App>{children}</App>
      </ReduxProvider>
    </html>
  );
}
const App = ({ children }) => {
  const pathName = usePathname();
  const userOnlineOfflineNotification = () => {
    window.addEventListener('offline', () => {
      toast.error(TOAST_ERROR.OFFLINE.MESSAGE, {
        toastId: TOAST_ERROR.OFFLINE.ID,
      });
    });
    window.addEventListener('online', () => {
      toast.success(TOAST_SUCCESS.ONLINE.MESSAGE, {
        toastId: TOAST_SUCCESS.ONLINE.ID,
      });
    });
  };

  useEffect(() => {
    userOnlineOfflineNotification();
  }, []);

  return (
    <body className={inter.className}>
      {PUBLIC_ROUTES.includes(pathName) ? (
        children
      ) : (
        <AuthWrapper>{children}</AuthWrapper>
      )}

      <ToastContainer
        position="top-right"
        autoClose={TOAST_CONFIGURATION.TIMER}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        className="toastify"
      />
      <div className="full-screen-printx" />
    </body>
  );
};
