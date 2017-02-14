import BaseChartVisualization from 'ember-google-analytics-embed/components/visualizations/charts/base-chart';

export default BaseChartVisualization.extend({

  chart: {
    type: 'LINE',
    options: {}
  },

  visualizationOptions: [
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

});
