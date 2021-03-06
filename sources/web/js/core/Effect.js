/**
 * Effect represents visual, sound etc effects
 */

Effect.prototype = new VisualEntity();
Effect.prototype.constructor = Effect;

/**
 * @constructor
 */
function Effect() {
	Effect.parent.constructor.call(this);
};

Effect.inheritsFrom(VisualEntity);
Effect.prototype.className = "Effect";

Effect.prototype.createInstance = function(params) {
	var entity = new Effect();
	entity.init(params);
	return entity;
};

entityFactory.addClass(Effect);

Effect.prototype.init = function(params) {
	var description = {};
	if (params.type != null)
		description = Account.instance.descriptionsData[params.type];
	Effect.parent.init.call(this, $.extend(params, description));
	this.guis = new Array();
};

Effect.prototype.createVisual = function() {
};

//
//	Plays an effect, and destroys it`s result data after lifetime ended
//
Effect.prototype.play = function(position, callback) {
	var that = this;
	if (position) {
		that.x = position.x;
		that.y = position.y;
	}

	$['each'](that.params.visuals, function(id, value) {
		value.parent = that.guiParent;

		var gui = guiFactory.createObject(value['class'], $['extend'](
				value, position));
		gui.clampByParentViewport();
		that.guis.push(gui);
		$['each'](gui.animations, function(id, anim) {
			gui.playAnimation(id, that.params.lifeTime, false, true);
		});
	});

	that.setTimeout(function() {
		that.destroy();
		if (callback) callback();
	}, this.params.lifeTime);
};

Effect.prototype.destroy = function() {
	var that = this;
	Effect.parent.destroy.call(this);
	$['each'](that.guis, function(id, value) {
		value.remove();
		delete value;
	});
	that.guis = new Array();
};
