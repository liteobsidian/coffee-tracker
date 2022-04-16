<template lang="pug">
  div
    q-scroll-area( id='select-list' ref='select-list' style='height: 400px' )
      q-list( bordered separator padding )
        q-item(
          v-for='(item,index) in items'
          :key='index'
          :id='`id${item.id}`'
          clickable
          @click='openItem(item)'
          @click.ctrl.exact='selectItem(item)'
        )
          slot(:item='item')
</template>

<script>
export default {
  name: 'SelectList',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    selectGroup: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    openItem (item) {
      if ('is_group' in item && !!item.is_group) {
        this.$emit('getdata', item.id)
      } else if (item.id) {
        this.$emit('selected', item)
      }
    },
    selectItem (item) {
      if ('is_group' in item && !!item.is_group && !!this.selectGroup) {
        this.$emit('selected', item)
      } else if (!!item.id && !item.is_group) {
        this.$emit('selected', item)
      }
    }
  },
  mounted () {
    this.$emit('getdata')
  }
}
</script>
