function insertCommas(amount) {
    var formatted = amount;

    return formatted;
}

function calculateForm() {
    var revProjection = {};
    
    revProjection['month-uniques'] = parseInt($('#month-uniques').val());
    revProjection['avg-session-length'] = parseInt($('#avg-session-length').val());
    revProjection['daily-sessions'] = parseInt($('#daily-sessions').val());
    revProjection['fill-rate'] = ($('#fill-rate').val()) / 100;
    revProjection['ctr'] = ($('#ctr').val()) / 100;
    revProjection['projection-cpc'] = ($('#projection-cpc').val());

    revProjection['ad-impressions'] = insertCommas(parseInt(revProjection['month-uniques'] * (revProjection['avg-session-length'] * revProjection['daily-sessions'])));
    revProjection['ads-displayed'] = insertCommas(parseInt(revProjection['ad-impressions'] * revProjection['fill-rate']));
    revProjection['total-clicks'] = insertCommas(parseInt(revProjection['ads-displayed'] * revProjection['ctr']));
    revProjection['month-projected-rev'] = insertCommas(parseFloat((revProjection['total-clicks'] * revProjection['projection-cpc']) * 1.00));
    revProjection['ecpm'] = revProjection['month-projected-rev'] / (revProjection['ads-displayed'] * 0.001);

    $('#ad-impressions').val(revProjection['ad-impressions']);
    $('#ads-displayed').val(revProjection['ads-displayed']);
    $('#total-clicks').val(revProjection['total-clicks']);
    $('#month-projected-rev').val(revProjection['month-projected-rev'].toFixed(2));
    $('#ecpm').val(revProjection['ecpm'].toFixed(2));

    var yearRevProjection = {};
    yearRevProjection['lowest-month'] = insertCommas(parseFloat(revProjection['month-projected-rev'] * .5));
    yearRevProjection['highest-month'] = insertCommas(parseFloat(revProjection['month-projected-rev'] * 1.5));
    yearRevProjection['month-average'] = insertCommas(revProjection['month-projected-rev'] + yearRevProjection['lowest-month'] + yearRevProjection['highest-month'])/3;
    yearRevProjection['projection'] = insertCommas(parseFloat(yearRevProjection['month-average'] * 12));

    $('#monthly-earnings').val(revProjection['month-projected-rev']);
    $('#lowest-month').val(yearRevProjection['lowest-month']);
    $('#highest-month').val(yearRevProjection['highest-month']);
    $('#monthly-average').val(yearRevProjection['month-average']);
    $('#projection').val(yearRevProjection['projection']);

    var adSpend = {};
    adSpend['dollars-spent'] = insertCommas($('#portion-spent').val() * yearRevProjection['projection']);
    adSpend['clicks-purchased'] = insertCommas(parseInt(adSpend['dollars-spent'] / revProjection['projection-cpc']));
    adSpend['apps-activated'] = insertCommas(parseInt(($('#conversion-rate').val() / 100) * adSpend['clicks-purchased']));

    $('#year-projection').val(yearRevProjection['projection']);
    $('#dollars-spent').val(adSpend['dollars-spent']);
    $('#ads-cpc').val(revProjection['projection-cpc']);
    $('#clicks-purchased').val(adSpend['clicks-purchased']);
    $('#apps-activated').val(adSpend['apps-activated']);

    $('#ad-impact-fill-rate').val(revProjection['fill-rate'] * 100);
    $('#ad-impact-ctr').val(revProjection['ctr']);
    $('#ad-impact-cpc').val(revProjection['projection-cpc']);
}

function updateRange(source) {
    source = '#' + source;
    var sourceMap = {};
    sourceMap['#fill-rate'] = '#fill-rate-range-value';
    sourceMap['#portion-spent'] = '#portion-spent-range-value';
    sourceMap['#conversion-rate'] = '#conversion-rate-range-value';
    
    var rangeValue = parseFloat($(source).val()).toFixed(1) + '%';
    $(sourceMap[source]).text(rangeValue);
}

$(document).ready(function() {
        calculateForm();
        $('.user-data').bind('focusout',calculateForm);
        $('input[type="range"]').bind('change', function(event){
                var source = event['srcElement']['id'];
                updateRange(source);
                calculateForm();
            }
        );
});
