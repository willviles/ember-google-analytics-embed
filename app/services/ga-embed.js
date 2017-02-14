import Ember from 'ember';
import GAEmbedService from 'ember-google-analytics-embed/services/ga-embed';
import config from '../config/environment';

const { computed, get } = Ember;

export default GAEmbedService.reopen({
  config: computed(function() {
    return get(config, 'google-analytics-embed');
  })
});
