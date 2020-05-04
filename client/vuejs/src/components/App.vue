<script>
import Counter from "./Counter";

export default {
  data(){
    return {
      todos: [{
        id:'1',
        task: 'html',
        limit: new Date()
      }, {
        id:'2',
        task: 'localStorage',
      }, {
        id:'3',
        task: 'binding',
        limit: new Date(2020,0,1)
      }],
      maxid: 0,
      selected: null
    }
  },
  components: { Counter }
};
</script>

<template>
  <div>
    <div id="todo-list">
      <div id="menu">
        <input id="select-all" type="button" value="選択" />
        <input id="done" type="button" value="完了" />
        <input id="search" type="text" placeholder="検索" />
      </div>
      <div id="add"><input type="text" placeholder="タスクを入力" /></div>
      <div id="todos">
        <div class="table" v-show="false">
          <div class="row">
            <div class="cell check"><input type="checkbox" /></div>
            <div class="cell task"></div>
            <div class="cell limit"></div>
          </div>
        </div>
      </div>
    </div>
    <del>
      <p class="sample">Hello, World!</p>
      <counter class="sample"/>
    </del>
  </div>
</template>

<style>
.sample {
  border: 1px solid khaki;
  background-color: linen;
}
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
