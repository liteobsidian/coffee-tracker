<template lang='pug'>
  div
    q-btn.relative-position(icon='library_books' color='primary' flat)
      q-tooltip Загрузить справочники
      q-menu(ref='qDictMenu')
        q-list( dense style='min-width: 100px' )
          q-item( v-for='dict in $options.dictionaries' :key="dict.name" clickable)
            q-item-section {{dict.name}}
            q-popup-proxy(ref='qUploadProxy' transition-show='scale' transition-hide='scale' :offset='[10, 10]' @hide="$refs.qDictMenu.hide()")
              upload-card(
                :title='dict.title'
                :action='dict.action'
                @close='$refs.qDictMenu.hide()'
                @update='handleUpdate'
              )
</template>

<script>

import { mapGetters } from 'vuex'
import UploadCard from './UploadCard'
import { dictionaries } from '@assets/dictionaries'

export default {
  name: 'UploadSelect',
  dictionaries: dictionaries,
  components: { UploadCard },
  props: {},
  computed: {
    ...mapGetters({ organization: 'organization/getSelected' })
  },
  methods: {
    handleUpdate (message) {
      this.$emit('update', message)
      this.$refs.qDictMenu.hide()
    }
  }
}
</script>
