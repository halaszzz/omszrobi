require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Bot üzenet küldése')
    .addStringOption(option =>
      option
        .setName('uzenet')
        .setDescription('Az elküldendő üzenet')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Felhasználó kickelése')
    .addUserOption(option =>
      option
        .setName('felhasznalo')
        .setDescription('Felhasználó')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('indok')
        .setDescription('Kick indoka')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Felhasználó bannolása')
    .addUserOption(option =>
      option
        .setName('felhasznalo')
        .setDescription('Felhasználó')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('indok')
        .setDescription('Ban indoka')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('verify-panel')
    .setDescription('OMSZ account beküldő panel küldése'),
]
.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {

    console.log('Parancsok feltöltése...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands },
    );

    console.log('Parancsok sikeresen feltöltve.');

  } catch (error) {
    console.error(error);
  }
})();
