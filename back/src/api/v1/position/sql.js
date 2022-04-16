'use strict'
export const LIST = `
SELECT id, name FROM stat.auth_position;
`
export const FIND_BY_NAME = `
SELECT id, name FROM stat.auth_position 
WHERE LOWER(name)=LOWER($1);
`
export const LIST_NAME = `
SELECT name FROM stat.auth_position
`
