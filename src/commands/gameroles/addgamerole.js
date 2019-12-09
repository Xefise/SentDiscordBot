const db = require("../../db.js");
const { log } = require("../../functions.js");

exports.run = (client, message, args) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("**Error:** You are **not administrator**!");
  if (args.length == 0) return message.reply("Not enough arguments. Type !-help");

  new Promise(function (resolve) {
    db.getGuild(message.guild, resolve);
  }).then(function (guildDB) {
    guildDB.gameRoles.push(args[0]);
    const gameRolesJSON = JSON.stringify(guildDB.gameRoles);
    if(gameRolesJSON.length >= 255) return message.reply("**Error:** Too much roles! Please shorten the role names.");

    new Promise(function (resolve) {
      db.updateGuild("gameRoles", `'${gameRolesJSON}'`, message.guild, resolve);
    }).then(function (res) {
      if(res) message.reply("Game roles have been changed!");
      else return message.reply("Error :(");
      log(`Game roles have been changed to ${gameRolesJSON} by ${message.author.tag}`, message.guild, "Guild " + message.guild, message.member.tag);
    });
  });
}