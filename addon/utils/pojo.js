import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';

const { parse, stringify } = JSON;

export function pojo(obj) {
  const isObject = typeOf(obj) === 'object' || typeOf(obj) === 'class';
  assert(`[ember-google-analytics-embed] value passed should be an object`, isObject);
  return parse(stringify(obj));
  
}

export default pojo;
