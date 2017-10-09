export function initialize(appInstance) {
  let gaEmbedService = appInstance.lookup('service:ga-embed');
  gaEmbedService.initialize();
}

export default {
  name: 'ga-embed',
  initialize
};
