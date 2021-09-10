interface Cat {
  id: number;
  sterilized: boolean;
  birthYear: number;
  colony: {
    address: string;
    locationType: { description: string };
    environment: { description: string };
  };
}

const buildCatsQuery = () => `query {
  cats (order: "id", descending: true, skip: 0, take: 4) {
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

const Home = ({ cats }: { cats: Cat[] }) => {
  return (
    <>
      <h1>Gatos</h1>

      <p>Lista de gatos</p>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Año</th>
            <th scope="col">Esterilizado</th>
            <th scope="col">Direción colonia</th>
            <th scope="col">Tipo colonia</th>
            <th scope="col">Entorno colonia</th>
          </tr>
        </thead>
        <tbody>
          {cats.map((cat, idx) => (
            <tr key={idx}>
              <td>{cat.id}</td>
              <td>{cat.birthYear}</td>
              <td>{cat.sterilized}</td>
              <td>{cat.colony.address}</td>
              <td>{cat.colony.locationType.description}</td>
              <td>{cat.colony.environment.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export async function getServerSideProps() {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: "Bearer " + "## API KEY"
    },

    body: JSON.stringify({ query: buildCatsQuery() }),
  };

  return fetch('http://service:8080/graphql', options)
    .then((response) => response.json())
    .then((response) => {
      const cats = response.data?.cats;
      console.log(JSON.stringify(cats));
      return { props: { cats } };
    });
}

export default Home;
