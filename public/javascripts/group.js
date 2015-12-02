// client side
// group.js
// - handle create and removed groups
// - handle ui changes when groups are crated and removed

defines['groups-url-base'] = `/api/${defines.API_VERSION}/groups`;
defines['single-group-url-base'] = `/group`;

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
    var defaultGroupParams = { name: '', description: '', position: null };
    params = toolbelt.normalize(params, defaultGroupParams);
    $.post(defines['groups-url-base'], params, opt_fn || function(res){
      G.addAndSetGroupAsSelected(res);
    });
};

G.getAllGroupsOnServer = function(fn) {
    $.get(defines['groups-url-base'], fn);
};

/* This function is not used. Could be used in the future. */
G.addAndSetGroupAsSelected = function(data) {
  G.addToSidebar(data);
  G.setGroupAsSelected(data.name);
};


/*
 * Helper function. Returns the outer html of a jquery object
 * @param {JQUERY Object} jq_obj
 * @return {String}
 */
getOuterHTML = function(jq_obj) {
   return jq_obj.clone().wrap('<div>').parent().html();
};

/*
 * Sets the inputted group as the selected group.
 * @param {String} name
 */
G.setGroupAsSelected = function(name) {
  $.get(defines['single-group-url-base'] + '/' + name, function(data) {
    var currentGroupSelected = $('.fc-group-list-item[data-selected="true"]');
    var currentName = currentGroupSelected.data('name');
    currentGroupSelected.replaceWith(getOuterHTML($(data).find('[data-name="' + currentName + '"]').first()));
    $('[data-name="' + name + '"]').replaceWith(getOuterHTML($(data).find('[data-name="' + name + '"]')));
    $('#fc-messages').html($(data).find('#fc-messages').html());
    $('.jumbotron.group-info').html($(data).find('.jumbotron.group-info').html());
  });
};

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
    var position = data.position;
    var selected = data.selected;

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
    wrapperLi.dataset.position = JSON.stringify(position);
    if(selected === true) {
      wrapperLi.dataset.selected = selected;
    }
    wrapperLink.href = 'javascript:G.setGroupAsSelected("' + name + '")';
    nameDiv.textContent = name;

    // TODO numberDiv, maybe an unread messages count
    return wrapperLink;
};

/**
 * Creates and returns a DOM node for the fc-group-list
 * @param  {Array<Object>}  data
 * @return {HTMLElement}
 */

G.makeGroupList = function(data) {
  var wrapperUl = document.createElement('li');
  wrapperUl.classList.add('fc-group-list');
  data.forEach(function(group) {
    wrapperUl.appendChild(G.makeGroupListItem(group));
  });
  return wrapperUl;
};

/*
 * Updates the sidebar to contain the new groups
 * @param  {Array<Group>} groups
 */
G.updateSidebar = function(groups) {
    var selectedGroup = G.queryGroupSelected();
    // if selected group is not in the new list of groups, set a new group
    // as selected
    var selectedGroupInArray = groups.some(function(group) {
      if(group.name == selectedGroup.dataset.name) {
        group.selected = true;
        return true;
      }
      return false;
    });
    if(!selectedGroupInArray) {
      alert("We're sorry, the group you were viewing is no longer available :(");
      if(groups.length > 0) {
        groups[0].selected = true;
      }
    }

    // Now update the new group list.
    var groupList = document.querySelector('.fc-group-list');
    groupList.innerHTML = G.makeGroupList(groups).innerHTML;
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

// G.refreshGroupListNames = function() {
//     G.getAllGroupsOnServer(function(arr) {
//         arr.forEach(G.addToSidebar);
//     });
// };

// TODO:nishanths clean up into non globals
var createGroupModal = document.querySelector('.modal#fc-create-group');
var createGroupButton = createGroupModal.querySelector('.fc-create');

createGroupButton.addEventListener('click', function(e) {
    var name = createGroupModal.querySelector('input.fc-group-name').value;
    Geo.getCurrentPosition(function (position) {
      G.createOnServer({ name: name, position: position });
    });
});

// handle newly created group events from the server
defines.socket.on(defines['socket-group-created'], function(data) {
  Geo.groupWithinDistance(data, function(isWithinDistance) {
    if(isWithinDistance) {
      G.addToSidebar(data);
    }
  });
});

// handle group removed events from the server
defines.socket.on(defines['socket-group-removed'], function(data) {
    // TODO
    console.log('TODO: group removed', data);
});

window.addEventListener('load', function() {
  Geo.updateGroupsOnStartup();
});

