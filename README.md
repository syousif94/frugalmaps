## Buncha

Buncha is crowdsourced calendar of local specials and game nights (happy hours, trvia, karaoke, etc.). It is available on the [App Store](https://itunes.apple.com/us/app/buncha-local-calendar/id1440536868?ls=1&mt=8) and the [Play Store](https://play.google.com/store/apps/details?id=me.syousif.LitCal)

<a href="https://buncha.app" target="_blank"><img src="https://i.imgur.com/3GvqGkL.jpg" height="300px" /></a>

#### Requirements

[Yarn](https://yarnpkg.com/)

[Node](https://nodejs.org/)

[Expo](https://expo.io)

#### Dev Instructions

1. Start running elasticsearch somewhere (Docker, AWS, locally, etc)
2. Install Firebase globally `npm -g install firebase-tools`
3. Run `firebase init` in the root directory and enable Hosting, Functions, and Firestore
4. Create a `.env` file in the `functions` directory

```sh
GOOGLE=GOOGLE_MAPS_API_KEY_WITH_PLACES_API_ENABLED
AWSES=ELASTICSEARCH_URL
POSTCODE=ANYTHING_YOU_WANT
```

5. Run `npm i` in the `functions` directory
6. Run `yarn` in the `frugalapp` directory
7. Create an IAM role with full S3 access and save the keys in an `aws.json` file in the `functions` directory

```json
{
  "accessKeyId": "",
  "secretAccessKey": "",
  "region": ""
}
```

8. Make an S3 bucket named `buncha` and a Cloudfront distribution for that bucket. Put that url in `frugalapp/CONSTANTS.js` as `AWSCF`
9. Setup elasticsearch indexes by running `yarn elastic` in the root directory and issue the following commands

```js
elastic.events.map();
elastic.locations.map();
elastic.reminders.map();
elastic.users.map();
```

10. Put your Firebase Functions url in `frugalapp/API.js`

App: `yarn start`

Local Firebase Functions: `yarn server`

Deploy Firebase Functions: `yarn deploy`

Deploy Firebase Hosting: `yarn web`
