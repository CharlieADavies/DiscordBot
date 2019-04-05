const memberTracking = require('./NewMemberSystem');
const Discord = require('discord.js'); //Main Discord module
const client = new Discord.Client();
client.login('NTM0OTI2ODEwNDM0MTA5NDQ2.DyAtUw.CodjG0PDyuvyofFTwppCCCTVzQg').then();
client.on('ready', () => {
    memberTracking.ConvertNewMembsToMembers(client.guilds.array()[0]);
});
