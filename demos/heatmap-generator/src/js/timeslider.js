function TwoDigits(val){
    if (val < 10){
        return "0" + val;
    }

    return val;
}

var timeSlider = $("#slider").dateRangeSlider({
    bounds: {min: new Date(2012, 0, 1), max: new Date(2012, 0, 1, 23, 59, 59)},
    defaultValues: {min: new Date(2012, 0, 1, 10, 00, 00), max: new Date(2012, 0, 01, 11, 00, 00)},
    formatter: function(value){
        var hours = value.getHours(),
        minutes = value.getMinutes();
        return TwoDigits(hours) + ":" + TwoDigits(minutes);
    }
    /*
    scales: [{
        first: function(value){ return value; },
        end: function(value) {return value; },
        next: function(value){
                   var next = new Date(value);
                   return new Date(next.setHour(value.getHour() + 1));
               },
        label: function(value){
                   return value.getHour();
               },
        format: function(tickContainer, tickStart, tickEnd){
                    tickContainer.addClass("myCustomClass");
                }
    }]
    */
});
