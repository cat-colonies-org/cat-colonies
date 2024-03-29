import { User, getUsersList } from '../../services/users';
import { useRouter } from 'next/router';
import { useState, useEffect, FormEvent } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import withPrivateRoute from '../../components/with-private-route';

const UsersList = () => {
  const [data, setData] = useState([] as User[]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const router = useRouter();

  const fetchData = async (page: number = 1, newPerPage: number = perPage) => {
    setLoading(true);

    const filter = {
      name: search,
      surnames: search,
      email: search,
      phoneNumber: search,
    };

    const users = await getUsersList({
      filter,
      page,
      perPage: newPerPage,
    });

    setData(users.items);
    setTotalRows(users.total);
    setLoading(false);
  };

  const addManager = () => {
    router.push(`/users/new`);
  };

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handlePerRowsChange = (newPerPage: number, page: number) => {
    fetchData(page, newPerPage);
    setPerPage(newPerPage);
  };

  const onInputChange = (event: FormEvent<HTMLInputElement>): void => {
    const target = (event.target || event.currentTarget) as any;

    setSearch(target.value);
  };

  const onSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  };

  useEffect(() => {
    fetchData(1, perPage);
  }, []);

  const columns: TableColumn<User>[] = [
    { name: 'Id', selector: (user) => "GES"+user.id, width: '90px' },
    { name: 'Alta', selector: (user) => new Date(user.createdAt).toLocaleDateString(), width: '100px' },
    {
      name: 'Rol',
      width: '120px',
      selector: (user) => user.role?.description,
    },
    { name: 'Nombre', selector: (user) => user.name, width: '150px' },
    { name: 'Apellidos', selector: (user) => user.surnames, width: '180px' },
    { name: 'Teléfono', selector: (user) => user.phoneNumber, width: '120px' },
    { name: 'Email', selector: (user) => user.email, width: '200px' },
    {
      name: 'Baja',
      selector: (user) => (user.ceasedAt ? new Date(user.ceasedAt).toLocaleDateString() : ''),
      width: '100px',
    },
  ];

  return (
    <>
      <p className="d-flex justify-content-between">
        <div>Listado de Gestoras</div>
        <button className="btn btn-primary btn-sm" onClick={addManager}>
          <i className="fa fa-plus-circle" aria-hidden="true"></i>
        </button>
      </p>

      <form onSubmit={onSearchSubmit}>
        <div className="col-lg-12 mb-3">
          <div className="shadow-sm p-3 bg-body rounded">
            <div className="row mt-3">
              <div className="col-md-10">
                <input
                  id="surnames"
                  type="search"
                  placeholder="Indicar filtro"
                  className="form-control"
                  value={search}
                  onChange={onInputChange}
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary" type="submit">
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <DataTable
        columns={columns}
        conditionalRowStyles={[
          {
            when: (user: User) => !!user.ceasedAt,
            style: {
              color: 'red',
            },
          },
        ]}
        data={data}
        highlightOnHover={false}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        onRowClicked={(row) => router.push(`/users/${row.id}`)}
        pagination
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        paginationServer
        paginationTotalRows={totalRows}
        progressPending={loading}
        striped={true}
      />
    </>
  );
};

export default withPrivateRoute(UsersList);
