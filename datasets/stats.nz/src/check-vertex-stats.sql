select sum(ST_NPoints(ST_SimplifyPreserveTopology(geom, 2))) as total_vertices_across_features
from statsnz.usually_resident_population_au;

select ST_NPoints(ST_SimplifyPreserveTopology(geom, 2)) as max_vertices_per_feature
from statsnz.usually_resident_population_au
order by st_npoints desc
limit 1;

select count(*) as num_features
from statsnz.usually_resident_population_au;
