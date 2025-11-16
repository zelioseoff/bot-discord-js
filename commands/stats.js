// commands/stats.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Affiche les statistiques du serveur'),

  async execute(interaction) {
    const guild = interaction.guild;
    const embed = new EmbedBuilder()
      .setTitle(`Statistiques – ${guild.name}`)
      .addFields(
        { name: 'Membres', value: `${guild.memberCount}`, inline: true },
        { name: 'En ligne', value: `${guild.members.cache.filter(m => m.presence?.status).size}`, inline: true },
        { name: 'Salons', value: `${guild.channels.cache.size}`, inline: true },
        { name: 'Créé le', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: false }
      )
      .setColor('#1a1a1a')
      .setThumbnail(guild.iconURL());

    await interaction.reply({ embeds: [embed] });
  },
};