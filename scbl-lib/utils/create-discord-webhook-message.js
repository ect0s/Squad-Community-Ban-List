import DiscordWebhookNode from 'discord-webhook-node';

const { Webhook, MessageBuilder } = DiscordWebhookNode;

export default function (url, options = {}) {
  return [
    new Webhook(url, { retryOnLimit: false })
      .setUsername('GameBans.org')
      .setAvatar(
        'https://raw.githubusercontent.com/ect0s/Squad-Community-Ban-List/master/client/src/assets/img/brand/scbl-logo-square.png'
      ),
    new MessageBuilder()
      .setColor(options.color || '#ffc40b')
      .setFooter('Powered by the gamebans.org')
      .setTimestamp()
  ];
}
