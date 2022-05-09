<template lang='pug'>
  div
    div.disclaimer(v-if='!requests || !requests.length')
      .text-h6.text-center.text-primary.self-center Нет ни одной заполненной заявки.
    q-markup-table.sticky_inventory_table.scroll(
      flat bordered
      separator='horizontal'
      v-if='requests && requests.length'
    )
      thead
        tr
          th.text-bold.text-teal.text-left Дата заявки
          th.text-bold.text-teal.text-right Точка
          th.text-bold.text-teal.text-right Пользователь
          th.text-bold.text-teal.text-right Сумма
          th.text-bold.text-teal.text-right Дата приёмки
          th.text-bold.text-teal.text-right Статус
          th
      tbody.scroll.bg-teal-1
        tr.cursor-pointer(v-for='(item, idx) in requests' :key='idx' @click = 'openEditRequest(item)')
          td.text-left {{item.date_create.split('-').reverse().join('.')}}
          td.text-right {{item.division_name}}
          td.text-right {{item.user_name}}
          td.text-right {{item.total_sum || '0'}} р.
          td.text-left {{item.date_accept ? item.date_accept.split('-').reverse().join('.') : ''}}
          td.text-right
            q-icon(v-if='item.is_accept' name='check' color='positive' size='sm')
          td.text-right
            q-btn(color='primary' flat round icon ='more_vert' @click.stop)
              q-menu(
                transition-show='scale'
                transition-hide='scale'
                auto-close
              )
                q-list(dense style='min-width:100px')
                  q-item(clickable v-close-popup @click='openEditRequest(item)')
                    q-item-section Открыть
                  q-item(clickable v-close-popup @click='deleteRequest(item.id)')
                    q-item-section Удалить
    q-btn.absolute-bottom-right(
      style='bottom: 14px; right: 20px'
      style.hover='opacity: 1'
      v-if='isAdmin'
      fab
      icon='add'
      color='teal-6'
      @click='openEditRequest'
    )
    q-dialog(v-model='showDialog')
      q-card.q-px-sm(style='width: 600px')
        q-card-section.q-mb-sm
          .row.justify-between
            .text-h6 {{formName}}
            q-btn(flat fab-mini color='grey' icon='close' @click='closeEditRequest')
        q-card-section.q-pt-none
          .row.q-col-gutter-sm
            .col-4
              select-date(
                label='Дата *'
                dense
                v-model='normalizeRequestDate'
                @clear='item.date_create=""'
                ref='field01'
                :rules='[ value => !!value || "Укажите дату"]'
              )
            .col-4
              q-select(flat dense label='Точка' :options='divisions' v-model='item.division_name'
                @input='setDivision($event)' ref='divisionSelect' style='flex: auto')
                template(v-slot:option='scope')
                  q-item(v-bind='scope.itemProps' v-on="scope.itemEvents")
                    q-item-section
                      span {{scope.opt.name}}
            .col-4
              q-checkbox.text-teal(color='teal' v-model='item.is_accept' disable label='Подтверждена')
            .col-12
              .text-teal Измените количество номенклатуры в заявке
              q-list.relative-position.q-mb-md(:bordered='!!divisionNomenclature && !!divisionNomenclature.length' separator dense style='min-height: 100px; max-height: 300px;')
                .flex.justify-center.content-center(v-if='!divisionNomenclature || !divisionNomenclature.length' style='height: 100px')
                  .text-body2.text-primary {{item.division_id ? 'Отсутствует, привязанная к выбранной точке номенклатура' : 'Выберите точку'}}
                q-item.q-pb-sm(v-for='(item, idx) in divisionNomenclature' :key='idx')
                  q-item-section {{item && item.name ? item.name : ''}}
                  q-item-section
                    q-input(
                      input-class='text-right'
                      flat dense label='Количество'
                      mask='#' fill-mask='0'  reverse-fill-mask
                    v-model='item.count'
                    )
                      template(v-slot:append bottom)
                        .text-body1.text-teal.q-mt-md {{item.unit}}
                  q-separator
          .float-right.q-mb-md
            q-btn.q-mr-md(v-if='item.id && !item.is_accept' outline color='primary' label='Подтвердить' @click='acceptRequest')
            q-btn.q-mr-md(outline color='primary' label='Сохранить' @click='saveRequest')
            q-btn(outline color='primary' label='Отмена' @click='closeForm')
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SelectDate from '@components/inputs/SelectDate'
import Vue from 'vue'

const normalizeDate = (value) => value ? value.split(' ')[0].split('-').reverse().join('.') : ''

export default {
  name: 'RequestTab',
  data () {
    return {
      tab: 'request',
      showDialog: false,
      item: {
        id: '',
        date_create: null,
        division_id: '',
        division_name: '',
        user_id: '',
        user_name: '',
        is_accept: false,
        date_accept: null,
        sum: '',
        nomenclature: []
      },
      divisionNomenclature: []
    }
  },
  computed: {
    ...mapGetters({
      isAdmin: 'auth/isAdmin',
      requests: 'request/getRequestList',
      divisions: 'division/getDivisionsList',
      needNomenclature: 'request/getNeedNomenclatureList'
    }),
    normalizeRequestDate: {
      get: function () {
        return normalizeDate(this.item.date_create)
      },
      set: function (val) {
        Vue.set(this.item, 'date_create', val)
      }
    },
    formName () {
      return this.item.id ? 'Изменение заявки' : 'Создание заявки'
    }
  },
  methods: {
    ...mapActions({
      listRequests: 'request/listRequest',
      pushRequestInDB: 'request/addRequest',
      editRequest: 'request/updateRequest',
      deleteRequest: 'request/deleteRequest',
      updateDivisionsList: 'division/listDivisions',
      accept: 'request/acceptRequest'
    }),
    async initLoad () {
      try {
        this.$q.loading.show()
        await this.listRequests()
        await this.updateDivisionsList()
      } catch (err) {
        this.$q.notify({ message: 'Ошибка обновления списка заявок', color: 'primary' })
      } finally {
        this.$q.loading.hide()
      }
    },
    openEditRequest (item) {
      if (item.id) {
        this.item = { ...item }
        this.divisionNomenclature = JSON.parse(JSON.stringify(item.nomenclature))
      }
      const currentDate = new Date()
      const dotCurrentDate = currentDate.toLocaleDateString()
      if (!item.date_accept) {
        this.normalizeRequestDate = dotCurrentDate.split('.').reverse().join('-')
      }
      this.showDialog = true
    },
    closeEditRequest () {
      this.showDialog = false
      this.clearItem()
    },
    clearItem () {
      this.item = {
        id: '',
        date_create: null,
        division_id: '',
        division_name: '',
        user_id: '',
        user_name: '',
        is_accept: false,
        date_accept: null,
        sum: '',
        nomenclature: []
      }
      this.divisionNomenclature = []
    },
    setDivision (val) {
      this.item.division_name = val.name
      this.item.division_id = val.id
      this.divisionNomenclature = val.nomenclature && val.nomenclature.length
        ? val.nomenclature.map(el => { return { ...el, count: 0 } })
        : []
      const needList = this.needNomenclature.find(el => el.division_id === val.id)
      console.log('needList', needList)
      if (needList && needList.nomenclature && needList.nomenclature.length) this.divisionNomenclature = needList.nomenclature
      this.$refs.divisionSelect.hidePopup()
    },
    closeForm () {
      this.showDialog = false
      this.clearItem()
    },
    async saveRequest () {
      this.item.nomenclature = this.divisionNomenclature
      const { id, date_create: dateCreate, division_id: divisionId, nomenclature } = this.item
      const isAdd = !id
      try {
        this.$q.loading.show()
        if (!dateCreate) this.$q.notify({ message: 'Введите дату ', type: 'info' })
        if (!divisionId) this.$q.notify({ message: 'Укажите подразделение ', type: 'info' })
        if (!nomenclature || !nomenclature.length) this.$q.notify({ message: 'В документе отсутствует номенклатура', type: 'info' })
        // eslint-disable-next-line camelcase
        if (dateCreate && divisionId && nomenclature && nomenclature.length) {
          isAdd ? await this.pushRequestInDB(this.item) : await this.editRequest(this.item)
          this.clearItem()
          this.showDialog = false
        }
      } catch (err) {
        this.$q.notify(err && err.response && err.response.data ? err.response.data.message : 'Ошибка')
        console.error(`Не получилось ${isAdd ? 'добавить' : 'изменить'} заявку`)
        this.$q.notify({ message: `Не получилось ${isAdd ? 'добавить' : 'изменить'} заявку`, color: 'primary' })
      } finally {
        this.$q.loading.hide()
      }
    },
    async acceptRequest () {
      try {
        this.$q.loading.show()
        await this.accept(this.item.id)
        this.showDialog = false
        this.clearItem()
      } catch (err) {
        this.$q.notify({ message: 'Ошибка подтверждения заявки' })
        console.error(err)
      } finally {
        this.$q.loading.hide()
      }
    }
  },
  created () {
    this.initLoad()
  },
  components: { 'select-date': SelectDate }
}
</script>

<style>
.workplace_scroll {
  height: calc(100vh - 150px);
  width: 100%;
}
</style>
