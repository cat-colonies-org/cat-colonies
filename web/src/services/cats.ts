import { apiCall, getCriteriaString } from '../common/util';

export const catQueryFields: string = `
  id
  createdAt
  ceasedAt
  ceaseCauseId
  ceaseCause { description }
  birthYear
  sterilized
  sterilizedAt
  imageURL
  gender
  kitten
  colonyId
  colony { address }
  colorId
  color { description }
  patternId
  pattern { description }
  eyeColorId
  eyeColor { description }
`;

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export type Cat = {
  id: number;
  createdAt: Date;
  ceasedAt: Date;
  ceaseCauseId: number;
  ceaseCause: { description: string };
  birthYear: number;
  sterilized: boolean;
  sterilizedAt: Date;
  imageURL: string;
  gender: Gender;
  kitten: boolean;
  colonyId: number;
  colony: { address: string };
  colorId: number;
  color: { description: string };
  patternId: number;
  pattern: { description: string };
  eyeColorId: number;
  eyeColor: { description: string };
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
