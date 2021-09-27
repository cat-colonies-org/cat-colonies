import { apiCall, getCriteriaString } from '../common/util';

const eyeColorQueryFields: string = `
  id
  description
`;

export type EyeColor = {
  id: number;
  description: string;
};

export interface EyeColorList {
  total: number;
  items: EyeColor[];
}

const getEyeColorFromGraphQlResult = (eyeColor: Record<string, any>): EyeColor => {
  return eyeColor as EyeColor;
};

export async function getEyeColorsList({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): Promise<EyeColorList> {
  const criteria = getCriteriaString({ filter, page, perPage });

  const query = `query {
      eyeColors (${criteria}) {
        total
        items {
          ${eyeColorQueryFields}
        }
      }
    }`;

  return await apiCall(query).then((response): EyeColorList => {
    const eyeColors = response?.data?.eyeColors;

    const total: number = eyeColors?.total || 0;
    const items: EyeColor[] = eyeColors
      ? eyeColors.items.map((eyeColor: any): EyeColor => {
          return getEyeColorFromGraphQlResult(eyeColor);
        })
      : [];

    return { items, total };
  });
}

export async function createEyeColor(description: string): Promise<EyeColor> {
  const query = `mutation { 
    createEyeColor(createEyeColorInput: {description: "${description}"}) { id description }
  }`;

  return await apiCall(query).then((response): EyeColor => {
    return response?.data?.createEyeColor;
  });
}
