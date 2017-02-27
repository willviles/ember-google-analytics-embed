import Ember from 'ember';
import BaseVisualization from 'ember-google-analytics-embed/components/visualizations/base-visualization';
import pojo from 'ember-google-analytics-embed/utils/pojo';

const { get, getProperties, isBlank, set } = Ember;

export default BaseVisualization.extend({

  chartOptions: Ember.Object.create({}),

  classNames: ['ga-embed-chart'],

  mergeInitialOptions() {
    set(this, 'chartOptions', get(this, 'mergedOptions'));

  },

  createVisualization() {
    const container = this.elementId;
    return new window.gapi.analytics.googleCharts.DataChart({
      chart: { container }
    });

  },

  newVisualizationAttrs({ newAttrs }) {
    const visualizationOptions = get(this, 'visualizationOptions');
    const chartOptions = get(this, 'chartOptions');

    Object.keys(newAttrs).forEach(key => {
      // If key isn't present in accepted visualizationOptions, don't add it
      if (!visualizationOptions.includes(key)) { return; }

      const value = this._getAttrValue(newAttrs[key]);

      // If value isn't null, set it as a chart option and return
      if (!isBlank(value)) {
        return set(chartOptions, key, value);
      }

      // Otherwise, if key is present in chartOptions, remove it
      if (Object.keys(chartOptions).includes(key)) {
        return delete chartOptions[key];
      }

    });

    this._super(...arguments);

  },

  updateVisualization() {
    let {
      query, chartType, chartOptions, visualization
    } = getProperties(this, 'query', 'chartType', 'chartOptions', 'visualization');

    if (!visualization) { return; }

    query = pojo(query); chartOptions = pojo(chartOptions);

    visualization.set({ query, chart: { type: chartType, options: chartOptions } });

    this.execute();

  }

});
