/* eslint-disable @next/next/no-sync-scripts */
import { CatsListRow, getCatsList } from '../../services/cats';
import { Colony, getColony } from '../../services/colonies';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DataTable, { TableColumn } from 'react-data-table-component';

const styles = {
  avatar: {
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    margin: '2px',
  },
  map: {},
};

const ColonyDetails = () => {
  const columns: TableColumn<CatsListRow>[] = [
    { name: 'Id', selector: (cat) => cat.id },
    {
      name: 'Foto',
      cell: (row) => <img height="56px" width="56px" style={styles.avatar} alt="" src={row.imageUrl} />,
    },
    { name: 'Fecha registro', selector: (cat) => cat.createdAt },
    { name: 'Nacimiento', selector: (cat) => cat.birthYear },
    { name: 'Color', selector: (cat) => cat.color },
    { name: 'Patrón', selector: (cat) => cat.pattern },
    {
      name: 'Esterilizado',
      selector: (cat) => cat.sterilized,
      format: (cat) => (cat.sterilized ? 'Sí' : 'No'),
    },
    { name: 'Dirección', selector: (cat) => cat.colonyAddress },
    { name: 'Tipo de localización', selector: (cat) => cat.colonyLocationType },
    { name: 'Entorno', selector: (cat) => cat.colonyEnvironment },
  ];

  const router = useRouter();

  const [colony, setColony] = useState({} as Colony);
  const [cats, setCats] = useState({} as CatsListRow[]);
  const [loading, setLoading] = useState(false);

  const onInputChange = (event) => {};

  const fetchData = async () => {
    setLoading(true);

    const id = router.query.id;
    if (id) {
      const colony = await getColony(+id);
      if (colony) {
        setColony(colony);

        const cats = await getCatsList({ filter: { colonyId: +id } });
        if (cats) setCats(cats.items);
      }
    }

    setLoading(false);
  };

  useEffect((): void => {
    if (!router.query.id) {
      router.push('/colonies');
      return;
    }

    fetchData();
  }, []);

  return (
    <>
      <h1>Colonia</h1>

      <p>Ficha de la colonia</p>

      <div className="d-flex flex-row flex-fill">
        <div className="p-7">
          <form>
            <div className="form-group">
              <label>
                Id
                <input readOnly id="id" className="disabled form-control" value={colony?.id} />
              </label>
              <label>
                Fecha registro
                <input
                  readOnly
                  id="createdAt"
                  className="disabled form-control"
                  onChange={onInputChange}
                  value={colony?.createdAt?.toString()}
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Dirección
                <input id="address" className="form-control" value={colony?.address} />
              </label>
              <label>
                Localidad
                <input readOnly id="town" className="disabled form-control" value={colony?.town?.name} />
              </label>
              <label>
                Ubicación
                <input
                  readOnly
                  id="locationType"
                  className="disabled form-control"
                  value={colony?.locationType?.description}
                />
              </label>
              <label>
                Entorno
                <input
                  readOnly
                  id="environment"
                  className="disabled form-control"
                  value={colony?.environment?.description}
                />
              </label>
              <button className="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
        <div className="p-3">
          <iframe
            id="map"
            width="425"
            height="350"
            scrolling="no"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-0.5000281333923341%2C38.37085001158514%2C-0.49294710159301763%2C38.374559391551465&amp;layer=mapnik"
            style={styles.map}
          ></iframe>
        </div>
      </div>

      <p>Gatos de la colonia</p>

      <DataTable
        columns={columns}
        data={cats}
        highlightOnHover={false}
        striped={true}
        progressPending={loading}
        onRowClicked={(row) => router.push(`/cats/${row.id}`)}
      />
    </>
  );
};

export default ColonyDetails;
