import Component from '@ember/component';
import { A } from '@ember/array';
import { assert } from '@ember/debug';
import { computed, get, getProperties, getWithDefault, set, setProperties } from '@ember/object';
import { assign } from '@ember/polyfills';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { isBlank, isPresent } from '@ember/utils';

import { task, timeout } from 'ember-concurrency';

import $ from 'jquery';

export default Component.extend({

  gaEmbed: service(),

  classNames: ['ga-embed-visualization'],
  classNameBindings: ['isLoading:ga-embed-visualization-loading'],

  isLoading: true,
  responsiveResize: true,
  debounce: false,

  _requiredOptions: computed(function() {
    return A(['query']);
  }),

  defaultOptions: computed(function() {
    return {};
  }),

  options: computed(function() {
    return {};
  }),

  mergedOptions: computed('defaultOptions', 'options', function() {
    let { defaultOptions, options } = getProperties(this, 'defaultOptions', 'options');
    if (!defaultOptions || !options) { return; }
    return assign({}, defaultOptions, options);
  }),

  didInsertElement() {
    this._super(...arguments);

    this._assertRequiredOptions();
    this._setResize();

    if (get(this, 'gaEmbed.apiReady')) {
      this._createVisualization();
    } else {
      window.gapi.analytics.ready(() => {
        this._createVisualization();
      });
    }

  },

  createVisualization() {
    assert(`[ember-google-analytics-embed] createVisualization() must be overridden when extending ember-google-analytics-embed/components/visualizations/base-visualization`);
  },

  didCreateVisualization() {},

  _createVisualization() {
    if (isPresent(get(this, 'visualization')) ||
        get(this, 'isDestroyed')) { return; }

    let visualization = this.createVisualization();

    assert(`[ember-google-analytics-embed] No visualization returned from createVisualization()`, visualization);

    set(this, 'visualization', visualization);

    this.newVisualizationAttrs();

    get(this, 'visualization').on('success', data => {
      setProperties(this, {
        data,
        isLoading: false
      });
      get(this, 'didCreateVisualization')(visualization);
    });

  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.newVisualizationAttrs();
  },

  newVisualizationAttrs() {
    this.mergeInitialAttrs();

    let visualizationOptions = get(this, 'visualizationOptions'),
        chartOptions = get(this, 'chartOptions');

    if (!chartOptions || get(this, 'isDestroyed')) { return; }

    let newValues = visualizationOptions.reduce((values, key) => {
      let value = get(this, key);
      value = this._getAttrValue(value);
      values[key] = value;
      return values;
    }, {});

    let changedValues = {};

    Object.keys(newValues).forEach(key => {
      let value = newValues[key];
      if (value !== chartOptions[key]) {
        chartOptions[key] = value;
        changedValues[key] = value;
      }
    });

    get(this, '_updateVisualization').perform();

  },

  mergeInitialAttrs() {
    let isMerged = get(this, 'isMerged');
    if (isMerged === true) { return; }

    let mergedOptions = get(this, 'mergedOptions'),
        chartOptions = getWithDefault(this, 'chartOptions', {});

    Object.keys(mergedOptions).forEach(key => {
      let value = mergedOptions[key];
      if (value !== chartOptions[key]) {
        chartOptions[key] = value;
        set(this, key, value);
      }
    });

    set(this, 'chartOptions', chartOptions);
    set(this, 'isMerged', true);

  },

  willUpdateVisualization() {},

  _updateVisualization: task(function* () {
    if (get(this, 'isDestroyed')) { return; }
    let debounce = getWithDefault(this, 'debounce', 0);
    yield timeout(debounce);
    this.willUpdateVisualization();
    this.updateVisualization();

  }).drop(),

  updateVisualization() {
    assert(`[ember-google-analytics-embed] updateVisualization() must be overridden when extending ember-google-analytics-embed/components/visualizations/base-visualization`);
  },

  update: task(function* () {
    if (get(this, 'isDestroyed')) { return; }
    let debounce = getWithDefault(this, 'debounce', 0);
    yield timeout(debounce);
    get(this, 'visualization').execute();

  }).drop(),

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

  _setResize() {
    if (!get(this, 'responsiveResize')) { return; }
    $(window).on(`resize.${get(this, 'elementId')}`, () => debounce(this, '_handleResize', 200));

  },

  _handleResize() {
    this.updateVisualization();

  },

  willDestroyElement() {
    $(window).off(`resize.${get(this, 'elementId')}`);
    get(this, 'update').cancelAll();
    get(this, '_updateVisualization').cancelAll();
  }

});
