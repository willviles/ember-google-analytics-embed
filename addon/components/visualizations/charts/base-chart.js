import Ember from 'ember';
import BaseVisualization from 'ember-google-analytics-embed/components/visualizations/base-visualization';
import pojo from 'ember-google-analytics-embed/utils/pojo';

const { get, getProperties, isBlank, set } = Ember;

export default BaseVisualization.extend({

  chart: {
    options: {}
  },

  mergeInitialOptions() {
    set(this, 'chart.options', get(this, 'mergedOptions'));

  },

  createVisualization() {
    return new window.gapi.analytics.googleCharts.DataChart();

  },

  newVisualizationAttrs({ newAttrs }) {
    const visualizationOptions = get(this, 'visualizationOptions');
    const chartOptions = get(this, 'chart.options');

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
    let { query, chart, visualization } = getProperties(this, 'query', 'chart', 'visualization');

    query = pojo(query); chart = pojo(chart);

    visualization.set({ query, chart });

    this.execute();

  }

});
