import { objToListString } from '../common/util';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const colonyQueryFields = `      
  id
  createdAt
  address
  locationType { 
    id 
    description 
  }
  environment { 
    id
    description 
  }
  town { 
    id 
    name 
  }
`;

export type Colony = {
  id: number;
  createdAt: Date;
  address: string;
  locationTypeId: number;
  locationType: {
    id: number;
    description: string;
  };
  environmentId: number;
  environment: {
    id: number;
    description: string;
  };
  townId: number;
  town: {
    id: number;
    name: string;
  };
};

export type ColonyListRow = {
  id: number;
  createdAt: Date;
  address: string;
  locationType: string;
  environment: string;
  town: string;
};

interface GetColoniesListResult {
  total: number;
  items: ColonyListRow[];
}

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Authorization: "Bearer " + "## API KEY"
  },
};

export async function getColoniesList(page: number, perPage: number): Promise<GetColoniesListResult> {
  const skip = Math.max(page - 1, 0) * perPage;
  const take = perPage;

  const query = `query {
    colonies (order: "id", descending: false, skip: ${skip}, take: ${take}) {
      total
      items {
        id
        createdAt
        address
        locationType { id description }
        environment { id description }
        town { id name }
      }
    }
  }`;

  return await fetch(publicRuntimeConfig.apiBaseUrl, {
    ...options,
    body: JSON.stringify({ query }),
  })
    .then((response) => response.json())
    .then((response): GetColoniesListResult => {
      const colonies = response?.data?.colonies;

      const total: number = colonies ? colonies.total : 0;
      const items: ColonyListRow[] = colonies
        ? colonies.items.map((colony: any): ColonyListRow => {
            return {
              id: colony.id,
              createdAt: colony.createdAt,
              address: colony.address,
              locationType: colony.locationType?.description,
              environment: colony.environment?.description,
              town: colony.town?.name,
            };
          })
        : [];
      // TODO: catch

      return { items, total };
    });
}

export async function getColony(id: number): Promise<Colony> {
  const query = `query {
    colony (id:${id}) {
      ${colonyQueryFields}
    }
  }`;

  return await fetch(publicRuntimeConfig.apiBaseUrl, {
    ...options,
    body: JSON.stringify({ query }),
  })
    .then((response) => response.json())
    .then((response): Colony => {
      return response?.data?.colony as Colony;
    });
}

export async function updateColony(id: number, data: any): Promise<Colony> {
  const toUpdateString = objToListString(data);

  const query = `mutation {
    updateColony (updateColonyInput: {id: ${id}, ${toUpdateString}}) {
      ${colonyQueryFields}
    }
  }`;

  return await fetch(publicRuntimeConfig.apiBaseUrl, {
    ...options,
    body: JSON.stringify({ query }),
  })
    .then(async (response) => {
      return response.json();
    })
    .then((response): Colony => {
      return response?.data?.updateColony as Colony;
    });
}
