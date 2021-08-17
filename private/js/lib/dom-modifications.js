(function(htmlElementPrototype){
	htmlElementPrototype.isHidden = function(){
		return this.offsetWidth === 0 && this.offsetHeight === 0;
	};

	htmlElementPrototype.isVisible = function(){
		return !this.isHidden();
	};
	
	htmlElementPrototype.show = function(display = 'block'){
		this.style.display = display;
	};

	htmlElementPrototype.hide = function(){
		this.style.display = 'none';
	};

	htmlElementPrototype.hasClass = function(className){
		let match = this.className.match(new RegExp('(?:^| )'+className+'(?:$| )'));
		return match? true:false;
	};

	htmlElementPrototype.onChangeClass = function(callback){
		if (this._csb) {
			this._csb.push(callback);
		} else {
			this._csb = [callback];
		}
	};

	htmlElementPrototype.addClass = function(className){
		if (!this.hasClass(className)) {
			if (this.className.length == 0) {
				this.className = className;
			} else {
				this.className += ' '+className;
			}
			this._csb?.forEach(i=>i(this, className, true));
		}
	};

	htmlElementPrototype.removeClass = function(className){
		let newClassName = this.className
			.split(' ')
			.filter(cls => cls != className)
			.join(' ');

		if (newClassName != this.className) {
			this.className = newClassName;
			this._csb?.forEach(i=>i(this, className, false));
		}
	};

	htmlElementPrototype.toggleClass = function(className, value = !this.hasClass(className)){
		if (value) {
			this.addClass(className);
		} else {
			this.removeClass(className);
		}
	};

	htmlElementPrototype.remove = function() {
		this.parentNode.removeChild(this);
	};

	htmlElementPrototype.previousSiblings = function() {
		let element = this;
		let result = [];
		while (element = element.previousElementSibling)
			result.push(element);
		return result;
	};

	htmlElementPrototype.nextSiblings = function() {
		let element = this;
		let result = [];
		while (element = element.nextElementSibling)
			result.push(element);
		return result;
	};

	htmlElementPrototype.closest = function(selector) {
		if (this == document.body){
			return undefined;
		} else {
			let parent = this.parentNode;
			return parent.matches(selector)? parent : parent.closest(selector);
		}
	};

	htmlElementPrototype.clear = function() {
		while (this.firstChild){ 
			this.removeChild(this.firstChild);
		}
	};

})(HTMLElement.prototype);


(function(arrayPrototype){
	arrayPrototype.peek = function(fun) {
		this.forEach(fun);
		return this;
	};

})(Array.prototype);