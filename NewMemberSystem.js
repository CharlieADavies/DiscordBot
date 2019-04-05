let mysql = require('mysql');


module.exports = {
    addNewMemberToDB: addNewMemberToDB,
    ConvertNewMembsToMembers: updateNewMembToMemb,
};

const con = require('./DatabaseConnection.js');

function addNewMemberToDB(member_id, username) {
    let sqlQueryString = "INSERT INTO discord_members (member_id, username, member_new_member) VALUES ('" + member_id + "', '" + username + "', 'New Member')";
    con.connect(function (err) {
        if (err) {
            console.error(err)
        }
        console.log("Connected!");
        con.query(sqlQueryString, function (err) {
            if (err) {
                console.error(err)
            }
            console.log("1 record inserted");
        });

    });
}

function getNewMembersToUpdate(guild, callback) {
    let sqlQueryString = "SELECT member_id FROM discord_members WHERE  member_new_member='New Member' AND joined_at < CURRENT_TIMESTAMP - INTERVAL 10 DAY";
    con.query(sqlQueryString, function (err, result) {
        if (err) {
            console.error()
        }
        console.log("Result", result);
        return callback(guild, result)
    });

}

function updateNewMembToMemb(guild) {
    getNewMembersToUpdate(guild, updateDiscordRoles);
    updateMembersInDb()
}

function updateMembersInDb() { //Updates the DB table to set roles of old enough members to "Member"
    let sqlQueryString = "UPDATE discord_members SET member_new_member= 'Member' WHERE  member_new_member='New Member' AND joined_at < CURRENT_TIMESTAMP - INTERVAL 10 DAY";
    con.query(sqlQueryString, function (err) {
        if (err) {
            console.error()
        }
        console.log("Entries updated")
    });
}

function updateDiscordRoles(guild, memberIDs) { //TODO refactor
    console.log("memberIDs", memberIDs);
    for (let i in memberIDs) {
        // noinspection JSUnfilteredForInLoop
        try {


            let memberID = memberIDs[i].member_id;
            console.log(guild.members.keyArray());
            guild.members.get(memberID).addRole(guild.roles.find(role => role.name === "Member")).catch(console.error);
            guild.members.get(memberID).removeRole(guild.roles.find(role => role.name === "New Member")).catch(console.error);
        } catch (e) {
            console.log("f", e)
        }
    }
}