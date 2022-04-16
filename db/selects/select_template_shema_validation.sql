-- Выборка всех плей структуры шаблона валидации
-- SELECT id, type_report_id, name, shema_validation, template_file, deleted, created_at, deleted_at
-- 	FROM stat.template;
SELECT value->'id' as id , 
       value->'name' as name, 
	   value->'type' as type,
	   value->'ref' as ref,
       value->'regexp' as reg,
	   value->'where' as wh
FROM stat.template, jsonb_array_elements(template.shema_validation) 
WHERE id =1;