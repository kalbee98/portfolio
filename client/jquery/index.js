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
	},{
		id: 3,
		task: '<b>xss</b>',
		limit: '2020/5/2'
	}, {
		id: 5,
		task: 'ほげふがぴよ'
	}];
	this.$target = $target;
}

Todo.prototype = {
	initialize: function(){
		this.show();
	},
	show: function(){
		var str = '';
		str = str + '<div class="table">'
		$.each(this.todos, function(i, n){
			str = str + '<div class="row">';
			str = str + '<div class="cell check"><input type="checkbox" /></div>';
			str = str + '<div class="cell task">' + escapeHtml(n.task) + '</div>';
			str = str + '<div class="cell limit">' + escapeHtml(n.limit) + '</div>';
			str = str + '</div>';
		});
		str = str + '</div>'
		$('#todos', this.$target).html(str);
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

//utilities
function escapeHtml(str) {
	str = str || '';
	str = str.replace(/&/g, '&amp;');
	str = str.replace(/</g, '&lt;');
	str = str.replace(/>/g, '&gt;');
	str = str.replace(/"/g, '&quot;');
	str = str.replace(/'/g, '&#39;');
	return str;
}
