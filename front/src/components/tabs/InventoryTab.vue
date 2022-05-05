<template lang='pug'>
  div
    div.disclaimer(v-if='!inventoryList || !inventoryList.length')
      .text-h6.text-center.text-primary.self-center Нет ни одной заполненной инвентаризации.
    q-markup-table.sticky_inventory_table.scroll(
      flat bordered
      separator='horizontal'
      v-if='inventoryList && inventoryList.length'
    )
      thead
        tr
          th.text-bold.text-teal.text-left Дата
          th.text-bold.text-teal.text-right Точка
          th.text-bold.text-teal.text-right Пользователь
          th.text-bold.text-teal.text-right Сумма
      tbody.scroll.bg-teal-1
        tr.cursor-pointer(v-for='(item, idx) in inventoryList' :key='idx' @click = 'openEditInventory(item)')
          td.text-left {{item.date.split('-').reverse().join('.')}}
          td.text-right {{item.division_name}}
          td.text-right {{item.user_name}}
          td.text-right {{item.total_sum}}
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
            q-btn(flat fab-mini color='grey' icon='close' @click='closeForm')
        q-card-section.q-pt-none
          .row.q-col-gutter-sm
            .col-6
              select-date(
                label='Дата *'
                dense
                v-model='normalizeInventoryDate'
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
import { Notify } from 'quasar'
import SelectDate from '@components/inputs/SelectDate'
import Vue from 'vue'

const normalizeDate = (value) => value ? value.split(' ')[0].split('-').reverse().join('.') : ''
export default {
  name: 'InventoryTab',
  data () {
    return {
      showDialog: false,
      item: {
        id: '',
        date: null,
        division_id: '',
        division_name: '',
        user_id: '',
        user_name: '',
        total_sum: '',
        nomenclature: []
      },
      divisionNomenclature: []
    }
  },
  computed: {
    ...mapGetters({
      inventoryList: 'inventory/getInventoryList',
      isAdmin: 'auth/isAdmin',
      divisions: 'division/getDivisionsList'
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
      return !this.item.id ? 'Заполнение инвентаризации' : 'Изменение инвентаризации'
    }
  },
  methods: {
    ...mapActions({
      listInventory: 'inventory/listInventory',
      addInventory: 'inventory/addInventory',
      updateInventory: 'inventory/updateInventory',
      deleteInventory: 'inventory/deleteInventory',
      updateDivisionsList: 'division/listDivisions',
      loadWorkdayByUser: 'workday/loadWorkdayByUser',
      getDivision: 'division/getDivision'
    }),
    showNotify (message) {
      Notify.create(message)
    },
    async saveInventory () {
      try {
        this.$q.loading.show()
        // eslint-disable-next-line camelcase
        this.item.nomenclature = this.divisionNomenclature
        const { id, date, division_id: divisionId, nomenclature } = this.item
        const isAdd = !id
        if (!date) this.$q.notify({ message: 'Введите дату ', type: 'info' })
        if (!divisionId) this.$q.notify({ message: 'Укажите подразделение ', type: 'info' })
        if (!nomenclature || !nomenclature.length) this.$q.notify({ message: 'В документе отсутствует номенклатура ', type: 'info' })
        // eslint-disable-next-line camelcase
        if (date && divisionId && nomenclature && nomenclature.length) {
          try {
            isAdd ? await this.addInventory(this.item) : await this.updateInventory(this.item)
            this.clearForm()
            this.showDialog = false
            return
          } catch (err) {
            this.$q.notify(err && err.response && err.response.data ? err.response.data.message : 'Ошибка')
          }
        }
        console.error(`Не получилось ${isAdd ? 'добавить' : 'изменить'} документ инвентаризации`)
        this.$q.notify({ message: `Не получилось ${isAdd ? 'добавить' : 'изменить'} документ инвентаризации`, color: 'primary' })
      } catch (err) {
        console.error(err)
      } finally {
        this.$q.loading.hide()
      }
    },
    clearForm () {
      this.item = {
        id: '',
        date: null,
        division_id: '',
        division_name: '',
        user_id: '',
        user_name: '',
        total_sum: '',
        nomenclature: []
      }
    },
    closeForm () {
      this.showDialog = false
      this.clearForm()
    },
    async openEditInventory (inventory) {
      try {
        this.$q.loading.show()
        if (!this.isAdmin) return
        if (!this.divisions || !this.divisions.length) await this.updateDivisionsList('')
        let workday = {}
        if (inventory) this.item = { ...inventory }
        if (!inventory.id) workday = await this.loadWorkdayByUser()
        if (!inventory.id && workday && workday.date) this.normalizeInventoryDate = workday.date
        if (!inventory.id && workday && workday.division_id) this.item.division_id = workday.division_id
        if (!inventory.id && workday && workday.division_name) this.item.division_name = workday.division_name
        this.divisionNomenclature = this.item.nomenclature
          ? this.item.nomenclature.map(el => { return { ...el, count: el.count || 0 } })
          : []
        if (!this.item.id && workday && workday.division_id) {
          const { division } = await this.getDivision(workday.division_id)
          this.divisionNomenclature = division.nomenclature.map(el => { return { ...el, count: 0 } })
        }
        this.showDialog = true
      } catch (err) {
        console.error(err)
      } finally {
        this.$q.loading.hide()
      }
    },
    setDivision (val) {
      this.item.division_name = val.name
      this.item.division_id = val.id
      this.divisionNomenclature = val.nomenclature && val.nomenclature.length
        ? val.nomenclature.map(el => { return { ...el, count: 0 } })
        : []
      this.$refs.divisionSelect.hidePopup()
    }
  },
  created () {
    this.listInventory('')
  },
  components: { 'select-date': SelectDate }
}
</script>

<style>
.workplace_scroll {
  height: calc(100vh - 150px);
  width: 100%;
}
.disclaimer {
  height: calc(100vh - 200px);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.sticky_inventory_table {
  height: calc(100vh - 200px);
}
.sticky_inventory_table thead tr th {
  position: sticky;
  z-index: 1;
}
.sticky_inventory_table thead tr:first-child th {
  top: 0
}
.sticky_inventory_table thead tr th {
  top: 83px
}
</style>
