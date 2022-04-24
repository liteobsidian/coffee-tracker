<template lang='pug'>
  div
    q-card.work-place.q-pt-none.q-px-md(flat)
      q-card-section
        div
          q-splitter.scroll(v-model='splitterModel' style='height: 250px')
            template(v-slot:before='')
              q-tabs.text-teal(v-model='tab' vertical='')
                q-tab(name='mails' icon='mail' label='Mails')
                q-tab(name='alarms' icon='alarm' label='Alarms')
                q-tab(name='movies' icon='movie' label='Movies')
            template(v-slot:after='')
              q-tab-panels(v-model='tab' animated='' swipeable='' vertical='' transition-prev='jump-up' transition-next='jump-up')
                q-tab-panel(name='mails')
                  .text-h4.q-mb-md Mails
                  p
                    | Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                  p
                    | Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                q-tab-panel(name='alarms')
                  .text-h4.q-mb-md Alarms
                  p
                    | Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                  p
                    | Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                q-tab-panel.scroll(name='movies')
                  .text-h4.q-mb-md Movies
                  p
                    | Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                  p
                    | Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                  p
                    | Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
        .row
          .col-12
            .text-h5.text-teal.q-my-sm {{$route.name}}
          q-scroll-area.workplace_scroll
            .col-12
              q-list(bordered)
                q-item(clickable outline v-for='(nomenclature, idx) in nomenclatures' :key='idx' @click='openEditNomenclature(nomenclature)')
                  q-item-section( avatar )
                    q-icon(color='primary' name='category')
                  q-item-section {{nomenclature.name}}
                  q-item-section(side)
                    q-btn(color='primary' flat round icon ='more_vert' @click.stop)
                      q-menu(
                        transition-show='scale'
                        transition-hide='scale'
                        auto-close
                      )
                        q-list(dense style='min-width:100px')
                          q-item(clickable v-close-popup @click='openEditNomenclature(nomenclature)')
                            q-item-section Открыть
                          q-item(clickable v-close-popup @click='deleteNomenclature(nomenclature.id)')
                            q-item-section Удалить
              q-page-sticky(
                position='bottom-right'
                :offset='[120, 16]'
              )
                q-btn(
                  v-if='isAdmin'
                  fab
                  icon='add'
                  color='teal-6'
                  @click='showDialog=true'
                )
    q-dialog(v-model='showDialog')
      q-card.q-px-sm(style='width: 600px')
        q-card-section.q-mb-sm
          .row.justify-between
            .text-h6 {{formName}}
            q-btn(flat fab-mini color='grey' icon='close' @click='closeForm')
        q-card-section.q-pt-none
          .row.q-col-gutter-sm
            .col-12
              q-input(flat dense label='Название' v-model='item.name')
            .col-4
              q-input(flat dense label='Единица измерения' v-model='item.unit')
            .col-4
              q-input.q-mb-lg(flat dense label='Цена' mask='#.##' fill-mask='0'  reverse-fill-mask v-model='item.cost')
            .col-4.self-center
              q-checkbox.text-teal.text-caption.q-mb-lg(flat dense v-model='item.is_perishable') Скоропортящийся продукт
            .col-4
              q-input.q-mb-lg(flat dense label='Сумма закупки' mask='#.##' fill-mask='0'  reverse-fill-mask v-model='item.lot_value')
            .col-4
              q-input.q-mb-lg(flat dense label='Минимальное количество' mask='#' fill-mask='0'  reverse-fill-mask v-model='item.min_count')
            .col-4
              q-input.q-mb-lg(flat dense label='Максимальное количество' mask='#' fill-mask='0'  reverse-fill-mask v-model='item.max_count')
          .float-right.q-mb-md
            q-btn.q-mr-md(outline color='primary' label='Сохранить' @click='addNomenclature')
            q-btn(outline color='primary' label='Отмена' @click='closeForm')
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'

export default {
  name: 'StorageWorkPlace',
  props: {
    listType: {
      type: String,
      default: 'storage'
    }
  },
  data () {
    return {
      tab: 'mails',
      splitterModel: 10,
      showDialog: false,
      item: {
        id: '',
        name: '',
        unit: '',
        lot_value: '',
        min_count: 0,
        max_count: 0,
        cost: 0,
        is_perishable: false
      }
    }
  },
  computed: {
    ...mapGetters({
      nomenclatures: 'nomenclature/getNomenclatureList',
      isAdmin: 'auth/isAdmin'
    }),
    formName () {
      return !this.item.id ? 'Создание номенклатуры' : 'Изменение номенклатуры'
    }
  },
  methods: {
    ...mapActions({
      listNomenclature: 'nomenclature/listNomenclature',
      pushNomenclatureInDB: 'nomenclature/addNomenclature',
      editNomenclature: 'nomenclature/editNomenclature',
      deleteNomenclature: 'nomenclature/deleteNomenclature'
    }),
    showNotify (message) {
      Notify.create(message)
    },
    async addNomenclature () {
      // eslint-disable-next-line camelcase
      const { id, name, unit, lot_value, min_count, max_count, cost } = this.item
      const isAdd = !id
      if (!name) this.$q.notify({ message: 'Введите название номенклатуры', type: 'info' })
      // eslint-disable-next-line camelcase
      if (name && unit && lot_value && min_count && max_count && cost) {
        try {
          isAdd ? await this.pushNomenclatureInDB(this.item) : await this.editNomenclature(this.item)
          this.clearForm()
          this.showDialog = false
          return
        } catch (err) {
          this.$q.notify(err && err.response && err.response.data ? err.response.data.message : 'Ошибка')
        }
      }
      console.error(`Не получилось ${isAdd ? 'добавить' : 'изменить'} номенклатуру`)
      this.$q.notify({ message: `Не получилось ${isAdd ? 'добавить' : 'изменить'} номенклатуру`, color: 'primary' })
    },
    clearForm () {
      this.item = {
        id: '',
        name: '',
        unit: '',
        lot_value: '',
        min_count: 0,
        max_count: 0,
        cost: 0,
        is_perishable: false
      }
    },
    closeForm () {
      this.showDialog = false
      this.clearForm()
    },
    openEditNomenclature (nomenclature) {
      if (!this.isAdmin) return
      this.item = { ...nomenclature }
      this.showDialog = true
    }
  },
  created () {
    this.listNomenclature('')
  }
}
</script>

<style>
.workplace_scroll {
  height: calc(100vh - 150px);
  width: 100%;
}
</style>
