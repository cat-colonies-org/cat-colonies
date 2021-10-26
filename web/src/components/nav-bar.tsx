/* eslint-disable @next/next/no-img-element */
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Auth } from '../common/authToken';
import Link from 'next/link';

interface NavbarProps {
  authToken: Auth;
}

function NavBar({ authToken: auth }: NavbarProps) {
  const router = useRouter();

  const logout = async () => {
    Auth.logout();
    toast.success('Logged out... 👋');
    router.push('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between mt-3 mb-3 rounded shadow">
      <a className="navbar-brand" href="#">
        Colonias
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Colecciones
            </a>

            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="#">
                <Link href="/users">
                  <a>Gestoras</a>
                </Link>
              </a>

              <a className="dropdown-item" href="#">
                <Link href="/colonies">
                  <a>Colonias</a>
                </Link>
              </a>

              <a className="dropdown-item" href="#">
                <Link href="/cats">
                  <a>Gatos</a>
                </Link>
              </a>
            </div>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Informes
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="#">
                <a>Informe 1</a>
              </a>
              <a className="dropdown-item" href="#">
                <a>Informe 2</a>
              </a>
              <a className="dropdown-item" href="#">
                <a>Informe 3</a>
              </a>
            </div>
          </li>
        </ul>

        <div>
          <a className="navbar-link mr-3">{auth?.email}</a>
          <button className="btn btn-outline-danger" onClick={logout}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
