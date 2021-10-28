/* eslint-disable @next/next/no-img-element */
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Auth } from '../common/authToken';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NavbarProps {
  authToken: Auth;
}

function NavBar({ authToken: auth }: NavbarProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const logout = async () => {
    Auth.logout();
    toast.success('Logged out... 👋');
    router.push('/login');
  };

  useEffect(() => {
    setEmail(auth?.email);
  });

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between mt-3 mb-3 rounded shadow">
      <Link href="/">
        <a className="navbar-brand" href="#">
          Colonias
        </a>
      </Link>
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
              <Link href="/users">
                <a className="dropdown-item" href="#">
                  Gestoras
                </a>
              </Link>

              <Link href="/colonies">
                <a className="dropdown-item" href="#">
                  Colonias
                </a>
              </Link>

              <Link href="/cats">
                <a className="dropdown-item" href="#">
                  Gatos
                </a>
              </Link>
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
              <Link href="#">
                <a className="dropdown-item" href="#">
                  Informe 1
                </a>
              </Link>
              <Link href="#">
                <a className="dropdown-item" href="#">
                  Informe 2
                </a>
              </Link>
              <Link href="#">
                <a className="dropdown-item" href="#">
                  Informe 3
                </a>
              </Link>
            </div>
          </li>
        </ul>

        <div>
          <a className="navbar-link mr-3">{email}</a>
          <button className="btn btn-outline-danger" onClick={logout}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
