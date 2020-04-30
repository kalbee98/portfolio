'use strict';

function Todo($target){
	//Todo: localstorage
	this.todos = [{
		id: 1,
		task: 'html',
		limit: 'today'
	},{
		id: 2,
		task: 'javascript',
		limit: 'tomorrow'
	}];
	this.$target = $target;
}

Todo.prototype = {
	initialize: function(){
		this.show();
	},
	show: function(){
		console.log(this.$target.find('#todos'));
	},
	add: function(){
		console.log('add');
	},
	remove: function(){
		console.log('delete');
	},
	update: function(){
		console.log('update');
	},
	search: function(){
		console.log('search');
	}
}
