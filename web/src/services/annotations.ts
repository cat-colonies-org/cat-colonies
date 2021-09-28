import { apiCall, getCriteriaString } from '../common/util';

const annotationQueryFields: string = `
  id
  catId
  annotation
  date
`;

export type Annotation = {
  id?: number;
  catId?: number;
  annotation: string;
  date: Date;
};

export interface AnnotationList {
  total: number;
  items: Annotation[];
}

const getAnnotationFromGraphQlResult = (annotation: Record<string, any>): Annotation => {
  return {
    ...annotation,
    date: new Date(annotation.date),
  } as Annotation;
};

export async function getAnnotationsList({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): Promise<AnnotationList> {
  const criteria = getCriteriaString({ filter, page, perPage });

  const query = `query {
      annotations (${criteria}) {
        total
        items {
          ${annotationQueryFields}
        }
      }
    }`;

  return await apiCall(query).then((response): AnnotationList => {
    const annotations = response?.data?.annotations;

    const total: number = annotations?.total || 0;
    const items: Annotation[] = annotations
      ? annotations.items.map((annotation: any): Annotation => {
          return getAnnotationFromGraphQlResult(annotation);
        })
      : [];

    return { items, total };
  });
}

export async function createAnnotation(catId: number, annotation: string): Promise<Annotation> {
  const query = `mutation {
    createAnnotation(createAnnotationInput: { catId: ${catId}, annotation: "${annotation}"}) { ${annotationQueryFields} }
  }`;

  return await apiCall(query).then((response): Annotation => {
    return response?.data?.createAnnotation;
  });
}
