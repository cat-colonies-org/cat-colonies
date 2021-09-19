import { apiCall, getCriteriaString } from '../common/util';

export const catQueryFields: string = `
  id
  createdAt
  birthYear
  imageURL
  sterilized
  color { description }
  pattern { description }
`;

export type Cat = {
  id: number;
  createdAt: Date;
  birthYear: number;
  imageURL: string;
  sterilized: boolean;
  color: { id: number; description: string };
  pattern: { id: number; description: string };
};

export interface CatsList {
  total: number;
  items: Cat[];
}

const getCatFromGraphQlResult = (cat: Record<string, any>): Cat => {
  return {
    ...cat,
    createdAt: new Date(cat.createdAt),
  } as Cat;
};

export async function getCatsList({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): Promise<CatsList> {
  const criteria = getCriteriaString({ filter, page, perPage });

  const query = `query {
      cats (${criteria}) {
        total
        items {
          ${catQueryFields}
        }
      }
    }`;

  return await apiCall(query).then((response): CatsList => {
    const cats = response?.data?.cats;

    const total: number = cats ? cats.total : 0;
    const items: Cat[] = cats
      ? cats.items.map((cat: any): Cat => {
          return getCatFromGraphQlResult(cat);
        })
      : [];

    return { items, total };
  });
}
