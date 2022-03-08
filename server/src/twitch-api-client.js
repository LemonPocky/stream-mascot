'use strict';

require('dotenv').config();
const { ClientCredentialsAuthProvider } = require('@twurple/auth');
const { ApiClient } = require('@twurple/api');
const { EventSubListener } = require('@twurple/eventsub');
const { NgrokAdapter } = require('@twurple/eventsub-ngrok');

module.exports = class TwitchApiClient {
  constructor() {
    // Get an access token from Twitch
    this._clientId = process.env.CLIENT_ID;
    this._clientSecret = process.env.CLIENT_SECRET;
    this._broadcasterId = process.env.BROADCASTER_ID;

    this.isListening = false;
    this.activeSubscriptions = {};

    const authProvider = new ClientCredentialsAuthProvider(
      this._clientId,
      this._clientSecret
    );

    // Initializes the api client
    this.apiClient = new ApiClient({ authProvider });

    // Start listening to EventSub using ngrok
    // If this app ever expands, ngrok will need to be replaced by a more permanent solution
    this.listener = new EventSubListener({
      apiClient: this.apiClient,
      adapter: new NgrokAdapter(),
      secret: process.env.SECRET,
    });
  }

  // Start listening to EventSub and subscribe to events
  async connect() {
    try {
      // Starts the backing server and listens to incoming EventSub notifications.
      await this.listener.listen();
      this.isListening = true;
      await this.subscribeToEvents();
      console.log('Twitch EventSub listener is listening.');
    } catch (error) {
      console.log('Error subscribing to events: ' + error);
      // Clear all currently active subscriptions
      this.resetAllSubscriptions();
    }
  }

  // All event subscriptions happen in this function
  // Their handlers should be defined as separate functions
  // TODO: Move the handlers to external files
  async subscribeToEvents() {
    // Subscribe to events
    console.log('Subscribing to Channel Update...');
    this.activeSubscriptions['updateSubscription'] =
      await this.listener.subscribeToChannelUpdateEvents(
        this._broadcasterId,
        this.onChannelUpdate
      );

    console.log('Subscribing to Channel Follow...');
    this.activeSubscriptions['followSubscription'] =
      await this.listener.subscribeToChannelFollowEvents(
        this._broadcasterId,
        this.onChannelFollow
      );

    // Triggers when the broadcaster gets raided
    console.log('Subscribing to Channel Raid To...');
    this.activeSubscriptions['raidToSubscription'] =
      await this.listener.subscribeToChannelRaidEventsTo(
        this._broadcasterId,
        this.onChannelRaidTo
      );
  }

  onChannelUpdate(event) {
    console.log(`${event.broadcasterName} updated their channel info.`);
  }

  onChannelFollow(event) {
    console.log(
      `${event.userDisplayName} just followed ${event.broadcasterDisplayName}!`
    );
  }

  onChannelRaidTo(event) {
    console.log(
      `${event.raidingBroadcasterDisplayName} just raided ${event.raidedBroadcasterDisplayName} with ${event.viewers} viewers!`
    );
  }

  // TODO: A function that restores subscriptions on disconnect

  // Deletes all EventSub subscriptions belonging to this client
  async resetAllSubscriptions() {
    return this.apiClient.eventSub.deleteAllSubscriptions();
  }
};
