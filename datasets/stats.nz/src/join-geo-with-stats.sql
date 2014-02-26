CREATE TABLE statsnz.usually_resident_population_au
AS
SELECT
  au.au2013_nam,
  pop.population_2001,
  (pop.population_2001::numeric / au.land_area_) population_2001_per_land_unit,
  pop.population_2006,
  (pop.population_2006::numeric / au.land_area_) population_2006_per_land_unit,
  pop.population_2013,
  (pop.population_2013::numeric / au.land_area_) population_2013_per_land_unit,
  au.land_area_ land_area,
  au.geom
FROM
  statsnz.au au,
  statsnz.usually_resident_popluation pop
WHERE
  CAST(au.au2013 AS integer) = pop.area_unit_code
  AND
  au.land_area_ != 0;
