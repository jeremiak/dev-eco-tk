function insertCommas(amount) {
    var formatted = amount //.toFixed(2);
  /*
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
   */
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
    
    var ecpmValue = revProjection['ecpm'].toFixed(2);
    $('#ecpm').val(ecpmValue);
    $('#sidebar-ecpm').val(ecpmValue);

    var yearRevProjection = {};
    yearRevProjection['lowest-month'] = insertCommas(parseFloat(revProjection['month-projected-rev'] * .5));
    yearRevProjection['highest-month'] = insertCommas(parseFloat(revProjection['month-projected-rev'] * 1.5));
    yearRevProjection['month-average'] = insertCommas(revProjection['month-projected-rev'] + yearRevProjection['lowest-month'] + yearRevProjection['highest-month'])/3;
    yearRevProjection['projection'] = insertCommas(parseFloat(yearRevProjection['month-average'] * 12));

    $('#monthly-earnings').val(revProjection['month-projected-rev']);
    $('#sidebar-monthly-earnings').val(revProjection['month-projected-rev']);

    $('#lowest-month').val(yearRevProjection['lowest-month']);
    $('#highest-month').val(yearRevProjection['highest-month']);
    $('#monthly-average').val(yearRevProjection['month-average']);
    
    $('#projection').val(yearRevProjection['projection']);
    $('#sidebar-projection').val(yearRevProjection['projection']);

    var adSpend = {};
    adSpend['dollars-spent'] = insertCommas($('#portion-spent').val() * yearRevProjection['projection']);
    adSpend['clicks-purchased'] = insertCommas(parseInt(adSpend['dollars-spent'] / revProjection['projection-cpc']));
    adSpend['apps-activated'] = insertCommas(parseInt(($('#conversion-rate').val() / 100) * adSpend['clicks-purchased']));

    $('#year-projection').val(yearRevProjection['projection']);
    $('#dollars-spent').val(adSpend['dollars-spent']);
    $('#ads-cpc').val(revProjection['projection-cpc']);
    $('#clicks-purchased').val(adSpend['clicks-purchased']);
    
    $('#apps-activated').val(adSpend['apps-activated']);
    $('#sidebar-apps-activated').val(adSpend['apps-activated']);

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
        // run all functions once to make sure all data is correctly displayed on form
        calculateForm();
        // any time user generated data (fields of the class 'user-data'), recalculate the form
        $('.user-data').bind('focusout',calculateForm);
        // make sure each range updates its label with the value while it changes
        $('input[type="range"]').bind('change', function(event){
                var source = event['srcElement']['id'];
                updateRange(source);
                calculateForm();
            }
        );
        // to the brand link, bind a function that scrolls to the top of the page
        $('.brand').bind('click', function() {
            $('html, body').animate({scrollTop:0}, 'fast');
            return false; // required to prevent default scroll
            });
});
