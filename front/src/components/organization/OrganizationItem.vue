<template lang="pug">
  common-item(:ismark='ismark')
    template(v-slot:avatar)
      q-icon(name='map')
    template(v-slot:title)
      | {{ item.name.toUpperCase()}}
</template>

<script>
import CommonItem from '@components/items/CommonItem.vue'
export default {
  name: 'OrganizationItem',
  props: {
    item: {
      type: Object,
      default () {
        return {
          id: '',
          name: '',
          full_name: '',
          address: '',
          inn: ''
        }
      }
    },
    ismark: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    uppercase (value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    }
  },
  components: {
    'common-item': CommonItem
  }
}
</script>
