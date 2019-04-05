let fs = require('fs');
module.exports = {easterEggListeners: easterEggListeners};

function easterEggListeners(client) {
    client.on('message', message => {

            if (message.content.includes("shit bot")) {
                message.reply("Who you calling stupid?")
            }
            switch (message.content) {
                case "!coin":
                    flipACoin(message);
                    break;
                case "!coinflip":
                    flipACoin(message);
                    break;
                case "!flipacoin":
                    flipACoin(message);
                    break;
                case "!funfact":
                    funFact(message);
                    break;
                case "!cr": //TODO move this to a utils file
                    giveCharlieHisRoles(message);
                    break
            }
        }
    )
}

function flipACoin(message) {
    let coin = (Math.random() > 0.5) ? "heads" : "tails";
    message.reply("The coin came up " + coin)
}

function funFact(message) {
    fs.readFile('FunFacts.txt', 'utf8', function (err, contents) {
        if (contents) {
            let lines = contents.split('\n');
            message.reply(lines[Math.round(Math.random() * 1000)])
        }
    });
}

function clearChannel(message) {
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
