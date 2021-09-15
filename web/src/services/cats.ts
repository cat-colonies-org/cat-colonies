export type CatsListRow = {
  id: number;
  imageUrl: string;
  createdAt: Date;
  color: string;
  pattern: string;
  sterilized: boolean;
  birthYear: number;
  colonyAddress: string;
  colonyLocationType: string;
  colonyEnvironment: string;
};

interface GetCatsListResult {
  total: number;
  items: CatsListRow[];
}

const options = {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    // Authorization: "Bearer " + "## API KEY"
  },
};

export async function getCatsList(page: number, perPage: number): Promise<GetCatsListResult> {
  const skip = Math.max(page - 1, 0) * perPage;
  const take = perPage;

  const query = `query {
      cats (order: "id", descending: false, skip: ${skip}, take: ${take}) {
        total
        items {
          id
          imageURL
          createdAt
          color { description }
          pattern { description }
          sterilized
          birthYear
          colony {
            address
            locationType { description }
            environment { description }
          }
        }
      }
    }`;

  // await fetch('http://cats.daviddiaz.es:8080/graphql', options) // TODO: llevar a configuración
  return await fetch('http://service:8080/graphql', {
    ...options,
    body: JSON.stringify({ query }),
  })
    .then((response) => response.json())
    .then((response): GetCatsListResult => {
      const cats = response?.data?.cats;

      const total: number = cats ? cats.total : 0;
      const items: CatsListRow[] = cats
        ? cats.items.map((cat: any): CatsListRow => {
            return {
              id: cat.id,
              imageUrl: cat.imageURL,
              createdAt: cat.createdAt,
              color: cat.color.description,
              pattern: cat.pattern.description,
              sterilized: cat.sterilized,
              birthYear: cat.birthYear,
              colonyAddress: cat.colony?.address,
              colonyLocationType: cat.colony?.locationType.description,
              colonyEnvironment: cat.colony?.environment.description,
            };
          })
        : [];
      // TODO: catch

      return { items, total };
    });
}
