'use strict'

export const SCHEMA = `
SELECT schema_validation 
FROM stat.template 
WHERE NOT deleted 
AND type_report_id = $1 
AND period <= $2 
AND ( e_date isNull or e_date >= $2)
`
export const TEMPLATE_FILE_SCHEMA = `
SELECT template_file,schema_validation
FROM stat.template 
WHERE NOT deleted 
AND type_report_id = $1
AND period <= $2 
AND ( e_date isNull or e_date >= $2)
`
