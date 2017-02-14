export function initialize(appInstance) {

  const gaEmbedService = appInstance.lookup('service:ga-embed');

  gaEmbedService.initialize();

}

export default {
  name: 'ga-embed',
  initialize
};
