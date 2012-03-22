function calculateForm() {
    var revProjection = {};
    revProjection['ad-impressions'] = parseInt($('#ad-impressions').val());
    revProjection['fill-rate'] = ($('#fill-rate').val()) / 100;
    revProjection['ctr'] = ($('#ctr').val()) / 100;
    revProjection['cpc'] = ($('#cpc').val());

    revProjection['ads-displayed'] = parseInt(revProjection['ad-impressions'] * revProjection['fill-rate']);
    revProjection['total-clicks'] = parseInt(revProjection['ads-displayed'] * revProjection['ctr']);
    revProjection['month-projected-rev'] = parseFloat((revProjection['total-clicks'] * revProjection['cpc']) * 1.00);
    revProjection['ecpm'] = revProjection['month-projected-rev'] / (revProjection['ads-displayed'] * 0.001);

    $('#ads-displayed').val(revProjection['ads-displayed']);
    $('#total-clicks').val(revProjection['total-clicks']);
    $('#month-projected-rev').val(revProjection['month-projected-rev']);
    $('#ecpm').val(revProjection['ecpm']);

    var yearRevProjection = {};
    yearRevProjection['lowest-month'] = parseFloat(revProjection['month-projected-rev'] * .5);
    yearRevProjection['highest-month'] = parseFloat(revProjection['month-projected-rev'] * 1.5);
    yearRevProjection['month-average'] = (revProjection['month-projected-rev'] + yearRevProjection['lowest-month'] + yearRevProjection['highest-month'])/3;
    yearRevProjection['projection'] = parseFloat(yearRevProjection['month-average'] * 12);

    $('#monthly-earnings').val(revProjection['month-projected-rev']);
    $('#lowest-month').val(yearRevProjection['lowest-month']);
    $('#highest-month').val(yearRevProjection['highest-month']);
    $('#monthly-average').val(yearRevProjection['month-average']);
    $('#projection').val(yearRevProjection['projection']);

}

$(document).ready(function() {
        calculateForm();
        $('.user-data').bind('focusout',calculateForm); 
});
