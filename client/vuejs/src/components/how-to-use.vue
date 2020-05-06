<script>
export default {
  data() {
    return {
      count: 0
    };
  },
  props: ["init"],
  methods: {
    increment() {
      this.count += 1;
    },
    decrement() {
      this.count -= 1;
    }
  }
};
</script>

<template>
  <aside>
    <h2>How to use</h2>
    <ul>
      <li>タスクを入力: "サンプル" と入力し Enter</li>
      <li>タスクと期限入力: "サンプル 2020/5/8" と入力し Enter</li>
      <li>タスクを更新: データを選択し "サンプル2" と変更し Enter</li>
      <li>タスクを完了: チェックボックスを選択し「完了」ボタンをクリック</li>
      <li>すべてのタスクを選択: 「選択」ボタンをクリック</li>
      <li>タスクを検索: 「検索」にテキストを入力するとインクリメンタル検索</li>
    </ul>
  </aside>
</template>

<style lang="less" scoped>
aside {
	font-size: 14px;
	color: tan;
	background-color: linen;
	margin: 0 auto;
	padding-left: 15px;
	width: 640px;
	border-radius: 10px 10px 10px 10px;
}
</style>