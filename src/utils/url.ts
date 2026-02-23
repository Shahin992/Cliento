export const removeSpecificQueryParams = (search: string, paramsToRemove: string[]) => {
  const searchParams = new URLSearchParams(search);

  paramsToRemove.forEach((param) => {
    searchParams.delete(param);
  });

  const nextSearch = searchParams.toString();
  return nextSearch ? `?${nextSearch}` : '';
};

export const getQueryParamValue = (search: string, paramName: string) => {
  const searchParams = new URLSearchParams(search);
  const value = searchParams.get(paramName);
  return value?.trim() ?? '';
};

export const keepOnlyQueryParams = (search: string, paramsToKeep: string[]) => {
  const current = new URLSearchParams(search);
  const next = new URLSearchParams();
  const allow = new Set(paramsToKeep);

  current.forEach((value, key) => {
    if (allow.has(key)) {
      next.append(key, value);
    }
  });

  const nextSearch = next.toString();
  return nextSearch ? `?${nextSearch}` : '';
};
