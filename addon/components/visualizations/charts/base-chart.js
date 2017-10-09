import BaseVisualization from 'ember-google-analytics-embed/components/visualizations/base-visualization';
import pojo from 'ember-google-analytics-embed/utils/pojo';

import { get, getProperties } from '@ember/object';

export default BaseVisualization.extend({

  classNames: ['ga-embed-chart'],

  createVisualization() {
    const container = this.elementId;

    return new window.gapi.analytics.googleCharts.DataChart({
      chart: { container }
    });

  },

  updateVisualization() {
    let {
      query, chartType: type, chartOptions: options, visualization
    } = getProperties(this, 'query', 'chartType', 'chartOptions', 'visualization');

    if (!visualization || get(this, 'isDestroyed')) { return; }

    query = pojo(query);
    options = pojo(options);

    // eslint-disable-next-line ember/use-ember-get-and-set
    visualization.set({ query, chart: { type, options } });

    get(this, 'update').perform();

  }

});
