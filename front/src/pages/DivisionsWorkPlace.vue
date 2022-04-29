<template lang='pug'>
  div
    q-card.work-place.q-pt-none.q-px-md(flat)
      q-card-section
        .row
          .col-12
            .text-h5.text-teal.q-my-sm {{$route.name}}
          q-scroll-area.workplace_scroll
            .col-12.scroll
              q-list(bordered)
                q-item(clickable outline v-for='(division, idx) in divisions' :key='idx' @click='openEditDivision(division)')
                  q-item-section( avatar )
                    q-icon(color='primary' name='other_houses')
                  q-item-section {{division.name}}
                  q-item-section(side)
                    q-btn(color='primary' flat round icon ='more_vert' @click.stop)
                      q-menu(
                        transition-show='scale'
                        transition-hide='scale'
                        auto-close
                      )
                        q-list(dense style='min-width:100px')
                          q-item(clickable v-close-popup @click='openEditDivision(division)')
                            q-item-section Открыть
                          q-item(clickable v-close-popup @click='deleteDivision(division.id)')
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
            .col-8
              q-input(flat dense label='Название' v-model='item.name')
            .col-4
              q-input(flat dense label='Город' v-model='item.city')
            .col-8
              q-input(flat dense label='Адрес' v-model='item.address')
            .col-4
              q-input(
                input-class='text-right'
                flat dense
                label='Коэффициент'
                mask='#.###' fill-mask='0'
                reverse-fill-mask
                :rules='[val => (0.4 <= +val && val <= 1.1) || "Значение не умещается в интервал"]'
                v-model='item.factor'
              )
            .col-12
              .text-teal Список номенклатуры точки
              q-list.relative-position(:bordered='!!nomenclature.length' separator dense style='min-height: 100px;')
                .flex.justify-center.content-center(v-if='!divisionNomenclature || !divisionNomenclature.length' style='height: 100px')
                  .text-body2.text-primary Отсутствует, привязанная к точке номенклатура
                q-item(v-for='(item, idx) in divisionNomenclature' :key='idx')
                  q-item-section(side top)
                    q-btn(icon='remove' fab-mini flat color='primary' @click='removeItem(idx)')
                      q-tooltip Удалить номенклатуру
                  q-item-section {{item && item.name ? item.name : ''}}
                  q-separator
              q-btn.float-right(
                outline
                round
                dense
                size='md'
                icon='add'
                color='teal-6'
                style='margin-top: -38px; margin-right: 5px;'
              )
                q-popup-proxy
                  q-form(@submit='handleSubmit' @reset='handleReset')
                    .col.q-pa-md
                      q-select.q-mb-md(
                        flat dense label='Номенклатура' :options='nomenclature'
                        v-model='currentNomenclature.name' @input='setNomenclature($event)'
                        ref='nomenclatureSelect'
                      )
                        template(v-slot:option='scope')
                          q-item(v-bind='scope.itemProps' v-on="scope.itemEvents")
                            q-item-section
                              span {{scope.opt.name}}
                      .row.flex.justify-end
                        q-btn( label='Ok' color='primary' outline v-close-popup type='submit' )
                        q-btn( label='закрыть' color='teal' flat v-close-popup  type='reset')
        .float-right.q-mb-md
          q-btn.q-mr-md(outline color='primary' label='Сохранить' @click='addDivision')
          q-btn(outline color='primary' label='Отмена' @click='closeForm')
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'

export default {
  name: 'DivisionsWorkPlace',
  props: {
    listType: {
      type: String,
      default: 'divisions'
    }
  },
  data () {
    return {
      showDialog: false,
      item: {
        id: '',
        name: '',
        city: '',
        address: '',
        factor: 0,
        nomenclature: []
      },
      divisionNomenclature: [],
      currentNomenclature: {
        id: '',
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      divisions: 'division/getDivisionsList',
      nomenclature: 'nomenclature/getNomenclatureList',
      isAdmin: 'auth/isAdmin'
    }),
    formName () {
      return !this.item.id ? 'Создание подразделения' : 'Изменение подразделения'
    }
  },
  methods: {
    ...mapActions({
      listDivision: 'division/listDivisions',
      listNomenclature: 'nomenclature/listNomenclature',
      pushDivisionInDB: 'division/addDivision',
      editDivision: 'division/editDivision',
      deleteDivision: 'division/deleteDivision'
    }),
    showNotify (message) {
      Notify.create(message)
    },
    async addDivision () {
      const { id, name, city, address, factor } = this.item
      const isAdd = !id
      if (!name) this.$q.notify({ message: 'Введите название подразделения', type: 'info' })
      if (name && city && address && factor) {
        try {
          isAdd ? await this.pushDivisionInDB(this.item) : await this.editDivision(this.item)
          this.clearForm()
          this.showDialog = false
          return
        } catch (err) {
          this.$q.notify(err && err.response && err.response.data ? err.response.data.message : 'Ошибка')
        }
      }
      console.error(`Не получилось ${isAdd ? 'добавить' : 'изменить'} подразделение`)
      this.$q.notify({ message: `Не получилось ${isAdd ? 'добавить' : 'изменить'} подразделение`, color: 'primary' })
    },
    clearForm () {
      this.item = {
        id: '',
        name: '',
        city: '',
        address: '',
        factor: 0,
        nomenclature: []
      }
      this.divisionNomenclature = []
    },
    closeForm () {
      this.showDialog = false
      this.clearForm()
    },
    openEditDivision (division) {
      if (!this.isAdmin) return
      this.item = { ...division }
      this.divisionNomenclature = division.nomenclature ? division.nomenclature : []
      this.showDialog = true
    },
    handleSubmit () {
      if (!this.divisionNomenclature) this.divisionNomenclature = []
      if (this.divisionNomenclature && (!this.divisionNomenclature.length || !this.divisionNomenclature.find(el => el.id === this.currentNomenclature.id))) {
        if (this.currentNomenclature && this.currentNomenclature.name) this.divisionNomenclature.push({ ...this.currentNomenclature })
        this.item.nomenclature = this.divisionNomenclature
      }
      this.handleReset()
    },
    handleReset () {
      this.currentNomenclature = {}
    },
    setNomenclature (val) {
      this.currentNomenclature.name = val.name
      this.currentNomenclature.id = val.id
      this.$refs.nomenclatureSelect.hidePopup()
    },
    removeItem (idx) {
      console.log('item', idx)
      this.$nextTick(() => {
        this.divisionNomenclature.splice(idx, 1)
        this.item.nomenclature = this.divisionNomenclature
      })
      console.log(this.divisionNomenclature)
    },
    async init () {
      try {
        this.$q.loading.show()
        await this.listNomenclature('')
        await this.listDivision('')
      } catch (err) {
        console.error(err)
      } finally {
        this.$q.loading.hide()
      }
    }
  },
  created () {
    this.init()
  }
}
</script>
<style>
.workplace_scroll {
  height: calc(100vh - 150px);
  width: 100%;
}
</style>
