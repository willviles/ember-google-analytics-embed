import Ember from 'ember';
import BaseChartVisualization from 'ember-google-analytics-embed/components/visualizations/charts/base-chart';

const {
  assert, get, isEmpty
} = Ember;

export default BaseChartVisualization.extend({

  chartType: 'GEO',

  classNames: ['ga-embed-geo-chart'],

  visualizationOptions: [
    'backgroundColor',
    'colorAxis',
    'datalessRegionColor',
    'defaultColor',
    'displayMode',
    'domain',
    'enableRegionInteractivity',
    'height',
    'keepAspectRatio',
    'legend',
    'region',
    'magnifyingGlass',
    'markerOpacity',
    'resolution',
    'sizeAxis',
    'tooltip',
    'width'
  ],

  willInsertElement() {
    this._super(...arguments);
    this._loadGeoApis();
  },

  willUpdateVisualization() {
    this._validateRegion();
    this._super(...arguments);
  },

  _regions: ['002', '015', '011', '017', '014', '018', '150', '154', '155', '151', '039', '019', '021', '029', '013', '005', '142', '143', '030', '034', '035', '145', '009', '053', '054', '057', '061'],

  _validateRegion() {
    const chartOptions = get(this, 'chartOptions');
    const region = get(chartOptions, 'region');

    if (isEmpty(region)) { return; }

    const isValidRegion = get(this, '_regions').includes(region);

    if (!isValidRegion) {
      delete chartOptions.region;
      return assert(`[ember-google-analytics-embed] Invalid region passed to ga-embed-geo-chart component. For valid region codes, reference https://google-developers.appspot.com/chart/interactive/docs/gallery/geochart#continent-hierarchy-and-codes.`);
    }

  },

  _loadGeoApis() {
    const gaEmbedService = get(this, 'gaEmbed');
    const { geoApisInitialized } = gaEmbedService;
    if (!geoApisInitialized) { gaEmbedService.initializeGeoApis(); }

  }

});
