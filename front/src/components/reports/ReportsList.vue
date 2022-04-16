<template lang='pug'>
  div
    .row.q-mt-lg.q-mb-sm
      button-filter-period
      upload-btn.q-ml-xs(
        :type-report='typeReport'
        :drop-file='dropFile'
        @update="getData"
        :disable='!period.period_s || !period.period_e'
      )
      q-btn(
        v-if='period.period_e && items.length'
        icon='fal fa-download'
        flat outline color='primary'
        label='сформировать отчет'
        @click='downloadFullReport'
      )
        q-tooltip Отчёт формируется по последней дате установленного периода
      q-space
      upload-select(
        v-if='period.period_s'
        @update='$q.notify({message: $event, color: "positive", timeout: 2000})'
      )
    drop-area(:height="scrollHeight" @drop="handleDrop")
      q-scroll-area.absolute-full( :style=`scrollHeightString`)
        q-list(
          v-if='items.length'
          bordered
          separator
        )
          q-item.q-py-md(
            v-for='({check, period, file_name, shortname, org_short_name, uuid, status, created_at}, idx) in items'
            :key='idx'
          )
            q-item-section( avatar )
              .row
                q-checkbox(v-if='isAdmin' :value='check' size='sm' @input='toggleCheck(idx)')
                q-avatar.q-ml-sm(style="border: 1px solid rgba(0,0,0,0.2)")
                  q-icon(name='insert_chart_outlined' color='primary')
            q-item-section
              q-item-label {{file_name}}
              q-item-label(caption)
                span.text-primary.barnaul-bold {{monthLabel(period)}}
            q-item-section
              q-item-label.ellipsis-2-lines.text-black(caption) {{org_short_name}}
              q-item-label(caption)
                span {{normalizeDateTime(created_at)}}
                span.q-ml-xs.text-teal {{shortname}}
            q-item-section( side )
              .row.q-gutter-sm.flex-center
                q-icon(:name=`$options.statusValidation[status.validation].icon` :color='$options.statusValidation[status.validation].color' size='sm')
                  q-tooltip {{$options.statusValidation[status.validation].description}}
                q-btn(icon='more_vert' size='md' flat round)
                  q-menu(
                    transition-show="scale"
                    transition-hide="scale"
                    auto-close
                    anchor="bottom middle" self="top end"
                  )
                    q-list(dense)
                      q-item(clickable @click='handleDownloadSource(uuid)')
                        q-item-section(avatar)
                          q-avatar(size='sm')
                            q-icon(name='download' color="primary" size='xs')
                        q-item-section Скачать загруженный файл
                      q-item(clickable @click='handleDownloadProtocol(uuid)' v-if='!status.validation')
                        q-item-section(avatar)
                          q-avatar(size='sm')
                            q-icon(name='download' color="primary" size='xs')
                        q-item-section Скачать протокол расхождений
                      q-item(clickable @click='handleDelete(uuid)')
                        q-item-section(avatar)
                          q-avatar(size='sm')
                            q-icon(name='delete' color="primary" size='xs')
                        q-item-section Удалить загруженный файл
                      q-item(clickable @click='handleRevalidation(uuid)' v-if='isAdmin')
                        q-item-section(avatar)
                          q-avatar(size='sm')
                            q-icon(name='redo' color="primary" size='xs')
                        q-item-section Выполнить повторную проверку загруженного файла

                      q-separator
                      .text-caption.text-grey.text-center(@click.stop) UUID: {{uuid}}
          q-space
        q-card.relative-position.bg-grey-1(
          v-else
          :style="scrollHeightString"
        )
         .absolute-center
           .text-h6.text-teal.text-center За выбранный период для текущей организации отчётов не найдено.
</template>

<script>
import ButtonFilterPeriod from '@components/filters/ButtonFilterPeriod'
import UploadBtn from '@components/upload/UploadBtn'
import UploadSelect from '@components/upload/UploadSelect'
import { validation } from '@assets/docStatus'
import { mapActions, mapGetters } from 'vuex'
import { dateHelper, loadingStatus } from '@mixins'
import DropArea from '../common/DropArea'

export default {
  name: 'ReportsList',
  props: {
    organization: {
      type: Object,
      default: () => {}
    },
    typeReport: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      items: [],
      dropFile: null
    }
  },
  computed: {
    ...mapGetters({ period: 'period/getFilterPeriod', isAdmin: 'auth/isAdmin' }),
    organizationId () {
      return this.organization.id
    },
    scrollHeight () {
      return this.$q.screen.height - 270
    },
    scrollHeightString () {
      return `height: ${this.scrollHeight}px`
    }
  },
  watch: {
    period () {
      this.getData()
    },
    organizationId () {
      this.getData()
    },
    typeReport () {
      this.getData()
    }
  },
  methods: {
    ...mapActions({
      loadList: 'reports/reportsList',
      deleteFile: 'reports/deleteFile',
      protocolFile: 'reports/getProtocolFile',
      originalFile: 'reports/getOriginalFile',
      changeStatus: 'reports/changeStatus',
      getFullReportFile: 'reports/getFullReportFile',
      revalidationFile: 'reports/revalidationFile'
    }),
    async getData () {
      try {
        this.isLoading = true
        const payload = { periodStart: this.dotToDashDate(this.period.period_s), periodEnd: this.dotToDashDate(this.period.period_e), division: null, typeReport: this.typeReport }
        if (this.organizationId) payload.organization = this.organizationId
        const list = await this.loadList(payload)
        this.items = list.map(el => {
          el.check = false
          return el
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    async handleDownloadSource (uuid) {
      try {
        const data = await this.originalFile(uuid)
        const url = URL.createObjectURL(data)
        window.open(url, '_blank')
      } catch (err) {
        console.error(err)
        this.$q.notify({ message: `Не удается найти файл с uuid = ${uuid} в системе; ТРЕБУЕТСЯ ОБРАЩЕНИЕ В СЛУЖБУ ПОДДЕРЖКИ !`, type: 'error' })
      }
    },
    async handleDownloadProtocol (uuid) {
      try {
        const data = await this.protocolFile(uuid)
        const url = URL.createObjectURL(data)
        window.open(url, '_blank')
      } catch (err) {
        console.error(err)
        this.$q.notify({
          message: 'Ошибка загрузки протокола расхождений',
          type: 'error'
        })
      }
    },
    async downloadFullReport () {
      try {
        this.isLoading = true
        const data = await this.getFullReportFile({ typeReport: this.typeReport, period: this.dotToDashAndSetFirst(this.period.period_e) })
        const filename = data.headers['content-disposition'].split('filename=')[1].split(';')[0].replace(/['"]/g, '')
        const url = URL.createObjectURL(data.data)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } catch (err) {
        console.error(err)
        this.$q.notify({
          message: 'Ошибка загрузки сформированного отчёта',
          type: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },
    async handleDelete (uuid) {
      try {
        const { message } = await this.deleteFile(uuid)
        this.$q.notify({ message, type: 'positive' })
        await this.getData()
      } catch (err) {
        console.error(err)
      }
    },
    handleDrop (file) {
      if (!+this.organization.id) {
        this.$q.notify({
          message: 'Организация не установлена',
          type: 'error'
        })
        return
      }
      const types = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      if (types.includes(file.type)) { this.dropFile = file } else {
        this.$q.notify({
          message: 'Не соответствует тип файла. Загрузите .xls или .xlsx',
          type: 'error'
        })
      }
    },
    // МЕТОД ПРЕКЛЮЧАЕТ СТАТУС "handled" для принудительного добавления в отчёт невалидных файлов.
    // async toggleStatus (uuid) {
    //   try {
    //     const data = await this.changeStatus(uuid)
    //     console.log(data)
    //     await this.getData()
    //   } catch (err) {
    //     console.error(err)
    //   }
    // },
    toggleCheck (idx) {
      const item = this.items[idx]
      item.check = !item.check
      this.items.splice(idx, 1, item)
    },
    async handleRevalidation (uuid) {
      try {
        const { message } = await this.revalidationFile(uuid)
        this.$q.notify({ message, type: 'positive' })
        await this.getData()
      } catch (err) {
        this.$q.notify({ message: err.message, type: 'error' })
        console.error(err)
      }
    }
  },
  created () {
    this.getData()
  },
  statusValidation: validation,
  mixins: [dateHelper, loadingStatus],
  components: { DropArea, ButtonFilterPeriod, UploadBtn, UploadSelect }
}
</script>

<style scoped>

</style>
