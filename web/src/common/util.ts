export const objToListString = (obj: Record<string, any>): string => {
  return Object.keys(obj).reduce((composed, key) => {
    composed += composed ? ', ' : '';
    return composed + `${key}: ${JSON.stringify(obj[key])}`;
  }, '');
};

export const getCriteriaString = ({
  filter,
  page,
  perPage,
}: {
  filter?: Record<string, any>;
  page?: number;
  perPage?: number;
}): string => {
  let criteria = 'order: "id"';

  if (filter) {
    const filterString = objToListString(filter);
    criteria += filterString;
  }

  if (page && perPage) {
    const skip = Math.max(page - 1, 0) * perPage;
    const take = perPage;
    criteria += `, skip: ${skip}, take: ${take}`;
  }

  return criteria;
};
