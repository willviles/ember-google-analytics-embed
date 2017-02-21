import Ember from 'ember';

const {
  $, assert, computed,
  get, getWithDefault, inject: { service },
  isBlank, isPresent, run, run: { debounce },
  set, setProperties, typeOf
} = Ember;

export default Ember.Component.extend({

  gaEmbed: service(),

  classNames: ['ga-embed-visualization'],
  classNameBindings: ['isLoading:ga-embed-visualization-loading'],

  isLoading: true,
  debounce: false,

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
    if (isPresent(get(this, 'visualization'))) { return; }

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
    this.newVisualizationAttrs(...arguments);

  },

  newVisualizationAttrs() {

    const debounce = get(this, 'debounce');

    if (debounce && typeOf(debounce) === 'number') {
      run.cancel(
        get(this, '_willUpdateVisualization')
      );

      set(this, '_willUpdateVisualization', run.later(this, () => {
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
    const debounce = get(this, 'debounce');

    if (debounce && typeOf(debounce) === 'number') {
      run.cancel(
        get(this, 'willExecute')
      );

      set(this, 'willExecute', run.later(this, () => {
        get(this, 'visualization').execute();
      }, debounce / 2));

    } else {
      get(this, 'visualization').execute();

    }

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

  responsiveResize: true,

  _setResize() {
    if (!get(this, 'responsiveResize')) { return; }
    $(window).on(`resize.${get(this, 'elementId')}`, () => debounce(this, '_handleResize', 200));

  },

  _handleResize() {
    this.updateVisualization();

  },

});
