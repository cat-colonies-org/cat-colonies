import { Auth } from '../../common/authToken';
import { Cat, Gender, isKitten } from '../../services/cats';
import { coatFromCat } from '../../common/util';
import {
  addColonyManager,
  Colony,
  createColony,
  getColony,
  removeColonyManager,
  updateColony,
} from '../../services/colonies';
import { createColonyAnnotation } from '../../services/colony-annotations';
import { createEnvironment, Environment, getEnvironmentsList } from '../../services/environments';
import { createLocationType, getLocationTypesList, LocationType } from '../../services/location-types';
import { createTown, getTownsList, Town } from '../../services/towns';
import { NextPageContext } from 'next';
import { toast } from 'react-toastify';
import { getUsersList, User } from '../../services/users';
import { UserAnnotation } from '../../services/user-annotations';
import { useRouter } from 'next/router';
import DataTable, { TableColumn } from 'react-data-table-component';
import InputModal from '../../components/input-modal';
import PropertySelector from '../../components/property-selector';
import React, { FormEvent, useEffect, useState } from 'react';
import Select from 'react-select';
import withPrivateRoute from '../../components/with-private-route';

interface ColonyDetailsProps {
  id: string;
  authToken: Auth;
}

const ColonyDetails = ({ id, authToken }: ColonyDetailsProps) => {
  const router = useRouter();

  interface Stats {
    active: number;
    total: number;
    males: number;
    females: number;
    malesSterilized: number;
    femalesSterilized: number;
    kittens: number;
  }

  const zeroStats: Stats = Object.freeze({
    active: 0,
    total: 0,
    males: 0,
    females: 0,
    malesSterilized: 0,
    femalesSterilized: 0,
    kittens: 0,
  });

  const catsColumns: TableColumn<Cat>[] = [
    { name: 'Id', selector: (cat) => cat.id, width: '60px' },
    { name: 'Alta', selector: (cat) => new Date(cat.createdAt).toLocaleDateString(), width: '100px' },
    {
      name: 'Nacimiento',
      selector: (cat) => (cat.bornAt ? new Date(cat.bornAt).toLocaleDateString() : ''),
      width: '100px',
    },
    {
      name: 'Sexo',
      width: '100px',
      selector: (cat) => (cat.gender === Gender.Male ? 'Macho' : cat.gender === Gender.Female ? 'Hembra' : ''),
    },
    {
      name: 'Esterilizado',
      width: '110px',
      selector: (cat) =>
        cat.sterilized
          ? `Esterilizado ${cat.sterilizedAt ? '(' + new Date(cat.sterilizedAt).toLocaleDateString() + ')' : ''}`
          : '',
    },
    {
      name: 'Cachorro',
      width: '95px',
      selector: (cat) => (isKitten(cat) ? 'Cachorro' : ''),
    },
    {
      name: 'Capa',
      width: '200px',
      selector: coatFromCat,
    },
    {
      name: 'Baja',
      selector: (cat) => (cat.ceasedAt ? new Date(cat.ceasedAt).toLocaleDateString() : ''),
      width: '100px',
    },
    { name: 'Causa baja', selector: (cat) => (cat.ceaseCauseId ? cat.ceaseCause?.description : '') },
    { name: 'Fotos', selector: (cat) => cat?.pictures?.length, width: '90px' },
  ];

  const managersColumns: TableColumn<User>[] = [
    { name: 'Id', selector: (user) => user.id, width: '60px' },
    { name: 'Nombre', selector: (user) => user.name, width: '200px' },
    { name: 'Alta', selector: (user) => new Date(user.createdAt).toLocaleDateString(), width: '100px' },
    {
      cell: (user: User) => (
        <div style={{ width: '100%', textAlign: 'right' }}>
          <button
            title="eliminar"
            type="button"
            className="btn btn-secondary btn-circle btn-sm"
            onClick={() => onRemoveColonyManager(user.id)}
          >
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>
      ),
    },
  ];

  const annotationsColumns: TableColumn<UserAnnotation>[] = [
    { name: 'Id', selector: (row) => row.id, width: '100px' },
    { name: 'Fecha', selector: (row) => new Date(row.date).toLocaleDateString(), width: '100px' },
    { name: 'Anotación', selector: (row) => row.annotation },
  ];

  const [colony, setColony] = useState({} as Colony);
  const [environments, setEnvironments] = useState([] as Environment[]);
  const [locationTypes, setLocationTypes] = useState([] as LocationType[]);
  const [towns, setTowns] = useState([] as Town[]);
  const [users, setUsers] = useState([] as User[]);
  const [stats, setStats] = useState(zeroStats);
  const [sterilizedStyle, setSterilizedStyle] = useState({});
  const [isAnnotationModalOpen, setAnnotationModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const valueAndPercent = (value: number, total: number): string => {
    return total ? `${value} (${((value / total) * 100).toFixed(2)}%)` : `${value}`;
  };

  const nameSorter = (a: { name: string }, b: { name: string }): number => {
    return a.name.localeCompare(b.name);
  };

  const descriptionSorter = (a: { description: string }, b: { description: string }): number => {
    return a.description.localeCompare(b.description);
  };

  const onNewTown = async (name: string): Promise<void> => {
    const item: Town = await createTown(name);

    if (!item) {
      toast.error(`Error creando localidad "${name}"`);
      return;
    }

    setTowns((prev) => [...prev, { ...item }].sort(nameSorter));

    setColony((prev) => {
      return { ...prev, townId: item.id };
    });

    toast.success(`Creada nueva localidad "${item.name}" con id "${item.id}"`);
  };

  const onNewLocationType = async (description: string): Promise<void> => {
    const item: LocationType = await createLocationType(description);

    if (!item) {
      toast.error(`Error creando ubicación "${description}"`);
      return;
    }

    setLocationTypes((prev) => [...prev, { ...item }].sort(descriptionSorter));

    setColony((prev) => {
      return { ...prev, locationTypeId: item.id };
    });

    toast.success(`Creada nueva ubicación "${item.description}" con id "${item.id}"`);
  };

  const onNewEnvironment = async (description: string): Promise<void> => {
    const item: Environment = await createEnvironment(description);

    if (!item) {
      toast.error(`Error creando entorno "${description}"`);
      return;
    }

    setEnvironments((prev) => [...prev, { ...item }].sort(descriptionSorter));

    setColony((prev) => {
      return { ...prev, environmentId: item.id };
    });

    toast.success(`Creado nuevo entorno "${item.description}" con id "${item.id}"`);
  };

  const onSelectChange = (data: any, meta: { action: string; name: string }): void => {
    setColony((prev: any) => ({ ...prev, [meta.name]: data?.value }));
  };

  const onInputChange = (event: FormEvent<HTMLInputElement>): void => {
    setColony((prev) => {
      return { ...prev, [event.currentTarget.id]: event.currentTarget.value };
    });
  };

  const onAddCat = async (event: FormEvent<HTMLButtonElement>): Promise<void> => {
    if (!colony.id) {
      toast.warn('Debe guardar la nueva colonia antes de añadirle gatos');
      return;
    }

    const colonySaved = await save();
    if (colonySaved) {
      router.push(`/cats/new?colonyId=${colony.id}`);
    }
  };

  const onAddAnnotation = (event: FormEvent<HTMLButtonElement>) => {
    if (!colony.id) {
      toast.warn('Debe guardar la colonia antes de poder hacer anotaciones');
      return;
    }

    setAnnotationModalOpen(true);
  };

  const onNewAnnotation = async (result: { value: string }) => {
    if (!result?.value || !colony.id) return;

    const colonyAnnotation: UserAnnotation = await createColonyAnnotation(colony.id, result.value);
    if (colonyAnnotation) {
      if (colony.annotations) colony.annotations.push(colonyAnnotation);
      else colony.annotations = [colonyAnnotation];

      setColony((prev) => ({ ...prev, annotations: prev.annotations }));

      toast.success(`Creada nueva anotación "${colonyAnnotation.annotation}"`);
    } else {
      toast.error(`Error creando nueva anotación "${result.value}"`);
    }
  };

  const onAddColonyManager = async (userId: number) => {
    const existingUser = colony.managers.find((u) => u.id === userId);
    if (existingUser) {
      toast.warn('El usuario ya es gestor');
      return;
    }

    const selectedUser = users.find((u) => u.id === userId);
    if (!selectedUser) {
      toast.error('El usuario no existe');
      return;
    }

    if (!!(await addColonyManager(colony.id, selectedUser.id))) {
      toast.success(`Añadido gestor "${selectedUser.name}"`);
      setColony(await getColony(colony.id));
    } else {
      toast.error(`Error añadiendo gestor "${selectedUser.name}"`);
    }
  };

  const onRemoveColonyManager = async (userId: number) => {
    const existingUser = colony.managers.find((u) => u.id === userId);
    if (!existingUser) {
      toast.warn('El usuario no es gestor');
      return;
    }

    if (!!(await removeColonyManager(colony.id, userId))) {
      toast.success(`Eliminado gestor "${existingUser.name}"`);
      setColony(await getColony(colony.id));
    } else {
      toast.error(`Error eliminando gestor "${existingUser.name}"`);
    }
  };

  const onSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    const colony = await toast.promise(save(), {
      pending: 'Conectando con el servidor...',
      success: 'Datos actualizados',
      error: 'Error actualizando datos',
    });

    setColony(colony);
  };

  const save = () => {
    if (colony.id) {
      return updateColony(+colony.id, {
        ...{ address: colony.address },
        ...{ locationTypeId: +colony.locationTypeId },
        ...{ environmentId: +colony.environmentId },
        ...{ townId: +colony.townId },
      });
    } else {
      return createColony({
        ...{ address: colony.address },
        ...{ locationTypeId: +colony.locationTypeId },
        ...{ environmentId: +colony.environmentId },
        ...{ townId: +colony.townId },
      });
    }
  };

  const reduceAndSetStats = (cats: Cat[]): void => {
    const stats = cats.reduce(
      (stats: Stats, cat: Cat): Stats => {
        ++stats.total;

        if (!cat.ceasedAt && !cat.ceaseCauseId) {
          ++stats.active;

          stats.males += cat.gender === Gender.Male ? 1 : 0;
          stats.females += cat.gender === Gender.Female ? 1 : 0;
          stats.malesSterilized += cat.gender === Gender.Male && cat.sterilized ? 1 : 0;
          stats.femalesSterilized += cat.gender === Gender.Female && cat.sterilized ? 1 : 0;
          stats.kittens += isKitten(cat) ? 1 : 0;
        }

        return stats;
      },
      { ...zeroStats },
    );

    setStats(stats);

    if ((stats.malesSterilized + stats.femalesSterilized) / stats.active < 0.7) {
      setSterilizedStyle({ color: 'red' });
    }
  };

  const fetchData = async () => {
    setLoading(true);

    const userId = id === 'new' ? undefined : id;

    const [colony, environments, locationTypes, towns, users] = await Promise.all([
      userId ? getColony(+userId) : undefined,
      getEnvironmentsList({}),
      getLocationTypesList({}),
      getTownsList({}),
      getUsersList({}),
    ]);

    if (colony) setColony(colony);
    if (colony?.cats) reduceAndSetStats(colony.cats);
    if (environments) setEnvironments(environments.items.sort(descriptionSorter));
    if (locationTypes) setLocationTypes(locationTypes.items.sort(descriptionSorter));
    if (towns) setTowns(towns.items.sort(nameSorter));
    if (users) setUsers(users.items.sort(nameSorter));

    setLoading(false);
  };

  useEffect((): void => {
    fetchData();
  }, [id]);

  return (
    <>
      <InputModal
        id="AnnotationModal"
        title="Nueva Anotación"
        caption="Texto"
        buttonCaption="Añadir"
        isOpen={isAnnotationModalOpen}
        onClose={() => setAnnotationModalOpen(false)}
        onReturn={onNewAnnotation}
        placeholder="Inserta aquí la anotación"
      />

      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-12">
            <div className="container-md">
              <div className="shadow p-3 bg-body rounded">
                <p>
                  <i className="fa fa-id-card mr-2" aria-hidden="true"></i>
                  Datos generales de la COLONIA
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
                        value={colony?.id ? `CO${colony.id}` : ''}
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
                        allowAdd={authToken.isAdmin}
                        options={towns.map((i) => ({ value: i.id, label: i.name }))}
                        value={colony?.townId}
                        onChange={onSelectChange}
                        onCreate={onNewTown}
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-5">
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
                    <div className="col-md-4">
                      <label htmlFor="location" className="form-label">
                        Ubicación
                      </label>
                      <PropertySelector
                        id="locationTypeId"
                        title="Nueva Ubicación"
                        caption="Descripción"
                        buttonCaption="Crear"
                        allowAdd={authToken.isAdmin}
                        options={locationTypes.map((i) => ({ value: i.id, label: i.description }))}
                        value={colony?.locationTypeId}
                        onChange={onSelectChange}
                        onCreate={onNewLocationType}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label" htmlFor="environment">
                        Entorno
                      </label>
                      <PropertySelector
                        id="environmentId"
                        title="Nuevo entorno"
                        caption="Descripción"
                        buttonCaption="Crear"
                        allowAdd={authToken.isAdmin}
                        options={environments.map((i) => ({ value: i.id, label: i.description }))}
                        value={colony?.environmentId}
                        onChange={onSelectChange}
                        onCreate={onNewEnvironment}
                      />
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
                  <p>Machos: {valueAndPercent(stats.malesSterilized, stats.active)}</p>
                  <p>Hembras: {valueAndPercent(stats.femalesSterilized, stats.active)}</p>
                  <p style={sterilizedStyle}>
                    Total: {valueAndPercent(stats.malesSterilized + stats.femalesSterilized, stats.active)}
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

              {colony.id && (
                <Select
                  onChange={(v: any) => v?.value && onAddColonyManager(v.value)}
                  options={users
                    .filter((u) => !colony.managers.find((m) => m.id === u.id))
                    .map((user: User) => ({
                      value: user.id,
                      label: `${user.name} ${user.surnames} (GES${user.id})`,
                    }))}
                  isSearchable={true}
                  isClearable={true}
                  placeholder={<div>Seleccione gestora para añadir a la colonia...</div>}
                />
              )}

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
              <div className="d-flex justify-content-between">
                <p>
                  <i className="far fa-sticky-note mr-2" aria-hidden="true"></i>
                  Anotaciones
                </p>

                <button className="btn btn-primary btn-sm mb-3" onClick={onAddAnnotation} disabled={!colony.id}>
                  <i className="fa fa-plus-circle" aria-hidden="true"></i>
                </button>
              </div>

              <DataTable
                columns={annotationsColumns}
                data={colony.annotations || []}
                dense={true}
                highlightOnHover={true}
                progressPending={loading}
                striped={true}
              />
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <div className="shadow p-3 bg-body rounded">
              <p className="d-flex justify-content-between">
                <div>
                  <i className="fas fa-cat mr-2" aria-hidden="true"></i>
                  Gatos
                </div>
                <button className="btn btn-primary btn-sm mb-3" onClick={onAddCat} disabled={!colony.id}>
                  <i className="fa fa-plus-circle" aria-hidden="true"></i>
                </button>
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

ColonyDetails.getInitialProps = async (ctx: NextPageContext) => {
  return { id: ctx.query.id };
};

export default withPrivateRoute(ColonyDetails);
