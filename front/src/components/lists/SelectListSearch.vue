<template lang="pug">
  div
    q-toolbar(v-if='!hideSearch')
      slot(name='addon')
        q-space
        q-input.text-body1(
          dense outlined
          clearable autofocus
          hide-bottom-space
          clear-icon='clear'
          ref='search'
          v-model='search'
          @keydown.enter='doSearch'
          @clear='$emit("search","")'
          style='width:100%'
        )
        q-btn(flat :disable='!search' icon='search' @click='doSearch')
    select-list(
      :items='items'
      :select-group='selectGroup'
      @getdata='$emit("getdata",$event)'
      @selected='$emit("selected",$event)'
    )
      template(v-slot='{ item }')
        slot(name='list' :item='item')
</template>

<script>
import SelectList from './SelectList.vue'
export default {
  name: 'SelectListSearch',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    selectGroup: {
      type: Boolean,
      default: false
    },
    autoSearch: {
      type: Boolean,
      default: false
    },
    hideSearch: {
      type: Boolean,
      default: false
    },
    query: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      search: '',
      isSearch: false
    }
  },
  watch: {
    query (value) {
      this.hideSearch && this.$emit('search', value)
    },
    isSearch (val, oldval) {
      if (val && !oldval) this.search = ''
    }
  },
  methods: {
    doSearch () {
      this.$emit('search', this.search)
      this.is_search = false
    },
    setSearch () {
      this.is_search = !this.is_search
      if (this.is_search) {
        this.$nextTick(() => {
          this.$refs.search.focus()
        })
      }
    }
  },
  components: {
    'select-list': SelectList
  }
}
</script>
