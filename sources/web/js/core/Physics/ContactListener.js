
/**
 * Contact Listener - part of the Physics singleton to
 * listen and register contacts dynamics,
 */

var LOG_DEBUG = false;

/**
 * @constructor
 */
function ContactListener(contactProcessor) {
	this.contactProcessor = contactProcessor;
	if (!contactProcessor)
		console.log("No contact processor were added! Will be defaults");
	world = Physics.getWorld();
	this.activeContacts = new Array();
	this.activeContactIDs = new Array();
//	this.contactShape1 = null;
//	this.contactShape2 = null;	
//	this.currentContact = null;
	this.events = new Array();
};

//
//	Returns list of contacts and contacted entities id
//
ContactListener.prototype.getContacts = function() {
	var contact = world.m_contactList;
	var contactIDs = new Array();
	var contacts = new Array();
	for (; contact != null; contact = contact['m_next']) {
		contactIDs.push(contact.m_shape1.m_body.m_userData.id + ':'
				+ contact.m_shape2.m_body.m_userData.id);
		contacts.push(contact);
	}
	return {
		"iDs" : contactIDs,
		"contacts" : contacts
	};
};

//
//	Main part of the listener
//
ContactListener.prototype.update = function() {
	var that = this;
	var contactList = this.getContacts();

	var newContactIDs = contactList["iDs"];
	var newContacts = contactList["contacts"];

	if (this.activeContactIDs && this.contactProcessor) {
		$['each'](newContactIDs, function(id, value) {
			if ($.inArray(value, that.activeContactIDs) == -1) {
				var type1 = newContacts[id].m_shape1.m_body.m_userData.params["type"];
				var type2 = newContacts[id].m_shape2.m_body.m_userData.params["type"];
//				that.contactShape1 = newContacts[id].m_shape1;
//				that.contactShape2 = newContacts[id].m_shape2;
//				that.currentContact = newContacts[id];
				var contact = newContacts[id];
				that.contactProcessor.processBegin(type1, type2, contact);								
			}
		});
		$['each'](that.activeContactIDs, function(id, value) {
			if ($.inArray(value, newContactIDs) == -1) {
				var type1 = that.activeContacts[id].m_shape1.m_body.m_userData.params["type"];
				var type2 = that.activeContacts[id].m_shape2.m_body.m_userData.params["type"];

//				that.contactShape1 = that.activeContacts[id].m_shape1;
//				that.contactShape2 = that.activeContacts[id].m_shape2;
//				that.currentContact = that.activeContacts[id];
				var contact = that.activeContacts[id];
				that.contactProcessor.processEnd(type1, type2, contact);
			}
		});
	}
	
	this.activeContactIDs = newContactIDs;
	this.activeContacts = newContacts;
};