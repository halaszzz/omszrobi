require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  Events,
} = require('discord.js');

const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once('ready', () => {
  console.log(`${client.user.tag} elindult.`);
});

client.on(Events.InteractionCreate, async interaction => {

  // /say
  if (interaction.isChatInputCommand() && interaction.commandName === 'say') {
    const message = interaction.options.getString('uzenet');

    await interaction.channel.send(message);

    return interaction.reply({
      content: 'Üzenet elküldve.',
      ephemeral: true,
    });
  }

  // /kick
  if (interaction.isChatInputCommand() && interaction.commandName === 'kick') {
    const user = interaction.options.getUser('felhasznalo');
    const reason = interaction.options.getString('indok') || 'Nincs megadva';

    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({
        content: 'Nem találom a felhasználót.',
        ephemeral: true,
      });
    }

    try {
      await user.send(`Ki lettél rúgva a szerverről.\nIndok: ${reason}`);
    } catch {}

    await member.kick(reason);

    return interaction.reply(`${user.tag} kirúgva.`);
  }

  // /ban
  if (interaction.isChatInputCommand() && interaction.commandName === 'ban') {
    const user = interaction.options.getUser('felhasznalo');
    const reason = interaction.options.getString('indok') || 'Nincs megadva';

    try {
      await user.send(`Ki lettél tiltva a szerverről.\nIndok: ${reason}`);
    } catch {}

    await interaction.guild.members.ban(user.id, { reason });

    return interaction.reply(`${user.tag} bannolva.`);
  }

  // /verify-panel
  if (interaction.isChatInputCommand() && interaction.commandName === 'verify-panel') {

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('verify_button')
        .setLabel('Adatok beküldése')
        .setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder()
      .setTitle('OMSZ Account Beküldés')
      .setDescription('Nyomd meg a gombot és töltsd ki az adatokat.')
      .setColor('Blue');

    await interaction.channel.send({
      embeds: [embed],
      components: [row],
    });

    return interaction.reply({
      content: 'Panel elküldve.',
      ephemeral: true,
    });
  }

  // Gomb
  if (interaction.isButton() && interaction.customId === 'verify_button') {

    const modal = new ModalBuilder()
      .setCustomId('verify_modal')
      .setTitle('OMSZ Account Beküldés');

    const forumInput = new TextInputBuilder()
      .setCustomId('forum_link')
      .setLabel('Fórum profil linked')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const accountInput = new TextInputBuilder()
      .setCustomId('account_id')
      .setLabel('Account ID')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const firstRow = new ActionRowBuilder().addComponents(forumInput);
    const secondRow = new ActionRowBuilder().addComponents(accountInput);

    modal.addComponents(firstRow, secondRow);

    return interaction.showModal(modal);
  }

  // Modal beküldés
  if (interaction.isModalSubmit() && interaction.customId === 'verify_modal') {

    const forumLink = interaction.fields.getTextInputValue('forum_link');
    const accountId = interaction.fields.getTextInputValue('account_id');

    const channel = interaction.guild.channels.cache.get(config.vezetosegChannelId);

    if (channel) {

      const embed = new EmbedBuilder()
        .setTitle('Új OMSZ account beküldés')
        .addFields(
          {
            name: 'Discord felhasználó',
            value: `${interaction.user.tag}`,
          },
          {
            name: 'Discord ID',
            value: `${interaction.user.id}`,
          },
          {
            name: 'Fórum profil',
            value: forumLink,
          },
          {
            name: 'Account ID',
            value: accountId,
          }
        )
        .setColor('Green')
        .setTimestamp();

      await channel.send({
        embeds: [embed],
      });
    }

    return interaction.reply({
      content: 'Sikeresen beküldted az adatokat.',
      ephemeral: true,
    });
  }
});

client.login(process.env.TOKEN);
