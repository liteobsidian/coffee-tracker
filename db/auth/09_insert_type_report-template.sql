-- INSERT INTO stat.type_report(name)	VALUES ('Мониторинг_ЗП');

INSERT INTO stat.template(
	type_report_id, name, shema_validation, template_file)
	VALUES (1, 'Шаблон XLSX v2021_Мониторинг_ЗП_v7', 
    '[
    {
       "id": 1,
       "name": "region",
       "type": "string",
       "ref" : "federal_subject.name",
       "regexp": ""
    },
    {
        "id": 2,
        "name": "organization",
        "type": "string",
        "ref" : "organization.name",
        "regexp": ""
    },
    {
        "id": 3,
        "name": "OID",
        "type": "string",
        "ref" : "organization.oid",
        "regexp": ""
    },
    {
        "id": 4,
        "name": "inn",
        "type": "string",
        "ref" : "",
        "regexp": "^([0-9]{10}|[0-9]{12})$"
    },
    {
        "id": 5,
        "name": "kpp",
        "type": "string",
        "ref" : "",
        "regexp": "^([0-9]{9})?$"
    },

    {
        "id": 6,
        "name": "division",
        "type": "string",
        "ref" : "division.name",
        "where": "name = $1",
        "regexp": ""
    },
    {
        "id": 7,
        "name": "oid_division",
        "type": "string",
        "ref" : "division.oid",
        "where": "oid = $1",
        "regexp": ""
    },
    {
        "id": 8,
        "name": "month",
        "type": "string",
        "ref" : "",
        "regexp": "(Январь|Февраль|Март|Апрель|Май|Июнь|Июль|Август|Сентябрь|Октябрь|Ноябрь|Декабрь)"
    },
    {
        "id": 9,
        "name": "year",
        "type": "string",
        "ref" : "",
        "regexp": "(2021|2022|2023|2024|2025)"
    },
    {
        "id": 10,
        "name": "snils",
        "type": "string",
        "ref" : "",
        "regexp": "^([0-9]{11})?$"
    },
    {
        "id": 11,
        "name": "position",
        "type": "string",
        "ref" : "position.name",
        "where": "name = $1",
        "regexp": ""
    },
    {
        "id": 12,
        "name": "stavka",
        "type": "numeric(10,2)",
        "ref" : "",
        "where": "",
        "regexp": ""
    },    
    {
        "id": 13,
        "name": "usl_zan",
        "type": "string",
        "ref" : "",
        "regexp": "(Основное|Внутреннее совместительство|Внешнее совместительство)"
    },
    {
        "id": 14,
        "name": "num_dog",
        "type": "string",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 15,
        "name": "date_dog",
        "type": "string",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 16,
        "name": "tab_nom",
        "type": "string",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 17,
        "name": "finance_source",
        "type": "string",
        "ref" : "finance_source.name",
        "where": "name = $1 and b_date <= $2 and (e_date = null or e_date >= $2)",
        "regexp": ""
    },
    {
        "id": 18,
        "name": "prod_r_time",
        "type": "numeric(10,2)",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 19,
        "name": "norma_r_time",
        "type": "numeric(10,2)",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 20,
        "name": "fark_r_time",
        "type": "numeric(10,2)",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 21,
        "name": "prod_rt_covid",
        "type": "numeric(10,2)",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 22,
        "name": "prod_rt_415",
        "type": "numeric(10,2)",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 23,
        "name": "prod_rt_484",
        "type": "numeric(10,2)",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 24,
        "name": "dolg_oklad",
        "type": "numeric(10,2)",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 25,
        "name": "vyp_osob_usl",
        "type": "numeric(10,2)",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 26,
        "name": "koeff_ray",
        "type": "numeric(10,2)",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 27,
        "name": "koeff_pust",
        "type": "numeric(10,2)",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 28,
        "name": "koeff_gor",
        "type": "numeric(10,2)",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 29,
        "name": "koeff_sev",
        "type": "numeric(10,2)",
        "ref" : "",
        "regexp": ""
    },
    {
        "id": 30,
        "name": "dop_sovm",
        "type": "numeric(10,2)"
    },
    {
        "id": 31,
        "name": "dop_sel",
        "type": "numeric(10,2)"
    },
    {
        "id": 32,
        "name": "dop_zon",
        "type": "numeric(10,2)"
    },
    {
        "id": 33,
        "name": "dop_obj",
        "type": "numeric(10,2)"
    },
    {
        "id": 34,
        "name": "dop_rab",
        "type": "numeric(10,2)"
    },
    {
        "id": 35,
        "name": "dop_kval",
        "type": "numeric(10,2)"
    },
    {
        "id": 36,
        "name": "dop_vyx",
        "type": "numeric(10,2)"
    },
    {
        "id": 37,
        "name": "dop_noc",
        "type": "numeric(10,2)"
    },
    {
        "id": 38,
        "name": "nadb_gos",
        "type": "numeric(10,2)"
    },
    {
        "id": 39,
        "name": "inye_vyp",
        "type": "numeric(10,2)"
    },
    {
        "id": 40,
        "name": "nadb_int",
        "type": "numeric(10,2)"
    },
    {
        "id": 41,
        "name": "prem_v_res",
        "type": "numeric(10,2)"
    },
    {
        "id": 42,
        "name": "prem_os_vag",
        "type": "numeric(10,2)"
    },
    {
        "id": 43,
        "name": "nadb_kat",
        "type": "numeric(10,2)"
    },
    {
        "id": 44,
        "name": "prem_zad",
        "type": "numeric(10,2)"
    },
    {
        "id": 45,
        "name": "nadb_vys",
        "type": "numeric(10,2)"
    },
    {
        "id": 46,
        "name": "nadb_stag",
        "type": "numeric(10,2)"
    },
    {
        "id": 47,
        "name": "prem_mes",
        "type": "numeric(10,2)"
    },
    {
        "id": 48,
        "name": "prem_kvart",
        "type": "numeric(10,2)"
    },
    {
        "id": 49,
        "name": "prem_god",
        "type": "numeric(10,2)"
    },
    {
        "id": 50,
        "name": "nadb_m_spec",
        "type": "numeric(10,2)"
    },
    {
        "id": 51,
        "name": "nadb_zvan",
        "type": "numeric(10,2)"
    },
    {
        "id": 52,
        "name": "nadb_u_step",
        "type": "numeric(10,2)"
    },
    {
        "id": 53,
        "name": "nadb_selo",
        "type": "numeric(10,2)"
    },
    {
        "id": 54,
        "name": "nadb_uchast",
        "type": "numeric(10,2)"
    },
    {
        "id": 55,
        "name": "r_k_pust_415",
        "type": "numeric(10,2)"
    },
    {
        "id": 56,
        "name": "r_k_sev_415",
        "type": "numeric(10,2)"
    },
    {
        "id": 57,
        "name": "vyp_st_415",
        "type": "numeric(10,2)"
    },
    {
        "id": 58,
        "name": "sum_str_415",
        "type": "numeric(10,2)"
    },
    {
        "id": 59,
        "name": "r_k_pust_484",
        "type": "numeric(10,2)"
    },
    {
        "id": 60,
        "name": "vyp_st_484",
        "type": "numeric(10,2)"
    },
    {
        "id": 61,
        "name": "sum_st_484",
        "type": "numeric(10,2)"
    },
    {
        "id": 62,
        "name": "inye_vyp_st",
        "type": "numeric(10,2)"
    },
    {
        "id": 63,
        "name": "opl_neotr_711",
        "type": "numeric(10,2)"
    },
    {
        "id": 64,
        "name": "dop_vyp_covid",
        "type": "numeric(10,2)"
    },
    {
        "id": 65,
        "name": "dop_vyp_3118",
        "type": "numeric(10,2)"
    }
]', 
    'template_v2021_v7.xlsx');