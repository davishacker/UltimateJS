/*
 * BaseState - abstract class - current state of the game.
 * Loads GUI preset and operate with GUI elements.
 * Preloads any required resources
 */

BaseState.prototype = new Entity();
BaseState.prototype.constructor = BaseState;

/**
 * @constructor
 */
function BaseState() {
	BaseState.parent.constructor.call(this);
};

BaseState.inheritsFrom(Entity);

BaseState.prototype.init = function(params) {
	BaseState.parent.init.call(this, params);
	this.guiContainer = new GuiContainer();
	this.guiContainer.init();
	this.guiContainer.resize();
};

BaseState.prototype.destroy = function() {
	BaseState.parent.destroy.call(this);
	this.guiContainer.clear();
};

BaseState.prototype.addGui = function(entity, name) {
	this.guiContainer.addGui(entity, name);
};
BaseState.prototype.removeGui = function(entity) {
	this.guiContainer.removeGui(entity);
};
BaseState.prototype.getGui = function(name) {
	return this.guiContainer.getGui(name);
};

BaseState.prototype.resize = function() {
	this.guiContainer.resize();
};

// Activate will either init object immediately or
// preload required resources and then call init
BaseState.prototype.activate = function(params) {
	this.id = params ? params['id'] : null;
	this.params = params;
	if (this.resources) {
		this.preload();
	} else {
		this.init(this.params);
	}
};

// Preloading of static resources - resources that
// should be upload before the use of the state
BaseState.prototype.preload = function() {
	// Loading JSONs first
	var totalToLoad = 0;
	var that = this;
	if (!this.resources)
		this.preloadComplete();

	
	if (this.resources.json) {
		$['each'](this.resources.json, function(key, val) {
			totalToLoad++;
			$['getJSON'](key, function(data) {
				that.resources.json[key] = data;
			}).error(function() {
				assert(false, "error reading JSON " + key);
			}).complete(function() {
				totalToLoad--;
				if (totalToLoad <= 0)
					that.jsonPreloadComplete();
				
			});
		});
	} else {
		this.jsonPreloadComplete();
	}
};

BaseState.prototype.jsonPreloadComplete = function() {
	var that = this;
	if (this.resources.media) {
		var startTime = new Date();
		Resources.loadMedia(this.resources.media, function() {
			//console.log("Media loaded for %d ms", (new Date() - startTime));
			that.preloadComplete();
		}, this.preloadingCallback);
	} else {
		this.preloadComplete();
	}
};

BaseState.prototype.preloadComplete = function() {
	// loading complete, make initializing
	this.init(this.params);
};

BaseState.prototype.preloadJson = function(jsonToPreload) {
	if (!this.resources)
		this.resources = new Object();
	if (!this.resources.json)
		this.resources.json = new Object();
	if (typeof jsonToPreload === "string") {
		this.resources.json[jsonToPreload] = null;
	} else if (typeof jsonToPreload === "array") {
		$['each'](this.resources.json, function(key, val) {
			this.resources.json[val] = null;
		});
	} else {
		console.error("Invalid argument for preloadJson: should be array of json urls or single url.");
	}
	//this.jsonPreloadComplete();
};

BaseState.prototype.preloadMedia = function(mediaToPreload, callback) {
	if (!this.resources)
		this.resources = new Object();
	if (!this.resources.media)
		this.resources.media = new Array();
	
	this.preloadingCallback = callback;

	// if (typeof mediaToPreload === "array") {
	if (mediaToPreload instanceof Array) {
		// this.resources.media.concat(mediaToPreload);
		this.resources.media = mediaToPreload;
	} else {
		console.error("Invalid argument for preloadMedia: array of media urls.");
	}
};
