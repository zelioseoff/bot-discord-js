// commands/help.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche toutes les commandes du bot'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('PROTECT SÉCURE – COMMANDES')
      .setDescription('Voici la liste complète des commandes disponibles.')
      .setColor('#1a1a1a')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addFields(
        { name: 'TICKETS', value: '`/ticket` → Ouvre un ticket d’assistance', inline: false },
        { name: 'BIENVENUE', value: '`/bienvenue activer|désactiver|salon` → Gère le message de bienvenue', inline: false },
        { name: 'MODÉRATION', value: '`/clear`, `/mute`, `/unmute`,', inline: false },
        { name: 'UTILITAIRES', value: '`/ping`, `/stats`, `/userinfo`, `/botinfo`', inline: false },
        { name: 'INFO', value: 'Bot développé pour **Protect Sécure** • 24/7', inline: false }
      )
      .setFooter({ text: `Demandé par ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};