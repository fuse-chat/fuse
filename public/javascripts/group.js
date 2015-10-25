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
 */
G.createOnServer = function(params) {
    var defaultGroupParams = { name: '', description: '' };
    params = toolbelt.normalize(params, defaultGroupParams);
    $.post(defines['groups-url-base'], params);
};

/**
 * Creates and returns a DOM node for a list item that
 * can be added to the groups list on the sidebar.
 * @param  {!string} name         the name of the group
 * @param  {number} messageCount the unread count
 * @return {HTMLElement}              
 */
G.makeGroupListItem = function(name, messageCount) {
    toolbelt.assert(!_.isEmpty(name), 'name should be non-empty string');
    
    var wrapperLi = document.createElement('li');
    var wrapperLink = document.createElement('a');
    var nameDiv = document.createElement('div');
    var numberDiv = document.createElement('div');

    wrapperLi.classList.add('fc-group-list-item');
    wrapperLink.classList.add('.fc-group-list-item-link');
    nameDiv.classList.add('fc-group-list-item-name');
    numberDiv.classList.add('fc-group-list-item-number');

    wrapperLink.appendChild(nameDiv);
    wrapperLink.appendChild(numberDiv);
    wrapperLi.appendChild(wrapperLink);

    wrapperLink.href = `/group/${name}`;
    nameDiv.dataset.name = name;
    nameDiv.textContent = nameDiv.dataset.name;
    // TODO numberDiv

    return wrapperLi;
};

/**
 * Get the list of group names on the sidebar as a Set
 * @return {Set<string>}
 */
G.queryGroupNamesOnSidebar = function() {
    var groupList = document.querySelector('.fc-group-list');
    var groupListItems = _.toArray(groupList.querySelectorAll('.fc-group-list-item'));

    var names = new Set();

    groupListItems.forEach(function(item) {
        names.add(item.dataset.name);
    });

    return names;
};

/**
 * Adds the group named `name` to the sidebar list if it doesn't exist already
 * @param {string} name
 * @return {HTMLElement} the node that was added or null
 */
G.addToSidebar = function(name) {
    var groupList = document.querySelector('.fc-group-list');
    var currentNames = G.queryGroupNamesOnSidebar();
    
    if (currentNames.has(name)) {
        return null;
    }

    var node = G.makeGroupListItem(name);
    groupList.appendChild(node);
    return node;
};

// TODO:nishanths clean up into non globals
var createGroupModal = document.querySelector('.modal#fc-create-group');
var createGroupButton = createGroupModal.querySelector('.fc-create');

createGroupButton.addEventListener('click', function(e) {
    var name = createGroupModal.querySelector('input.fc-group-name').value;
    G.createOnServer({ name: name });
});


// handle newly created group events from the server
// data is a string of the new group's name
defines.socket.on(defines['socket-group-created'], function(name) {
    G.addToSidebar(name);
});

// handle group removed events from the server
defines.socket.on(defines['socket-group-removed'], function(data) {
    console.log(data);
});
