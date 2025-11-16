const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute un membre (timeout)')
    .addUserOption(option =>
      option.setName('membre')
        .setDescription('Membre à muter')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('minutes')
        .setDescription('Durée en minutes')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('raison')
        .setDescription('Raison du mute')
        .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: '❌ Tu n\'as pas la permission de muter.', ephemeral: true });
    }

    const member = interaction.options.getMember('membre');
    const minutes = interaction.options.getInteger('minutes');
    const reason = interaction.options.getString('raison') || 'Aucune raison';

    if (member.isCommunicationDisabled()) {
      return interaction.reply({ content: '❌ Ce membre est déjà muté.', ephemeral: true });
    }

    await member.timeout(minutes * 60 * 1000, reason);
    await interaction.reply(`🔇 **${member.user.tag}** muté pour **${minutes} min**. Raison : ${reason}`);
  },
};