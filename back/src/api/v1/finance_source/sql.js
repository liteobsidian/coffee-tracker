'use strict'
export const LIST = `
SELECT id, name, b_date, e_date 
FROM stat.finance_source;
`
export const LIST_ACTIVE = `
SELECT id, name, b_date, e_date FROM stat.finance_source 
WHERE b_date <= $1 AND ( e_date isNull or e_date >= $1)
`
