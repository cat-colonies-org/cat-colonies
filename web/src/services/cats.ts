import { apiCall, getCriteriaString, objToListString, omit } from '../common/util';
import { Annotation } from './annotations';

export const catQueryFields: string = `
  id
  createdAt
  ceasedAt
  ceaseCauseId
  ceaseCause { description }
  bornAt
  sterilized
  sterilizedAt
  imageURL
  gender
  colonyId
  colony { address }
  colorId
  color { description }
  patternId
  pattern { description }
  eyeColorId
  eyeColor { description }
  annotations { id date annotation }
`;

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Unknown = 'Unknown',
}

export type Cat = {
  id: number;
  createdAt: Date;
  ceasedAt: Date;
  ceaseCauseId: number;
  ceaseCause: { description: string };
  bornAt: Date;
  sterilized: boolean;
  sterilizedAt: Date;
  imageURL: string;
  gender: Gender;
  colonyId: number;
  colony: { address: string };
  colorId: number;
  color: { description: string };
  patternId: number;
  pattern: { description: string };
  eyeColorId: number;
  eyeColor: { description: string };
  annotations: Annotation[];
};

export const isKitten = (cat: Cat): boolean => {
  if (!cat?.bornAt) return false;

  const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000;
  const today: Date = new Date();
  const birthDate: Date = new Date(cat.bornAt);

  return today.getTime() - birthDate.getTime() <= sixMonths;
};

export interface CatsList {
  total: number;
  items: Cat[];
}

const getCatFromGraphQlResult = (cat: Record<string, any>): Cat => {
  return {
    ...cat,
    createdAt: cat.createdAt ? new Date(cat.createdAt) : undefined,
    bornAt: cat.bornAt ? new Date(cat.bornAt) : undefined,
    sterilizedAt: cat.sterilizedAt ? new Date(cat.sterilizedAt) : undefined,
    ceasedAt: cat.ceasedAt ? new Date(cat.ceasedAt) : undefined,
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

export async function getCat(id: number): Promise<Cat> {
  const query = `query {
    cat (id:${id}) {
      ${catQueryFields}
    }
  }`;

  return await apiCall(query).then((response): Cat => {
    return getCatFromGraphQlResult(response?.data?.cat);
  });
}

export async function createCat(cat: Partial<Cat>): Promise<Cat> {
  const gender = `gender: ${cat.gender}`;

  cat = omit(cat, ['createdAt', 'gender', 'imageURL', 'annotations']);

  const fields = objToListString(cat);

  const query = `mutation {
    createCat(createCatInput: { ${fields}, ${gender} }) { ${catQueryFields} }
  }`;

  return await apiCall(query).then((response): Cat => {
    return getCatFromGraphQlResult(response?.data?.createCat);
  });
}

export async function updateCat(id: number, cat: Partial<Cat>): Promise<Cat> {
  const gender = `gender: ${cat.gender}`;

  cat = omit(cat, [
    'id',
    'createdAt',
    'gender',
    'ceaseCause',
    'colony',
    'color',
    'pattern',
    'eyeColor',
    'imageURL',
    'annotations',
  ]);

  const fields = objToListString(cat);

  const query = `mutation {
    updateCat (updateCatInput: {id: ${id}, ${fields}, ${gender}}) {
      ${catQueryFields}
    }
  }`;

  return await apiCall(query).then((response): Cat => {
    let cat = response?.data?.updateCat;

    cat = cat ? getCatFromGraphQlResult(cat) : undefined;

    return cat;
  });
}
