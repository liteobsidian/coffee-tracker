<template lang='pug'>
  div
    q-card.work-place.q-pt-none.q-px-md(flat)
      q-card-section
        .row
          .col-12
            .text-h5.text-teal.q-my-sm {{$route.name}}
          .col-12.scroll(style='height: 80vh')
            q-list(bordered)
              q-item(clickable outline v-for='(user, idx) in users' :key='idx' @click='openEditUser(user)')
                q-item-section( avatar )
                  q-icon(color='primary' :name='user.is_admin ? "manage_accounts" : "account_circle"')
                q-item-section {{user.name}}
                q-item-section(side)
                  q-btn(color='primary' flat round icon ='more_vert' @click.stop)
                    q-menu(
                      transition-show='scale'
                      transition-hide='scale'
                      auto-close
                    )
                      q-list(dense style='min-width:100px')
                        q-item(clickable v-close-popup @click='openEditUser(user)')
                          q-item-section Открыть
                        q-item(clickable v-close-popup @click='deleteUser(user.id)')
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
          q-input(flat dense label='Имя' v-model='item.name')
          q-input(flat dense label='Логин' v-model='item.login')
          q-input.q-mb-lg(flat dense label='Пароль' type='password' v-model='item.password')
          q-checkbox(label='Администратор' v-model='item.is_admin' lazy-rules :rules='[ val => val.length >= 5 || "Пароль должен содержать не менее 6 символов" ]')
          .float-right.q-mb-md
            q-btn.q-mr-md(outline color='primary' label='Сохранить' @click='addUser')
            q-btn(outline color='primary' label='Отмена' @click='closeForm')
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'

export default {
  name: 'UsersWorkPlace',
  props: {
    listType: {
      type: String,
      default: 'users'
    }
  },
  data () {
    return {
      showDialog: false,
      item: {
        id: '',
        name: '',
        login: '',
        password: '',
        is_admin: false
      }
    }
  },
  computed: {
    ...mapGetters({
      organization: 'organization/getSelected',
      userId: 'auth/getUserId',
      users: 'auth/getUsersList',
      isAdmin: 'auth/isAdmin'
    }),
    formName () {
      return !this.item.id ? 'Создание пользователя' : 'Изменение пользователя'
    }
  },
  methods: {
    ...mapActions({
      listUsers: 'auth/listUsers',
      pushUserInDB: 'auth/addUser',
      editUser: 'auth/editUser',
      deleteUser: 'auth/deleteUser'
    }),
    showNotify (message) {
      Notify.create(message)
    },
    async addUser () {
      const { name, login, password, id } = this.item
      const isAdd = !id
      if (!password) this.$q.notify({ message: 'Введите пароль', type: 'info' })
      if (name && login && password) {
        try {
          isAdd ? await this.pushUserInDB(this.item) : await this.editUser(this.item)
          this.clearForm()
          this.showDialog = false
          return
        } catch (err) {
          this.$q.notify(err && err.response && err.response.data ? err.response.data.message : 'Ошибка')
        }
      }
      console.error(`Не получилось ${isAdd ? 'добавить' : 'изменить'} пользователя`)
      this.$q.notify({ message: `Не получилось ${isAdd ? 'добавить' : 'изменить'} пользователя`, color: 'primary' })
    },
    clearForm () {
      this.item = {
        id: '',
        name: '',
        login: '',
        password: '',
        is_admin: false
      }
    },
    closeForm () {
      this.showDialog = false
      this.clearForm()
    },
    openEditUser (user) {
      if (!this.isAdmin) return
      this.item = user
      this.showDialog = true
    }
  },
  created () {
    this.listUsers('')
  }
}
</script>
