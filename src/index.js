'use strict';

async function run() {
  require('dotenv').config();
  const { ClientCredentialsAuthProvider } = require('@twurple/auth');
  const { ApiClient } = require('@twurple/api');
  const { EventSubListener } = require('@twurple/eventsub');
  const { NgrokAdapter } = require('@twurple/eventsub-ngrok');

  // Get an access token from Twitch
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const broadcasterId = process.env.BROADCASTER_ID;

  const authProvider = new ClientCredentialsAuthProvider(
    clientId,
    clientSecret
  );

  // Initializes the api client
  const apiClient = new ApiClient({ authProvider });

  // Start listening to EventSub using ngrok
  // If this app ever expands, ngrok will need to be replaced by a more permanent solution
  const listener = new EventSubListener({
    apiClient,
    adapter: new NgrokAdapter(),
    secret: process.env.SECRET,
  });

  process.on('SIGINT', function () {
    console.log('Caught interrupt signal');
    listener.unlisten();
    process.exit();
  });

  try {
    await listener.listen();
    await subscribeToEvents(listener, broadcasterId);
    console.log('Listener is listening.');
  } catch (error) {
    console.log('Error: ' + error);
    // Clear all currently active subscriptions
    listener.unlisten();
  }
}

// All event subscriptions happen in this function
// Their handlers should be defined as separate functions
async function subscribeToEvents(listener, userId) {
  // Subscribe to events
  const activeSubscriptions = {};
  activeSubscriptions['updateSubscription'] =
    await listener.subscribeToChannelUpdateEvents(userId, onChannelUpdate);
  activeSubscriptions['followSubscription'] =
    await listener.subscribeToChannelFollowEvents(userId, onChannelFollow);

  // Start listening to all subscriptions
  // for (const subscription in activeSubscriptions) {
  //   try {
  //     await activeSubscriptions[subscription].start();
  //   } catch (error) {
  //     console.log('There was a problem subscribing to an event. ' + error);
  //   }
  // }
}

async function onChannelUpdate(event) {
  console.log(`${event.broadcasterName} updated their channel info.`);
}

async function onChannelFollow(event) {
  console.log(
    `${event.userDisplayName} just followed ${event.broadcasterDisplayName}!`
  );
}

run();
