import BaseChartVisualization from 'ember-google-analytics-embed/components/visualizations/charts/base-chart';
import { computed } from '@ember/object';

export default BaseChartVisualization.extend({

  chartType: 'LINE',

  classNames: ['ga-embed-line-chart'],

  visualizationOptions: computed(function() {
    return [
      // Animation
      'animation',
      // Interaction
      'crosshair', 'enableInteractivity', 'explorer', 'selectionMode', 'tooltip',
      // Text
      'annotations', 'title', 'titlePosition', 'titleTextStyle', 'legend',
      // Axis
      'hAxis', 'vAxis', 'vAxes', 'axisTitlesPosition',
      // Style
      'backgroundColor', 'curveType', 'dataOpacity', 'fontSize', 'fontName',
      // Line Style
      'colors', 'lineDashStyle', 'lineWidth', 'pointShape', 'pointSize', 'pointsVisible',
      // Sizing & Positioning
      'chartArea', 'height', 'width', 'orientation', 'reverseCategories'
    ]
  })

});
