// commands/userinfo.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Affiche les infos d’un membre')
    .addUserOption(option =>
      option.setName('membre')
        .setDescription('Membre à afficher (défaut: toi)')
        .setRequired(false)),

  async execute(interaction) {
    const member = interaction.options.getMember('membre') || interaction.member;
    const user = member.user;

    const roles = member.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .map(r => r)
      .join(', ') || 'Aucun rôle';

    const embed = new EmbedBuilder()
      .setTitle(`Informations – ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setColor(member.displayHexColor || '#1a1a1a')
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Compte créé', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true },
        { name: 'Rejoint le', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
        { name: 'Rôles', value: roles.length > 1024 ? 'Trop de rôles' : roles, inline: false },
        { name: 'Statut', value: member.presence?.status ? member.presence.status : 'Hors ligne', inline: true },
        { name: 'Boost', value: member.premiumSince ? 'Oui' : 'Non', inline: true }
      )
      .setFooter({ text: 'Protect Sécure • Sécurité 24/7' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};