import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

type ColonyRow = {
  id: number;
  createdAt: Date;
  address: string;
  locationType: string;
  environment: string;
  town: string;
};

export default function Colonies() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const router = useRouter();

  const fetchData = async (page: number, newPerPage?: number) => {
    setLoading(true);

    const skip = Math.max(page - 1, 0) * perPage;
    const take = newPerPage || perPage;

    const query = `query {
      colonies (order: "id", descending: false, skip: ${skip}, take: ${take}) {
        total
        items {
          id
          createdAt
          address
          locationType { description }
          environment { description }
          town { name }
        }
      }
    }`;

    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: "Bearer " + "## API KEY"
      },

      body: JSON.stringify({ query }),
    };

    // await fetch('http://cats.daviddiaz.es:8080/graphql', options) // TODO: llevar a configuración
    await fetch('http://service:8080/graphql', options)
      .then((response) => response.json())
      .then((response) => {
        const colonies = response?.data?.colonies;
        if (!colonies) return;

        const mapped = response.data.colonies.items.map((colony: any): ColonyRow => {
          return {
            id: colony.id,
            createdAt: colony.createdAt,
            address: colony.address,
            locationType: colony.locationType?.description,
            environment: colony.environment?.description,
            town: colony.town?.name,
          };
        });

        setData(mapped);
        setTotalRows(colonies.total);
        setLoading(false);
      });
    // TODO: catch
  };

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handlePerRowsChange = (newPerPage: number, page: number) => {
    fetchData(page, newPerPage);
    setPerPage(newPerPage);
  };

  useEffect(() => {
    fetchData(1, perPage);
  }, []);

  const columns: TableColumn<ColonyRow>[] = [
    { name: 'Id', selector: (row) => row.id },
    { name: 'Registro', selector: (row) => row.createdAt },
    { name: 'Dirección', selector: (row) => row.address },
    { name: 'Tipo ubicación', selector: (row) => row.locationType },
    { name: 'Entorno', selector: (row) => row.environment },
    { name: 'Localidad', selector: (row) => row.town },
  ];

  return (
    <>
      <h1>Colonias</h1>

      <p>Lista de Colonias</p>

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
}
