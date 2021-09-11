import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';

interface Cat {
  id: number;
  sterilized: boolean;
  birthYear: number;
  colonyAddress: string;
  colonyLocationType: string;
  colonyEnvironment: string;
}

const Cats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(4);

  const fetchData = async (page: number) => {
    setLoading(true);

    const skip = Math.max(page - 1, 0) * perPage;

    const query = `query {
      cats (order: "id", descending: false, skip: ${skip}, take: ${perPage}) {
        id
        sterilized
        birthYear
        colony {
          address
          locationType { description }
          environment { description }
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

    await fetch('http://service:8080/graphql', options)
      .then((response) => response.json())
      .then((response) => {
        const cats = response.data?.cats.map((cat: any): Cat => {
          return {
            id: cat.id,
            sterilized: cat.sterilized,
            birthYear: cat.birthYear,
            colonyAddress: cat.colony.address,
            colonyLocationType: cat.colony.locationType.description,
            colonyEnvironment: cat.colony.environment.description,
          };
        });

        setLoading(false);
        setData(cats);
        setTotalRows(10);
      });
    // TODO: catch
  };

  const handlePerRowsChange = (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    fetchData(page);
    // setLoading(true);
    // const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${newPerPage}&delay=1`);
    // setData(response.data.data);
    // setLoading(false);
  };

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const columns = [
    { name: 'Id', selector: (cat: any) => cat.id },
    { name: 'Nacimiento', selector: (cat: Cat) => cat.birthYear },
    {
      name: 'Esterilizado',
      selector: (cat: any) => cat.sterilized,
      format: (cat: any) => (cat.sterilized ? 'Sí' : 'No'),
    },
    { name: 'Dirección', selector: (cat: any) => cat.colonyAddress },
    { name: 'Tipo de localización', selector: (cat: any) => cat.colonyLocationType },
    { name: 'Entorno', selector: (cat: any) => cat.colonyEnvironment },
  ];

  return (
    <>
      <h1>Gatos</h1>

      <p>Lista de gatos</p>

      <DataTable
        highlightOnHover={true}
        striped={true}
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationRowsPerPageOptions={[3, 6, 9, 12]}
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onRowClicked={(row) => {
          alert(JSON.stringify(row, null, 2));
        }}
      />
    </>
  );
};

export default Cats;
