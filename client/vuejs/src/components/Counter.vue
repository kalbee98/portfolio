<script>
export default {
  data() {
    return {
      count: 0,
    }
  },
  props: ['init'],
  methods: {
    increment() {
      this.count += 1
    },
    decrement() {
      this.count -= 1
    },
  }
}
</script>

<template>
  <div>
    <button v-on:click="decrement">-</button>
    <span>{{count}}</span>
    <button v-on:click="increment">+</button>
  </div>
</template>
