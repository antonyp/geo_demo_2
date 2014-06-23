#!/usr/bin/perl -wT

use warnings;
use strict;
use URI;

my $request_url = 'https://maps.googleapis.com/maps/api/distancematrix/json?';

my %parameters = (
    'client' => 'gme-optimationcloudservices',
    'origins' => '-33.860,151.200',
    'mode' => 'driving'
);

my @bbox = (151.140,-33.880,151.280,-33.820);

open ( my $dest_points_fh, '>', 'dest.csv');

print $dest_points_fh "lat,lon\n";

my @destinations = ();
my $points = 0;
for ( my $lat = $bbox[1]; $lat < $bbox[3]; $lat += 0.005 ) {
    for ( my $lon = $bbox[0]; $lon < $bbox[2]; $lon += 0.005 ) {
        $points += 1;
        push @destinations, "$lat,$lon";
        print $dest_points_fh "$lat,$lon\n";
    }
}

close $dest_points_fh;

$parameters{'destinations'} = join ( '|', @destinations);

my $uri = URI->new($request_url);
$uri->query_form(%parameters);

print $uri;

print STDERR "URL Length: " . length ($uri) . "\n";
print STDERR "Total Points: $points\n";
