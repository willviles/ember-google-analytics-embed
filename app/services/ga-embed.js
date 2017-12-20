import { computed, get } from '@ember/object';
import GAEmbedService from 'ember-google-analytics-embed/services/ga-embed';
import config from '../config/environment';

export default GAEmbedService.reopen({
  config: computed(function() {
    return get(config, 'google-analytics-embed');
  })
});
