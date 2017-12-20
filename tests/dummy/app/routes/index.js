import Route from '@ember/routing/route';
import { get, set, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({

  gaEmbed: service(),

  model() {
    return RSVP.resolve({
      viewIds: null,
      lineChartTitle: 'You may change this title in the text box below',
      barChartTimeframe: '30daysAgo',
      pieChartIs3d: false,
      gaEmbed: get(this, 'gaEmbed')
    });

  },

  setupController(controller, model) {

    setProperties(controller, model);

    // Two methods of grabbing isAuthorized
    // Wrapping in a ready statement returns value

    // get(this, 'gaEmbed')._onApiReady(() => {
    //   console.log(get(this, 'gaEmbed')._isAuthorized());
    // });
    //
    // // Not wrapping returns a promise
    // get(this, 'gaEmbed')._isAuthorized().then(val => {
    //   console.log(val);
    // });

  },

  actions: {

    toggleBarChartTimeframe() {
      set(this, 'controller.barChartTimeframe',
        get(this, 'controller.barChartTimeframe') === '30daysAgo' ? '7daysAgo' : '30daysAgo'
      );

    },

    signOut() {
      get(this, 'gaEmbed').signOut().then(msg => {
        // eslint-disable-next-line
        console.log(msg);
      });
    },

    getCustomData() {
      const viewIds = get(this, 'controller.viewIds');

      if (!viewIds) { return; }

      get(this, 'gaEmbed').getData({
        'ids': viewIds,
        'metrics': 'ga:sessions',
        'dimensions': 'ga:date',
        'start-date': '30daysAgo',
        'end-date': 'yesterday'
      }).then(data => {
        // eslint-disable-next-line
        console.log(data);
      }).catch(err => {
        // eslint-disable-next-line
        console.log(err);
      });

    },

    viewChanged(ids) {
      set(this, 'controller.viewIds', ids);

    }

  }

});
