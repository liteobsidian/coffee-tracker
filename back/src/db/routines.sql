create or replace function update_division_factor() returns boolean
    language plpgsql
as
$$
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
