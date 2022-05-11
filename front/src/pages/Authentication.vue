<template lang='pug'>
  .l-auth.q-pa-md.q-mx-auto.q-mt-xl(style="max-width: 370px")
    q-form(ref='form' @submit='submitAuthentication')
      q-card
        q-card-section.barnaul-medium.text-primary
          q-toolbar
            q-icon(name='coffee_maker' style='font-size:1.5rem')
            q-toolbar-title Вход в Coffee.Tracker
        q-separator(inset)
        q-card-section.q-pb-xl.q-pt-lg
          q-input.text-body1(
            v-model='user.username'
            label='Имя пользователя'
            lazy-rules
            :rules='[ val => !!val || "Введите имя пользователя"]'
          )
            template(v-slot:append)
              q-icon(name='fal fa-user')
          q-input.text-body1(
            v-model='user.password'
            label='Пароль пользователя'
            :type="showPassword ? 'text' : 'password'"
            lazy-rules
            :rules='[ val => !!val || "Введите пароль пользователя", val => testPassword(val) || "Пароль должен быть не менее 6 символов"]'
            @keydown.enter.native='submitAuthentication'
          )
            template(v-slot:append)
              q-icon(
                :name="showPassword ? 'fal fa-eye' : 'fal fa-eye-slash'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              )
        q-card-actions.q-pt-md(align='right')
          q-btn.barnaul-bold(
            icon='login'
            type='submit'
            style='width:40%'
            outline
            color='primary'
            label='Войти'
          )
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LoginPage',
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      showPassword: false
    }
  },
  computed: {
    ...mapGetters({
      isAdmin: 'auth/isAdmin'
    }),
    baseRoute () {
      return this.isAdmin ? '/workdays' : '/job'
    }
  },
  methods: {
    ...mapActions({
      authLogin: 'auth/authRequest'
    }),
    testPassword (val) {
      return val.length > 5 || this.user.username === 'Admin'
    },
    async submitAuthentication () {
      this.$refs.form.validate(true).then(async outcome => {
        if (outcome) {
          try {
            await this.authLogin(this.user)
            this.$router.push(this.baseRoute)
          } catch (err) {
            this.$q.notify({
              message: err.response.data.message.includes('Ошибка БД') ? 'Ошибка БД. Попробуйте ещё раз позже' : 'Ошибка авторизации. Неверный логин или пароль',
              color: 'error'
            })
            console.error(err)
          }
          // console.debug(`Пользователь ${this.user.username} успешно вошел в программу`)
        }
      })
    }
  }
}
</script>
