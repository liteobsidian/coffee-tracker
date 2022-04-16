import date from 'date-and-time'

export const getFormatValue = v => {
  if ('valueType' in v) {
    const format = getFormat(v)
    const value = getValue(v)
    if (format) {
      if (v.valueType === 'money') {
        return new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
          currencyDisplay: 'symbol',
          useGrouping: false
        }).format(value)
      } else if (v.valueType === 'numeric') {
        const [, c = ''] = format.split('.')
        return new Intl.NumberFormat('ru-RU', {
          style: 'decimal',
          useGrouping: false,
          minimumFractionDigits: c.length,
          maximumFractionDigits: c.length
        }).format(value)
      } else if (v.valueType === 'date') {
        let newFormat
        if (format.slice(-2) === 'mm') {
          newFormat = `${format.slice(0, format.length - 2).toUpperCase()}hh`
        } else {
          newFormat = format.toUpperCase()
        }
        return date.format(value, newFormat)
      } else {
        return `${value}`
      }
    } else {
      return value
    }
  } else {
    return v.value
  }
}

export const getValue = v => {
  if ('valueType' in v) {
    let value = v.value
    if (v.valueType === 'integer') {
      try {
        value = parseInt(v.value, 10)
      } catch (e) {
        throw new Error(`Невозможно привести тип данных ${v.value} к целому типу`)
      }
    } else if (v.valueType === 'money' || v.valueType === 'numeric') {
      try {
        value = +v.value
      } catch (e) {
        throw new Error(`Невозможно привести тип данных ${v.value} к числовому типу`)
      }
    } else if (v.valueType === 'date') {
      try {
        value = new Date(v.value)
      } catch (e) {
        throw new Error(`Невозможно привести тип данных ${v.value} к типу дата`)
      }
    }
    return value
  } else {
    return v.value || ''
  }
}

export const getFormat = v => {
  if ('valueType' in v) {
    if (v.valueType === 'integer') {
      return '0'
    } else if (v.valueType === 'money') {
      return '0.00'
    } else if (v.valueType === 'numeric') {
      return v.format || '0.00'
    } else if (v.valueType === 'date') {
      return v.format || 'dd.mm.yyyy'
    } else {
      return v.format || ''
    }
  } else {
    return v.format || ''
  }
}

export const applyStyle = (cell, v) => {
  if ('styles' in v) {
    Object.keys(v).forEach(k => {
      cell.style(k, v[k])
    })
  }
}

// 1. Проверка контрольного числа Страхового номера проводится только для номеров больше номера 001-001-998
// 2. Контрольное число СНИЛС рассчитывается следующим образом:
// 1. Каждая цифра СНИЛС умножается на номер своей позиции (позиции отсчитываются с конца)
// 2. Полученные произведения суммируются
// 3. Если сумма меньше 100, то контрольное число равно самой сумме
// 4. Если сумма равна 100 или 101, то контрольное число равно 00
// 5. Если сумма больше 101, то сумма делится по остатку на 101 и контрольное число определяется остатком от деления аналогично пунктам 2.3 и 2.4
// 3. Добавлены исключения на 000-000-000 00 и 999-999-999 01
const MINSNILS = '001001998'
const EXT1 = '00000000000'
const EXT2 = '99999999901'
export const verifySnils = (snils) => {
  // console.log(snils)
  let controllNum = 0
  if (snils === EXT1 || snils === EXT2) return true
  if (typeof snils !== 'string') return false
  snils = snils.replace(/-/g, '')
  snils = snils.replace(/\s/g, '')
  const kr = parseInt(snils.substr(-2), 10)
  // console.log('kr=',kr)
  snils = snils.substr(0, snils.length - 2)
  if (snils <= MINSNILS) return false
  const asnils = snils.split('')
  let summa = 0
  asnils.reverse().forEach((el, i) => {
    summa = summa + el * (i + 1)
  })
  // console.log('summa',summa)
  if (summa < 100) { controllNum = summa }
  if (summa > 101) {
    controllNum = summa % 101
    summa = controllNum
  }
  if (summa === 100 || summa === 101) { controllNum = 0 }
  //   console.log('controlNum=',controllNum)
  //   console.log('kr=',kr)
  //   console.log(typeof controllNum)
  //   console.log(typeof kr)
  return (controllNum === kr)
}
