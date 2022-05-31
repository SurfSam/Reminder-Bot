const Mongo = require('mongodb');

const uri = `mongodb://mongo:27017`;

const client = new Mongo.MongoClient(uri);

exports.init = async function () {
    await client.connect((err) => {
        if (err) console.log(err);
        else console.log("Connected to DB");
    });
}

exports.getReminders = async function () {
    try {
        const db = client.db("ReminderBot");

        const reminders = db.collection("Reminders");

        return await reminders.find({}).toArray();
    } catch (err) {
        console.log(err);
    }
}

exports.addReminder = async function (author, channel, message, date) {
    try {
        const db = client.db("ReminderBot");

        const reminders = db.collection("Reminders");

        reminders.insertOne({ userID: author.id, channel: channel.id, message, date });
    } catch (err) {
        console.log(err);
    }
}

exports.deleteReminder = async function (reminder) {
    try {
        const db = client.db("ReminderBot");

        const reminders = db.collection("Reminders");

        reminders.deleteOne(reminder);
    } catch (err) {
        console.log(err);
    }
}