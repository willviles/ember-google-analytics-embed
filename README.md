Ember Google Analytics Embed
======

[![Build Status](https://travis-ci.org/willviles/ember-google-analytics-embed.svg)](https://travis-ci.org/willviles/ember-google-analytics-embed) [![Ember Observer Score](http://emberobserver.com/badges/ember-google-analytics-embed.svg)](http://emberobserver.com/addons/ember-google-analytics-embed) ![Download count all time](https://img.shields.io/npm/dt/ember-google-analytics-embed.svg) [![npm](https://img.shields.io/npm/v/ember-google-analytics-embed.svg)](https://www.npmjs.com/package/ember-google-analytics-embed)

**Ember Google Analytics Embed** is an addon for quickly building custom Google Analytics dashboards in your Ember.js app, using the [Google Analytics Embed API](https://developers.google.com/analytics/devguides/reporting/embed/v1/).

![](https://cloud.githubusercontent.com/assets/2046935/23407774/741fbae0-fdbd-11e6-8cdd-4eb6d49c9bf1.jpg)

The addon exposes the following components to use in your templates:

- [Bar Chart](#bar-chart) *(ga-embed-bar-chart)*
- [Column Chart](#column-chart) *(ga-embed-column-chart)*
- [Geo Chart](#geo-chart) *(ga-embed-geo-chart)*
- [Line Chart](#line-chart) *(ga-embed-line-chart)*
- [Pie Chart](#pie-chart) *(ga-embed-pie-chart)*
- [Table](#table) *(ga-embed-table)*

The addon also enables Analytics user authorization using the [authorization](#authorization) *(ga-embed-authorize)* component and view selection via the [view selector](#view-selection) *(ga-embed-view-selector)* component.

## Demos

Check out the [Embed API demos](https://ga-dev-tools.appspot.com/embed-api/) page for examples.

## Installation

`ember install ember-google-analytics-embed`

## Setup

To authorize your application to access the [Google Analytics API](https://developers.google.com/analytics/devguides/config), you must create a Client ID from the [Google API Console](https://console.developers.google.com/). When you've obtained your Client ID, add it to your environment file. If you are using Geo Charts, you must also include an API Key, for accessing the [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript). Both these APIs must be enabled from your API console and have the right origins/referrers set.

```javascript
// config/environment.js
ENV['google-analytics-embed'] = {
  clientId: 'YOUR_CLIENT_ID',
  apiKey: 'YOUR_API_KEY'
};
```


## Authorization
There are two ways to authorize users: through the authorization flow, requiring a user to click and authenticate, or via an access token sent from your server.

Adding the base `ga-embed-authorize` component to your templates will create a 'Sign in to Google Analytics' button and handle the authorization flow automatically:

```handlebars
{{ga-embed-authorize}}
```

Inject the `ga-embed` service into your templates to conditionally show/hide elements:

```handlebars
{{#if gaEmbed.isAuthorized}}
  // Add visualizations here
{{/if}}
```

The `ga-embed` service also exposes information about the current authorized user:

```handlebars
{{log gaEmbed.authorizedUser}}
// => { email: 'foo@bar.com', imageUrl: '...', name: 'Foo Bar' }
```

### Sign Out

To enable the user to sign out, inject the `ga-embed` service into the consuming object and create the following action.

```javascript
gaEmbed: service(),

actions: {
  signOut() {
    get(this, 'gaEmbed').signOut().then(() => {
      // Returns a promise when complete
    });
  }
}
```

### Access Token Authorization
To remove the user auth flow, you may return an access token from your server. Simply pass the access token to the `ga-embed-authorize` component. You can find more information on setting up server side authorization [here](https://ga-dev-tools.appspot.com/embed-api/server-side-authorization/).

```handlebars
{{ga-embed-authorize accessToken=analyticsAccessToken}}
```

## Visualizations

Each visualization accepts two main attributes, a query and an options hash.

### Query

To get data from our Google Analytics property, we must build a query using the [Google Reporting API](https://developers.google.com/analytics/devguides/reporting/core/v4/). The example below shows a pie chart of sessions, segmented by country. It limits the data to the last 30 days up until today and requests just the top ten results.

```handlebars
{{ga-embed-pie-chart
    query=(hash
      ids="YOUR_PROPERTY_ID"
      metrics="ga:sessions"
      dimensions="ga:country"
      start-date="30daysAgo"
      sort="-ga:sessions"
      max-results=10
      end-date="today"
    )}}
```

### Options

An options hash may be passed to each chart, allowing full configuration of the visualization.

```handlebars
{{ga-embed-pie-chart query=query options=options}}
```

Individual options properties may also be passed and can be dynamically updated.

```handlebars
{{ga-embed-pie-chart
    query=query
    options=options
    title="Sessions by country"
    is3D=pieChartIs3D
    }}
```


### Components

#### Bar Chart

Creates a bar chart visualization and accepts the following configuration [options](https://google-developers.appspot.com/chart/interactive/docs/gallery/barchart#configuration-options).

```handlebars
{{ga-embed-bar-chart query=query options=options}}
```

#### Column Chart

Creates a column chart visualization and accepts the following configuration [options](https://google-developers.appspot.com/chart/interactive/docs/gallery/columnchart#configuration-options).

```handlebars
{{ga-embed-column-chart query=query options=options}}
```

#### Geo Chart

Creates a geo chart visualization and accepts the following configuration [options](https://google-developers.appspot.com/chart/interactive/docs/gallery/geochart#configuration-options). This component lazy-loads the Google Maps Geocoding API.

The region property can be dynamically updated and is validated before the chart is updated to ensure a [valid region code](https://google-developers.appspot.com/chart/interactive/docs/gallery/geochart#continent-hierarchy-and-codes) is used.

```handlebars
{{ga-embed-geo-chart query=query options=options region=region}}
```

#### Line Chart

Creates a line chart visualization and accepts the following configuration [options](https://google-developers.appspot.com/chart/interactive/docs/gallery/linechart#configuration-options).

```handlebars
{{ga-embed-line-chart query=query options=options}}
```

#### Pie Chart

Creates a pie chart visualization and accepts the following configuration [options](https://google-developers.appspot.com/chart/interactive/docs/gallery/piechart#configuration-options).

To transform a pie chart into a donut chart, simply add a value for the pie hole.

```handlebars
{{ga-embed-pie-chart query=query options=options pieHole=0.4}}
```

#### Table

Creates a table visualization and accepts the following configuration [options](https://google-developers.appspot.com/chart/interactive/docs/gallery/table#configuration-options).

```handlebars
{{ga-embed-table query=query options=options}}
```


### Loading State

Each visualization has a loading state class of `.ga-embed-visualization-loading`, which you can customize in your CSS. The classes set on visualizations allow for custom loading states per visualization.

```html
<div id="ember123" class="ga-embed-visualization ga-embed-chart ga-embed-line-chart ga-embed-visualization-loading">...</div>
```

### Auto Resizing

By default, visualizations auto resize on window resize. To disable auto resizing, set `responsiveResize=false` on the visualization.

```handlebars
{{ga-embed-line-chart query=query options=options responsiveResize=false}}
```

### Debouncing

When dynamically updating many properties on a visualization, it may be beneficial to debounce executing a new render. To do so, the visualization accepts a `debounce` value in milliseconds (ms).

```handlebars
{{ga-embed-line-chart query=query options=options debounce=100}}
```

## View Selection

The `ga-embed-view-selector` component allows the user to select a view from any property they are authorized on. Add the view selector component to your template.

```handlebars
{{#if gaEmbed.isAuthorized}}
  {{ga-embed-view-selector ids=(mut viewIds) onChange=(action 'customAction')}}
{{/if}}
```

Use the mutable property in your queries:

```handlebars
{{ga-embed-pie-chart
    query=(hash
      ids=viewIds
      // ...
    )}}
```


## Querying the Reporting API

The `gaEmbed` service enables a quick method to query data from analytics without directly using a visualization. This can be useful for querying the Google Analytics Reporting API and using the data in your own custom components.

```javascript
get(this, 'gaEmbed').getData({
  'ids': 'YOUR_PROPERTY_ID',
  'metrics': 'ga:sessions',
  'dimensions': 'ga:date',
  'start-date': '30daysAgo',
  'end-date': 'yesterday'
}).then(data => {
  console.log(data);
}).catch(err => {
  console.log(err);
});
```

## Using Google Analytics Embed API

- [Google Embed API](https://developers.google.com/analytics/devguides/reporting/embed/v1/)
  - [Component Reference](https://developers.google.com/analytics/devguides/reporting/embed/v1/component-reference)
  - [Examples](https://ga-dev-tools.appspot.com/embed-api/)

- [Google Charts API](https://google-developers.appspot.com/chart/interactive/docs/gallery)

- [Google Reporting API](https://developers.google.com/analytics/devguides/reporting/core/v4/)
  - [Dimensions & Metrics Explorer](https://developers.google.com/analytics/devguides/reporting/core/dimsmets)

## Contributing

A crude dummy app demonstrates all the functionality of the addon. To view the dummy app, clone the repo and simply create a .env file with the following information:

```bash
# .env
GOOGLE_API_KEY=YOUR_API_KEY
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
```

Then start the server using:

```
ember serve
```
