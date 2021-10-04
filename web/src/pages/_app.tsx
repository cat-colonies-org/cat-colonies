/* TODO: remove this directive */
/* eslint-disable @next/next/no-sync-scripts */

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { AuthToken } from '../common/authToken';
import { ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import DefaultLayout from '../components/default-layout';
import Head from 'next/head';
import type { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  const tokenCookie = Cookies.get('authToken');
  const authToken = new AuthToken(tokenCookie);

  const Layout = (Component as any).Layout || DefaultLayout;

  return (
    <>
      <Head>
        <title>Gatetes</title>
        <meta name="description" content="A service to control them all" />
        <link rel="icon" href="favicon.ico" />

        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css"
          integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4"
          crossOrigin="anonymous"
        />

        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" />

        <script
          src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
          integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"
          integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"
          integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm"
          crossOrigin="anonymous"
        ></script>
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
        <Component {...pageProps} authToken={authToken} />
      </Layout>
    </>
  );
}

export default App;
