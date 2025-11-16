const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Démute un membre')
    .addUserOption(option =>
      option.setName('membre')
        .setDescription('Membre à démute')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: '❌ Tu n\'as pas la permission de démute.', ephemeral: true });
    }

    const member = interaction.options.getMember('membre');

    if (!member.isCommunicationDisabled()) {
      return interaction.reply({ content: '❌ Ce membre n\'est pas muté.', ephemeral: true });
    }

    await member.timeout(null);
    await interaction.reply(`🔊 **${member.user.tag}** a été démute.`);
  },
};