const Discord = require('discord.js');
const config = require('./config.json');

const { addReminder, init } = require('./reminder.js');
const { validate, fitArgs } = require('./sandbox.js');
const db = require('./database');

const bot = new Discord.Client({
    token: config.token,
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
	partials: ["CHANNEL"],
	autorun: true
})

bot.on('ready', async () => {
    console.log("Connected");

    init(bot);
    await db.init();
})

bot.on('messageCreate', async (message) => {

    if (!validate(message)) return;

    const { command, args } = fitArgs(message.content);

    switch (command) {

        case 'reminder':

            await addReminder(message, args);
            break;

        default:

            message.channel.send(`Unknown command: ${command}`);
            break;
    }
});

bot.login(config.token);