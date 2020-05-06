import './less/index.less';
import Vue from 'vue';
import App from './components/App';
import HowToUse from './components/how-to-use';

new Vue({
  el: '#app',
  components: { App },
  template: '<app/>',
})

new Vue({
  el: '#how-to-use',
  components: { HowToUse },
  template: '<how-to-use />',
})
