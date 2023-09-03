// "Charclara" = Character Class and Race, "Charname" = Character Name

class Group {
    constructor(name) {
        this.name = name;
        this.player = [];
    }

    addPlayer(charname,charclara) {
        // interior element that is part of each new group element added
        this.players.push(new Player (charname,charclara));
    }
}

class Player {
    constructor (charname, charclara) {
        this.charname = charname;
        this.charclara = charclara;
    }
}

class GroupService {
    static url = "https://64f42331932537f4051a219d.mockapi.io";
    // fetch();

    static getAllGroups() {
        return $.get(this.url);
        // return all groups from MockAPI url
    }

    static getGroup(id) {
        return $.get(this.url + `/${id}`);
        // Read groups available or listed (C *R* UD)
    }

    static createGroup(group) {
        // Takes the "class group" array created
        return $.post(this.url, group)
        // Create new group item entry (*C* RUD)
    }

    static updateGroup(group) {
        return $.ajax({
            url: this.url + `/${group._id}`,
            // "._id" to update group entry within database
            dataType : "json",
            // what we should be sending or updating it as
            data: JSON.stringify(group),
            // how to format the data being sent
            contentType: "application/JSON",
            type: "PUT",
            // what type of HTTP method/action being taken
        });
    }

    static deleteGroup(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: "DELETE",
        });
    }
}


// DOM Management area

class DOMManager {
    static groups;
    // all groups within this class

    static getAllGroups() {
        // calls from groupService method and inserts for DOM usage
        GroupService.getAllGroups().then(groups => this.render(groups));
        // ".then" is Promise for when call completed
    }

    static deleteGroup(id) {
        GroupService.deleteGroup(id)
            .then(() => {
                return GroupService.getAllGroups();
                // Once a group is deleted successfully, we want to retrieve all other remaining groups and re-render them
            })
            .then((groups) => this.render(groups));
        }
    
    static addPlayer(id) {
        for (let group of this.groups) {
            if (group._id == group) {
                group.players.push(new Player($(`#${group._id}-player-charname`).val(), 
                $(`#${group._id}-player-charclara`).val()));
                GroupService.updategroup(group)
                    // Taking new group and Players to update arrays via API with new data
                    .then(() => {
                        return GroupService.getAllGroups();
                    })
                    .then((groups) => this.render(groups));
                }
            }
        }
    
    static deletePlayer(groupId, playerId) {
        for (let group of this.groups) {
            if (group._id == groupId) {
                for (let player of group.players) {
                    if (player._id == playerId) {
                        group.players.splice(group.players.indexOf(player), 1);
                        GroupService.updateGroup(group)
                        .then(() => {
                            return GroupService.getAllGroups();
                        })
                        .then((groups) => this.render(groups));
                    }
                }
            }
        }
    }

    static createGroup(name) {
        GroupService.createGroup(new Group(name))
            .then(() => {
                return GroupService.getAllGroups();
            })
            .then((groups) => this.render(groups));
    }

    static render(groups) {
        // Take a list of groups and render to DOM (HTML) visually
        this.groups = groups;
        $("#app").empty();
        //Div for the app HTML to be rendered within, cleared out each time something is rendered
        for (let group of groups) {
            // Loop through each instance of group added, rendering in Div for "app"
            $('#app').prepend(
                // Write HTML for each group rendered
                `<div id="${group._id}" class="card">
                    <div class="card-header">
                        <h2>${group.name}</h2>
                        <button class="btn btn-delete" onclick="DOMManager.deletegroup('${group._id}')">Delete group</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${group._id}-player-charname" class="form-control" 
                                    placeholder="Jackmerius Tacktheratrix">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${group._id}-player-charclara" class="form-control" 
                                    placeholder="Dwarf Barbarian, etc.">                                
                                </div>
                            </div>
                            <button id="${group._id}-new-player" onclick="DOMManager.addPlayer('${group._id}')" 
                            class="btn btn-create form-control">Add Player<i class="bi bi-person-plus"></i></button>
                        </div>
                    </div>
                </div>
                <br>`
                // Each group created ^^, now to add each Player inside each group
            );
            for (let player of group.players) {
                $(`#${group._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${player._id}"><strong>Character Name: </strong> ${player.charname}</span>
                        <span id="name-${player._id}"><strong>Character Race & Class: </strong> ${player.charclara}</span>
                        <button class="btn btn-delete" onclick="DOMManager.deletePlayer('${group._id}','${player._id}')">
                        Remove Player<i class="bi bi-person-dash"></i></button>
                    </p>
                    `
                )
            }
        }
    }
    
}


$('#create-new-group').click(() => {
    DOMManager.createGroup($('#new-group-name').val());
    $('#new-group-name').val('');
})

/// Code that will run for each action
DOMManager.getAllGroups();