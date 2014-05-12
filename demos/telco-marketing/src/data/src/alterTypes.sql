ALTER TABLE mb_stats_gme
    ALTER COLUMN urp TYPE integer USING (urp::integer),
    ALTER COLUMN urp_male TYPE integer USING (urp_male::integer),
    ALTER COLUMN urp_female TYPE integer USING (urp_female::integer),
    ALTER COLUMN urp_0_4 TYPE integer USING (urp_0_4::integer),
    ALTER COLUMN urp_5_9 TYPE integer USING (urp_5_9::integer),
    ALTER COLUMN urp_10_14 TYPE integer USING (urp_10_14::integer),
    ALTER COLUMN urp_15_19 TYPE integer USING (urp_15_19::integer),
    ALTER COLUMN urp_20_24 TYPE integer USING (urp_20_24::integer),
    ALTER COLUMN urp_25_29 TYPE integer USING (urp_25_29::integer),
    ALTER COLUMN urp_30_34 TYPE integer USING (urp_30_34::integer),
    ALTER COLUMN urp_35_39 TYPE integer USING (urp_35_39::integer),
    ALTER COLUMN urp_40_44 TYPE integer USING (urp_40_44::integer),
    ALTER COLUMN urp_45_49 TYPE integer USING (urp_45_49::integer),
    ALTER COLUMN urp_50_54 TYPE integer USING (urp_50_54::integer),
    ALTER COLUMN urp_55_59 TYPE integer USING (urp_55_59::integer),
    ALTER COLUMN urp_60_64 TYPE integer USING (urp_60_64::integer),
    ALTER COLUMN urp_65ov TYPE integer USING (urp_65ov::integer),
    ALTER COLUMN median_age TYPE real USING (median_age::real),
    ALTER COLUMN born_nz TYPE integer USING (born_nz::integer),
    ALTER COLUMN born_over TYPE integer USING (born_over::integer),
    ALTER COLUMN born_unk TYPE integer USING (born_unk::integer);