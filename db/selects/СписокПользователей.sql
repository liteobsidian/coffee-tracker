SELECT a.organization_id as org_id, o.short_name, a.name as login, a.full_name->>'last_name' as lastname,
       a.full_name->>'first_name' as firstname,
	   a.full_name->>'middle_name' as middlename, 
	   a.mobil_phone, a.email, a.created_at, a.deleted_at
	FROM stat.auth_users as a
	join stat.organization as o on o.id = a.organization_id
	where NOT a.deleted
	order by o.idx_in_report;