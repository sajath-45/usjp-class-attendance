// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAiMyIx1Q1tu4hqsFGerYG_PKY7GK-KCHE',
    authDomain: 'usjp-class-attendance.firebaseapp.com',
    projectId: 'usjp-class-attendance',
    storageBucket: 'usjp-class-attendance.appspot.com',
    messagingSenderId: '195678760527',
    appId: '1:195678760527:web:d3dcae0d7aefb3db4a043a',
    measurementId: 'G-C6C0WTTL7J',
  },

  /* for push notification service visite- onesignal.com */
  onesignal: {},
  serverKey:
    'AAAAT1FnxB4:APA91bGvhnd5WWR5QKefhuxKfRkuy8JvNbQ7V3hvuKGJ4gu2qOkhl2sYkGY8CfTcIW7VxIDfns5Tb4NuqZsLLwC3t8WpIHTyGCgjA4D4Wrmo7EpxkggNhJj_hb940uqZqfIOaXqh_CQi',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
