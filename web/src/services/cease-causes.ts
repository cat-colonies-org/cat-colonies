import { apiCall, getCriteriaString } from '../common/util';

const ceaseCauseQueryFields: string = `
  id
  description
`;

export type CeaseCause = {
  id: number;
  description: string;
};

export interface CeaseCauseList {
  total: number;
  items: CeaseCause[];
}

const getCeaseCauseFromGraphQlResult = (ceaseCause: Record<string, any>): CeaseCause => {
  return ceaseCause as CeaseCause;
};

export async function getCeaseCausesList({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): Promise<CeaseCauseList> {
  const criteria = getCriteriaString({ filter, page, perPage });

  const query = `query {
      ceaseCauses (${criteria}) {
        total
        items {
          ${ceaseCauseQueryFields}
        }
      }
    }`;

  return await apiCall(query).then((response): CeaseCauseList => {
    const ceaseCauses = response?.data?.ceaseCauses;

    const total: number = ceaseCauses?.total || 0;
    const items: CeaseCause[] = ceaseCauses
      ? ceaseCauses.items.map((ceaseCause: any): CeaseCause => {
          return getCeaseCauseFromGraphQlResult(ceaseCause);
        })
      : [];

    return { items, total };
  });
}

export async function createCeaseCause(description: string): Promise<CeaseCause> {
  const query = `mutation {
    createCeaseCause(createCeaseCauseInput: {description: "${description}"}) { id description }
  }`;

  return await apiCall(query).then((response): CeaseCause => {
    return response?.data?.createCeaseCause;
  });
}
