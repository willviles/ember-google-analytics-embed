import BaseVisualization from 'ember-google-analytics-embed/components/visualizations/base-visualization';
import pojo from 'ember-google-analytics-embed/utils/pojo';

import { get, getProperties, set } from '@ember/object';

export default BaseVisualization.extend({

  classNames: ['ga-embed-chart'],

  init() {
    this._super(...arguments);
    set(this, 'chartOptions', {});
  },

  mergeInitialOptions() {
    let mergedOptions = get(this, 'mergedOptions');
    set(this, 'chartOptions', mergedOptions);

  },

  createVisualization() {
    const container = this.elementId;

    return new window.gapi.analytics.googleCharts.DataChart({
      chart: { container }
    });

  },

  newVisualizationAttrs() {
    let visualizationOptions = get(this, 'visualizationOptions'),
        chartOptions = get(this, 'chartOptions');

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

    this._super(...arguments);

  },

  updateVisualization() {
    let {
      query, chartType, chartOptions, visualization
    } = getProperties(this, 'query', 'chartType', 'chartOptions', 'visualization');

    if (!visualization || get(this, 'isDestroyed')) { return; }

    query = pojo(query);
    chartOptions = pojo(chartOptions);

    visualization.set({ query, chart: { type: chartType, options: chartOptions } });

    this.execute();

  }

});
