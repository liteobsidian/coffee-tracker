import { date } from 'quasar'
import { localeDate } from '@assets/localeDate'

export const systemLogout = {
  methods: {
    logout () {
      const dialog = this.$q.dialog({
        title: 'Выход из программы',
        message: 'Вы действительно хотите выйти из программы?',
        ok: {
          label: 'Да',
          outline: true,
          color: 'primary'
        },
        cancel: {
          label: 'Нет',
          outline: true,
          color: 'primary'
        },
        focus: 'cancel'
      })
        .onOk(() => {
          this.$router.push('/logout')
        })
        .onCancel(() => {

        })
        .onDismiss(() => {
          clearTimeout(timer)
        })

      const timer = setTimeout(() => {
        dialog.hide()
      }, 5000)
    }
  }
}

export const loadingStatus = {
  computed: {
    isLoading: {
      get: function () {
        return this.$store.getters['loading/isLoading']
      },
      set: function (value) {
        this.$store.dispatch('loading/setLoading', value)
      }
    }
  }
}

export const dateHelper = {
  methods: {
    monthLabel (date) {
      if (!date) return ''
      const parts = date.split('-')
      return `${localeDate.months[+parts[1] - 1]} ${parts[0]}`
    },
    dotMonthLabel (date) {
      if (!date) return ''
      const parts = date.split('.')
      return `${localeDate.months[+parts[1] - 1]} ${parts[2]}`
    },
    dotToDashDate (date) {
      if (!date) return ''
      return date.split('.').reverse().join('-')
    },
    dashToDot (date) {
      if (!date) return ''
      return date.split('-').reverse().join('.')
    },
    dotToDashAndSetFirst (date) {
      if (!date) return ''
      const newDate = date.split('.').reverse()
      newDate[2] = '01'
      return newDate.join('-')
    },
    normalizeDateTime (dt) {
      return date.formatDate(dt, 'DD.MM.YYYY HH:mm')
    },
    getPeriodMonth (dt) {
      const t = new Date(dt)
      const s = new Date()
      s.setMonth(t.getMonth(), 1)
      return {
        start: date.formatDate(date.startOfDate(s, 'month'), 'DD.MM.YYYY'),
        end: date.formatDate(date.endOfDate(s, 'month'), 'DD.MM.YYYY')
      }
    },
    getPeriodYear (dt) {
      const t = new Date(dt)
      const s = new Date()
      s.setFullYear(t.getFullYear())
      return {
        start: date.formatDate(date.startOfDate(s, 'year'), 'DD.MM.YYYY'),
        end: date.formatDate(date.endOfDate(s, 'year'), 'DD.MM.YYYY')
      }
    },
    noFutureDate (date) {
      return new Date(date) <= new Date()
    },
    getCurrentDate () {
      const timeStamp = Date.now()
      return date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm')
    }
  }
}
