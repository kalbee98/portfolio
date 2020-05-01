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
	var maxId = 0;
	$.each(this.todos, function(i, n){
		maxId = Math.max(maxId, n.id);
	});
	this.maxId = maxId;
}

Todo.prototype = {
	initialize: function(){
		//イベント処理
		this.$target.on('click', '#select-all', $.proxy(this._toggle, this));
		this.$target.on('keyup', '#add input[type=text]', $.proxy(this._add, this));
		this.$target.on('click', '#done', $.proxy(this._remove, this));
		this.show();
	},
	show: function(){
		var str = '';
		str = str + '<div class="table">'
		$.each(this.todos, function(i, n){
			str = str + '<div class="row" data-id="' + n.id + '">';
			str = str + '<div class="cell check"><input type="checkbox" /></div>';
			str = str + '<div class="cell task">' + escapeHtml(n.task) + '</div>';
			str = str + '<div class="cell limit">' + escapeHtml(n.limit) + '</div>';
			str = str + '</div>';
		});
		str = str + '</div>'
		$('#todos', this.$target).html(str);
	},
	seq: function(){
		this.maxId++;
		return this.maxId;	
	},
	/* 全選択 or 解除 */
	_toggle: function(event){
		var $checkbox = $('.check input[type=checkbox]', this.$target);
		if($checkbox.filter(':not(:checked)').length > 0){
			$checkbox.prop('checked', true);
		} else {
			$checkbox.prop('checked', false);
		}
	},
	/* タスク追加 */
	_add: function(event){
		var key = event.key;
		var text = event.target.value || '';
		if(key != 'Enter' || text.length == 0){
			return;
		}
		//todo: date input
		this.todos.push({
			id: this.seq(),
			task: text
		});
		event.target.value = '';
		this.show();
	},
	/* タスク削除 */
	_remove: function(event){
		var $checked = $('.check input[type=checkbox]:checked', this.$target);
		var ids = $checked.map(function(i, n){
			return $(n).closest('div.row').data('id');
		}).toArray();
		this.todos = $.map(this.todos, function(n){
			if(ids.indexOf(n.id) === -1){
				return n;
			}
		});
		this.show();
	},
	update: function(){
		console.log('update');
		this.show();
	},
	_select: function(){

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
