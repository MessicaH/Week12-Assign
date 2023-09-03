// "Charclara" = Character Class and Race, "Charname" = Character Name

class Group {
    constructor(charname) {
        this.charname = charname;
        this.player = [];
    }

    addPlayer(charname,charclara) {
        // interior element that is part of each new Group element added
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
    //static url = "https://64f42331932537f4051a219d.mockapi.io";
    fetch();

    static getAllGroups() {
        return $.get(this.url);
        // return all Groups from MockAPI url
    }

    static getGroup(id) {
        return $.get(this.url + `/${id}`);
        // Read Groups available or listed (C *R* UD)
    }

    static createGroup(Group) {
        // Takes the "class Group" array created
        return $.post(this.url, Group)
        // Create new Group item entry (*C* RUD)
    }

    static updateGroup(Group) {
        return $.ajax({
            url: this.url + `/${Group._id}`,
            // "._id" to update Group entry within database
            dataType : "json",
            // what we should be sending or updating it as
            data: JSON.stringify(Group),
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
    static Groups;
    // all Groups within this class

    static getAllGroups() {
        // calls from GroupService method and inserts for DOM usage
        GroupService.getAllGroups().then(Groups => this.render(Groups));
        // ".then" is Promise for when call completed
    }

    static deleteGroup(id) {
        GroupService.deleteGroup(id)
            .then(() => {
                return GroupService.getAllGroups();
                // Once a Group is deleted successfully, we want to retrieve all other remaining Groups and re-render them
            })
            .then((Groups) => this.render(Groups));
        }
    
    static addPlayer(id) {
        for (let Group of this.Groups) {
            if (Group._id == id) {
                Group.Players.push(new Player($(`#${Group._id}-Player-charname`).val(), $(`#${Group._id}-Player-charclara`).val()));
                GroupService.updateGroup(Group)
                    // Taking new Group and Players to update arrays via API with new data
                    .then(() => {
                        return GroupService.getAllGroups();
                    })
                    .then((Groups) => this.render(Groups));
                }
            }
        }
    
    static deletePlayer(GroupId, PlayerId) {
        for (let Group of this.Groups) {
            if (Group._id == GroupId) {
                for (let Player of Group.Players) {
                    if (Player._id == PlayerId) {
                        Group.Players.splice(Group.Players.indexOf(Player), 1);
                        GroupService.updateGroup(Group)
                        .then(() => {
                            return GroupService.getAllGroups();
                        })
                        .then((Groups) => this.render(Groups));
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
            .then((Groups) => this.render(Groups));
    }

    static render(Groups) {
        // Take a list of Groups and render to DOM (HTML) visually
        this.Groups = Groups;
        $("#app").empty();
        //Div for the app HTML to be rendered within, cleared out each time something is rendered
        for (let Group of Groups) {
            // Loop through each instance of Group added, rendering in Div for "app"
            $('#app').prepend(
                // Write HTML for each Group rendered
                `<div id="${Group._id}" class="card">
                    <div class="card-header">
                        <h2>${Group.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteGroup('${Group._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${Group._id}-Player-charname" class="form-control" 
                                    placeholder="Jackmerius Tacktheratrix, D'Glester Hardunkichud">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${Group._id}-Player-charclara" class="form-control" 
                                    placeholder="Half-Elf Bard, Dwarf Barbarian, etc.">                                
                                </div>
                            </div>
                            <button id="${Group._id}-new-Player" onclick="DOMManager.addPlayer('${Group._id}')" 
                            class="btn btn-primary form-control">Add Player</button>
                        </div>
                    </div>
                </div>
                <br>`
                // Each Group created ^^, now to add each Player inside each Group
            );
            for (let player of group.players) {
                $(`#${group._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${player._id}"><strong>Character Name: </strong> ${player.charname}</span>
                        <span id="name-${player._id}"><strong>Character Race & Class: </strong> ${player.charclara}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deletePlayer('${Group._id}','${player._id}')">
                        Delete Player</button>
                    </p>
                    `
                )
            }
        }
    }
    
}


$('#create-new-Group').click(() => {
    DOMManager.createGroup($('#new-Group-name').val());
    $('#new-Group-name').val('');
})

/// Code that will run for each action
DOMManager.getAllGroups();