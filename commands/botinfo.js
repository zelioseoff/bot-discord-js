// commands/botinfo.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Affiche les informations du bot'),

  async execute(interaction) {
    const client = interaction.client;
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor(uptime / 3600) % 24;
    const minutes = Math.floor(uptime / 60) % 60;

    const embed = new EmbedBuilder()
      .setTitle('PROTECT SÉCURE – BOT INFO')
      .setThumbnail(client.user.displayAvatarURL())
      .setColor('#1a1a1a')
      .addFields(
        { name: 'Nom', value: client.user.tag, inline: true },
        { name: 'ID', value: client.user.id, inline: true },
        { name: 'Créé le', value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}:F>`, inline: false },
        { name: 'Serveurs', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Membres totaux', value: `${client.users.cache.size}`, inline: true },
        { name: 'Latence', value: `${client.ws.ping} ms`, inline: true },
        { name: 'Uptime', value: `${days}j ${hours}h ${minutes}m`, inline: false },
        { name: 'Version', value: 'Discord.js v14', inline: true },
        { name: 'Node.js', value: process.version, inline: true }
      )
      .setFooter({ text: 'Développé pour Protect Sécure • Assistance 24/7' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};