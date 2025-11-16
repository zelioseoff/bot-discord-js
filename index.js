const { Client, GatewayIntentBits, Collection, EmbedBuilder, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, PresenceUpdateStatus, ActivityType } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// === CHARGER LES COMMANDES ===
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// === BIENVENUE AUTO ===
client.on('guildMemberAdd', async member => {
  if (!config.welcomeEnabled) return;

  const channel = member.guild.channels.cache.get(config.welcomeChannel) ||
                  member.guild.channels.cache.find(ch => ch.name === 'general');
  if (!channel || !channel.isTextBased()) return;

  const embed = new EmbedBuilder()
    .setTitle(`Bienvenue ${member.user.username} !`)
    .setDescription(`Salut <@${member.id}> !\nBienvenue sur **${member.guild.name}**.\nPrends le temps de lire les règles !`)
    .setColor('#00ff00')
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();

  await channel.send({ embeds: [embed] });
});

// === READY – DND + LOGS FR ===
client.once('ready', async () => {
  const guild = client.guilds.cache.get(config.guildId);
  const now = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

  console.log('╔════════════════════════════════════╗');
  console.log('║     PROTECT SÉCURE – BOT EN LIGNE  ║');
  console.log('╚════════════════════════════════════╝');
  console.log(`Connecté : ${client.user.tag}`);
  console.log(`ID Bot    : ${client.user.id}`);
  console.log(`Serveur   : ${guild ? guild.name : 'Non trouvé'}`);
  console.log(`Membres   : ${guild ? guild.memberCount.toLocaleString('fr-FR') : 'N/A'}`);
  console.log(`Heure FR  : ${now} (CET)`);
  console.log(`Statut    : Do Not Disturb`);
  console.log('══════════════════════════════════════');

  client.user.setPresence({
    status: PresenceUpdateStatus.DoNotDisturb,
    activities: [{
      name: 'Protect Sécure • Assistance 24/7',
      type: ActivityType.Playing,
    }]
  });

  const commands = client.commands.map(cmd => cmd.data.toJSON());
  try {
    if (config.guildId && guild) {
      await guild.commands.set(commands);
      console.log(`Commandes déployées sur ${guild.name}`);
    } else {
      await client.application.commands.set(commands);
      console.log('Commandes déployées globalement');
    }
  } catch (error) {
    console.error('Erreur déploiement :', error);
  }

  console.log('Bot prêt !');
});

// === INTERACTIONS ===
client.on('interactionCreate', async interaction => {
  // === SLASH COMMANDS ===
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      if (['ticket', 'bienvenue', 'clear', 'mute', 'unmute', 'ping', 'stats', 'help', 'userinfo', 'botinfo'].includes(interaction.commandName)) {
        await command.execute(interaction);
      } else {
        await interaction.deferReply({ flags: 64 });
        await command.execute(interaction);
      }
    } catch (error) {
      console.error(error);
      const reply = { content: 'Erreur lors de l’exécution.', flags: 64 };
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(reply).catch(() => {});
      } else {
        await interaction.reply(reply).catch(() => {});
      }
    }
    return;
  }

  // === MENU DÉROULANT TICKET ===
  if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select') {
    await interaction.deferReply({ flags: 64 });

    const type = interaction.values[0];

    const types = {
      tech: { 
        name: 'Technique', 
        emoji: '🛠️', 
        color: '#0099ff', 
        role: config.ticketRoles.tech,
        category: config.ticketCategories.tech 
      },
      secu: { 
        name: 'Sécurité', 
        emoji: '⚠️', 
        color: '#ff0000', 
        role: config.ticketRoles.secu,
        category: config.ticketCategories.secu 
      },
      info: { 
        name: 'Info', 
        emoji: '📄', 
        color: '#888888', 
        role: config.ticketRoles.info,
        category: config.ticketCategories.info 
      },
      urgence: { 
        name: 'Urgence', 
        emoji: '🚨', 
        color: '#00ff00', 
        role: config.ticketRoles.urgence,
        category: config.ticketCategories.urgence 
      }
    };

    const selected = types[type];
    if (!selected || !selected.role || !selected.category) {
      console.error(`[CONFIG] ${type} → role: ${selected?.role}, cat: ${selected?.category}`);
      return interaction.editReply({ content: 'Configuration manquante.', flags: 64 }).catch(() => {});
    }

    let ticketChannel;
    try {
      const channelName = `${selected.name.toLowerCase()}-${interaction.user.username}`.slice(0, 100);
      ticketChannel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: selected.category,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
          { id: selected.role, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
          { id: interaction.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] }
        ]
      });
    } catch (error) {
      console.error('Erreur création salon :', error);
      return interaction.editReply({ content: 'Impossible de créer le salon.', flags: 64 }).catch(() => {});
    }

    // === MESSAGE DANS LE TICKET (séparé) ===
    const roleMention = `<@&${selected.role}>`;
    const welcomeEmbed = new EmbedBuilder()
      .setTitle(`${selected.emoji} Ticket – ${selected.name}`)
      .setDescription(
        `${roleMention} **— ÉQUIPE NOTIFIÉE —**\n\n` +
        `Bonjour <@${interaction.user.id}>,\n` +
        `Votre ticket **${selected.name}** est ouvert.\n` +
        `Un membre de l’équipe vous répondra sous peu.\n\n` +
        `**Fermez ce ticket une fois le problème résolu.**`
      )
      .setColor(selected.color)
      .setTimestamp();

    const closeButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('Fermer le ticket')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🔒') // EMOJI VALIDE
    );

    // Envoi séparé → ne bloque pas
    ticketChannel.send({ 
      content: roleMention, 
      embeds: [welcomeEmbed], 
      components: [closeButton] 
    }).catch(err => console.error('Échec envoi message :', err));

    // RÉPONSE ÉPHÉMÈRE
    await interaction.editReply({ 
      content: `${selected.emoji} Votre ticket est ouvert : ${ticketChannel}` 
    }).catch(() => {});
  }

  // === FERMER LE TICKET ===
  if (interaction.isButton() && interaction.customId === 'close_ticket') {
    await interaction.reply('Ticket fermé dans 5 secondes...');
    setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
  }
});

client.login(config.token);