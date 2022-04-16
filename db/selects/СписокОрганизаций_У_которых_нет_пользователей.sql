SELECT a.id, a.short_name
FROM stat.organization a
WHERE NOT EXISTS (
    SELECT 1 FROM stat.auth_users u
    WHERE u.organization_id = a.id
)