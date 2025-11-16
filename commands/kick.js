const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulser un membre')
    .addUserOption(option =>
      option.setName('membre')
        .setDescription('Membre à expulser')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('raison')
        .setDescription('Raison du kick')
        .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: '❌ Tu n\'as pas la permission d\'expulser.', ephemeral: true });
    }

    const member = interaction.options.getMember('membre');
    const reason = interaction.options.getString('raison') || 'Aucune raison';

    if (!member.kickable) {
      return interaction.reply({ content: '❌ Je ne peux pas expulser ce membre.', ephemeral: true });
    }

    await member.kick(reason);
    await interaction.reply(`✅ **${member.user.tag}** a été expulsé. Raison : ${reason}`);
  },
};