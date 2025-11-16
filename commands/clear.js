// commands/clear.js
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprime un nombre de messages')
    .addIntegerOption(option =>
      option.setName('nombre')
        .setDescription('Nombre de messages à supprimer (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: 'Tu dois avoir la permission de gérer les messages.', ephemeral: true });
    }

    const amount = interaction.options.getInteger('nombre');

    try {
      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({ content: `${amount} messages supprimés.`, ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: 'Erreur : messages trop anciens (>14 jours).', ephemeral: true });
    }
  },
};