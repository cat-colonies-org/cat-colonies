import { apiCall, getCriteriaString } from '../common/util';

const townQueryFields: string = `
  id
  name
`;

export type Town = {
  id: number;
  name: string;
};

export interface TownList {
  total: number;
  items: Town[];
}

const getTownFromGraphQlResult = (town: Record<string, any>): Town => {
  return town as Town;
};

export async function getTownsList({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): Promise<TownList> {
  const criteria = getCriteriaString({ filter, page, perPage });

  const query = `query {
      towns(${criteria}) {
        total
        items {
          ${townQueryFields}
        }
      }
    }`;

  return await apiCall(query).then((response): TownList => {
    const towns = response?.data?.towns;

    const total: number = towns ? towns.total : 0;
    const items: Town[] = towns
      ? towns.items.map((town: any): Town => {
          return getTownFromGraphQlResult(town);
        })
      : [];

    return { items, total };
  });
}

export async function createTown(name: string): Promise<Town> {
  const query = `mutation {
    createTown(createTownInput: {name: "${name}"}) { id name }
  }`;

  return await apiCall(query).then((response): Town => {
    return response?.data?.createTown;
  });
}
