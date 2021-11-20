import { User, getUsersList } from '../../services/users';
import { useRouter } from 'next/router';
import { useState, useEffect, FormEvent } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import withPrivateRoute from '../../components/with-private-route';

const UsersList = () => {
  class SearchFields {
    name: string = '';
    surnames: string = '';
  }

  const emptySearchFields = new SearchFields();

  const [data, setData] = useState([] as User[]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [search, setSearch] = useState(emptySearchFields);

  const router = useRouter();

  const fetchData = async (page: number = 1, newPerPage: number = perPage) => {
    setLoading(true);

    const users = await getUsersList({
      filter: search,
      page,
      perPage: newPerPage,
    });

    setData(users.items);
    setTotalRows(users.total);
    setLoading(false);
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

    setSearch((search: SearchFields) => {
      return { ...search, [target.id]: target.value };
    });
  };

  const onSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  };

  useEffect(() => {
    fetchData(1, perPage);
  }, []);

  const columns: TableColumn<User>[] = [
    { name: 'Id', selector: (user) => user.id, width: '60px' },
    { name: 'Alta', selector: (user) => new Date(user.createdAt).toLocaleDateString(), width: '100px' },
    {
      name: 'Rol',
      width: '150px',
      selector: (user) => user.role?.description,
    },
    { name: 'Nombre', selector: (user) => user.name, width: '150px' },
    { name: 'Apellidos', selector: (user) => user.surnames, width: '250px' },
    { name: 'Teléfono', selector: (user) => user.phoneNumber, width: '100px' },
    { name: 'Email', selector: (user) => user.email, width: '200px' },
  ];

  return (
    <>
      <p>
        <i className="fa fa-female mr-2" aria-hidden="true"></i>Listado de gestoras
      </p>

      <form onSubmit={onSearchSubmit}>
        <div className="col-lg-12 mb-3">
          <div className="shadow-sm p-3 bg-body rounded">
            <div className="row mt-3">
              <div className="col-md-5">
                <input
                  id="name"
                  type="search"
                  placeholder="Filtrar por nombre"
                  className="form-control"
                  value={search.name}
                  onChange={onInputChange}
                />
              </div>
              <div className="col-md-5">
                <input
                  id="surnames"
                  type="search"
                  placeholder="Filtrar por apellidos"
                  className="form-control"
                  value={search.surnames}
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

        {/* <label className="form-label" htmlFor="name">
          Nombre:
        </label>
        <input className="form-control" id="name" value={search.name} onChange={onInputChange} />
        <label className="form-label" htmlFor="surnames">
          Apellidos:
        </label>
        <input className="form-control" id="surnames" value={search.surnames} onChange={onInputChange} />
        <button className="btn btn-primary" type="submit">
          Buscar
        </button> */}
      </form>

      <DataTable
        columns={columns}
        data={data}
        highlightOnHover={false}
        striped={true}
        progressPending={loading}
        pagination
        paginationServer
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onRowClicked={(row) => router.push(`/users/${row.id}`)}
      />
    </>
  );
};

export default withPrivateRoute(UsersList);
