create or replace function report_nalog(beg_period date, end_period date) returns json
	immutable
	language plpgsql as $$
DECLARE
	beg_date timestamp default '1970-01-01'::date;
	end_date timestamp default '2199-12-31'::date;
	temp_json json;
BEGIN
	IF (beg_period is not null) THEN
		beg_date = beg_period::date;
	END IF;
	IF (end_period is not null) THEN
		end_date = end_period::date;
	END IF;
	with sum as (
		SELECT sum(a.cash_sum + a.uncash_sum) as period_cash,
			a.division_id
		from workday a
		where a.date <= current_date and a.date >= beg_date
		group by a.division_id
	),
		select_remains as (
			SELECT jsonb_build_array(to_char(a.date, 'DD.MM.YYYY'), c.id, c.name, (a.cash_sum + a.uncash_sum)::numeric(15,2),
															 b.period_cash::numeric(15,2)
				) as obj
			from workday a
						 left join sum b on a.division_id = b.division_id
						 left join division c on a.division_id = c.id
			where a.date <= current_date and a.date >= beg_date
			order by a.date
		) select jsonb_agg(obj) from select_remains
	INTO temp_json;
	RETURN temp_json;
EXCEPTION
	WHEN others THEN RAISE EXCEPTION '%',sqlerrm;
END;
$$;

create or replace function report_user(beg_period date, end_period date) returns json
	immutable
	language plpgsql as $$
DECLARE
	beg_date timestamp default '1970-01-01'::date;
	end_date timestamp default '2199-12-31'::date;
	temp_json json;
BEGIN
	IF (beg_period is not null) THEN
		beg_date = beg_period::date;
	END IF;
	IF (end_period is not null) THEN
		end_date = end_period::date;
	END IF;
	with temp as (
		SELECT jsonb_build_array(b.name, c.name,
			coalesce(EXTRACT(epoch from sum(a.date_close - a.date_open))/3600, 0)::numeric(5,3),
			sum(a.cash_sum + a.uncash_sum)::numeric(15,2)
		) as obj
		from workday a
					 left join auth_users b on a.auth_user_id = b.id
					 left join division c on a.division_id = c.id
		where a.date >= beg_date and a.date <= end_date
		group by b.name, c.name, a.auth_user_id, a.division_id
		order by sum(a.cash_sum + a.uncash_sum) desc, a.division_id
	) select jsonb_agg(obj) from temp
			INTO temp_json;
	RETURN temp_json;
EXCEPTION
	WHEN others THEN RAISE EXCEPTION '%',sqlerrm;
END;
$$;

create or replace function update_division_factor() returns boolean
	language plpgsql as $$
BEGIN
    with division_value as (
        select sum(a.cash_sum + a.uncash_sum)::numeric(15, 2) as cash, a.division_id
        from workday a
        where date_close is not null
          and date_close::date <= current_date
          and date_close > current_date - interval '1 month'
        group by a.division_id
    ), max_cash as (
        select max(cash) as max
        from division_value
    ), calculate_factor as (select a.division_id, (((a.cash / b.max) * 0.5) + 0.6)::numeric(4,2) as factor
    from division_value a
    left join max_cash b on b is not null)
    update division set factor = a.factor from calculate_factor a where a.division_id = id;
    return true;
END;
$$;
