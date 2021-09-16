import { apiCall, objToListString } from '../common/util';

const colonyQueryFields: string = `
  id
  createdAt
  address
  locationType { id description }
  environment { id description }
  town { id name }
`;

export type Colony = {
  id: number;
  createdAt: Date;
  address: string;
  locationType: {
    id: number;
    description: string;
  };
  environment: {
    id: number;
    description: string;
  };
  town: {
    id: number;
    name: string;
  };
};

export interface ColoniesList {
  total: number;
  items: Colony[];
}

const getColonyFromGraphQlResult = (colony: Record<string, any>): Colony => {
  return {
    ...colony,
    createdAt: new Date(colony.createdAt),
  } as Colony;
};

export async function getColoniesList(page: number, perPage: number): Promise<ColoniesList> {
  const skip = Math.max(page - 1, 0) * perPage;
  const take = perPage;

  const query = `query {
    colonies (order: "id", descending: false, skip: ${skip}, take: ${take}) {
      total
      items {
        ${colonyQueryFields}
      }
    }
  }`;

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
  const query = `query {
    colony (id:${id}) {
      ${colonyQueryFields}
    }
  }`;

  return await apiCall(query).then((response): Colony => {
    return getColonyFromGraphQlResult(response?.data?.colony);
  });
}

export async function updateColony(id: number, data: any): Promise<Colony> {
  const toUpdateString = objToListString(data);

  const query = `mutation {
    updateColony (updateColonyInput: {id: ${id}, ${toUpdateString}}) {
      ${colonyQueryFields}
    }
  }`;

  return await apiCall(query).then((response): Colony => {
    return response?.data?.updateColony as Colony;
  });
}
