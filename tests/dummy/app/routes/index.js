import Ember from 'ember';

const {
  get, inject: { service },
  set, setProperties
} = Ember;

export default Ember.Route.extend({

  gaEmbed: service(),

  model() {
    return Ember.RSVP.resolve({
      lineChartView: {
        name: 'All Website Data',
        id: 'ga:138780399'
      },
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

    toggleChartView() {

      const currentChartView = get(this, 'controller.lineChartView');

      let newChartView;

      if (currentChartView.name === 'All Website Data') {
        newChartView = {
          name: 'User Data',
          id: 'ga:139693274'
        };

      } else {
        newChartView = {
          name: 'All Website Data',
          id: 'ga:138780399'
        };

      }

      set(this, 'controller.lineChartView', newChartView);
      this.notifyPropertyChange('controller.lineChartView.id');

    },

    toggleBarChartTimeframe() {
      set(this, 'controller.barChartTimeframe',
        get(this, 'controller.barChartTimeframe') === '30daysAgo' ? '7daysAgo' : '30daysAgo'
      );

    },

    signOut() {
      get(this, 'gaEmbed').signOut().then(msg => {
        console.log(msg);
      });
    },

    getCustomData() {

      get(this, 'gaEmbed').getData({
        'ids': 'ga:138780399',
        'metrics': 'ga:sessions',
        'dimensions': 'ga:date',
        'start-date': '30daysAgo',
        'end-date': 'yesterday'
      }).then(data => {
        console.log(data);
      }).catch(err => {
        console.log(err);
      });

    }

  }

});
