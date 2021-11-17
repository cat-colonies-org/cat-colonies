import { Colony, getColoniesList } from '../../services/colonies';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import withPrivateRoute from '../../components/with-private-route';

const Colonies = () => {
  const [data, setData] = useState([] as Colony[]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const router = useRouter();

  const fetchData = async (page: number, newPerPage?: number) => {
    setLoading(true);

    const colonies = await getColoniesList(page, newPerPage || perPage);

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

  const columns: TableColumn<Colony>[] = [
    { name: 'Id', selector: (row) => row.id },
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
