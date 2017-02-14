import BaseChartVisualization from 'ember-google-analytics-embed/components/visualizations/charts/base-chart';

export default BaseChartVisualization.extend({

  chart: {
    type: 'PIE',
    options: {}
  },

  visualizationOptions: [
    'backgroundColor', 'chartArea', 'colors',
    'enableInteractivity', 'fontSize', 'fontName',
    'height', 'is3D', 'legend', 'pieHole', 'pieSliceBorderColor',
    'pieSliceText', 'pieSliceTextStyle', 'pieStartAngle',
    'reverseCategories', 'pieResidueSliceColor', 'pieResidueSliceLabel',
    'slices', 'sliceVisibilityThreshold', 'title', 'titleTextStyle',
    'tooltip', 'width'
  ]

});
