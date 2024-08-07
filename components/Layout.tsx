import Head from "next/head";
import Nav from "./Nav";
import styles from "../styles/Layout.module.scss";

const Layout = ({ children }: any) => {
  return (
    <>
      <Head>
        <title>To Do List</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <Nav />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </>
  );
};
export default Layout;
