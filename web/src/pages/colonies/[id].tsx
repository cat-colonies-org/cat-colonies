import 'react-datepicker/dist/react-datepicker.css';
import { Cat, Gender } from '../../services/cats';
import { Chart } from 'react-google-charts';
import { Colony, getColony, updateColony } from '../../services/colonies';
import { Environment, getEnvironmentsList } from '../../services/environments';
import { FormEvent, useEffect, useState } from 'react';
import { getLocationTypesList, LocationType } from '../../services/locationTypes';
import { getTownsList, Town } from '../../services/towns';
import { toast } from 'react-toastify';
import { User } from '../../services/users';
import { useRouter } from 'next/router';
import DataTable, { TableColumn } from 'react-data-table-component';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import withPrivateRoute from '../../components/with-private-route';
import NewTownModal from '../../components/new-town-modal';

registerLocale('es', es);

const ColonyDetails = () => {
  const router = useRouter();

  interface Stats {
    active: number;
    total: number;
    males: number;
    females: number;
    esteriliced: number;
    kittens: number;
  }

  const zeroStats: Stats = Object.freeze({
    active: 0,
    total: 0,
    males: 0,
    females: 0,
    esteriliced: 0,
    kittens: 0,
  });

  const catsColumns: TableColumn<Cat>[] = [
    { name: 'Id', selector: (cat) => cat.id },
    { name: 'Alta', selector: (cat) => new Date(cat.createdAt).toLocaleDateString() },
    { name: 'Nacimiento', selector: (cat) => cat.birthYear },
    {
      name: 'Genero',
      selector: (cat) =>
        cat.gender === Gender.Male ? 'Macho' : cat.gender === Gender.Female ? 'Hembra' : 'Indeterminado',
    },
    {
      name: 'Esterilizado',
      selector: (cat) => cat.sterilized,
      format: (cat) => (cat.sterilized ? 'Sí' : 'No'),
    },
    { name: 'Cachorro', selector: (cat) => (cat.kitten ? 'Sí' : 'No') },
    { name: 'Patrón', selector: (cat) => cat.pattern?.description },
    { name: 'Baja', selector: (cat) => (cat.ceasedAt ? new Date(cat.ceasedAt).toLocaleDateString() : '') },
    { name: 'Causa baja', selector: (cat) => cat.ceaseCause?.description },
  ];

  const managersColumns: TableColumn<User>[] = [
    { name: 'Id', selector: (user) => user.id },
    { name: 'Alta', selector: (user) => new Date(user.createdAt).toLocaleDateString() },
    { name: 'Nombre', selector: (user) => user.name },
    { name: 'Apellidos', selector: (user) => user.surnames },
    { name: 'Teléfono', selector: (user) => user.phoneNumber },
    { name: 'Email', selector: (user) => user.email },
  ];

  const [colony, setColony] = useState({} as Colony);
  const [environments, setEnvironments] = useState({} as Environment[]);
  const [locationTypes, setLocationTypes] = useState({} as LocationType[]);
  const [towns, setTowns] = useState({} as Town[]);
  const [stats, setStats] = useState(zeroStats as Stats);
  const [loading, setLoading] = useState(false);
  const [modalOneOpen, setModalOneOpen] = useState(false);

  const onCreateTownClick = (event: FormEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    console.log(event);
    setModalOneOpen(true);
  };

  const handleCloseModalOne = () => setModalOneOpen(false);

  const onCreateLocationTypeClick = (event: FormEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    toast.warning('No implementado 😅');
  };

  const onCreateEnvironmentClick = (event: FormEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    toast.warning('No implementado 😅');
  };

  const onDateChange = (newValue: Date): void => {
    setColony({ ...colony, createdAt: newValue });
  };

  const onInputChange = (event: FormEvent<HTMLInputElement>): void => {
    setColony({ ...colony, [event.currentTarget.id]: event.currentTarget.value });
  };

  const onSelectChange = (event: FormEvent<HTMLSelectElement>): void => {
    setColony({ ...colony, [event.currentTarget.id]: +event.currentTarget.value });
  };

  const onSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    if (colony.id) {
      const updatePromise = updateColony(+colony.id, {
        ...(colony.address && { address: colony.address }),
        ...(colony.locationTypeId && { locationTypeId: +colony.locationTypeId }),
        ...(colony.environmentId && { environmentId: +colony.environmentId }),
        ...(colony.townId && { townId: +colony.townId }),
      });

      toast.promise(updatePromise, {
        pending: 'Conectando con el servidor...',
        success: 'Datos actualizados',
        error: 'Error actualizando datos',
      });
    }
  };

  const reduceAndSetStats = (cats: Cat[]): void => {
    setStats(
      cats.reduce(
        (stats: Stats, cat: Cat): Stats => {
          ++stats.total;

          if (!cat.ceasedAt && !cat.ceaseCauseId) {
            ++stats.active;
            stats.males += cat.gender === Gender.Male ? 1 : 0;
            stats.females += cat.gender === Gender.Female ? 1 : 0;
            stats.esteriliced += cat.sterilized ? 1 : 0;
            stats.kittens += cat.kitten ? 1 : 0;
          }

          return stats;
        },
        { ...zeroStats },
      ),
    );
  };

  const fetchData = async () => {
    setLoading(true);

    const id = router.query.id;
    if (id) {
      const colony = await getColony(+id);
      if (colony) {
        setColony(colony);

        const [environments, locationTypes, towns] = await Promise.all([
          getEnvironmentsList({}),
          getLocationTypesList({}),
          getTownsList({}),
        ]);

        if (environments) setEnvironments(environments.items);
        if (locationTypes) setLocationTypes(locationTypes.items);
        if (towns) setTowns(towns.items);
        if (colony.cats) reduceAndSetStats(colony.cats);
      }
    }

    setLoading(false);
  };

  useEffect((): void => {
    fetchData();
  }, []);

  const styles = {
    map: {
      display: 'block',
      width: '100%',
      height: '350px',
    },
  };

  return (
    <>
      <NewTownModal id="newTownModal" isOpen={modalOneOpen} onRequestClose={handleCloseModalOne} />

      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-7">
            <div className="container-md">
              <div className="shadow p-3 bg-body rounded">
                <p>
                  <i className="far fa-sticky-note mr-2" aria-hidden="true"></i>
                  Datos generales
                </p>
                <form onSubmit={onSubmit}>
                  <div className="row mt-3">
                    <div className="col-md-2">
                      <label htmlFor="id" className="form-label">
                        Id
                      </label>
                      <input
                        id="id"
                        type="text"
                        className="form-control"
                        value={colony?.id}
                        placeholder="Nueva colonia"
                        readOnly
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="createdAt" className="form-label">
                        Alta
                      </label>
                      <DatePicker
                        className="form-control"
                        selected={colony.createdAt}
                        onChange={onDateChange}
                        locale="es"
                      />
                    </div>
                    <div className="col-md-7">
                      <label htmlFor="town" className="form-label">
                        Localidad
                      </label>
                      <div className="input-group mb-3">
                        <select id="townId" className="form-control" value={colony?.townId} onChange={onSelectChange}>
                          {towns.length &&
                            towns.map((item, i) => (
                              <option key={i} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                        <div className="input-group-append">
                          <button className="input-group-text" onClick={onCreateTownClick}>
                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-12">
                      <label htmlFor="address" className="form-label">
                        Calle
                      </label>
                      <input
                        id="address"
                        type="text"
                        placeholder="Dirección de la colonia"
                        className="form-control"
                        value={colony?.address}
                        onChange={onInputChange}
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label htmlFor="location" className="form-label">
                        Ubicación
                      </label>
                      <div className="input-group mb-3">
                        <select
                          id="locationTypeId"
                          className="form-control"
                          value={colony?.locationTypeId}
                          onChange={onSelectChange}
                        >
                          {locationTypes.length &&
                            locationTypes.map((item, i) => (
                              <option key={i} value={item.id}>
                                {item.description}
                              </option>
                            ))}
                        </select>
                        <div className="input-group-append">
                          <button className="input-group-text" onClick={onCreateLocationTypeClick}>
                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="environment">
                        Entorno
                      </label>
                      <div className="input-group mb-3">
                        <select
                          id="environmentId"
                          className="form-control"
                          value={colony?.environmentId}
                          onChange={onSelectChange}
                        >
                          {environments.length &&
                            environments.map((item, i) => (
                              <option key={i} value={item.id}>
                                {item.description}
                              </option>
                            ))}
                        </select>
                        <div className="input-group-append">
                          <button className="input-group-text" onClick={onCreateEnvironmentClick}>
                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-12">
                      <button className="btn btn-primary">Guardar</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="shadow p-3 bg-body rounded">
              <p>
                <i className="far fa-map mr-2" aria-hidden="true"></i>
                Ubicación
              </p>
              <iframe
                style={styles.map}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1564.0051792651661!2d-0.49694479283032256!3d38.37188181628149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6236e5beba75f9%3A0xe54cc71b08152eeb!2sC.%20Roque%20Chab%C3%A1s%2C%2011%2C%2003011%20Alicante%20(Alacant)%2C%20Alicante!5e0!3m2!1ses!2ses!4v1631740183993!5m2!1ses!2ses"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <div className="shadow p-3 bg-body rounded">
              <p>
                <i className="fas fa-chart-pie mr-2" aria-hidden="true"></i>
                Estadísticas
              </p>

              <div className="row">
                <div className="col-sm">
                  Población
                  <Chart
                    width={200}
                    height={150}
                    chartType="PieChart"
                    loader={<div>Cargando gráfico...</div>}
                    data={[
                      ['Estado', 'Total'],
                      ['Activos', stats.active],
                      ['Total', stats.total],
                    ]}
                    options={{
                      is3D: true,
                      pieSliceText: 'value',
                      backgroundColor: '#fafafa',
                    }}
                  />
                </div>
                <div className="col-sm">
                  Esterilizados
                  <Chart
                    width={200}
                    height={150}
                    chartType="PieChart"
                    loader={<div>Cargando gráfico...</div>}
                    data={[
                      ['Estado', 'Total'],
                      ['Sí', stats.esteriliced],
                      ['No', stats.active - stats.esteriliced],
                    ]}
                    options={{
                      is3D: true,
                      pieSliceText: 'value',
                      backgroundColor: '#fafafa',
                    }}
                  />
                </div>
                <div className="col-sm">
                  Sexo
                  <Chart
                    width={200}
                    height={150}
                    chartType="PieChart"
                    loader={<div>Cargando gráfico...</div>}
                    data={[
                      ['Estado', 'Total'],
                      ['Hembras', stats.females],
                      ['Machos', stats.males],
                    ]}
                    options={{
                      is3D: true,
                      pieSliceText: 'value',
                      backgroundColor: '#fafafa',
                    }}
                  />
                </div>
                <div className="col-sm">
                  Edad
                  <Chart
                    width={200}
                    height={150}
                    chartType="PieChart"
                    loader={<div>Cargando gráfico...</div>}
                    data={[
                      ['Estado', 'Total'],
                      ['Cachorros', stats.kittens],
                      ['Adultos', stats.active - stats.kittens],
                    ]}
                    options={{
                      is3D: true,
                      pieSliceText: 'value',
                      backgroundColor: '#fafafa',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <div className="shadow p-3 bg-body rounded">
              <p>
                <i className="fa fa-female mr-2" aria-hidden="true"></i>
                Gestoras
              </p>

              <DataTable
                columns={managersColumns}
                data={colony.managers}
                dense
                highlightOnHover={true}
                striped={true}
                progressPending={loading}
                onRowClicked={(row) => router.push(`/users/${row.id}`)}
              />
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <div className="shadow p-3 bg-body rounded">
              <p>
                <i className="fas fa-cat mr-2" aria-hidden="true"></i>
                Gatos
              </p>

              <DataTable
                columns={catsColumns}
                data={colony.cats}
                dense
                highlightOnHover={true}
                striped={true}
                progressPending={loading}
                onRowClicked={(row) => router.push(`/cats/${row.id}`)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withPrivateRoute(ColonyDetails);
