const db = require('./database');

var bot;
exports.init = function(_bot) {
    bot = _bot;
}

exports.addReminder = async function (message, args) {
    const timeArg = args.shift();

    const timeValues = timeArg.split(/[A-z]/g).filter(x => x != "");

    const charValues = timeArg.split(/\d+/g).filter(x => x != "");

    const fullValues = new Map();

    for (let i = 0; i < charValues.length; i++) {
        fullValues.set(charValues[i], timeValues[i]);
    }

    const messageArg = args.join(" ");

    const dueDate = new Date();

    for (const [key, value] of fullValues) {
        switch (key) {
            case 'y':
                dueDate.setFullYear(dueDate.getFullYear() + parseInt(value));
                break;
            case 'M':
                dueDate.setMonth(dueDate.getMonth() + parseInt(value));
                break;
            case 'w':
                dueDate.setDate(dueDate.getDate() + parseInt(value) * 7);
                break;
            case 'd':
                dueDate.setDate(dueDate.getDate() + parseInt(value));
                break;
            case 'h':
                dueDate.setHours(dueDate.getHours() + parseInt(value));
                break;
            case 'm':
                dueDate.setMinutes(dueDate.getMinutes() + parseInt(value));
                break;
            default:
                message.channel.send(`Unsupported type ${key}`);
                return;
        }
    }

    if (dueDate.getTime() <= Date.now()) message.channel.send(`Invalid date ${dueDate.toDateString}`);
    else {

        await db.addReminder(message.author, message.channel, messageArg, dueDate);

        message.react("👍");
    }

    console.log(`Registered reminder for ${message.author.id} in channel ${message.channel.id}`);
}

exports.resolveReminder = async function (reminder) {

    const channel = await bot.channels.fetch(reminder.channel);

    channel.send({ content: `<@${reminder.userID}> ${reminder.message}`});

    db.deleteReminder(reminder);

    console.log(`Resolved reminder for ${reminder.userID} in channel ${reminder.channel}`);
}

const { CronJob } = require('cron');

const reminderJob = new CronJob(
    "0/30 * * * * *",
    async () => {
        console.log("Updating reminders");
        const reminders = await db.getReminders();

        const ripeReminders = reminders.filter(x => x.date < Date.now());

        for(var rem of ripeReminders) {
            await this.resolveReminder(rem);
        }
    },
    null,
    true
)