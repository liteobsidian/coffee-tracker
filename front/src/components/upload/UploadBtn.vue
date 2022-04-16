<template lang='pug'>
  div
    q-btn.relative-position(icon='upload' color='primary' flat label='Загрузить' :disable='disable')
      q-tooltip Загрузить отчёт для проверки
      q-popup-proxy(ref='qUploadProxy' transition-show='scale' transition-hide='scale' :offset='[10, 10]')
        upload-card(
          :type-report='typeReport'
          :organization='organization'
          :drop-file='dropFile'
          title='Загрузка файла отчёта'
          @update='$emit("update")'
          @close="$refs.qUploadProxy.hide()"
        )
</template>

<script>

import { mapGetters } from 'vuex'
import UploadCard from './UploadCard'

export default {
  name: 'UploadBtn',
  components: { UploadCard },
  props: {
    typeReport: {
      type: Number,
      default: 0
    },
    dropFile: {
      type: File,
      default: null
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({ organization: 'organization/getSelected' })
  },
  watch: {
    dropFile (val) {
      if (val) this.$refs.qUploadProxy.show()
    }
  }
}
</script>
