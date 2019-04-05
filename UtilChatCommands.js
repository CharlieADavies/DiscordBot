module.exports = {utilListener: utilListener};
const memberTracking = require('./ExperienceSystem.js');
const newMemberSystem = require('./NewMemberSystem');
function utilListener(client) {
    //TODO use paramaterised commands rather than simple checking like this
    client.on('message', message => {
            if (message.content.includes("stupid bot")) {
                message.reply("Who you calling stupid?")
            }
            switch (message.content) {
                case "!clear":
                    if(message.channel.name==="general"||message.channel.name==="memes"||message.channel.name==="staff")
                    clearChannel(message);
                    break;
                case "!cr":
                    giveCharlieHisRoles(message);
                    break;
                case "!add":
                    addToDatabase(message);
                    break;
                case "!score":
                    memberTracking.levelUpUser(message.member.id);
                    memberTracking.getLevel(message.author.id, function (none, level) {
                        message.reply("Your level is "+level)

                    });
                    break;
            }
        }
    )
}

function addToDatabase(message) {
    let id = message.author.id;
    let username = message.member.displayName;
    console.log(id,username);
    newMemberSystem.addNewMemberToDB(id, username)
}

function clearChannel(message) {
    console.log("cleared : ", message.channel.name);
    if (message.channel.name !== "bot-ideas") {
        message.channel.bulkDelete(50).catch(console.error)
    }
}

function giveCharlieHisRoles(message) {
    const CharlieID = "152515077512232960";
    const roles = ['532410245712969750',
        '537334980997677088',
        '534926421752152065',
        '537336063954255877'];
    if (message.author.id === CharlieID) {
        for (let i = 0; i < roles.length; i++) {
            if (!message.member.roles.keyArray().includes(roles[i])) {
                message.member.addRole(roles[i]).catch(console.error)
            }
        }
    }
}
