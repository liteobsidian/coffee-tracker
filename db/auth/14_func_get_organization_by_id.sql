original
CREATE OR REPLACE FUNCTION stat.get_organization_by_id(IN in_id bigint)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    IMMUTABLE
    PARALLEL UNSAFE
    COST 100
    
AS $BODY$
DECLARE
    temp_organization jsonb DEFAULT '{}';
BEGIN
    SELECT jsonb_build_object(
        'id',coalesce(a.id,0),
        'name',coalesce(a.name,''),
        'full_name',coalesce(a.full_name,''),
        'short_name',coalesce(a.short_name,''),
        'client_id', coalesce(a.client_id,''),
        'client_secret',coalesce(a.client_secret,''),
        'sb_client_id',coalesce(a.sb_client_id,''),
        'sb_client_secret',coalesce(a.sb_client_secret,''),
        'sandbox',coalesce(a.sandbox,true)
    ) AS organization
    FROM organization AS a
    WHERE a.id = in_id
    INTO STRICT temp_organization;
    RETURN temp_organization;
EXCEPTION WHEN NO_DATA_FOUND THEN    
    RETURN jsonb_build_object('id',0,'name','','full_name','','short_name',''); 
END;
$BODY$;

CREATE OR REPLACE FUNCTION stat.get_organization_by_id_lite(IN in_id bigint)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    IMMUTABLE
    PARALLEL UNSAFE
    COST 100
    
AS $BODY$
DECLARE
    temp_organization jsonb DEFAULT '{}';
BEGIN
    SELECT jsonb_build_object(
        'id',coalesce(a.id,0),
        'name',coalesce(a.name,''),
        'full_name',coalesce(a.full_name,''),
        'short_name',coalesce(a.short_name,'')
    ) AS organization
    FROM organization AS a
    WHERE a.id = in_id
    INTO STRICT temp_organization;
    RETURN temp_organization;
EXCEPTION WHEN NO_DATA_FOUND THEN    
    RETURN jsonb_build_object('id',0,'name','','full_name','','short_name',''); 
END;
$BODY$;