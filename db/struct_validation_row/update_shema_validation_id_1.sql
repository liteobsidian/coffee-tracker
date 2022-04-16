UPDATE stat.template
	SET shema_validation='[
    {
       "id": 1,
       "name": "region",
       "rules": "[value => !!value,value => isFederalSubjectName(value)]"
    },
    {
        "id": 2,
        "name": "organization",
        "rules": "[value => !!value,value => isOrganizationName(value)]"        
    },
    {
        "id": 3,
        "name": "OID",
        "rules": "[value => !!value,value => isOrganizationOid(value)]"
    },
    {
        "id": 4,
        "name": "inn",
        "rules": "[value => !!value,value => /^[0-9]{12}$/.test(value)]"
    },
    {
        "id": 5,
        "name": "kpp",
        "rules": "[value => !!value,value => /^[0-9]{9}$/.test(value)]"
    },

    {
        "id": 6,
        "name": "division",
        "rules": "[value => !!value,value => isDivisionName(value)]"
    },
    {
        "id": 7,
        "name": "oid_division",
        "rules": "[value => !!value,value => isDivisionOid(value)]"
    },
    {
        "id": 8,
        "name": "month",
        "rules": "[value => !!value,value => isMonthNameRus(value)]"
    },
    {
        "id": 9,
        "name": "year",
        "rules": "[value => !!value,value => isYearYYYY(value)]"
    },
    {
        "id": 10,
        "name": "snils",
        "rules": "[value => !!value,value => /^[0-9]{11}$/.test(value)]"
    },
    {
        "id": 11,
        "name": "position",
        "rules": "[value => !!value,value => isPositionName(value)]"
    },
    {
        "id": 12,
        "name": "stavka",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },    
    {
        "id": 13,
        "name": "usl_zan",
        "rules": "[value =>/(Основное|Внутреннее совместительство|Внешнее совместительство)/.test(value)]"
    },
    {
        "id": 14,
        "name": "num_dog",
        "rules": "[value => !!value]"
    },
    {
        "id": 15,
        "name": "date_dog",
        "rules": "[value => !!value]"
    },
    {
        "id": 16,
        "name": "tab_nom",
        "type": "string",
        "rules": "[value => !!value]"
    },
    {
        "id": 17,
        "name": "finance_source",
        "rules": "[value => !!value,value => isFinanceSource(value,period)]"
    },
    {
        "id": 18,
        "name": "prod_r_time",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 19,
        "name": "norma_r_time",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 20,
        "name": "fark_r_time",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 21,
        "name": "prod_rt_covid",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 22,
        "name": "prod_rt_415",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 23,
        "name": "prod_rt_484",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 24,
        "name": "dolg_oklad",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 25,
        "name": "vyp_osob_usl",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 26,
        "name": "koeff_ray",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 27,
        "name": "koeff_pust",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 28,
        "name": "koeff_gor",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 29,
        "name": "koeff_sev",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 30,
        "name": "dop_sovm",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 31,
        "name": "dop_sel",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 32,
        "name": "dop_zon",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 33,
        "name": "dop_obj",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 34,
        "name": "dop_rab",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 35,
        "name": "dop_kval",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 36,
        "name": "dop_vyx",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"        
    },
    {
        "id": 37,
        "name": "dop_noc",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 38,
        "name": "nadb_gos",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 39,
        "name": "inye_vyp",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 40,
        "name": "nadb_int",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 41,
        "name": "prem_v_res",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 42,
        "name": "prem_os_vag",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 43,
        "name": "nadb_kat",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 44,
        "name": "prem_zad",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 45,
        "name": "nadb_vys",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 46,
        "name": "nadb_stag",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"        
    },
    {
        "id": 47,
        "name": "prem_mes",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"        
    },
    {
        "id": 48,
        "name": "prem_kvart",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"        
    },
    {
        "id": 49,
        "name": "prem_god",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 50,
        "name": "nadb_m_spec",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"        
    },
    {
        "id": 51,
        "name": "nadb_zvan",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 52,
        "name": "nadb_u_step",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"        
    },
    {
        "id": 53,
        "name": "nadb_selo",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 54,
        "name": "nadb_uchast",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"        
    },
    {
        "id": 55,
        "name": "r_k_pust_415",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"        
    },
    {
        "id": 56,
        "name": "r_k_sev_415",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 57,
        "name": "vyp_st_415",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"        
    },
    {
        "id": 58,
        "name": "sum_str_415",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"        
    },
    {
        "id": 59,
        "name": "r_k_pust_484",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 60,
        "name": "vyp_st_484",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 61,
        "name": "sum_st_484",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 62,
        "name": "inye_vyp_st",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 63,
        "name": "opl_neotr_711",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 64,
        "name": "dop_vyp_covid",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    },
    {
        "id": 65,
        "name": "dop_vyp_3118",
        "rules": "[value =>/^[0-9]+(.[0-9]{1,2})?$/.test(value)]"
    }
]
'
	WHERE id = 1;