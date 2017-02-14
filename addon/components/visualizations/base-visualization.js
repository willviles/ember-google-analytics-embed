import Ember from 'ember';

const {
  $, assert, assign, computed,
  get, getWithDefault, inject: { service },
  isBlank, isPresent, run, set, typeOf
} = Ember;

export default Ember.Component.extend({

  gaEmbed: service(),

  requiredOptions: [],
  _requiredOptions: Ember.A(['query']),

  mergedOptions: computed('defaultOptions', 'options', function() {
    const defaultOptions = getWithDefault(this, 'defaultOptions', {});
    const options = getWithDefault(this, 'options', {});

    return $.extend({}, defaultOptions, options);
  }),

  didInsertElement() {
    this._super(...arguments);

    this._assertRequiredOptions();
    this._setContainer();

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
    if (isPresent(get(this, 'visualization'))) { return; }

    let visualization = this.createVisualization();

    assert(`[ember-google-analytics-embed] No visualization returned from createVisualization()`, visualization);

    set(this, 'visualization', visualization);

    this.didCreateVisualization();

  },

  didCreateVisualization() {
    get(this, 'visualization').on('success', data => {
      set(this, 'data', data);
    });

  },

  didReceiveAttrs() {
    this._super(...arguments);

    this._mergeInitialOptions();
    this.newVisualizationAttrs(...arguments);

  },

  newVisualizationAttrs() {
    run.cancel(
      get(this, '_willUpdateVisualization')
    );

    set(this, '_willUpdateVisualization', run.later(this, () => {
      this.willUpdateVisualization();
    }, 250));

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
    run.cancel(
      get(this, 'willExecute')
    );

    set(this, 'willExecute', run.later(this, () => {
      get(this, 'visualization').execute();
    }, 250));

  },

  _assertRequiredOptions() {
    const options = get(this, '_requiredOptions').pushObjects(get(this, 'requiredOptions')).uniq();

    options.forEach(key => {
      assert(`[ember-google-analytics-embed] No parameter '${key}' passed to ember-google-analytics-embed/components/visualizations/data-chart`, get(this, key));
    });

  },

  _getAttrValue(value) {

    if (isBlank(value)) { return value; }

    // If it's a mutable object, get the actual value
    if (typeof value === 'object') {
      let objectKeys = Ember.A(Object.keys(value));
      if (objectKeys.any((objectkey) => objectkey.indexOf('MUTABLE_CELL') >= 0)) {
        value = Ember.get(value, 'value');
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

  _setContainer() {
    assign(get(this, 'chart'), { container: this.elementId });

  }

});
