import { apiCall, getCriteriaString } from '../common/util';

const userAnnotationQueryFields: string = `
  id
  userId
  annotation
  date
`;

export type UserAnnotation = {
  id?: number;
  userId?: number;
  annotation: string;
  date: Date;
};

export interface UserAnnotationList {
  total: number;
  items: UserAnnotation[];
}

const getUserAnnotationFromGraphQlResult = (userAnnotation: Record<string, any>): UserAnnotation => {
  return {
    ...userAnnotation,
    date: new Date(userAnnotation.date),
  } as UserAnnotation;
};

export async function getUserAnnotationsList({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): Promise<UserAnnotationList> {
  const criteria = getCriteriaString({ filter, page, perPage });

  const query = `query {
      userAnnotations (${criteria}) {
        total
        items {
          ${userAnnotationQueryFields}
        }
      }
    }`;

  return await apiCall(query).then((response): UserAnnotationList => {
    const userAnnotations = response?.data?.userAnnotations;

    const total: number = userAnnotations?.total || 0;
    const items: UserAnnotation[] = userAnnotations
      ? userAnnotations.items.map((userAnnotation: any): UserAnnotation => {
          return getUserAnnotationFromGraphQlResult(userAnnotation);
        })
      : [];

    return { items, total };
  });
}

export async function createUserAnnotation(userId: number, annotation: string): Promise<UserAnnotation> {
  const query = `mutation {
    createUserAnnotation(createUserAnnotationInput: { userId: ${userId}, annotation: "${annotation}"}) { ${userAnnotationQueryFields} }
  }`;

  return await apiCall(query).then((response): UserAnnotation => {
    return response?.data?.createUserAnnotation;
  });
}
