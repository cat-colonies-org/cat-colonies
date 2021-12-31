import 'react-datepicker/dist/react-datepicker.css';
import { Auth } from '../../common/authToken';
import { Colony } from '../../services/colonies';
import { createUserAnnotation, UserAnnotation } from '../../services/user-annotations';
import { createUserCeaseCause, getUserCeaseCausesList, UserCeaseCause } from '../../services/user-cease-causes';
import { NextPageContext } from 'next';
import { toast } from 'react-toastify';
import { User, getUser, updateUser, createUser, UserDocument } from '../../services/users';
import { useRouter } from 'next/router';
import DataTable, { TableColumn } from 'react-data-table-component';
import es from 'date-fns/locale/es';
import InputModal from '../../components/input-modal';
import PropertySelector from '../../components/property-selector';
import React, { FormEvent, useEffect, useState } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import withPrivateRoute from '../../components/with-private-route';
import UploadModal from '../../components/upload-modal';

registerLocale('es', es);

interface UserDetailsProps {
  id: string;
  authToken: Auth;
}

const UserDetails = ({ id, authToken }: UserDetailsProps) => {
  const router = useRouter();

  const emptyUser: Partial<User> = Object.freeze({
    createdAt: new Date(),
    name: '',
    surnames: '',
    phoneNumber: '',
    authorizesWhatsApp: false,
    email: '',
    roleId: 0,
    password: '',
    ceaseCauseId: undefined,
    ceasedAt: undefined,
  });

  const coloniesColumns: TableColumn<Colony>[] = [
    { name: 'Id', selector: (colony) => "CO"+colony.id },
    { name: 'Alta', selector: (colony) => new Date(colony.createdAt).toLocaleDateString() },
    { name: 'Ciudad', selector: (colony) => (colony.town?.name ? colony.town.name : undefined) },
    { name: 'Calle', selector: (colony) => colony.address },
    { name: 'Ubicación', selector: (colony) => colony.locationType?.description },
    { name: 'Entorno', selector: (colony) => colony.environment?.description },
  ];

  const annotationsColumns: TableColumn<UserAnnotation>[] = [
    { name: 'Id', selector: (row) => row.id, width: '100px' },
    { name: 'Fecha', selector: (row) => new Date(row.date).toLocaleDateString(), width: '100px' },
    { name: 'Anotación', selector: (row) => row.annotation },
  ];

  const documentsColumns: TableColumn<UserDocument>[] = [
    { name: 'Id', selector: (row) => row.id, width: '100px' },
    { name: 'Fecha', selector: (row) => new Date(row.createdAt).toLocaleDateString(), width: '100px' },
    {
      name: 'Fichero',
      cell: (row) => (
        <a download={`${row.originalFilename}`} href={`${process.env.NEXT_PUBLIC_DOCUMENTS_BASE_URL}/${row.document}`}>
          {row.originalFilename}
        </a>
      ),
    },
  ];

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({} as User);
  const [userCeaseCauses, setUserCeaseCauses] = useState([] as UserCeaseCause[]);
  const [isAnnotationModalOpen, setAnnotationModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  const descriptionSorter = (a: { description: string }, b: { description: string }): number => {
    return a.description.localeCompare(b.description);
  };

  const fetchData = async () => {
    setLoading(true);

    const userId = id === 'new' ? undefined : id;

    const [user, ceaseCauses] = await Promise.all([
      userId ? getUser(+userId) : Promise.resolve({ ...emptyUser } as User),
      getUserCeaseCausesList({}),
    ]);

    if (user) {
      setUser(user);
    }

    if (ceaseCauses) setUserCeaseCauses(ceaseCauses.items.sort(descriptionSorter));

    setLoading(false);
  };

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

  const onDateChange = (date: any, field: string): void => {
    setUser((prev: User) => {
      return { ...prev, [field]: date };
    });
  };

  const onSelectChange = (data: any, meta: { action: string; name: string }): void => {
    setUser((prev: any) => ({ ...prev, [meta.name]: data ? data.value : null }));
  };

  const onCreateCeaseCause = async (description: string) => {
    const item: UserCeaseCause = await createUserCeaseCause(description);

    if (!item) {
      toast.error(`Error creando causa de baja "${description}"`);
      return;
    }

    setUserCeaseCauses((prev) => [...prev, { ...item }].sort(descriptionSorter));

    setUser((prev) => ({ ...prev, ceaseCauseId: item.id }));

    toast.success(`Creada nueva causa de baja "${item.description}" con id "${item.id}"`);
  };

  const onDocumentsSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setUploadModalOpen(false);

    if (!user.id) {
      toast.warn('No es posible asignar documentos a un usuario que todavía no tiene ID');
      return;
    }

    const data = new FormData(event.target as HTMLFormElement);
    const response = await fetch(`${process.env.NEXT_PUBLIC_REST_BASE_URL}/document-upload/${user.id}`, {
      method: 'POST',
      headers: {
        Authorization: authToken.authorizationString,
      },
      body: data,
    });

    const { uploaded } = await response.json();
    if (uploaded) {
      const updatedUser = await getUser(user.id);

      setUser((prev) => ({ ...prev, documents: [...updatedUser.documents] }));

      toast.success(uploaded > 1 ? `Añadidos ${uploaded} nuevos documentos` : 'Añadido 1 nuevo documento');
    }
  };

  const onSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    const user = await toast.promise(save(), {
      pending: 'Conectando con el servidor...',
      success: 'Datos actualizados',
      error: 'Error actualizando datos',
    });

    setUser(user);
  };

  const save = () => {
    if (user.id) {
      return updateUser(+user.id, {
        ...{ name: user.name },
        ...{ surnames: user.surnames },
        ...{ idCard: user.idCard },
        ...{ email: user.email },
        ...{ phoneNumber: user.phoneNumber },
        ...{ authorizesWhatsApp: user.authorizesWhatsApp },
        ...{ ceasedAt: user.ceasedAt ? user.ceasedAt : null },
        ...{ ceaseCauseId: user.ceaseCauseId ? user.ceaseCauseId : null },
        ...{ password: user.password },
      });
    } else {
      return createUser({
        ...{ name: user.name },
        ...{ surnames: user.surnames },
        ...{ idCard: user.idCard },
        ...{ email: user.email },
        ...{ phoneNumber: user.phoneNumber },
        ...{ authorizesWhatsApp: user.authorizesWhatsApp },
        ...{ ceasedAt: user.ceasedAt ? user.ceasedAt : null },
        ...{ ceaseCauseId: user.ceaseCauseId ? user.ceaseCauseId : null },
        ...{ password: user.password },
      });
    }
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

      <UploadModal
        id="UploadModal"
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onReturn={onDocumentsSubmit}
      ></UploadModal>

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
                        placeholder="Nueva gestora"
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

                    <div className="col-md-3">
                      <label htmlFor="ceasedAt" className="form-label">
                        Baja
                      </label>
                      <ReactDatePicker
                        id="ceasedAt"
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                        locale="es"
                        selected={user?.ceasedAt}
                        onChange={(date: Date) => onDateChange(date, 'ceasedAt')}
                        todayButton="Hoy"
                        isClearable
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="ceaseCauseId" className="form-label">
                        Causa de baja
                      </label>
                      <PropertySelector
                        id="ceaseCauseId"
                        title="Nueva Causa de Baja"
                        caption="Descripción"
                        allowAdd={authToken.isAdmin}
                        options={userCeaseCauses.map((i) => ({ value: i.id, label: i.description }))}
                        value={user?.ceaseCauseId}
                        onChange={onSelectChange}
                        onCreate={onCreateCeaseCause}
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
                <i className="fas fa-home mr-2" aria-hidden="true"></i>
                Colonias
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
                <p>
                  <i className="far fa-file-pdf mr-2" aria-hidden="true"></i>
                  Documentos
                </p>
                <button
                  className="btn btn-primary btn-sm mb-3"
                  onClick={() => setUploadModalOpen(true)}
                  disabled={!user.id}
                >
                  <i className="fa fa-plus-circle" aria-hidden="true"></i>
                </button>
              </div>

              <DataTable
                columns={documentsColumns}
                data={user.documents || []}
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
              <div className="d-flex justify-content-between">
                <p>
                  <i className="far fa-sticky-note mr-2" aria-hidden="true"></i>
                  Anotaciones
                </p>
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

UserDetails.getInitialProps = async (ctx: NextPageContext) => {
  return { id: ctx.query.id };
};

export default withPrivateRoute(UserDetails);
