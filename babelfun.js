import _get from 'lodash-es/get';
import { kokos } from 'state/selectors';

export const babelfun = ( i = 0) => _get( { a: i ** 2 }, 'a' );

