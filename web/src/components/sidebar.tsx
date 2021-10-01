import Link from 'next/link';
import Image from 'next/image';
import { FormEvent } from 'react';
import { AuthToken } from '../common/authToken';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();

  const onLogoutClick = (event: FormEvent<HTMLButtonElement>) => {
    AuthToken.logout();
    router.push('/login');
  };

  return (
    <nav>
      <div className="sidebar-header">
        <Image alt="Logo Cinco Hocicos" src="/logo.jpg" width="250px" height="250px"></Image>
      </div>
      <ul className="list-unstyled components">
        <li>
          <Link href="/">
            <a>Inicio</a>
          </Link>
        </li>

        <li>
          <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
            Colecciones
          </a>
          <ul className="collapse list-unstyled" id="pageSubmenu">
            <li>
              <Link href="/colonies">
                <a>Colonias</a>
              </Link>
            </li>
            <li>
              <Link href="/cats">
                <a>Gatos</a>
              </Link>
            </li>
            <li>
              <Link href="/users">
                <a>Usuarios</a>
              </Link>
            </li>
            {/* <li>
              <a>Localidades</a>
            </li> */}
          </ul>
        </li>
        {/* <li className="active">
          <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
            Informes
          </a>
          <ul className="collapse list-unstyled" id="homeSubmenu">
            <li>
              <a>Semanal</a>
            </li>
            <li>
              <a>Mensual</a>
            </li>
            <li>
              <a>Anual</a>
            </li>
          </ul>
        </li> */}

        <button onClick={onLogoutClick}>Salir</button>

        {/* <li>
          <a>Contact</a>
        </li> */}
      </ul>
    </nav>
  );
};

export default Sidebar;
