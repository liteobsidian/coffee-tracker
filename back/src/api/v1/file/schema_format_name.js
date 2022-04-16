'use strict'
// Cловарь наимеований правил проверки соответствия формату данных,
// <Ключ> - идентификатор для применения в коде приложения
// <Значение>  - наименование должно строг соответствовать значениям указанным в теге format описательной схемы валидации,
// например (format: 'ГОД ПРЕДОСТАВЛЕНИЯ ДАННЫХ')

export const SCHEMA_FORMAT_NAME = {
  isOrganizationName: 'СООТВЕТСТВИЕ НАИМЕНОВАНИЯ СПРАВОЧНИКУ МЕДИЦИНСКИХ ОРГАНИЗАЦИЙ',
  isOrganizationOid: 'СООТВЕТСТВИЕ OID СПРАВОЧНИКУ МЕДИЦИНСКИХ ОРГАНИЗАЦИЙ',
  isDivisionName: 'СООТВЕТСТВИЕ НАИМЕНОВАНИЯ СПРАВОЧНИКУ ПОДРАЗДЕЛЕНИЯ М.О.',
  isDivisionOid: 'СООТВЕТСТВИЕ OID СПРАВОЧНИКУ ПОДРАЗДЕЛЕНИЯ М.О.',
  isFinanceNameActive: 'СООТВЕТСТВИЕ НАИМЕНОВАНИЯ ИСТОЧНИКА ФИНАНСИРОВАНИЯ НА ОТЧЕТНЫЙ ПЕРИОД',
  isPositionName: 'СООТВЕТСТВИЕ НАИМЕНОВАНИЯ ДОЛЖНОСТИ СПРАВОЧНОМУ НАИМЕНОВАНИЮ',
  isYearData: 'ГОД ПРЕДОСТАВЛЕНИЯ ДАННЫХ',
  checkNumber: 'ЧИСЛО',
  checkSnils: 'СНИЛС'
}
