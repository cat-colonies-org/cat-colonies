import { Cat, Gender } from '../../services/cats';
import { Colony, getColony, updateColony } from '../../services/colonies';
import { Environment, getEnvironmentsList } from '../../services/environments';
import { FormEvent, useEffect, useState } from 'react';
import { getLocationTypesList, LocationType } from '../../services/location-types';
import { createTown, getTownsList, Town } from '../../services/towns';
import { toast } from 'react-toastify';
import { User } from '../../services/users';
import { useRouter } from 'next/router';
import DataTable, { TableColumn } from 'react-data-table-component';
import NewEnvironmentModal from '../../components/new-environment-modal';
import NewLocationTypeModal from '../../components/new-location-type-modal';
import PropertySelector from '../../components/property-selector';
import withPrivateRoute from '../../components/with-private-route';

const ColonyDetails = () => {
  const router = useRouter();

  const isKitten = (cat: Cat): boolean => {
    if (!cat?.bornAt) return false;

    const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000;
    const today: Date = new Date();
    const birthDate: Date = new Date(cat.bornAt);

    return today.getTime() - birthDate.getTime() <= sixMonths;
  };

  interface Stats {
    active: number;
    total: number;
    males: number;
    females: number;
    malesEsteriliced: number;
    femalesEsteriliced: number;
    kittens: number;
  }

  const zeroStats: Stats = Object.freeze({
    active: 0,
    total: 0,
    males: 0,
    females: 0,
    malesEsteriliced: 0,
    femalesEsteriliced: 0,
    kittens: 0,
  });

  const catsColumns: TableColumn<Cat>[] = [
    { name: 'Id', selector: (cat) => cat.id },
    { name: 'Alta', selector: (cat) => new Date(cat.createdAt).toLocaleDateString() },
    { name: 'Nacimiento', selector: (cat) => new Date(cat.bornAt).toLocaleDateString() },
    {
      name: 'Genero',
      selector: (cat) => (cat.gender === Gender.Male ? 'Macho' : cat.gender === Gender.Female ? 'Hembra' : ''),
    },
    {
      name: 'Esterilizado',
      selector: (cat) => cat.sterilized,
      format: (cat) => (cat.sterilized ? 'Esterilizado' : ''),
    },
    {
      name: 'Cachorro',
      selector: (cat) => (isKitten(cat) ? 'Cachorro' : ''),
    },
    { name: 'Capa', selector: (cat) => `${cat.pattern?.description || '' + ' '}${cat.color?.description || ''}` },
    { name: 'Baja', selector: (cat) => (cat.ceasedAt ? new Date(cat.ceasedAt).toLocaleDateString() : '') },
    { name: 'Causa baja', selector: (cat) => (cat.ceaseCauseId ? cat.ceaseCause?.description : '') },
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
  const [environments, setEnvironments] = useState([] as Environment[]);
  const [locationTypes, setLocationTypes] = useState([] as LocationType[]);
  const [towns, setTowns] = useState([] as Town[]);
  const [stats, setStats] = useState(zeroStats);
  const [loading, setLoading] = useState(false);
  const [newTownModalOpen, setNewTownModalOpen] = useState(false);
  const [newLocationTypeModalOpen, setNewLocationTypeModalOpen] = useState(false);
  const [newEnvironmentModalOpen, setNewEnvironmentModalOpen] = useState(false);

  const valueAndPercent = (value: number, total: number): string => {
    return total ? `${value} (${((value / total) * 100).toFixed(2)}%)` : `${value}`;
  };

  const nameSorter = (a: { name: string }, b: { name: string }): number => {
    return a.name.localeCompare(b.name);
  };

  const descriptionSorter = (a: { description: string }, b: { description: string }): number => {
    return a.description.localeCompare(b.description);
  };

  // #region Town
  const onNewTown = (town: Town): void => {
    toast.success(`Creada nueva localidad "${town.name}" con id "${town.id}"`);
    setTowns((prev) => [...prev, { ...town }].sort(nameSorter));
    setColony((prev) => {
      return { ...prev, townId: town.id };
    });
  };

  // #endregion Town

  // #region LocationType
  const onCreateLocationTypeClick = (event: FormEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    setNewLocationTypeModalOpen(true);
  };

  const onNewLocationType = (locationType: LocationType): void => {
    toast.success(`Creada nueva localidad "${locationType.description}" con id "${locationType.id}"`);
    setLocationTypes((prev) => [...prev, { ...locationType }].sort(descriptionSorter));
    setColony((prev) => {
      return { ...prev, locationTypeId: locationType.id };
    });
  };

  const onLocationTypeError = (locationTypeName: string): void => {
    toast.error(`Error creando ubicatón "${locationTypeName}"`);
  };
  // #endregion LocationType

  // #region Environment

  const onCreateEnvironmentClick = (event: FormEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    setNewEnvironmentModalOpen(true);
  };

  const onNewEnvironment = (environment: Environment): void => {
    toast.success(`Creado nuevo entorno "${environment.description}" con id "${environment.id}"`);
    setEnvironments((prev) => [...prev, { ...environment }].sort(descriptionSorter));
    setColony((prev) => {
      return { ...prev, environmentId: environment.id };
    });
  };

  const onEnvironmentError = (environment: string): void => {
    toast.error(`Error creando entorno "${environment}"`);
  };
  // #endregion Environment
  const onInputChange = (event: FormEvent<HTMLInputElement>): void => {
    setColony((prev) => {
      return { ...prev, [event.currentTarget.id]: event.currentTarget.value };
    });
  };

  const onSelectChange = (event: FormEvent<HTMLSelectElement>): void => {
    setColony((prev) => {
      return { ...prev, [event.currentTarget.id]: +event.currentTarget.value };
    });
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
            stats.malesEsteriliced += cat.gender === Gender.Male && cat.sterilized ? 1 : 0;
            stats.femalesEsteriliced += cat.gender === Gender.Female && cat.sterilized ? 1 : 0;
            stats.kittens += isKitten(cat) ? 1 : 0;
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
    const [colony, environments, locationTypes, towns] = await Promise.all([
      id ? getColony(+id) : null,
      getEnvironmentsList({}),
      getLocationTypesList({}),
      getTownsList({}),
    ]);

    if (colony) setColony(colony);
    if (colony?.cats) reduceAndSetStats(colony.cats);
    if (environments) setEnvironments(environments.items.sort(descriptionSorter));
    if (locationTypes) setLocationTypes(locationTypes.items.sort(descriptionSorter));
    if (towns) setTowns(towns.items.sort(nameSorter));

    setLoading(false);
  };

  useEffect((): void => {
    fetchData();
  }, []);

  return (
    <>
      <NewLocationTypeModal
        id="newLocationTypeModal"
        isOpen={newLocationTypeModalOpen}
        onClose={() => setNewLocationTypeModalOpen(false)}
        onNewLocationType={onNewLocationType}
        onLocationTypeError={onLocationTypeError}
      />

      <NewEnvironmentModal
        id="newEnvironmentModal"
        isOpen={newEnvironmentModalOpen}
        onClose={() => setNewEnvironmentModalOpen(false)}
        onNewEnvironment={onNewEnvironment}
        onEnvironmentError={onEnvironmentError}
      />

      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-12">
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
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={colony?.createdAt?.toLocaleDateString()}
                      />
                    </div>
                    <div className="col-md-7">
                      <label htmlFor="town" className="form-label">
                        Localidad
                      </label>
                      <PropertySelector
                        id="townId"
                        title="Nueva Localidad"
                        caption="Descripción"
                        buttonCaption="Crear"
                        items={towns}
                        value={colony?.townId}
                        setter={setColony}
                        textGetter={(i: Town) => i.name}
                        factory={createTown}
                        onCreate={onNewTown}
                        onError={(i: string) => toast.error(`Error creando localidad "${i}"`)}
                      />
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
                  <span className="lead">Población</span>
                  <p>Activos: {stats.active}</p>
                  <p>Bajas: {stats.total - stats.active}</p>
                </div>
                <div className="col-sm">
                  <span className="lead">Sexo</span>
                  <p>Machos: {valueAndPercent(stats.males, stats.active)}</p>
                  <p>Hembras: {valueAndPercent(stats.females, stats.active)}</p>
                  <p>Desconocido: {valueAndPercent(stats.active - stats.males - stats.females, stats.active)}</p>
                </div>
                <div className="col-sm">
                  <span className="lead">Esterilizados</span>
                  <p>Machos: {valueAndPercent(stats.malesEsteriliced, stats.active)}</p>
                  <p>Hembras: {valueAndPercent(stats.femalesEsteriliced, stats.active)}</p>
                  <p>
                    Desconocido:{' '}
                    {valueAndPercent(stats.active - stats.malesEsteriliced - stats.femalesEsteriliced, stats.active)}
                  </p>
                </div>
                <div className="col-sm">
                  <span className="lead">Edad</span>
                  <p>Cachorros: {valueAndPercent(stats.kittens, stats.active)}</p>
                  <p>Adultos: {valueAndPercent(stats.active - stats.kittens, stats.active)}</p>
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
