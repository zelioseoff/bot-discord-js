const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  StringSelectMenuOptionBuilder 
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ouvre le système de tickets Protect Sécure'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('SYSTÈME DE TICKETS – PROTECT SÉCURE')
      .setDescription(
        'Bienvenue dans le centre d’assistance de **Protect Sécure**.\n' +
        'Ici, vous pouvez ouvrir un ticket pour obtenir de l’aide, signaler un problème ou contacter notre équipe technique.\n\n' +
        '**Veuillez choisir la raison de votre demande dans le menu déroulant ci-dessous :**'
      )
      .setColor('#1a1a1a')
      .setFooter({ text: 'Protect Sécure • Assistance 24/7' })
      .setTimestamp();

    const menu = new StringSelectMenuBuilder()
      .setCustomId('ticket_select')
      .setPlaceholder('Sélectionnez une catégorie...')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('🛠️ Assistance Technique ')
          .setDescription('Problème caméra, installation, réglage')
          .setValue('tech'),

        new StringSelectMenuOptionBuilder()
          .setLabel('⚠️ Signalement de sécurité')
          .setDescription('Intrusion, alarme, activité suspecte')
          .setValue('secu'),

        new StringSelectMenuOptionBuilder()
          .setLabel('📄 Demande d’information')
          .setDescription('Devis, services, protocoles')
          .setValue('info'),

        new StringSelectMenuOptionBuilder()
          .setLabel('🚨 Urgence client')
          .setDescription('Caméra HS, panne critique, intervention')
          .setValue('urgence')
      );

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};