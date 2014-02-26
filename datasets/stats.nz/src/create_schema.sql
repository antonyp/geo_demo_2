CREATE SCHEMA statsnz;

CREATE TABLE statsnz.usually_resident_popluation (
    area_unit_code integer PRIMARY KEY,
    area_unit_name text,
    population_2001 integer,
    population_2006 integer,
    population_2013 integer
);

CREATE TABLE statsnz.regional_summary_age_group_sex (
    area text,
    age text,
    male_2006 integer,
    female_2006 integer,
    total_2006 integer,
    male_2013 integer,
    female_2013 integer,
    total_2013 integer,

    PRIMARY KEY (area, age)
);
