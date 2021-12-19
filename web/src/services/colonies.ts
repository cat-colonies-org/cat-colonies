import { apiCall, getCriteriaString, objToListString } from '../common/util';
import { Cat, catDataFragment } from './cats';
import { ColonyAnnotation } from './colony-annotations';
import { User } from './users';

export const colonyListDataFragment: string = `
  fragment colonyData on Colony {
    id
    createdAt
    address
    cats { ceasedAt ceaseCauseId }
    locationType { description }
    environment { description }
    town { name }
  }
`;

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
    annotations { id colonyId date annotation }
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
  annotations: ColonyAnnotation[];
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
    createdAt: colony?.createdAt ? new Date(colony.createdAt) : undefined,
    managers: colony?.managers?.sort(idSorter),
    cats: colony?.cats?.sort(idSorter),
  } as Colony;
};

export async function getColoniesList({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): Promise<ColoniesList> {
  const criteria = getCriteriaString({ filter, page, perPage });

  const query = `
    ${colonyListDataFragment}

    query {
      colonies (${criteria}) {
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

export async function createColony(data: any): Promise<Colony> {
  const toCreateString = objToListString(data);

  const query = `
    ${colonyDataFragment}

    mutation {
      createColony (createColonyInput: {${toCreateString}}) {
        ...colonyData
      }
    }
  `;

  return await apiCall(query).then((response): Colony => {
    return getColonyFromGraphQlResult(response?.data?.createColony);
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
    return getColonyFromGraphQlResult(response?.data?.updateColony);
  });
}

export async function addColonyManager(colonyId: number, userId: number): Promise<boolean> {
  const query = `
    mutation {
      addColonyManager(colonyId: ${colonyId}, userId:${userId}) {
        result
      }
    }
  `;

  return await apiCall(query).then((response): boolean => {
    return response?.data?.addColonyManager?.result;
  });
}

export async function removeColonyManager(colonyId: number, userId: number): Promise<boolean> {
  const query = `
    mutation {
      removeColonyManager(colonyId: ${colonyId}, userId:${userId}) {
        result
      }
    }
  `;

  return await apiCall(query).then((response): boolean => {
    return response?.data?.removeColonyManager?.result;
  });
}
