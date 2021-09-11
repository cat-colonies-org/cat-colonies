import Link from 'next/link';

const Sidebar = () => {
  return (
    <nav>
      <div className="sidebar-header">
        <h3>Gatetes</h3>
      </div>
      <ul className="list-unstyled components">
        {/* <p>Cabecera</p> */}
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
              <a>Localidades</a>
            </li>
          </ul>
        </li>
        <li className="active">
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
        </li>

        {/* <li>
          <a>Contact</a>
        </li> */}
      </ul>
    </nav>
  );
};

export default Sidebar;
