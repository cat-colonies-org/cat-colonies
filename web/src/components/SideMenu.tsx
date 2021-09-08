import Link from 'next/link';

const SideMenu = () => {
  return (
    <>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/cats">
        <a>Lista de gatos</a>
      </Link>
    </>
  );
};

export default SideMenu;
