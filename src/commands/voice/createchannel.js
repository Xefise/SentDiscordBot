const { log } = require("../../functions.js");
const db = require("../../db.js");

exports.run = (client, message, args) => {
  if (!message.member.hasPermission("CONNECT")) return message.reply('**Error:** You do not have the "connect" permission!');
  if (args.length == 0) return message.reply("Not enough arguments. Type !-help");
  new Promise(function (resolve) {
    db.getGuild(message.guild, resolve);
  }).then(function (guildDB) {
    const noDelete = guildDB.whiteChannels;
    if (noDelete.includes(args[0])) return message.reply("**Error:** You cannot create channel with name of a white channel!");

    if (message.member.voiceChannel) {
      if (args.length == 1) makeChannel(message, args[0], 0, message);
      else makeChannel(message, args[0], args[args.length - 1], message);
      message.reply("The channel is created.");
    } else message.reply("First enter to a voice channel");
  });
}

function makeChannel(message, name, limit, message) {
  const guild = message.guild;
  new Promise(function (resolve) {
    db.select("guilds", "guildID", guild.id, resolve);
  }).then(function (guildDB) {
    const category = guild.channels.find( c => c.id == guildDB.voiceChannelsCategory && c.type == "category" );
    guild
    .createChannel(name, { type: "voice" })
    .then(channel => {
      channel.userLimit = limit;
      if (!category) throw new Error("Category of the channel does not exist");
      channel.setParent(category.id)
      const voiceBitrate = guildDB.bitrate * 1000; // GuildDB.bitrate in Kbits, but we need bits
      channel
        .edit({ bitrate: voiceBitrate })
        .catch();
      if (message.member.voiceChannel) message.member.setVoiceChannel(channel);
      //channel.lockPermissions().catch(console.error); does not work:(
      log(`Created voice channel "${name}" by ${message.author.tag}`, message.guild, "Guild " + message.guild, message.member.tag);
    }).catch(console.error);
  });
}