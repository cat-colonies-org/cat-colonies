import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Gatetes</title>
        <meta name="description" content="A service to control them all" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Gatetes</h1>

        <p className={styles.description}>Un servicio para controlarlos a todos...</p>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
