'use strict';

const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const config = require('../config/config');

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    //add channelId
    (this.channelId = config.discord.channelId),
      this.client.on('ready', () => {
        console.log(`Logged is as ${this.client.user.tag}`);
      });

    this.client.login(config.discord.tokenDiscord);
  }

  sendToFormatCode(logData) {
    const { code, message = 'This is some additional information about the code', title = 'Code example' } = logData;
    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt('000ff00', 16), //covert hexdecimal color code to integer color
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
        },
      ],
    };

    this.sendToMessage(codeMessage);
  }

  sendToMessage(message = 'message') {
    const channel = this.client.channels.cache.get(this.channelId);

    if (!channel) {
      console.log(`Couldn't find the channel ${this.channelId}`);
      return;
    }

    channel.send(message).catch((e) => console.error(e));
  }
}

module.exports = new LoggerService();
