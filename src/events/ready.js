const { log } = require("../functions.js");

module.exports = (client) => {
  log(`logged in as ${client.user.tag}!`, undefined , "BOT", "Client");

  client.user.setPresence({/*
    status: "idle",
    game: {
      name: "TEST!",
      type: "WATCHING"
    }*/
    status: "online",
    game: {
      name: "you:b| !-help v0.1.11 (stable)",
      type: "WATCHING"
    }
  });
}