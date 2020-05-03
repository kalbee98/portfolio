'use strict';

function Todo($target){
	this.KEY = 'TODOS';
	/*
	 * Todoデータ構造
	 * 	{
	 *		id: string(ID)
	 *		task: string(タスク)
	 *		limit: string(期日)
	 *		hide: boolean(表示有無/内部データ)
	 *	}
	 */
	this.todos = [];
	this.$target = $target;
	this.maxId = 0;
	this.selected = null;
}

Todo.prototype = {
	initialize: function(){
		//イベント処理
		this.$target.on('click', '#select-all', $.proxy(this._toggle, this));
		this.$target.on('keypress', '#add input[type=text]', $.proxy(this._register, this));
		this.$target.on('blur', '#add input[type=text]', $.proxy(this._clear, this));
		this.$target.on('click', '#done', $.proxy(this._remove, this));
		this.$target.on('click', 'div.row', $.proxy(this._select, this));
		this.$target.on('focus', '#search', $.proxy(this.searcher._start, this));
		this.$target.on('blur', '#search', $.proxy(this.searcher._stop, this));
		this.load();
		this.show();
	},
	/** データ読み込み(localStorage) */
	load: function(){
		try{
			localStorage;
		}catch(e){
			return;	//not supported!
		}
		var todos = localStorage.getItem(this.KEY);
		if(todos){
			this.todos = JSON.parse(todos);
			var maxId = 0;
			$.each(this.todos, function(i, n){
				maxId = Math.max(maxId, n.id);
			});
			this.maxId = maxId;
		}
	},
	/** データ保存(localStoarge) */
	save: function(){
		try{
			localStorage;
		}catch(e){
			return;	//not supported!
		}
		var todos = $.map(this.todos, function(n, i){
			return {
				id: n.id,
				task: n.task,
				limit: (n.limit ? n.limit : undefined)
			};
		});
		localStorage.setItem(this.KEY, JSON.stringify(todos));
	},
	/** タスク一覧の表示 */
	show: function(){
		var todos = this.todos.sort(function(a, b){
			//期限の早い順
			if((a.limit != null && b.limit == null) || a.limit < b.limit){
				return -1;
			}else if((a.limit == null && b.limit != null) || a.limit > b.limit){
				return 1;
			}
			//文字コード順(大文字小文字区別しない))
			var taskA = a.task.toUpperCase();
			var taskB = b.task.toUpperCase();
			if(taskA < taskB){
				return -1;
			}else if(taskA > taskB){
				return 1;
			}
			//その他
			return 0;
		});
		var str = '';
		str = str + '<div class="table">'
		$.each(this.todos, function(i, n){
			var hide = (n.hide ? ' hide' : '');
			str = str + '<div class="row' + hide + '" data-id="' + n.id + '">';
			str = str + '<div class="cell check"><input type="checkbox" /></div>';
			str = str + '<div class="cell task">' + escapeHtml(n.task) + '</div>';
			str = str + '<div class="cell limit">' + escapeHtml(n.limit) + '</div>';
			str = str + '</div>';
		});
		str = str + '</div>'
		$('#todos', this.$target).html(str);
	},
	/** id採番 */
	seq: function(){
		this.maxId++;
		return this.maxId;
	},
	/** 全選択 or 解除 */
	_toggle: function(event){
		var $checkbox = $('.check input[type=checkbox]', this.$target);
		if($checkbox.filter(':not(:checked)').length > 0){
			$checkbox.prop('checked', true);
			$(event.target).attr('value', '解除');
		} else {
			$checkbox.prop('checked', false);
			$(event.target).attr('value', '選択');
		}
	},
	/** タスク追加 */
	_register: function(event){
		// IME 非動作中に Enter 入力を判定するため keypress イベントを利用
		// keydown, keyup は IME 動作中でも Enter が発火する
		// isComposing で IME 判定が可能だがブラウザ間で動作が異なる
		var key = event.key;
		var text = event.target.value || '';
		if(key != 'Enter' || text.trim().length === 0){
			return;
		}
		var texts = splitText(text);
		if(this.selected){
			//update
			var id = this.selected;
			$.each(this.todos, function(i, n){
				if(n.id === id){
					n.task = texts[0];
					n.limit = texts[1];
					return false;
				}
			})
		}else{
			//insert
			this.todos.push({
				id: this.seq(),
				task: texts[0],
				limit: texts[1]
			});
		}
		event.target.value = '';
		this.save();
		this.show();
	},
	/** タスク削除 */
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
		this.selected = null;
		$('#add input[type=text]', this.$target).val('');
		this.save();
		this.show();
	},
	/** 行選択(更新用)) */
	_select: function(event){
		if($(event.target).is('input[type=checkbox]')){
			return;
		}
		var $row = $(event.currentTarget).closest('div.row');
		$row.siblings().removeClass('selected');
		$row.addClass('selected');
		$('.check input[type=checkbox]', this.$target).prop('checked', false);
		$('.check input[type=checkbox]', $row).prop('checked', true);

		var id = $row.data('id');
		this.selected = id;
		$.each(this.todos, function(i, n){
			if(n.id === id){
				var text = n.task;
				if(n.limit && n.limit.length > 0){
					text = text + ' ' + n.limit;
				}
				$('#add input[type=text]').val(text).focus();
				return false;
			}
		});
	},
	/** 行選択解除 */
	_clear: function(event){
		//fixme: onblur(_clear) と click(_select) の順序に依存しないように
		if(this.selected){
			this.selected = null;
			$('div.row.selected', this.$target).removeClass('selected');
			$('#add input[type=text]', this.$target).val('');
		}
	},
	/** インクリメンタル検索 */
	searcher: (function(){
		//setInterval を適宜実行させるためクロージャ実装(onchange はタイミングが不適)
		var intervalId;
		var prev;
		return {
			_start: function(event){
				var $target = $(event.target);
				intervalId = setInterval($.proxy(function(){
					var query = $target.val().toUpperCase().trim();
					if(query === prev){
						return;
					}
					prev = query;
					$.each(this.todos, function(i, n){
						//query が空文字の場合表示
						n.hide = (n.task.toUpperCase().indexOf(query) == -1);
					})
					this.show();
				}, this), 200);
			},
			_stop: function(event){
				clearInterval(intervalId);
			}
		};
	})()
};

//utilities

/** xss 対策 */
function escapeHtml(str) {
	str = str || '';
	str = str.replace(/&/g, '&amp;');
	str = str.replace(/</g, '&lt;');
	str = str.replace(/>/g, '&gt;');
	str = str.replace(/"/g, '&quot;');
	str = str.replace(/'/g, '&#39;');
	return str;
}

/** タスクと日付のテキストを分離(日付パースは簡易実装)) */
function splitText(str) {
	var pattern = /(\s|　)(\d{1,4}\/\d{1,2}\/\d{1,2})$/;
	var dateStr = str.match(pattern);
	if(dateStr == null){
		return [str, null];
	}

	//Todo: 日付の妥当性チェック
	var pair = [];
	pair.push(str.replace(pattern, ''));
	var ymd = dateStr[2].trim().split('/');
	pair.push(ymd[0] + '/' + ymd[1] + '/' + ymd[2]);
	return pair;
}
