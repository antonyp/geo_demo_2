        
function disclaimerBox () {
    bootbox.alert("<p>City noise mapping looks at the noise levels from transport and sometimes industrial / port noise sources. The aim is to capture and understand the ambient noise levels throughout the city to help with planning, building developments or to understand the health or social impacts from environmental noise.</p>" +
        "<p>Melbourne has lead the way within Australasia, being the only city to complete a road/rail/industrial city noise map, wrapped up in 2013.</p>" +
        "<p>To help people understand what a city noise map looks like, this site provides representation of noise from the Sydney road network. The noise levels are suggestive only, with arbitrary levels assigned to the road network based on the classification for each road. At this stage, these noise levels should not in any way be considered an accurate representation of the noise levels in any location. No consideration has been made for the actual traffic volumes / speed of each road, ground terrain, buildings, existing noise barriers and the like which would always be accounted for in a full city noise map.</p>" + 
        "By clicking OK you acknowledge the road traffic noise levels presented within this example are notional and are unlikely to reflect the actual noise environment.",
        function () {
            ga('send', 'event', 'button', 'click', 'closedisclaimer', 1);
        });
}

// show the box when the page loads
$(document).ready( disclaimerBox );

// also show the box when the user asks for more info
$(document).on("click", "#moreinfo", function() {
    disclaimerBox();
    ga('send', 'event', 'button', 'click', 'moreinfo', 1);
});
