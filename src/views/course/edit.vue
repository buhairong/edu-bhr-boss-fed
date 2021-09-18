<template>
  <create-or-update is-edit :id="id" />
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrUpdate from './components/CreateOrUpdate.vue'

export default Vue.extend({
  name: 'EditCourse',

  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },

  components: {
    CreateOrUpdate
  }
})
</script>

<style lang="scss" scoped></style>
