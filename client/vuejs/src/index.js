import './less/index.less';
import Vue from 'vue';
import App from './components/App'; // 作ったやつ
import HowToUse from './components/how-to-use';

new Vue({
  el: '#app', // アプリをマウントする要素(セレクタで指定)
  components: { App }, // Appというコンポーネントを使うよ、という宣言
  template: '<app/>', // el(今回は#app)の中に表示する内容
})

new Vue({
  el: '#how-to-use', // アプリをマウントする要素(セレクタで指定)
  components: { HowToUse }, // Appというコンポーネントを使うよ、という宣言
  template: '<how-to-use />', // el(今回は#app)の中に表示する内容
})
