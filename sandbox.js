exports.validate = function(message) {

    if (!message) return false;
    if (message.author.bot) return false;

    if (!message.content.startsWith('+')) return false;

    return true;
}

exports.fitArgs = function(content) {

    const args = content.substring(1).split(' ');

    return { command: args[0], args: args.slice(1) };
}