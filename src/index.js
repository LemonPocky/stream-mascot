'use strict';
const TwitchApiClient = require('./twitch-api-client');
const StreamMascotWSClient = require('./websocket-client');
const inquirer = require('inquirer');

// Used for managing connection to Twitch
const twitchApiClient = new TwitchApiClient(this);
// Used for managing connection to Stream Mascot
const streamMascotWSClient = new StreamMascotWSClient(this);

async function run() {
  // If we have to ctrl+c, ensures that the subscriptions are closed first
  process.on('SIGINT', function () {
    console.log('Caught interrupt signal');
    close();
  });

  // Set up an interactive CLI to manage the client
  menu();
}

async function menu() {
  inquirer
    .prompt({
      type: 'list',
      name: 'start',
      message:
        'Welcome to the Stream Mascot WebSocket client! ' +
        '\nPlease ensure the Unity program is running before you connect the client. ',
      choices: ['Start Client', 'Help', 'Quit'],
    })
    .then(async (answers) => {
      switch (answers.start) {
        case 'Start Client':
          await connectToServices();
          break;
        case 'Help':
          console.log(
            'HELP: This program receives events from Twitch and sends them to ' +
              'the Stream Mascot program. Be sure to fill out the info in .env.'
          );
          menu();
          break;
        case 'Quit':
          close();
          break;
        default:
      }
    });
}

async function connectToServices() {
  // Connect to Twitch
  await twitchApiClient.connect();
  streamMascotWSClient.connect();
}

function close() {
  console.log('Deleting all EventSub subscriptions');
  twitchApiClient.resetAllSubscriptions().then(() => {
    process.exit();
  });
}

run();
