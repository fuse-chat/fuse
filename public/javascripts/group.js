// client side
// group.js
// - handle create and removed groups
// - handle ui changes when groups are crated and removed

defines['groups-url-base'] = `/api/${defines.API_VERSION}/groups`;

/**
 * The group global namespace
 * @type {Object}
 */
const G = {};

/**
 * Create a group with the params
 * Use the opt_fn to handle failures such as creating a group with the same name
 */
G.createOnServer = function(params, opt_fn) {
    var defaultGroupParams = { name: '', description: '' };
    params = toolbelt.normalize(params, defaultGroupParams);
    $.post(defines['groups-url-base'], params, opt_fn || function(){});
};

G.getAllGroupsOnServer = function(fn) {
    $.get(defines['groups-url-base'], fn);
};

/**
 * Creates and returns a DOM node for a list item that
 * can be added to the groups list on the sidebar.
 * @param  {Object}   data
 * @return {HTMLElement}              
 */
G.makeGroupListItem = function(data) {
    var name = data.name;
    var messageCount = data.messages.length;
    var id = data.id;

    toolbelt.assert(!_.isEmpty(name), 'name should be non-empty string');
    
    var wrapperLi = document.createElement('li');
    var wrapperLink = document.createElement('a');
    var nameDiv = document.createElement('div');
    var numberDiv = document.createElement('div');

    wrapperLi.classList.add('fc-group-list-item');
    wrapperLink.classList.add('fc-group-list-item-link');
    nameDiv.classList.add('fc-group-list-item-name');
    numberDiv.classList.add('fc-group-list-item-number');

    wrapperLi.appendChild(nameDiv);
    wrapperLi.appendChild(numberDiv);
    wrapperLink.appendChild(wrapperLi);

    wrapperLi.dataset.name = name;
    wrapperLi.dataset.id = id;
    wrapperLink.href = `/group/${name}`;
    nameDiv.textContent = name;

    // TODO numberDiv, maybe an unread messages count

    return wrapperLink;
};

/**
 * Get the list of group names on the sidebar as a Set
 * @return {Set}
 */
G.queryGroupDataOnSidebar = function(field) {
    var groupList = document.querySelector('.fc-group-list');
    var groupListItems = _.toArray(groupList.querySelectorAll('.fc-group-list-item'));

    var names = new Set();

    groupListItems.forEach(function(item) {
        names.add(item.dataset[field]);
    });

    return names;
};

/**
 * Get the current selected group
 * @return {HTMLElement} the node that is selected
 */
G.queryGroupSelected = function() {
    var groupList = document.querySelector('.fc-group-list');
    var groupListItems = _.toArray(groupList.querySelectorAll('.fc-group-list-item'));

	var node = null;
    groupListItems.forEach(function(item) {
        if(item.dataset.selected === 'true'){
			node = item;
		}
    });

	return node;
};

/**
 * Adds the group named `name` to the sidebar list if it doesn't exist already
 * @return {HTMLElement} the node that was added or null
 */
G.addToSidebar = function(data) {
    var id = data.id;

    var groupList = document.querySelector('.fc-group-list');
    var currentNames = G.queryGroupDataOnSidebar('id');
    
    if (currentNames.has(id)) {
        return null;
    }

    var node = G.makeGroupListItem(data);
    groupList.appendChild(node);
    return node;
};

G.refreshGroupListNames = function() {
    G.getAllGroupsOnServer(function(arr) {
        arr.forEach(G.addToSidebar);
    });
};

// TODO:nishanths clean up into non globals
var createGroupModal = document.querySelector('.modal#fc-create-group');
var createGroupButton = createGroupModal.querySelector('.fc-create');

createGroupButton.addEventListener('click', function(e) {
    var name = createGroupModal.querySelector('input.fc-group-name').value;
    G.createOnServer({ name: name });
});


// handle newly created group events from the server
defines.socket.on(defines['socket-group-created'], function(data) {
    G.addToSidebar(data);
});

// handle group removed events from the server
defines.socket.on(defines['socket-group-removed'], function(data) {
    // TODO
    console.log(data);
});

G.start = function() {
    G.refreshGroupListNames();
};

G.start();
