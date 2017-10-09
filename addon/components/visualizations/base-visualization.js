import Component from '@ember/component';
import { A } from '@ember/array';
import { assert } from '@ember/debug';
import { computed, get, getWithDefault, set, setProperties } from '@ember/object';
import { assign } from '@ember/polyfills';
import { cancel, debounce, later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { isBlank, isPresent, typeOf } from '@ember/utils';

import $ from 'jquery';

export default Component.extend({

  gaEmbed: service(),

  classNames: ['ga-embed-visualization'],
  classNameBindings: ['isLoading:ga-embed-visualization-loading'],

  isLoading: true,
  responsiveResize: true,
  debounce: false,

  init() {
    this._super(...arguments);
    set(this, '_requiredOptions', A(['query']));
  },

  mergedOptions: computed('defaultOptions', 'options', function() {
    let defaultOptions = getWithDefault(this, 'defaultOptions', {}),
        options = getWithDefault(this, 'options', {});

    return assign({}, defaultOptions, options);
  }),

  didInsertElement() {
    this._super(...arguments);

    this._assertRequiredOptions();
    this._setResize();

    if (get(this, 'gaEmbed.apiReady')) {
      this._updateVisualization();
    } else {
      window.gapi.analytics.ready(() => {
        this._updateVisualization();
      });
    }

  },

  createVisualization() {
    assert(`[ember-google-analytics-embed] createVisualization() must be overridden when extending ember-google-analytics-embed/components/visualizations/base-visualization`);
  },

  _createVisualization() {
    if (isPresent(get(this, 'visualization')) ||
        get(this, 'isDestroyed')) { return; }

    let visualization = this.createVisualization();

    assert(`[ember-google-analytics-embed] No visualization returned from createVisualization()`, visualization);

    set(this, 'visualization', visualization);

    this.didCreateVisualization();

  },

  didCreateVisualization() {
    get(this, 'visualization').on('success', data => {
      setProperties(this, {
        data,
        isLoading: false
      });
    });

  },

  didReceiveAttrs() {
    this._super(...arguments);
    this._mergeInitialOptions();
    this.newVisualizationAttrs();
  },

  newVisualizationAttrs() {
    if (get(this, 'isDestroyed')) { return; }

    const debounce = get(this, 'debounce');

    if (debounce && typeOf(debounce) === 'number') {
      cancel(
        get(this, '_willUpdateVisualization')
      );

      set(this, '_willUpdateVisualization', later(this, () => {
        if (get(this, 'isDestroyed')) { return; }
        this.willUpdateVisualization();
      }, debounce / 2));

    } else {
      this.willUpdateVisualization();

    }

  },

  willUpdateVisualization() {
    this.updateVisualization();

  },

  updateVisualization() {
    assert(`[ember-google-analytics-embed] updateVisualization() must be overridden when extending ember-google-analytics-embed/components/visualizations/base-visualization`);
  },

  _updateVisualization() {
    this._createVisualization();
    this.updateVisualization();

  },

  execute() {
    if (get(this, 'isDestroyed')) { return; }

    const debounce = get(this, 'debounce');

    if (debounce && typeOf(debounce) === 'number') {
      cancel(
        get(this, 'willExecute')
      );

      set(this, 'willExecute', later(this, () => {
        get(this, 'visualization').execute();
      }, debounce / 2));

    } else {
      get(this, 'visualization').execute();

    }

  },

  _assertRequiredOptions() {
    let requiredOptions = getWithDefault(this, 'requiredOptions', A([])),
        options = get(this, '_requiredOptions').pushObjects(requiredOptions).uniq();

    options.forEach(key => {
      assert(`[ember-google-analytics-embed] No parameter '${key}' passed to ember-google-analytics-embed/components/visualizations/data-chart`, get(this, key));
    });

  },

  _getAttrValue(value) {
    if (isBlank(value)) { return value; }

    // If it's a mutable object, get the actual value
    if (typeof value === 'object') {
      let objectKeys = A(Object.keys(value));
      if (objectKeys.any((objectkey) => objectkey.indexOf('MUTABLE_CELL') >= 0)) {
        value = get(value, 'value');
      }
    }

    return value;
  },

  _mergeInitialOptions() {
    if (get(this, 'optionsMerged') === true) { return; }
    set(this, 'optionsMerged', true);

    if (typeOf(this.mergeInitialOptions) === 'function') {
      this.mergeInitialOptions();
    }

  },

  _setResize() {
    if (!get(this, 'responsiveResize')) { return; }
    $(window).on(`resize.${get(this, 'elementId')}`, () => debounce(this, '_handleResize', 200));

  },

  _handleResize() {
    this.updateVisualization();

  },

  willDestroyElement() {
    cancel(get(this, 'willExecute'));
    cancel(get(this, '_willUpdateVisualization'));
    $(window).off(`resize.${get(this, 'elementId')}`);

  }

});
