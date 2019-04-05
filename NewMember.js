//Listens for new guild members and creates channel for introduction

module.exports = {listenForMembers: memberListeners};
const memberTracking = require('./ExperienceSystem.js');

function memberListeners(client) {
    client.on('guildMemberAdd', async member => {
        //Creates the welcome channel for the new member
        let channel = await member.guild.createChannel("Welcome " + member.displayName, 'text', [{
            id: member.guild.id,
            deny: 'VIEW_CHANNEL'
        }]);
        await channel.setParent(member.guild.channels.find(channel => channel.name === "Set up your profile"));

        //Allows the relevant user to see the channel
        await channel.overwritePermissions(member, {//Explicitly allow the role to see, join and speak
            'VIEW_CHANNEL': true, 'SEND_MESSAGES': true,
        }).then(function () {
            console.log("Permissions changed")
        }).catch(console.error);

        let messageRoleArr = await sendUserRoleMessages(channel, member);
    });

}

function sendInitialWelcomeMessage(channel, member) {
    return channel.send("*Hello " + member + " and welcome to*  __***Retro89***__" +
        "\n*We are going to setup your profile, please **react** to each game with a **tick** or **cross** depending on the games you play!*"
        + "\n\n(note: if a new message does not appear after you have reacted to a game, please re-react)").then(msg => {
        return msg
    }).catch(console.error);


}

async function sendUserRoleMessages(channel, member) {
    await sendInitialWelcomeMessage(channel, member);
    let roleMessageArr = [
        {
            message: "***\n" +
                "Rainbow Six Siege?\n" +
                "***",
            roleName: "Rainbow 6 Siege"
        },
        {
            message: "***\n" +
                "Overwatch?\n" +
                "***",
            roleName: "Overwatch"
        }, {
            message: "***\n" +
                "Grand Theft Auto V Online?\n" +
                "***",
            roleName: "Grand Theft Auto"
        },
        {
            message: "***\n" +
                "Minecraft?\n" +
                "***",
            roleName: "Minecraft"
        },
        {
            message: "***\n" +
                "ETS2 or ATS?\n" +
                "***",
            roleName: "Retro Haulage"
        },
        {
            message: "***\n" +
                "Racing?\n" +
                "***\n",
            roleName: "Racing"
        },
        {
            message: "***\n" +
                "Counterstrike: Global offensive (competitive or casually)?\n" +
                "***\n",
            roleName: "CSGO"
        }
    ];
    await getRolesToSet(roleMessageArr[0].message, roleMessageArr[0].roleName, channel, roleMessageArr.slice(1), member, []);
}

//addRole(channel.guild.roles.find(role => role.name === roleName)
//The solution is to call the next function from inside a listener not from inside the .then()
async function getRolesToSet(messageText, roleName, channel, messageArr = null, member, rolesToAdd) {
    channel.send(messageText).then(msg => {
        msg.react("✅").then(xReaction => {
            xReaction.message.react("❌").then(tReaction => {
                msg = tReaction.message;
                const filter = (reaction) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌');
                let reactionCollector = msg.createReactionCollector(filter);

                reactionCollector.on("collect", reaction => {
                    if (reaction.count > 1) {
                        if (reaction.emoji.name === "✅") {
                            rolesToAdd.push(roleName)
                        }
                        reactionCollector.stop();
                    }
                });
                reactionCollector.on("end", s => {
                    if (messageArr.length > 0) {
                        return getRolesToSet(messageArr[0].message, messageArr[0].roleName, channel, messageArr.slice(1), member, rolesToAdd)
                    }
                    else {
                        verifySelectedRoles(rolesToAdd, channel, member)
                    }
                })
            })
        })


    })
}

function verifySelectedRoles(roles, channel, member) {
    let messageText;
    if (roles.length > 0) {
        messageText = "Did you select the following games : ";
        for (let i = 0; i < roles.length; i++) {
            messageText += "\n***" + roles[i] + "***"
        }
    }
    else {
        messageText = "You selected none of the games, but still want to be a member, correct?"
    }
    channel.send(messageText).then(msg => {
        msg.react("✅").then(xReaction => {
            xReaction.message.react("❌").then(tReaction => {
                msg = tReaction.message;
                const filter = (reaction) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌');
                let reactionCollector = msg.createReactionCollector(filter);

                reactionCollector.on("collect", reaction => {
                    if (reaction.count > 1) {
                        if (reaction.emoji.name === "❌") {
                            msg.channel.send("Whoops, we'd better start again then.").then(function () {
                                reactionCollector.stop();
                                sendUserRoleMessages(msg.channel, member)
                            })
                        }
                        else {
                            reactionCollector.stop();
                            assignRoles(roles, member, msg.channel);
                            welcomeUser(member)
                        }

                    }
                });
            })
        })
    })

}

function assignRoles(rolesToAddNames, member, channel) {
    console.log(member.id);
    let roles = [member.guild.roles.find(role => role.name === "New Member")];
    for (let i = 0; i < rolesToAddNames.length; i++) {
        roles.push(member.guild.roles.find(role => role.name === rolesToAddNames[i]).id);
    }
    member.addRoles(roles).then(channel.delete()).then().catch(console.error);
    memberTracking.addNewMemberToDB(member.id, member.displayName)
}

function welcomeUser(member) {
    member.guild.channels.find(channel => channel.name === "general").send("Welcome " + member + " to the server")

}