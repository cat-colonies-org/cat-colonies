import { apiCall, getCriteriaString } from '../common/util';

const patternQueryFields: string = `
  id
  description
`;

export type Pattern = {
  id: number;
  description: string;
};

export interface PatternList {
  total: number;
  items: Pattern[];
}

const getPatternFromGraphQlResult = (pattern: Record<string, any>): Pattern => {
  return pattern as Pattern;
};

export async function getPatternsList({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): Promise<PatternList> {
  const criteria = getCriteriaString({ filter, page, perPage });

  const query = `query {
      patterns (${criteria}) {
        total
        items {
          ${patternQueryFields}
        }
      }
    }`;

  return await apiCall(query).then((response): PatternList => {
    const patterns = response?.data?.patterns;

    const total: number = patterns?.total || 0;
    const items: Pattern[] = patterns
      ? patterns.items.map((pattern: any): Pattern => {
          return getPatternFromGraphQlResult(pattern);
        })
      : [];

    return { items, total };
  });
}

export async function createPattern(description: string): Promise<Pattern> {
  const query = `mutation { 
    createPattern(createPatternInput: {description: "${description}"}) { id description }
  }`;

  return await apiCall(query).then((response): Pattern => {
    return response?.data?.createPattern;
  });
}
