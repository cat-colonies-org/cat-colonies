/* TODO: remove this directive */
/* eslint-disable @next/next/no-sync-scripts */

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import Head from 'next/head'
import { Auth } from '../common/authToken';
import { ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import DefaultLayout from '../components/default-layout';
import type { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  const tokenCookie = Cookies.get('authToken');
  const authToken = new Auth(tokenCookie);

  const Layout = (Component as any).Layout || DefaultLayout;

  return (
    <>
    <Head>
      <title>Gatetes</title>
      </Head>  
      <Layout authToken={authToken}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnHover
        />
      </Layout>  
   
      <Component {...pageProps} authToken={authToken} />   
     
    </>
  );
}

export default App;
