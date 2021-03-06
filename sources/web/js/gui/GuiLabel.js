/*
 * Label with text that can be aligned vertically and horizontally
 */

GuiLabel.prototype = new GuiElement();
GuiLabel.prototype.constructor = GuiLabel;

/**
 * @constructor
 */
function GuiLabel() {
	GuiLabel.parent.constructor.call(this);
}

GuiLabel.inheritsFrom(GuiElement);
GuiLabel.prototype.className = "GuiLabel";

GuiLabel.prototype.createInstance = function(params) {
	var entity = new GuiLabel();
	entity.initialize(params);
	return entity;
};

guiFactory.addClass(GuiLabel);

GuiLabel.prototype.initialize = function(params) {
	GuiLabel.parent.initialize.call(this, params);

	this.fontSize = params['fontSize'] ? params['fontSize'] : 20;
	this.change(params['text']);
	if (params['align']) {
		this.align(params['align'], params['verticalAlign']);
	}
	if (params['color']) {
		this.setColor(params['color']);
	}
};

GuiLabel.prototype.generate = function(src) {
	var id = this.id;
	this.rowId = this.id + "_row";
	this.cellId = this.id + "_cell";
	return "<div id='" + this.id + "' class='" + this.style + " unselectable'>"
			+ "<div id='" + this.rowId + "' style='display:table-row;'>"
			+ "<div id='" + this.cellId + "' style='display:table-cell;'>"
			+ src + "</div></div></div>";
};

GuiLabel.prototype.create = function(src) {
	GuiDiv.parent.create.call(this, src);
	$("#" + this.cellId)['css']("font-size", Math.floor(this.fontSize
			* Math.min(Screen.widthRatio(), Screen.heightRatio()))
			+ "px");

};

GuiLabel.prototype.change = function(src) {
	$("#" + this.cellId).text(src);
	$("#" + this.cellId)['css']("font-size", Math.floor(this.fontSize
			* Math.min(Screen.widthRatio(), Screen.heightRatio()))
			+ "px");
};

GuiLabel.prototype.append = function(src) {
	$("#" + this.cellId).append(src);
	this.resize();
};

GuiLabel.prototype.empty = function() {
	$("#" + this.cellId).empty();
	this.resize();
};

GuiLabel.prototype.setPosition = function(x, y) {
	GuiLabel.parent.setPosition.call(this, x, y);

};

GuiLabel.prototype.setRealSize = function(width, height) {
	GuiLabel.parent.setRealSize.call(this, width, height);

	var size = Screen.calcRealSize(width, height);
	$("#" + this.rowId)['css']("width", size.x);
	$("#" + this.rowId)['css']("height", size.y);
	$("#" + this.cellId)['css']("width", size.x);
	$("#" + this.cellId)['css']("height", size.y);

	$("#" + this.cellId)['css']("font-size", Math.floor(this.fontSize
			* Math.min(Screen.widthRatio(), Screen.heightRatio()))
			+ "px");
	// cssTransform($("#" + this.cellId), null, null, Screen.widthRatio(),
	// Screen.heightRatio());

};

GuiLabel.prototype.resize = function() {
	GuiLabel.parent.resize.call(this);
};

GuiLabel.prototype.setColor = function(color) {
	this.jObject['css']("color", color);
};

GuiLabel.prototype.align = function(alignH, alignV) {
	if (alignH) {
		$("#" + this.cellId)['css']("text-align", alignH);
	}
	if (alignV) {
		$("#" + this.cellId)['css']("vertical-align", alignV);
	}
};
