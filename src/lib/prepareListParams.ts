import type { AxiosRequestConfig } from 'axios';

import type { Document, ListOptions } from '../types';

/**
 * Disallowed filter keys
 */
const BLACKLIST = ['offset', 'limit', 'page', 'sort'];

/**
 * Converts a typed ListOption<T> query options object into an Axios-friendly GET parameter object
 * @param options The ListOptions<T> object to convert
 */
export function prepareListParams<D extends Document>({
  pagination = {},
  filter = {},
  sort,
}: ListOptions<D> = {}): AxiosRequestConfig['params'] {
  const params = {
    ...pagination,
    ...(sort
      ? { sort: `${String(sort.key)}:${sort.asc ? 'asc' : 'desc'}` }
      : {}),
    ...Object.entries(filter || {}).reduce((res, [fk, fv]) => {
      if (BLACKLIST.includes(fk)) {
        return res;
      }

      let addition;

      const fvk = Object.keys(fv)[0];
      const fvv = fv[fvk];

      switch (fvk) {
        case 'gt':
          addition = { [`${fk}>${fvv}`]: '' };
          break;
        case 'lt':
          addition = { [`${fk}<${fvv}`]: '' };
          break;
        case 'gte':
          addition = { [`${fk}>`]: `${fvv}` };
          break;
        case 'exist':
          addition = { [`${fvv ? '' : '!'}${fk}`]: '' };
          break;
        case 'inc':
          addition = { [fk]: fvv.join(',') };
          break;
        case 'exc':
          addition = { [`${fk}!`]: fvv.join(',') };
          break;
        case 'eq':
          addition = { [fk]: `${fvv}` };
          break;
        case 'neq':
          addition = { [`${[fk]}!`]: `${fvv}` };
          break;
        default:
          break;
      }

      return {
        ...res,
        ...addition,
      };
    }, {}),
  };

  return params;
}
