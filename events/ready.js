const { Events, ActivityType, PresenceUpdateStatus } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
  name: Events.ClientReady,
  once: true,

  async execute(client) {
    const guild = client.guilds.cache.get(config.guildId);

    // === HEURE LOCALE FR ===
    const now = new Date();
    const frTime = now.toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // === CONSOLE LOGS ===
    console.log('╔════════════════════════════════════╗');
    console.log('║     PROTECT SÉCURE – BOT ACTIF     ║');
    console.log('╚════════════════════════════════════╝');
    console.log(`Connecté : ${client.user.tag}`);
    console.log(`ID Bot   : ${client.user.id}`);
    console.log(`Serveur  : ${guild ? guild.name : '❌ Non trouvé'}`);
    console.log(`Membres  : ${guild ? guild.memberCount.toLocaleString('fr-FR') : 'N/A'}`);
    console.log(`Heure FR : ${frTime} (CET)`);
    console.log(`Statut   : Do Not Disturb`);
    console.log('══════════════════════════════════════');

    // === STATUT DND + ACTIVITÉ ===
    client.user.setPresence({
      status: PresenceUpdateStatus.DoNotDisturb, // DND
      activities: [{
        name: 'Protect Sécure • Assistance 24/7',
        type: ActivityType.Playing,
      }]
    });

    // === DÉPLOIEMENT DES COMMANDES ===
    const commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      commands.push(command.data.toJSON());
    }

    try {
      if (config.guildId && guild) {
        await guild.commands.set(commands);
        console.log(`Commandes déployées sur : ${guild.name}`);
      } else {
        await client.application.commands.set(commands);
        console.log('Commandes déployées globalement');
      }
    } catch (error) {
      console.error('Erreur déploiement commandes :', error);
    }

    console.log('Bot en ligne et prêt !');
  },
};