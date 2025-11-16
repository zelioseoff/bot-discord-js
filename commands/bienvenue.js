const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const fs = require('fs');
let config = require('../config.json'); // Chargé une fois

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bienvenue')
    .setDescription('Configurer le message de bienvenue')
    .addSubcommand(sub =>
      sub.setName('activer')
        .setDescription('Activer la bienvenue'))
    .addSubcommand(sub =>
      sub.setName('désactiver')
        .setDescription('Désactiver la bienvenue'))
    .addSubcommand(sub =>
      sub.setName('salon')
        .setDescription('Définir le salon de bienvenue')
        .addChannelOption(option =>
          option.setName('salon')
            .setDescription('Salon où envoyer les messages')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText))),

  async execute(interaction) {
    // Vérification admin
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'Tu dois être admin.', ephemeral: true });
    }

    const sub = interaction.options.getSubcommand();

    try {
      if (sub === 'activer') {
        config.welcomeEnabled = true;
        saveConfig();
        await interaction.reply({ content: 'Message de bienvenue **activé**.' });

      } else if (sub === 'désactiver') {
        config.welcomeEnabled = false;
        saveConfig();
        await interaction.reply({ content: 'Message de bienvenue **désactivé**.' });

      } else if (sub === 'salon') {
        const channel = interaction.options.getChannel('salon');
        if (channel.type !== ChannelType.GuildText) {
          return interaction.reply({ content: 'Veuillez sélectionner un salon texte.', ephemeral: true });
        }
        config.welcomeChannel = channel.id; // ID, pas le nom !
        saveConfig();
        await interaction.reply({ content: `Salon de bienvenue défini : ${channel}` });
      }
    } catch (error) {
      console.error('Erreur bienvenue.js :', error);
      await interaction.reply({ content: 'Erreur lors de la configuration.', ephemeral: true });
    }
  },
};

// === FONCTION DE SAUVEGARDE ===
function saveConfig() {
  fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
  // Recharger le module pour mise à jour instantanée
  delete require.cache[require.resolve('../config.json')];
  config = require('../config.json');
}