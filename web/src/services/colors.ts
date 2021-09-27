import { apiCall, getCriteriaString } from '../common/util';

const colorQueryFields: string = `
  id
  description
`;

export type Color = {
  id: number;
  description: string;
};

export interface ColorList {
  total: number;
  items: Color[];
}

const getColorFromGraphQlResult = (color: Record<string, any>): Color => {
  return color as Color;
};

export async function getColorsList({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): Promise<ColorList> {
  const criteria = getCriteriaString({ filter, page, perPage });

  const query = `query {
      colors (${criteria}) {
        total
        items {
          ${colorQueryFields}
        }
      }
    }`;

  return await apiCall(query).then((response): ColorList => {
    const colors = response?.data?.colors;

    const total: number = colors?.total || 0;
    const items: Color[] = colors
      ? colors.items.map((color: any): Color => {
          return getColorFromGraphQlResult(color);
        })
      : [];

    return { items, total };
  });
}

export async function createColor(description: string): Promise<Color> {
  const query = `mutation { 
    createColor(createColorInput: {description: "${description}"}) { id description }
  }`;

  return await apiCall(query).then((response): Color => {
    return response?.data?.createColor;
  });
}
