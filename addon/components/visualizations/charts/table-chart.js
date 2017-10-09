import BaseChartVisualization from 'ember-google-analytics-embed/components/visualizations/charts/base-chart';
import { computed } from '@ember/object';

export default BaseChartVisualization.extend({

  chartType: 'TABLE',

  classNames: ['ga-embed-table'],

  visualizationOptions: computed(function() {
    return [
      'allowHtml', 'alternatingRowStyle', 'cssClassNames',
      'firstRowNumber', 'frozenColumns', 'height',
      'page', 'pageSize', 'pagingButtons',
      'rtlTable', 'scrollLeftStartPosition',
      'showRowNumber', 'sort', 'sortAscending', 'sortColumn',
      'startPage', 'width'
    ]
  })

});
