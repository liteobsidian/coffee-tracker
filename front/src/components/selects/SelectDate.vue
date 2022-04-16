<template lang="pug">
  q-input.text-body2(
    :disable='disable'
    :dense='dense' :label='label'
    :value='value' @input='handleInput'
    mask='##.##.####'
    ref='selectdate'
    :rules='[ value => (!value || validateDate(value)) || "Введите корректную дату", ...rules ]'
    hide-bottom-space
  )
    template(v-slot:before)
      slot(name='before')
    template(v-slot:append)
      q-icon.cursor-pointer(v-if='!!value&&!disable' name='clear' @click='$emit("input", "")' size='20px')
      q-icon.cursor-pointer(size='20px' name='fal fa-calendar')
        q-popup-proxy(ref='qDateProxy' transition-show='scale' transition-hide='scale')
          q-date(:value='value' :locale='$options.localeDate' @input='selectDate' minimal mask='DD.MM.YYYY')
</template>

<script>
import { localeDate } from '@assets/localeDate'
const dateValidate = (value) => {
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
  localeDate: localeDate,
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
    rules: {
      type: Array,
      default: () => []
    }
  },
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
      return dateValidate(d)
    },
    handleInput (val) {
      this.validateDate(val) ? this.$emit('input', val) : this.$emit('input')
    }
  }
}
</script>
