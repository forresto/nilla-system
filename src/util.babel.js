import {encode} from 'he';

export function escape(html) {
  return encode(html, {'useNamedReferences': true});
}