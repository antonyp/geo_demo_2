cat census_2013/extracted/cleaned/usually-resident-population-count-by-area-unit.csv | \
    psql -c "COPY statsnz.usually_resident_popluation FROM STDIN CSV HEADER;"

cat census_2013/extracted/cleaned/regional-summary-table1.csv | \
    psql -c "COPY statsnz.regional_summary_age_group_sex FROM STDIN CSV HEADER;"
