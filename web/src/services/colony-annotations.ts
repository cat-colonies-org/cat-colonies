import { apiCall, getCriteriaString } from '../common/util';

const colonyAnnotationQueryFields: string = `
  id
  colonyId
  annotation
  date
`;

export type ColonyAnnotation = {
  id?: number;
  colonyId?: number;
  annotation: string;
  date: Date;
};

export interface ColonyAnnotationList {
  total: number;
  items: ColonyAnnotation[];
}

const getColonyAnnotationFromGraphQlResult = (colonyAnnotation: Record<string, any>): ColonyAnnotation => {
  return {
    ...colonyAnnotation,
    date: new Date(colonyAnnotation.date),
  } as ColonyAnnotation;
};

export async function getColonyAnnotationsList({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): Promise<ColonyAnnotationList> {
  const criteria = getCriteriaString({ filter, page, perPage });

  const query = `query {
      colonyAnnotations (${criteria}) {
        total
        items {
          ${colonyAnnotationQueryFields}
        }
      }
    }`;

  return await apiCall(query).then((response): ColonyAnnotationList => {
    const colonyAnnotations = response?.data?.colonyAnnotations;

    const total: number = colonyAnnotations?.total || 0;
    const items: ColonyAnnotation[] = colonyAnnotations
      ? colonyAnnotations.items.map((colonyAnnotation: any): ColonyAnnotation => {
          return getColonyAnnotationFromGraphQlResult(colonyAnnotation);
        })
      : [];

    return { items, total };
  });
}

export async function createColonyAnnotation(colonyId: number, annotation: string): Promise<ColonyAnnotation> {
  const query = `mutation {
    createColonyAnnotation(createColonyAnnotationInput: { colonyId: ${colonyId}, annotation: "${annotation}"}) { ${colonyAnnotationQueryFields} }
  }`;

  return await apiCall(query).then((response): ColonyAnnotation => {
    return response?.data?.createColonyAnnotation;
  });
}
