import { Cat } from '../services/cats';
import { Color } from '../services/colors';
import { Auth } from './authToken';

export const omit = (obj: Record<string, any>, props: string[]) => {
  const result = { ...obj };
  props.forEach(function (prop) {
    delete result[prop];
  });
  return result;
};

export const objToListString = (obj: Record<string, any>): string => {
  return Object.keys(obj).reduce((composed, key) => {
    composed += composed ? ', ' : '';
    return composed + `${key}: ${JSON.stringify(obj[key])}`;
  }, '');
};

export const coatFromCat = (cat: Cat) => {
  let pattern = cat.patternId !== 0 ? cat.pattern?.description : '';
  return (
    pattern +
    (pattern ? ' ' : '') +
    cat.colors?.reduce(
      (acc: string, color: Color) => (color.id !== 0 ? (acc ? acc + ', ' : '') + color.description : acc),
      '',
    )
  );
};

export const getCriteriaString = ({
  filter,
  page,
  perPage,
}: {
  // TODO: add "order"
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): string => {
  const criteria: string[] = [];

  if (filter) criteria.push(objToListString(filter));

  if (true) criteria.push('order: "id"');

  if (page && perPage) {
    const skip = Math.max(page - 1, 0) * perPage;
    const take = perPage;
    criteria.push(`skip: ${skip}, take: ${take}`);
  }

  return criteria.join(', ');
};

export const apiCall = async (query: string, variables?: any) => {
  const apiBaseUrl: string = process.env.NEXT_PUBLIC_GRAPHQL_BASE_URL as string;

  return await fetch(apiBaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + (await Auth.getToken()),
    },
    body: JSON.stringify({ query, variables }),
  })
    .then((response) => {
      if (response.status === 401) {
        Auth.logout();
        window.location.assign('/login');
        return;
      }

      return response.json();
    })
    .catch((e) => {
      console.error(e.stack);
    });
};
