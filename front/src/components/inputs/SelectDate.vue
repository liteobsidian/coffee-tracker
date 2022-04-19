<template lang='pug'>
  q-input(
    :disable='disable'
    :readonly='readonly'
    :dense='dense'
    :label='label'
    :value='value'
    @input='handleInput($event)'
    mask='##.##.####' ref='selectdate'
    :rules='[ value => (!value || validateDate(value)) || "Введите корректную дату", ...rules ]'
    hide-bottom-space
  )
    template(v-slot:before)
      slot(name='before')
    template(v-slot:append)
      q-icon.cursor-pointer(v-if='!!value&&!disable&&!readonly' name='close' @click='$emit("clear")' size='20px')
      q-icon.cursor-pointer(size='20px' name='calendar_today' :disabled='disable || readonly')
        q-popup-proxy(v-if='!disable&&!readonly' ref='qDateProxy' transition-show='scale' transition-hide='scale')
          q-date(:value='value' :locale='myLocale' @input='selectDate' minimal mask='DD.MM.YYYY')
</template>

<script>
const validateDate = (value) => {
  const arrD = value.split('.')
  arrD[1] -= 1
  const d = new Date(arrD[2], arrD[1], arrD[0])
  if ((arrD[2].length === 4) && (d.getFullYear() === +arrD[2]) && (d.getMonth() === +arrD[1]) && (d.getDate() === +arrD[0])) {
    return true
  } else {
    return false
  }
}
export default {
  name: 'SelectDate',
  props: {
    value: {
      type: String,
      default: ''
    },
    disable: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'Выберите дату'
    },
    dense: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    myLocale: {
      days: 'Воскресенье,Понедельник,Вторник,Среда,Четверг,Пятница,Суббота'.split(','),
      daysShort: 'Вс,Пн,Вт,Ср,Чт,Пт,Сб'.split(','),
      months: 'Январь,Февраль,Март,Апрель,Май,Июнь,Июль,Август,Сентябрь,Октябрь,Ноябрь,Декабрь'.split(','),
      monthsShort: 'Янв,Фев,Мар,Апр,Май,Июн,Июл,Авг,Сен,Окт,Ноя,Дек'.split(','),
      firstDayOfWeek: 1
    }
  }),
  computed: {
    hasError () {
      return this.$refs.selectdate.hasError
    }
  },
  methods: {
    selectDate (e) {
      this.$emit('input', e)
      this.$refs.qDateProxy.hide()
    },
    validateDate (d) {
      return validateDate(d)
    },
    handleInput (val) {
      this.validateDate(val) ? this.$emit('input', val) : this.$emit('input', '')
    }
  }
}
</script>

<style>

</style>
