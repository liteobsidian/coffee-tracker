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
      tbody.scroll.bg-teal-1
        tr.cursor-pointer(v-for='(item, idx) in requests' :key='idx' @click = 'openEditRequest(item)')
          td.text-left {{item.date_create.split('-').reverse().join('.')}}
          td.text-right {{item.division_name}}
          td.text-right {{item.user_name}}
          td.text-right {{item.sum}}
          td.text-left {{item.date_accept ? item.date_accept.split('-').reverse().join('.') : ''}}
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
      @click='openEditInventory'
    )
    q-dialog(v-model='showDialog')
      q-card.q-px-sm(style='width: 600px')
        q-card-section.q-mb-sm
          .row.justify-between
            .text-h6 {{formName}}
            q-btn(flat fab-mini color='grey' icon='close' @click='closeEditRequest')
        q-card-section.q-pt-none
          .row.q-col-gutter-sm
            .col-6
              select-date(
                label='Дата *'
                dense
                v-model='normalizeRequestDate'
                @clear='item.date=""'
                ref='field01'
                :rules='[ value => !!value || "Укажите дату"]'
              )
            .col-6
              q-select(flat dense label='Точка' :options='divisions' v-model='item.division_name' @input='setDivision($event)' ref='divisionSelect')
                template(v-slot:option='scope')
                  q-item(v-bind='scope.itemProps' v-on="scope.itemEvents")
                    q-item-section
                      span {{scope.opt.name}}
            .col-12
              .text-teal Укажите количество оставшейся номенклатуры
              q-list.relative-position.q-mb-md(:bordered='!!divisionNomenclature && !!divisionNomenclature.length' separator dense style='min-height: 100px; max-height: 300px;')
                .flex.justify-center.content-center(v-if='!divisionNomenclature || !divisionNomenclature.length' style='height: 100px')
                  .text-body2.text-primary Отсутствует, привязанная к точке номенклатура
                q-item.q-pb-sm(v-for='(item, idx) in divisionNomenclature' :key='idx')
                  q-item-section {{item && item.name ? item.name : ''}}
                  q-item-section
                    q-input(
                      input-class='text-right'
                      flat dense label='Остаток'
                      mask='#' fill-mask='0'  reverse-fill-mask
                    v-model='item.count'
                    )
                      template(v-slot:append bottom)
                        .text-body1.text-teal.q-mt-md {{item.unit}}
                  q-separator
          .float-right.q-mb-md
            q-btn.q-mr-md(outline color='primary' label='Сохранить' @click='saveInventory')
            q-btn(outline color='primary' label='Отмена' @click='closeForm')
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
      }
    }
  },
  computed: {
    ...mapGetters({
      isAdmin: 'auth/isAdmin',
      requests: 'request/getRequestList'
    }),
    normalizeInventoryDate: {
      get: function () {
        return normalizeDate(this.item.date)
      },
      set: function (val) {
        Vue.set(this.item, 'date', val)
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
      editNomenclature: 'request/updateRequest',
      deleteNomenclature: 'request/deleteRequest'
    }),
    async initLoad () {
      try {
        this.$q.loading.show()
        await this.listRequests()
      } catch (err) {
        this.$q.notify({ message: 'Ошибка обновления списка заявок', color: 'primary' })
      } finally {
        this.$q.loading.hide()
      }
    },
    openEditRequest (item) {
      if (item.id) this.item = { ...item }
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
    }
  },
  created () {
    this.initLoad()
  }
}
</script>

<style>
.workplace_scroll {
  height: calc(100vh - 150px);
  width: 100%;
}
</style>
