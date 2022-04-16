<template lang='pug'>
  q-card(style='width: 300px' flat)
    q-card-section.q-pb-none
      .text-h6 {{ title }}
    q-card-section.q-py-none
      q-file.q-pl-sm.ellipsis(
        v-model='file'
        flat
        clearable
        ref='filePicker'
        accept=".xls, .xlsx"
        clear-icon='clear'
        label='Выберите файл *'
      )
        template(v-slot:prepend)
          q-icon(name='fal fa-paperclip')
      q-input.q-pl-sm.q-mt-sm(readonly label='Период' :value='dotMonthLabel(period.period_s)' style='font-size: 18px')
        template(v-slot:prepend)
          q-icon(name='fal fa-calendar')
        q-tooltip Документ загружается по дате начала периода
    q-card-actions.float-right.q-pa-md
      q-btn(icon='fal fa-paper-plane' :disable='!file' @click='sendFile' outline color='primary' label='отправить')
      q-btn(icon='clear' v-close-popup outline color='primary' label='закрыть')
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import SelectDate from '@components/selects/SelectDate'
import { dateHelper, loadingStatus } from '@mixins'
import { localeDate } from '@assets/localeDate'

export default {
  name: 'UploadCard',
  components: { SelectDate },
  props: {
    title: {
      type: String,
      default: 'Загрузка файла отчёта'
    },
    typeReport: {
      type: Number,
      default: 0
    },
    organization: {
      type: Object,
      default: () => {}
    },
    dropFile: {
      type: File,
      default: null
    },
    action: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      file: null
    }
  },
  computed: {
    ...mapGetters({ period: 'period/getFilterPeriod' })
  },
  methods: {
    ...mapActions({
      uploadFile: 'reports/uploadFile',
      propAction (dispatch, payload) {
        return dispatch(this.action, payload)
      }
    }),
    async sendFile () {
      try {
        this.isLoading = true
        let message = ''
        if (this.action) {
          const resp = await this.propAction({ file: this.file, period: this.dotToDashAndSetFirst(this.period.period_s) })
          message = resp.message
        } else {
          await this.uploadFile({ file: this.file, typeReport: this.typeReport, period: this.dotToDashAndSetFirst(this.period.period_s) })
        }
        this.$emit('update', message)
      } catch (err) {
        console.error(err)
        this.$q.notify({
          message: err.toString(),
          type: 'error'
        })
      } finally {
        this.isLoading = false
        this.$emit('close')
      }
    }
  },
  watch: {
    dropFile (val) {
      if (!val) return
      this.file = val
    }
  },
  mounted () {
    if (this.dropFile) this.file = this.dropFile
  },
  mixins: [dateHelper, loadingStatus],
  localeDate: localeDate
}
</script>

<style scoped>

</style>
