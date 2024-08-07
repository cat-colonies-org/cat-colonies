import { apiCall, getCriteriaString } from '../common/util';
import { Annotation } from './annotations';
import { Color } from './colors';

export type Picture = {
  id: number;
  catId: number;
  createdAt: Date;
  originalFilename: string;
  image: string;
  thumbnail: string;
};

// Used in /src/pages/cats/[id].tsx
export enum Gender {  
  // eslint-disable-next-line no-unused-vars
  Male = 'Male',
  // eslint-disable-next-line no-unused-vars  
  Female = 'Female',
  // eslint-disable-next-line no-unused-vars  
  Unknown = 'Unknown',  
}

export const catDataFragment: string = `
  fragment catData on Cat {
    id
    createdAt
    ceasedAt
    ceaseCauseId
    ceaseCause { description }
    bornAt
    sterilized
    sterilizedAt
    gender
    colonyId
    colony { id address town { name } cats { id } }
    eyeColorId
    eyeColor { description }
    patternId
    pattern { description }
    colors { id description }
    annotations { id catId date annotation }
    pictures { id catId createdAt originalFilename image thumbnail }
  }
`;

export type CatId = {
  id: number;
};

export type Cat = {
  id: number;
  createdAt: Date;
  ceasedAt: Date;
  ceaseCauseId: number;
  ceaseCause: { description: string };
  bornAt: Date;
  sterilized: boolean;
  sterilizedAt: Date;
  gender: Gender;
  colonyId: number;
  colony: { id: number; address: string; town: { name: string }; cats: CatId[] };
  eyeColorId: number;
  eyeColor: { description: string };
  patternId: number;
  pattern: { description: string };
  colors: Color[];
  annotations: Annotation[];
  pictures: Picture[];
};

export interface CatsList {
  total: number;
  items: Cat[];
}

export const isKitten = (cat: Cat): boolean => {
  if (!cat?.bornAt) return false;

  const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000;
  const today: Date = new Date();
  const birthDate: Date = new Date(cat.bornAt);

  return today.getTime() - birthDate.getTime() <= sixMonths;
};

const getCatFromGraphQlResult = (cat: Record<string, any>): Cat => {
  if (!cat) return {} as Cat;

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

  const query = `
    ${catDataFragment}

    query {
      cats (${criteria}) {
        total
        items {
          ...catData
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
  const query = `
    ${catDataFragment}

    query {
      cat (id:${id}) {
        ...catData
      }
    }
  `;

  return await apiCall(query).then((response): Cat => {
    return getCatFromGraphQlResult(response?.data?.cat);
  });
}

export async function createCat(cat: Partial<Cat>): Promise<Cat> {
  const query = `
    ${catDataFragment}

    mutation (
      $bornAt: DateTime,
      $sterilized: Boolean,
      $sterilizedAt: DateTime,
      $colors: [InputColor!]
      $colonyId: Int,
      $patternId: Int,
      $eyeColorId: Int,
      $gender: Gender,
      $ceasedAt: DateTime,
      $ceaseCauseId: Int,
      $annotations: [InputAnnotation!]
    ) {
      createCat(createCatInput: {
        bornAt: $bornAt,
        colors: $colors,
        sterilized: $sterilized,
        sterilizedAt: $sterilizedAt,
        colonyId: $colonyId,
        patternId: $patternId,
        eyeColorId: $eyeColorId,
        gender: $gender,
        ceasedAt: $ceasedAt,
        ceaseCauseId: $ceaseCauseId,
        annotations: $annotations
      }) {
        ...catData
      }
    }
  `;

  return await apiCall(query, cat).then((response): Cat => {
    return getCatFromGraphQlResult(response?.data?.createCat);
  });
}

export async function updateCat(cat: Partial<Cat>): Promise<Cat> {
  const query = `
    ${catDataFragment}

    mutation (
        $id: Int!,
        $bornAt: DateTime,
        $sterilized: Boolean,
        $sterilizedAt: DateTime,
        $colors: [InputColor!]
        $colonyId: Int,
        $patternId: Int,
        $eyeColorId: Int,
        $gender: Gender,
        $ceasedAt: DateTime,
        $ceaseCauseId: Int,
        $annotations: [InputAnnotation!]
      ) {
      updateCat (updateCatInput: {
        id: $id,
        bornAt: $bornAt,
        colors: $colors,
        sterilized: $sterilized,
        sterilizedAt: $sterilizedAt,
        colonyId: $colonyId,
        patternId: $patternId,
        eyeColorId: $eyeColorId,
        gender: $gender,
        ceasedAt: $ceasedAt,
        ceaseCauseId: $ceaseCauseId,
        annotations: $annotations
      }) {
        ...catData
      }
    }
  `;

  return await apiCall(query, cat).then((response): Cat => {
    let cat = response?.data?.updateCat;

    cat = cat ? getCatFromGraphQlResult(cat) : undefined;

    return cat;
  });
}
