export const parseFilterParams = (query) => {
  const filter = {};

  if (query.type) {
    filter.contactType = query.type;
  }

  if (typeof query.isFavourite !== 'undefined') {
    const val = query.isFavourite.toString().toLowerCase();
    filter.isFavourite = ['true', '1', 'yes'].includes(val);
  }

  return filter;
};
