import { apiCall, objToListString } from '../common/util';
import { Cat, catDataFragment } from './cats';
import { User } from './users';

export const colonyDataFragment: string = `
  ${catDataFragment}

  fragment colonyData on Colony {
    id
    createdAt
    address
    managers { id name createdAt }
    cats { ...catData }
    locationTypeId
    locationType { description }
    environmentId
    environment { description }
    townId
    town { name }
  }
`;

export type Colony = {
  id: number;
  createdAt: Date;
  address: string;
  locationTypeId: number;
  environmentId: number;
  townId: number;
  managers: User[];
  cats: Cat[];
  locationType: { description: string };
  environment: { description: string };
  town: { name: string };
};

export interface ColoniesList {
  total: number;
  items: Colony[];
}

const idSorter = (a: { id: number }, b: { id: number }): number => {
  return a.id - b.id;
};

const getColonyFromGraphQlResult = (colony: Record<string, any>): Colony => {
  return {
    ...colony,
    createdAt: colony.createdAt ? new Date(colony.createdAt) : undefined,
    managers: colony.managers?.sort(idSorter),
    cats: colony.cats?.sort(idSorter),
  } as Colony;
};

export async function getColoniesList(page: number, perPage: number): Promise<ColoniesList> {
  const skip = Math.max(page - 1, 0) * perPage;
  const take = perPage;

  const query = `
    ${colonyDataFragment}
  
    query {
      colonies (order: "id", descending: false, skip: ${skip}, take: ${take}) {
        total
        items {
          ...colonyData
        }
      }
    }
  `;

  return await apiCall(query).then((response): ColoniesList => {
    const colonies = response?.data?.colonies;

    const total: number = colonies ? colonies.total : 0;
    const items: Colony[] = colonies
      ? colonies.items.map((colony: any): Colony => getColonyFromGraphQlResult(colony))
      : [];

    return { items, total };
  });
}

export async function getColony(id: number): Promise<Colony> {
  const query = `
    ${colonyDataFragment}
      
    query {
      colony (id:${id}) {
        ...colonyData
      }
    }
  `;

  return await apiCall(query).then((response): Colony => {
    return getColonyFromGraphQlResult(response?.data?.colony);
  });
}

export async function updateColony(id: number, data: any): Promise<Colony> {
  const toUpdateString = objToListString(data);

  const query = `
    ${colonyDataFragment}

    mutation {
      updateColony (updateColonyInput: {id: ${id}, ${toUpdateString}}) {
        ...colonyData
      }
    }
  `;

  return await apiCall(query).then((response): Colony => {
    return response?.data?.updateColony as Colony;
  });
}
