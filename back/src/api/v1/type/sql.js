'use strict'
export const LIST = `
SELECT a.id, a.name
FROM stat.type_report as a
WHERE NOT a.deleted
`
export const GET = `
SELECT a.id, a.name
FROM stat.type_report as a
WHERE NOT a.deleted 
AND  a.id = $1
`
