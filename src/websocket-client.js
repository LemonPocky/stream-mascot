'use strict';

const WebSocket = require('ws');

// Class that represents a WebSocket client to facilitate communication between
// this client and the Stream Mascot server.
// The terms may sound backwards, but this is the client because this will send messages to
// the server (Unity) when it receives an event from Twitch, and Unity will perform
// a behavior based on the message received.
module.exports = class StreamMascotWSClient {
  constructor() {
    // TODO: Add port to env?
    this.port = '8080';

    // Path to the service
    // Keep as '/Service' unless it's changed server-side
    this.path = '/Service';

    // WebSocket client object
    this.wsc;
  }

  // Connects to the Stream Mascot WebSocket server
  connect() {
    // Creates a new websocket client
    this.wsc = new WebSocket(`ws://localhost:${this.port}${this.path}`);

    this.wsc.on('open', () => {
      console.log('WebSocket client connected to Stream Mascot server.');
      if (wsc.readyState === wsc.OPEN) {
        wsc.send('Sending test message from client to server.');
      }
    });

    this.wsc.on('error', (error) => {
      console.log('Connection Error. ' + error);
    });

    this.wsc.on('close', (code, reason) => {
      console.log(
        'WebSocket disconnected from Stream Mascot server. ' + reason.toString()
      );
    });

    this.wsc.on('message', (data, isBinary) => {
      if (!isBinary) {
        console.log(
          `WebSocket received message from server: ${data.toString()}`
        );
      }
    });
  }
};
