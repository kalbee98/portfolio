<script>
import Config from "./../config.js";

export default {
  data(){
    return {
      /*
       * Todoデータ構造
       * 	{
       *		id: string(ID)
       *		task: string(タスク)
       *		limit: Date(期日)
       *		checked: boolean(チェック有無: 内部データ)
       *	}
       */
      todos: [],
      selected: null
    }
  },
  created(){
    console.log('_created');
    this.load();
  },
  mounted(){
    console.log('_mounted');
  },
  updated(){
    console.log('_updated');
  },
  destroyed(){
    console.log('_destroyed');
  },
  methods: {
    load(){
      console.log('_load');
      let todos = localStorage.getItem(Config.LOCAL_STORAGE_KEY);
      if(todos){
        todos = JSON.parse(todos);
        todos = todos.map((todo) => {
          return {
            id: todo.id,
            task: todo.task,
            limit: (todo.limit ? new Date(todo.limit) : undefined),
            checked: false
          };
        });
        this.todos = todos;
      }
    },
    save(){
      console.log('_save');
      const todos = this.todos.map((todo) => {
        return {
          id: todo.id,
          task: todo.task,
          limit: (todo.limit ? todo.limit: undefined)
        };
      });
      localStorage.setItem(Config.LOCAL_STORAGE_KEY, JSON.stringify(todos));
    },
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
    register(event){
      console.log('_register: ');
      const text = event.target.value || '';
      if(text.trim().legnth === 0){
        return;
      }
      this.todos.push({
        id: this.maxId + 1,
        task: text,
        limit: new Date(new Date().getFullYear(), 
          Math.floor(Math.random() * 11), 
          Math.floor(Math.random() * 31))
      });
      event.target.value = '';
      this.save();
    },
    remove(event){
      console.log('_remove');
      this.todos = this.todos.filter((todo) => {
        return !todo.checked;
      });
      this.save();
    },
    select(event){
      console.log('_select');
      //todo: $(selector).is() 相当の操作?
      if(event.target.getAttribute('type') === 'checkbox'){
        return;
      }
      const id = event.currentTarget.dataset.id;
      this.selected = id;
      this.todos.forEach((todo) => {
        todo.checked = (todo.id == id);
      });
    },
    clear(event){
      console.log('_clear');
    },
    search(event){
      console.log('_search');
    }
  },
  computed: {
    maxId(){
      console.log('_maxid');
      let max = 0;
      if(this.todos){
        this.todos.forEach((todo) => {
          max = Math.max(todo.id);
        });
      }
      return max;
    },
    checked(){
      console.log('_checked')
      const checked = this.todos.some((todo) => {
        return todo.checked;
      });
      return checked;
    },
    allChecked(){
      console.log('_allChecked');
      const all = this.todos.every((todo) => {
        return todo.checked;
      });
      console.log('all', all);
      return all;
    }
  },
  watch: {
    todos(){
      console.log('watch:todos', arguments);
    },
    selected(){
      console.log('watch:selected', this.selected);
    }
  }
};
</script>

<template>
  <div>
    <div id="todo-list">
      <div id="menu">
        <input id="select-all" type="button" value="選択" />
        <input id="done" type="button" value="完了" v-on:click="remove" v-bind:disabled="!checked" />
        <input id="search" type="text" v-on:input="search" placeholder="検索" />
      </div>
      <div id="add">
        <input id="edit" type="text" v-on:keypress.enter="register" placeholder="タスクを入力" />
      </div>
      <div id="todos">
        <div class="table">
          <div class="row" v-bind:class="{selected: todo.id == selected}" v-for="todo in todos" v-on:click="select" v-bind:data-id="todo.id" v-bind:key="todo.id">
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
