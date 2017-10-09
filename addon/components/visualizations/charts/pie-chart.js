import BaseChartVisualization from 'ember-google-analytics-embed/components/visualizations/charts/base-chart';
import { computed } from '@ember/object';

export default BaseChartVisualization.extend({

  chartType: 'PIE',

  classNames: ['ga-embed-pie-chart'],

  visualizationOptions: computed(function() {
    return [
      'backgroundColor', 'chartArea', 'colors',
      'enableInteractivity', 'fontSize', 'fontName',
      'height', 'is3D', 'legend', 'pieHole', 'pieSliceBorderColor',
      'pieSliceText', 'pieSliceTextStyle', 'pieStartAngle',
      'reverseCategories', 'pieResidueSliceColor', 'pieResidueSliceLabel',
      'slices', 'sliceVisibilityThreshold', 'title', 'titleTextStyle',
      'tooltip', 'width'
    ]
  })

});
