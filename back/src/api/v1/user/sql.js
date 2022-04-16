'use strict'
export const GET = `
    SELECT a.id,a.name,get_fullname(a.full_name) AS full_name,
    get_shortname(a.full_name,1) AS short_name, get_initials(a.full_name) AS initials,
    get_organization_by_id_lite(a.organization_id) AS organization,
    a.type, a.mobil_phone, thmb_avatar AS avatar
    FROM auth_users a WHERE id = $1
`
