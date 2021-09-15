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
    const filterString = Object.keys(filter).reduce((acc, key) => acc + `, ${key}: ${JSON.stringify(filter[key])}`, '');
    criteria += filterString;
  }

  if (page && perPage) {
    const skip = Math.max(page - 1, 0) * perPage;
    const take = perPage;
    criteria += `, skip: ${skip}, take: ${take}`;
  }

  return criteria;
};
