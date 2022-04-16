<template lang='pug'>
  div
    q-card.work-place.q-pt-none.q-px-md(flat)
      q-card-section
        .row
          .col-12
            .text-h5.text-teal.q-my-sm {{$route.name}}
          .col-12.scroll(style='height: 80vh')
            q-list(bordered)
              q-item(clickable outline v-for='division in divisions' @click='openEditDivision(division)')
                q-item-section( avatar )
                  q-icon(color='primary' name='Other Houses')
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
        q-card-section.q-pt-none.q-gutter-y-sm
          q-input(flat dense label='Название' v-model='item.name')
          q-input(flat dense label='Город' v-model='item.city')
          q-input.q-mb-lg(flat dense label='Адрес' v-model='item.address')
          q-input.q-mb-lg(flat dense label='Коэффициент' v-model='item.factor')
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
        factor: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      divisions: 'division/getDivisionsList',
      isAdmin: 'auth/isAdmin'
    }),
    formName () {
      return !this.item.id ? 'Создание подразделения' : 'Изменение подразделения'
    }
  },
  methods: {
    ...mapActions({
      listDivision: 'division/listDivisions',
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
        factor: 0
      }
    },
    closeForm () {
      this.showDialog = false
      this.clearForm()
    },
    openEditDivision (division) {
      if (!this.isAdmin) return
      this.item = division
      this.showDialog = true
    }
  },
  created () {
    this.listDivisions('')
  }
}
</script>
