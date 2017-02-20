import BaseChartVisualization from 'ember-google-analytics-embed/components/visualizations/charts/base-chart';

export default BaseChartVisualization.extend({

  chart: {
    type: 'TABLE',
    options: {}
  },

  classNames: ['ga-embed-table'],

  visualizationOptions: [
    'allowHtml', 'alternatingRowStyle', 'cssClassNames',
    'firstRowNumber', 'frozenColumns', 'height',
    'page', 'pageSize', 'pagingButtons',
    'rtlTable', 'scrollLeftStartPosition',
    'showRowNumber', 'sort', 'sortAscending', 'sortColumn',
    'startPage', 'width'
  ]

});
