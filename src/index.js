'use strict';
const TwitchApiClient = require('./twitch-api-client');
const WebSocketClient = require('./websocket-client');

async function run() {
  // const twitchApiClient = new TwitchApiClient(this);
  const WebSocketClient = new WebSocketClient(this);

  // twitchApiClient.connect();

  // If we have to ctrl+c, ensures that the subscriptions are closed first
  process.on('SIGINT', function () {
    console.log('Caught interrupt signal');
    console.log('Deleting all EventSub subscriptions');
    twitchApiClient.resetAllSubscriptions().then(() => {
      process.exit();
    });
  });
}

run();
