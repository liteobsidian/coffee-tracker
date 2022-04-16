'use strict'
// Схема валидации данных используемая по умолчанию для отчетности type_report_id=1 по ЗП

export const SCHEMA_DEFAULT = {
  type: 'array',
  items: {
    type: 'array',
    items: [
      {
        title: '0 Область',
        description: 'наименование области к которой относится медицинская организация',
        examples: ['Липецкая область'],
        type: 'string',
        const: 'Липецкая область'
      },
      {
        title: '1 Наименование медицинской организации',
        description: 'Полное официальное наименование медицинской органиазции',
        type: 'string',
        format: 'СООТВЕТСТВИЕ НАИМЕНОВАНИЯ СПРАВОЧНИКУ МЕДИЦИНСКИХ ОРГАНИЗАЦИЙ'
      },
      {
        title: '2 OID медорганизации',
        description: 'OID медицинской организациии в системе ЕГИСЗ',
        type: 'string',
        format: 'СООТВЕТСТВИЕ OID СПРАВОЧНИКУ МЕДИЦИНСКИХ ОРГАНИЗАЦИЙ'
      },
      {
        title: '3 ИНН',
        description: 'ИНН медицинской организации',
        examples: ['4821011419'],
        type: 'string',
        pattern: '[0-9]{10}'
      },
      {
        title: '4 КПП',
        description: 'КПП медицинской организации',
        examples: ['482101001'],
        type: 'string',
        pattern: '[0-9]{9}'
      },
      {
        title: '5 Подразделение',
        description: 'Наименование подразделения (отделения) медицинской организации',
        format: 'СООТВЕТСТВИЕ НАИМЕНОВАНИЯ СПРАВОЧНИКУ ПОДРАЗДЕЛЕНИЯ М.О.',
        type: 'string'
      },
      {
        title: '6 OID подразделения',
        description: 'OID подразделения (отделения) медицинской организации',
        format: 'СООТВЕТСТВИЕ OID СПРАВОЧНИКУ ПОДРАЗДЕЛЕНИЯ М.О.',
        type: 'string'
      },
      {
        title: '7 Месяц',
        description: 'Месяц формирования отчета',
        examples: ['Январь'],
        type: 'string',
        enum: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
      },
      {
        title: '8 Год',
        description: 'Год формирования отчета',
        format: 'ГОД ПРЕДОСТАВЛЕНИЯ ДАННЫХ'
      },
      {
        title: '9 СНИЛС',
        description: 'СНИЛС сотрудника',
        format: 'СНИЛС'
      },
      {
        title: '10 Должность',
        description: 'Должность сотрудника',
        type: 'string',
        format: 'СООТВЕТСТВИЕ НАИМЕНОВАНИЯ ДОЛЖНОСТИ СПРАВОЧНОМУ НАИМЕНОВАНИЮ'
      },
      {
        title: '11 Ставка',
        description: 'Размер ставки сотрудника',
        examples: [0.5, 1],
        type: 'number'
      },
      {
        title: '12 Занятость',
        description: 'Условия занятости сотрудника',
        examples: ['Основное', 'Внутреннее совместительство'],
        type: 'string',
        enum: ['Основное', 'Внутреннее совместительство', 'Внешнее совместительство']
      },
      {
        title: '13 Номер договора',
        description: 'Номер трудового договора',
        type: 'string',
        pattern: '^.+$'
      },
      {
        title: '14 Дата договора',
        description: 'Дата трудового договора',
        format: 'date'
      },
      {
        title: '15 Табельный номер',
        description: 'Табельный номер сотрудника',
        type: 'string',
        pattern: '^.+$'
      },
      {
        title: '16 Источник финасирования',
        description: 'Источник финансирования сотрудника',
        type: 'string',
        format: 'СООТВЕТСТВИЕ НАИМЕНОВАНИЯ ИСТОЧНИКА ФИНАНСИРОВАНИЯ НА ОТЧЕТНЫЙ ПЕРИОД'
      },
      {
        title: '17 Продолжительность рабочего времени',
        description: 'Продолжительность рабочего времени в неделю (часы)',
        maximum: 40,
        minimum: 18,
        format: 'ЧИСЛО'
      },
      {
        title: '18 Норма рабочего времени',
        description: 'Норма рабочего времени (часы)',
        type: 'number',
        default: 0
      },
      {
        title: '19 Фактическое отработанное время',
        description: 'Фактическое количество отработанного времени (часы)',
        type: 'number',
        default: 0
      },
      {
        title: '20 Фактическое отработанное время по COVID-19',
        description: 'Фактическое количество отработанного времени  для начисления выплат за оказание помощи, участвующим в оказании помощи больным Covid-19 ( часы )',
        type: 'number',
        default: 0
      },
      {
        title: '21 Фактическое отработанное время по ПП РФ 415',
        description: 'Фактическое количество отработанного времени  для начисления выплат по ПП РФ 415 (часы)',
        type: 'number',
        default: 0
      },
      {
        title: '22 Фактическое отработанное время по ПП РФ 484',
        description: 'Фактическое количество отработанного времени для начисления выплат по ПП РФ 484 (часы)',
        type: 'number',
        default: 0
      },
      {
        title: '23 Должностной оклад',
        description: 'Должностной оклад',
        type: 'number',
        default: 0
      },
      {
        title: '24',
        type: 'number',
        default: 0
      },
      {
        title: '25',
        type: 'number',
        default: 0
      },
      {
        title: '26',
        type: 'number',
        default: 0
      },
      {
        title: '27',
        type: 'number',
        default: 0
      },
      {
        title: '28',
        type: 'number',
        default: 0
      },
      {
        title: '29',
        type: 'number',
        default: 0
      },
      {
        title: '30',
        type: 'number',
        default: 0
      },
      {
        title: '31',
        type: 'number',
        default: 0
      },
      {
        title: '32',
        type: 'number',
        default: 0
      },
      {
        title: '33',
        type: 'number',
        default: 0
      },
      {
        title: '34',
        type: 'number',
        default: 0
      },
      {
        title: '35',
        type: 'number',
        default: 0
      },
      {
        title: '36',
        type: 'number',
        default: 0
      },
      {
        title: '37',
        type: 'number',
        default: 0
      },
      {
        title: '38',
        type: 'number',
        default: 0
      },
      {
        title: '39',
        type: 'number',
        default: 0
      },
      {
        title: '40',
        type: 'number',
        default: 0
      },
      {
        title: '41',
        type: 'number',
        default: 0
      },
      {
        title: '42',
        type: 'number',
        default: 0
      },
      {
        title: '43',
        type: 'number',
        default: 0
      },
      {
        title: '44',
        type: 'number',
        default: 0
      },
      {
        title: '45',
        type: 'number',
        default: 0
      },
      {
        title: '46',
        type: 'number',
        default: 0
      },
      {
        title: '47',
        type: 'number',
        default: 0
      },
      {
        title: '48',
        type: 'number',
        default: 0
      },
      {
        title: '49',
        type: 'number',
        default: 0
      },
      {
        title: '50',
        type: 'number',
        default: 0
      },
      {
        title: '51',
        type: 'number',
        default: 0
      },
      {
        title: '52',
        type: 'number',
        default: 0
      },
      {
        title: '53',
        type: 'number',
        default: 0
      },
      {
        title: '54',
        type: 'number',
        default: 0
      },
      {
        title: '55',
        type: 'number',
        default: 0
      },
      {
        title: '56',
        type: 'number',
        default: 0
      },
      {
        title: '57',
        type: 'number',
        default: 0
      },
      {
        title: '58',
        type: 'number',
        default: 0
      },
      {
        title: '59',
        type: 'number',
        default: 0
      },
      {
        title: '60',
        type: 'number',
        default: 0
      },
      {
        title: '61',
        type: 'number',
        default: 0
      },
      {
        title: '62',
        type: 'number',
        default: 0
      },
      {
        title: '63',
        type: 'number',
        default: 0
      },
      {
        title: '64',
        type: 'number',
        default: 0
      }
    ]
  }
}
