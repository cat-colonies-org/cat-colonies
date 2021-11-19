import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DataTable, { TableColumn } from 'react-data-table-component';
import withPrivateRoute from '../../components/with-private-route';
import { Colony } from '../../services/colonies';
import { User, getUser, updateUser, createUser } from '../../services/users';
import { createUserAnnotation, UserAnnotation } from '../../services/user-annotations';
import InputModal from '../../components/input-modal';

const UserDetails = () => {
  const router = useRouter();

  const emptyUser: Partial<User> = Object.freeze({
    createdAt: new Date(),
    name: '',
    surnames: '',
    phoneNumber: 0,
    email: '',
    roleId: 0,
  });

  const coloniesColumns: TableColumn<Colony>[] = [
    { name: 'Id', selector: (colony) => colony.id },
    { name: 'Alta', selector: (colony) => new Date(colony.createdAt).toLocaleDateString() },
    { name: 'Ciudad', selector: (colony) => (colony.town?.name ? colony.town.name : undefined) },
    { name: 'Calle', selector: (colony) => colony.address },
    { name: 'Ubicación', selector: (colony) => colony.locationType?.description },
    { name: 'Entorno', selector: (colony) => colony.environment?.description },
  ];

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({} as User);
  const [isAnnotationModalOpen, setAnnotationModalOpen] = useState(false);

  const annotationsColumns: TableColumn<UserAnnotation>[] = [
    { name: 'Id', selector: (row) => row.id, width: '100px' },
    { name: 'Fecha', selector: (row) => new Date(row.date).toLocaleDateString(), width: '100px' },
    { name: 'Anotación', selector: (row) => row.annotation },
  ];

  const fetchData = async () => {
    setLoading(true);

    const id = router?.query?.id ? +router.query.id : undefined;
    if (!id) {
      toast.error('Error inesperado');
      router.replace('/');
      return;
    }

    const [user] = await Promise.all([id ? getUser(+id) : Promise.resolve({ ...emptyUser } as User)]);

    if (user) setUser(user);

    setLoading(false);
  };

  useEffect((): void => {
    fetchData();
  }, []);

  const onAddAnnotation = (event: FormEvent<HTMLButtonElement>) => {
    if (!user.id) {
      toast.warn('Debe guardar la gestora antes de poder hacer anotaciones');
      return;
    }

    setAnnotationModalOpen(true);
  };

  const onNewAnnotation = async (result: { value: string }) => {
    if (!result?.value || !user.id) return;

    const userAnnotation: UserAnnotation = await createUserAnnotation(user.id, result.value);
    if (userAnnotation) {
      if (user.annotations) user.annotations.push(userAnnotation);
      else user.annotations = [userAnnotation];

      setUser((prev) => ({ ...prev, annotations: prev.annotations }));

      toast.success(`Creada nueva anotación "${userAnnotation.annotation}"`);
    } else {
      toast.error(`Error creando nueva anotación "${result.value}"`);
    }
  };

  const onInputChange = (event: FormEvent<HTMLInputElement>): void => {
    const target = (event.target || event.currentTarget) as any;

    setUser((user) => {
      return { ...user, [target.id]: target.value };
    });
  };

  const onCheckboxChange = (event: FormEvent<HTMLInputElement>): void => {
    const target = (event.target || event.currentTarget) as any;

    setUser((user) => {
      return { ...user, [target.id]: target.checked };
    });
  };

  const onDateChange = (date: Date, field: string): void => {
    setUser((prev: User) => {
      return { ...prev, [field]: date };
    });
  };

  const onSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    let promise: Promise<User>;

    if (user.id) promise = updateUser(user);
    else promise = createUser(user);

    const saved = await toast.promise(promise, {
      pending: 'Conectando con el servidor...',
      success: 'Datos actualizados',
      error: 'Error actualizando datos',
    });

    saved && setUser(saved);
  };

  useEffect((): void => {
    fetchData();
  }, []);

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
      />

      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-12">
            <div className="container-md">
              <div className="shadow p-3 bg-body rounded">
                <p>
                  <i className="fa fa-id-card mr-2" aria-hidden="true"></i>
                  Datos generales de la GESTORA
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
                        value={user?.id ? `GES${user.id}` : ''}
                        placeholder="Nueva colonia"
                        readOnly
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="name" className="form-label">
                        Nombre
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Nombre de la gestora"
                        className="form-control"
                        value={user?.name}
                        onChange={onInputChange}
                      />
                    </div>
                    <div className="col-md-5">
                      <label htmlFor="surnames" className="form-label">
                        Apellidos
                      </label>
                      <input
                        id="surnames"
                        type="text"
                        placeholder="Apellidos de la gestora"
                        className="form-control"
                        value={user?.surnames}
                        onChange={onInputChange}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-2">
                      <label htmlFor="idCard" className="form-label">
                        DNI
                      </label>
                      <input
                        id="idCard"
                        type="text"
                        className="form-control"
                        value={user?.idCard}
                        placeholder="idCard"
                        onChange={onInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        id="email"
                        type="text"
                        className="form-control"
                        value={user?.email}
                        placeholder="Email"
                        onChange={onInputChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="phoneNumber" className="form-label">
                        Teléfono
                      </label>
                      <input
                        id="phoneNumber"
                        type="text"
                        className="form-control"
                        value={user?.phoneNumber}
                        placeholder="phoneNumber"
                        onChange={onInputChange}
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="authorizesWhatsApp" className="form-label">
                        Autoriza WhatsApp
                      </label>
                      <div className="form-check">
                        <input
                          id="authorizesWhatsApp"
                          className="form-check-input"
                          type="checkbox"
                          checked={user.authorizesWhatsApp}
                          onChange={onCheckboxChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-2">
                      <label htmlFor="createdAt" className="form-label">
                        Alta
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={user?.createdAt?.toLocaleDateString()}
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
              <p className="d-flex justify-content-between">
                <div>
                  <i className="fas fa-home mr-2" aria-hidden="true"></i>
                  Colonias
                </div>
              </p>

              <DataTable
                columns={coloniesColumns}
                data={user.colonies}
                dense
                highlightOnHover={true}
                striped={true}
                progressPending={loading}
                onRowClicked={(row) => router.push(`/colonies/${row.id}`)}
              />
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-12">
            <div className="shadow p-3 bg-body rounded">
              <div className="d-flex justify-content-between">
                <div>
                  <i className="far fa-sticky-note mr-2" aria-hidden="true"></i>
                  Anotaciones
                </div>
                <button className="btn btn-primary btn-sm mb-3" onClick={onAddAnnotation} disabled={!user.id}>
                  <i className="fa fa-plus-circle" aria-hidden="true"></i>
                </button>
              </div>

              <DataTable
                columns={annotationsColumns}
                data={user.annotations || []}
                dense={true}
                highlightOnHover={true}
                progressPending={loading}
                striped={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withPrivateRoute(UserDetails);
