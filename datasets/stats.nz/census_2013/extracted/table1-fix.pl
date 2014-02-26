#!/usr/bin/perl -w

use strict;
use warnings;

#my $csv_header = <>;
#print $csv_header;

my $header = undef;
while (my $line = <>) {
    chomp $line;
    if ($line !~ /^\d/) {
        # header line
        $header = $line;
    }else{
        # data line
        if (defined $header) {
            print "$header,$line\n";
        }
    }
}
