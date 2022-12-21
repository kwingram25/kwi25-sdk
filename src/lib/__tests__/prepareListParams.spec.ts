import test from 'ava';

import type { Document } from '../../types';
import { prepareListParams } from '../prepareListParams';

interface MyDoc extends Document {
  num: number;
  str: string;
}

test('empty options', (t) => {
  t.deepEqual(prepareListParams(), {});

  t.deepEqual(prepareListParams({}), {});
});

test('pagination', (t) => {
  const pagination = { offset: 2, limit: 10, page: 3 };

  t.deepEqual(prepareListParams({ pagination }), { ...pagination });
});

test('sort', (t) => {
  t.deepEqual(prepareListParams<MyDoc>({ sort: { key: 'str', asc: false } }), {
    sort: 'str:desc',
  });

  t.deepEqual(prepareListParams<MyDoc>({ sort: { key: 'str', asc: true } }), {
    sort: 'str:asc',
  });
});

test('filter: eq/neq/regex', (t) => {
  t.deepEqual(
    prepareListParams<MyDoc>({ filter: { str: { eq: '/asdf/i' } } }),
    {
      str: '/asdf/i',
    }
  );

  t.deepEqual(
    prepareListParams<MyDoc>({ filter: { str: { neq: '/asdf/i' } } }),
    {
      'str!': '/asdf/i',
    }
  );
});

test('filter: gt/gte/lt', (t) => {
  t.deepEqual(prepareListParams<MyDoc>({ filter: { num: { lt: 9 } } }), {
    'num<9': '',
  });

  t.deepEqual(prepareListParams<MyDoc>({ filter: { num: { gt: 9 } } }), {
    'num>9': '',
  });

  t.deepEqual(prepareListParams<MyDoc>({ filter: { num: { gte: 9 } } }), {
    'num>': '9',
  });
});

test('filter: exist/nexist', (t) => {
  t.deepEqual(prepareListParams<MyDoc>({ filter: { str: { exist: true } } }), {
    str: '',
  });

  t.deepEqual(prepareListParams<MyDoc>({ filter: { str: { exist: false } } }), {
    '!str': '',
  });
});

test('filter: inc/exc', (t) => {
  t.deepEqual(
    prepareListParams<MyDoc>({ filter: { str: { inc: ['foo', 'bar'] } } }),
    {
      str: 'foo,bar',
    }
  );

  t.deepEqual(
    prepareListParams<MyDoc>({ filter: { str: { exc: ['foo', 'bar'] } } }),
    {
      'str!': 'foo,bar',
    }
  );
});
