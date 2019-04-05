let mysql = require('mysql');
let connections = require('./DatabaseConnection.js');

module.exports = {

    addXP: addXP,
    levelUpServer: levelUpServer,
    levelUpUser: callbackFun,
    getLevel: fetchLevelAndXP
};

const con = connections;


function addXP(xpIncrement, memberID) {
    let sqlQueryString = "UPDATE discord_members SET experience_points=experience_points + " + xpIncrement + " WHERE member_id = '" + memberID + "';";
    !
        con.query(sqlQueryString, function (err, result) {
            if (err) {
                console.error()
            }
            console.log("updated xp");
        });
}


function levelUpServer(memberArray) { //TODO change this to use a single SQL query rather than multiple
    console.log("Levelling up server");
    for (let i = 0; i < memberArray.length; i++) {
        console.log("Levelling up: ", memberArray[i].id);
        try {
            callbackFun(memberArray[i].id)
        }
        catch (e) {
            console.log("&e&");
            console.error(e)
        }
    }
}

function sendLevelUpMessage(member, level) {
    member.guild.channels.find(channel => channel.name === "level-ups").send(member + "Has levelled up to level: " + level + " Well done!")
}

function checkLevels(currentLevel, currentXP) { //TODO update this to use a sensible levelling algorithm
    let newLevels = currentLevel + parseInt(currentXP / 100);
    let newXP = currentXP % 100;
    if (newLevels === currentLevel) {
        return null
    }
    return {xp: newXP, level: newLevels}
}

function checkAndLevelUpMember(memberId, currentLevel, currentXP) {
    let newLevelXp = checkLevels(currentLevel, currentXP);
    if (newLevelXp) {
        setLevelAndXP(memberId, newLevelXp.level, newLevelXp.xp)
    }
}

function fetchLevelAndXP(memberID, callback) { //TODO create a similar function that doest it for the entire server
    console.log("fetchLevelAndXP started " + memberID);
    let sqlQueryString = "SELECT level,experience_points FROm discord_members WHERE member_id='" + memberID + "';";
    con.query(sqlQueryString, function (err, result) {
        if (err) {
            console.error(err)
        }
        console.log("fetchLevelAndXP started callback started");
        console.log("fetching level and xp: ", result);
        callback(memberID, result[0].level, result[0].experience_points)
    });
}

function setLevelAndXP(memberID, newLevel, newXP) {
    let sqlQueryString = "UPDATE discord_members SET experience_points=" + newXP + ", level=" + newLevel + " WHERE member_id =" + memberID + " ;";
    return con.query(sqlQueryString, function (err, result) {
        if (err) {
            console.error(err)
        }
        console.log(memberID + " has been levelled up to " + newLevel);
    });
}

function callbackFun(memberID) {
    fetchLevelAndXP(memberID, checkAndLevelUpMember)
}



