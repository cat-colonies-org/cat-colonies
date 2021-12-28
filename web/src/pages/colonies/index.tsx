import { Colony, getColoniesList } from '../../services/colonies';
import { useRouter } from 'next/router';
import { useState, useEffect, FormEvent } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import withPrivateRoute from '../../components/with-private-route';

const Colonies = () => {
  const [data, setData] = useState([] as Colony[]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const router = useRouter();

  const fetchData = async (page: number=1, newPerPage: number=perPage) => {
    setLoading(true);

    const filter = {
      address: search, 
      townName: search,     
    };

    const colonies = await getColoniesList( {
      filter, page, perPage: newPerPage } );

    setData(colonies.items);
    setTotalRows(colonies.total);
    setLoading(false);
  };

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handlePerRowsChange = (newPerPage: number, page: number) => {
    fetchData(page, newPerPage);
    setPerPage(newPerPage);
  };

  const addColony = () => {
    router.push(`/colonies/new`);
  };

  useEffect(() => {
    fetchData(1, perPage);
  }, []);

  const getActiveCats = (colony: Colony): number => {
    return colony.cats?.reduce((active, curr) => {
      return curr.ceasedAt || curr.ceaseCauseId ? active : active + 1;
    }, 0);
  };

  const onSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  };

  const onInputChange = (event: FormEvent<HTMLInputElement>): void => {
    const target = (event.target || event.currentTarget) as any;

    setSearch(target.value);
  };


  const columns: TableColumn<Colony>[] = [
    { name: 'Id', selector: (row) => 'CO'+row.id },
    { name: 'Registro', selector: (row) => row.createdAt.toLocaleDateString() },
    { name: 'Dirección', selector: (row) => row.address },
    { name: 'Tipo ubicación', selector: (row) => row.locationType.description },
    { name: 'Entorno', selector: (row) => row.environment.description },
    { name: 'Localidad', selector: (row) => row.town.name },
    { name: 'Activos', selector: (row) => getActiveCats(row) },
  ];



  return (
    <>
      <p className="d-flex justify-content-between">
        <div>Listado de Colonias</div>
        <button className="btn btn-primary btn-sm" onClick={addColony}>
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
        onRowClicked={(row) => router.push(`/colonies/${row.id}`)}
      />
    </>
  );
};

export default withPrivateRoute(Colonies);
