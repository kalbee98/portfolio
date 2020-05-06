<script>
import Config from "./../config.js";

export default {
  data(){
    return {
      /**
       * Todoデータ構造
       * 	{
       *		id: string(ID)
       *		task: string(タスク)
       *		limit: Date(期日)
       *		checked: boolean(チェック有無: 内部データ)
       *    visible: boolean(インクリメンタル検索結果: 内部データ)
       *	}
       */
      todos: [],
      /** 選択行(ID) */
      selected: null
    }
  },
  computed: {
    sorted(){
      // sort() は破壊的操作のためスプレッド構文で複製
      return [...this.todos].sort((a, b) => {
        //期限の早い順(null は 期日があるタスクより後ろにするため null チェック))
        if((a.limit != null && b.limit == null) || (a.limit && a.limit < b.limit)){
          return -1;
        }else if((a.limit == null && b.limit != null) || (b.limit && a.limit > b.limit)){
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
    },
    maxId(){
      let max = 0;
      if(this.todos){
        this.todos.forEach((todo) => {
          max = Math.max(todo.id);
        });
      }
      return max;
    },
    checked(){
      const checked = this.todos.some((todo) => {
        return todo.checked;
      });
      return checked;
    },
    allChecked(){
      const all = this.todos.every((todo) => {
        return todo.checked;
      });
      return all;
    }
  },
  created(){
    this.load();
  },
  methods: {
    /** データ読み込み(localStorage) */
    load(){
      let todos = localStorage.getItem(Config.LOCAL_STORAGE_KEY);
      if(todos){
        todos = JSON.parse(todos);
        todos = todos.map((todo) => {
          return {
            id: todo.id,
            task: todo.task,
            limit: (todo.limit ? new Date(todo.limit) : null),
            checked: false,
            visible: true
          };
        });
        this.todos = todos;
      }
    },
    /** データ保存(localStoarge) */
    save(){
      const todos = this.todos.map((todo) => {
        return {
          id: todo.id,
          task: todo.task,
          limit: (todo.limit ? todo.limit: undefined)
        };
      });
      localStorage.setItem(Config.LOCAL_STORAGE_KEY, JSON.stringify(todos));
    },
    /** タスク追加,更新 */
    register(event){
      let text = event.target.value || '';
      let limit;
      if(text.trim().legnth === 0){
        return;
      }
      [text, limit] = this.parseInputText(text);
      if(this.selected){
        //update
        const todo = this.todos.find((todo) => {
          return todo.id == this.selected;
        })
        todo.task = text;
        todo.limit = limit;
        todo.checked = false;
        this.selected = null;
      }else{
        //insert
        this.todos.push({
          id: this.maxId + 1,
          task: text,
          limit: limit,
          checked: false,
          visible: true
        });
      }
      event.target.value = '';
      this.save();
    },
    /** タスク削除 */
    remove(event){
      this.todos = this.todos.filter((todo) => {
        return !todo.checked;
      });
      this.save();
    },
    /** 全選択 or 解除 */
    toggle(event){
      const mode = !this.allChecked;
      this.todos.forEach((todo) => {
        todo.checked = mode;
      })
    },
    /** 行選択(更新用)) */
    select(event){
      //todo: $(selector).is() 相当の操作?
      if(event.target.getAttribute('type') === 'checkbox'){
        return;
      }
      const id = event.currentTarget.dataset.id;
      this.selected = id;
      this.todos.forEach((todo) => {
        if(todo.id == id){
          todo.checked = true;
          this.$refs.input.value = todo.task + ' ' + this.formatDate(todo.limit);
          this.$refs.input.focus();
        }else{
          todo.checked = false;
        }
      });
    },
    /** 行選択解除 */
    clear(event){
      if(this.selected){
        this.selected = null;
        this.$refs.input.value = '';
      }
    },
    /** インクリメンタル検索 */
    search(event){
      this.todos.forEach((todo) => {
        todo.visible = todo.task.includes(event.target.value);
      });
    },
    /** 日付フォーマット */
    formatDate(date){
      let arr = [];
      if(date){
        arr.push(date.getFullYear());
        arr.push('/');
        arr.push(date.getMonth() + 1);
        arr.push('/');
        arr.push(date.getDate());
      }
      return arr.join('');
    },
    /** 入力タスク解析(yyyy/MM/dd を期限(limit)として入力から切り出す) */
    parseInputText(text){
      const str = ' ' + text + ' ';
      const regexp = /((\s|　)+\d{1,4}\/\d{1,2}\/\d{1,2}(\s|　)+)/g;

      //日付表現のチェック
      const dateStrs = str.match(regexp);
      if(dateStrs == null){
        return [text, null];
      }

      const index = dateStrs.length - 1;
      const [y, m, d] = dateStrs[index].trim().split('/');
      const limit = new Date(y, m - 1, d);

      return [str.replace(regexp, ' ').trim(), limit];
    }
  }
};
</script>

<template>
  <div>
    <div id="todo-list">
      <div id="menu">
        <input id="select-all" type="button" v-on:click="toggle" v-bind:value="allChecked ? '解除' : '選択'" />
        <input id="done" type="button" value="完了" v-on:click="remove" v-bind:disabled="!checked" />
        <input id="search" type="text" v-on:input="search" placeholder="検索" />
      </div>
      <div id="add">
        <input id="edit" type="text" ref="input" v-on:keypress.enter="register" v-on:blur="clear" placeholder="タスクを入力" />
      </div>
      <div id="todos">
        <div class="table">
          <div class="row" v-bind:class="{selected: todo.id == selected}" 
              v-for="todo in sorted" v-bind:key="todo.id" v-show="todo.visible"
              v-on:click="select" v-bind:data-id="todo.id">
            <div class="cell check">
              <input type="checkbox" v-model="todo.checked" />
            </div>
            <div class="cell task">
              {{todo.task}}
            </div>
            <div class="cell limit">
              {{formatDate(todo.limit)}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
#header {
	text-align: center;
}

#todo-list { 
	max-width: 640px;
	margin : auto;
	border: 1px solid #CACACA;
	border-radius: 10px 10px 10px 10px;
}

#menu {
  padding: 10px 10px 0 10px;
  
  input[type=button] {
    height: 24px;
    border: 1px solid #CACACA;
    border-radius: 5px 5px 5px 5px;
    cursor: pointer;
  }

  input[type=text] {
    height: 24px;
    border: 1px solid #CACACA;
    border-radius: 5px 5px 5px 5px;
    padding: 0 5px 0 5px;
    float: right;
  }
}


#add {
	height: 50px;
  padding: 10px 10px 10px 10px;

  input[type=text] {
    font-size: 16px;
    width: 100%;
    height: 30px;
    border-radius: 8px 8px 8px 8px;
    padding: 0 10px 0 10px;
  }
}

#todos {
  /* 角丸対応 */
  .table {
    border-radius: 0 0 8px 8px;
  }
  .row:last-child {
    border-radius: 0 0 8px 8px;

    .cell:first-child {
      border-radius: 0 0 0 8px;
    }
    .cell:last-child {
      border-radius: 0 0 8px 0;
    }
  }

  .table {
    width: 100%;
    background-color: #F9F9F9;
  }
  .row {
    height: 33px;
  }
  .row:hover {
    background-color: #E8EEF7;
  }
  .row.selected {
    background-color: #FFFFCC;

    .task{
      text-decoration: underline;
    }
  }
  .cell {
    border-top: 1px solid #CACACA;
    vertical-align: middle;
  }
  .check {
    width: 30px;
    padding: 0 10px 0 10px;
  }
  input[type=checkbox]{
    cursor: pointer;
  }
  .task {
    font-size: 16px;
    color: #575757;
    width: auto;
  }
  .limit {
    font-size: 15px;
    color: #878787;
    width: 100px;
    text-align: right;
    padding: 0 10px 0 10px;
  }
}

</style>
