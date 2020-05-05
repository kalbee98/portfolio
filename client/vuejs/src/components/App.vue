<script>
import Config from "./../config.js";
import Counter from "./Counter";

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
       *    selected: boolean(行選択: 内部データ)
       *	}
       */
      todos: [],
      // maxid: 0,
      selected: null,
      message: 'Hello Vue: ' + new Date(),
      seen: true
    }
  },
  created(){
    console.log('_created', Config);
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
      let todos = localStorage.getItem(Config.LOCAL_STORAGE_KEY);
      if(todos){
        todos = JSON.parse(todos);
        todos = todos.map((todo) => {
          return {
            id: todo.id,
            task: todo.task,
            limit: (todo.limit ? new Date(todo.limit) : undefined)
          };
        });
        this.todos = todos;
      }
    },
    save(){
      if(this.todos){
        const todos = this.todos.map((todo) => {
          return {
            id: todo.id,
            task: todo.task,
            limit: (todo.limit ? todo.limit: undefined)
          };
        });
        localStorage.setItem(Config.LOCAL_STORAGE_KEY, JSON.stringify(todos));
      }
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
      console.log('register: ', event.target.value);
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
      
    }
  },
  computed: {
    maxId(){
      let max = 0;
      if(this.todos){
        this.todos.forEach((todo) => {
          max = Math.max(todo.id);
        });
      }
      return max;
    },
    checkCount(){
      return this.todos.length;
    }
  },
  watch: {
    todos(){
      console.log('watch:todos', arguments);
    }
  },
  components: { Counter }
};
</script>

<template>
  <div>
    <!-- <span v-if="seen">Now You see me</span><br />
    test: {{ checkCount }} -->
    <div id="todo-list">
      <div id="menu">
        <input id="select-all" type="button" value="選択" />
        <input id="done" type="button" value="完了" v-bind:disabled="!selected" />
        <input id="search" type="text" placeholder="検索" />
      </div>
      <div id="add">
        <input id="edit" type="text" v-on:keypress.enter="register" placeholder="タスクを入力" />
      </div>
      <div id="todos">
        <div class="table">
          <div class="row" v-for="todo in todos" v-bind:data-id="todo.id" v-bind:key="todo.id">
            <div class="cell check">
              <!-- <input type="checkbox" v-bind:checked="todo.checked" /> -->
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
    <!-- <del>
      <p class="sample">Hello, World!</p>
      <counter v-bind:init="10" class="sample"/>
    </del> -->
  </div>
</template>

<style>
/* .sample {
  border: 1px solid khaki;
  background-color: linen;
} */
</style>

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
