import Ember from 'ember';

const { assert, typeOf } = Ember;
const { parse, stringify } = JSON;

export function pojo(obj) {
  const isObject = typeOf(obj) === 'object' || typeOf(obj) === 'class';
  assert(`[ember-google-analytics-embed] value passed should be an object`, isObject);
  return parse(stringify(obj));
}

export default pojo;
