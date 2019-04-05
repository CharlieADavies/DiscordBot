const Discord = require('discord.js'); //Main Discord module
const memberListener = require('./NewMember.js'); //Functionality for listening to new members
const easterEggs = require('./EasterEggs.js'); //Functionality for fun chat commands
const memberTracking = require('./ExperienceSystem.js');
const chatUtils = require('./UtilChatCommands'); //Functionality for staff chat commands
// Create an instance of a Discord client
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});
client.on('error', () => {
    console.log('error encountered');
});
memberListener.listenForMembers(client); //Initiates new member listener
easterEggs.easterEggListeners(client);
chatUtils.utilListener(client);
// Simple ping listener/response
client.on('message', message => { //Included to verify bot connections
    memberTracking.addXP(1,message.author.id);
    if (message.content === 'ping') {
        message.channel.send('pong');
    }
    if (message.content === '!nm'){
        memberTracking.ConvertNewMembsToMembers(message.member.guild);
    }
    if (message.content === '!guild'){
        console.log(message.member.guild)
    }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login('No Secrets Here');
