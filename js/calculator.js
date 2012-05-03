var Calculator = {};
Calculator.debug = true;

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
    function populateECPM(ecpm) {
		$('#ecpm').val(ecpm);
	    $('#sidebar-ecpm').val(ecpm);
	}
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
    revProjection['ecpm'] = revProjection['month-projected-rev'] / (revProjection['ads-displayed'] / 1000);
	
	Calculator.debug == true ? console.log(revProjection) : false;

    $('#ad-impressions').val(revProjection['ad-impressions']);
    $('#ads-displayed').val(revProjection['ads-displayed']);
    $('#total-clicks').val(revProjection['total-clicks']);
    $('#month-projected-rev').val(revProjection['month-projected-rev'].toFixed(2));
    

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
    adSpend['clicks-purchased'] = insertCommas(parseInt(adSpend['dollars-spent'] * revProjection['projection-cpc']));
    adSpend['apps-activated'] = insertCommas(parseInt(($('#conversion-rate').val() / 100) * adSpend['clicks-purchased']));
    adSpend['cost-per-acq'] = insertCommas(adSpend['dollars-spent'] / adSpend['apps-activated']);

    $('#year-projection').val(yearRevProjection['projection']);
    
    $('#dollars-spent').val(adSpend['dollars-spent']);
    $('#sidebar-dollars-spent').val(adSpend['dollars-spent']); 

    $('#ads-cpc').val(revProjection['projection-cpc']);
    $('#clicks-purchased').val(adSpend['clicks-purchased']);
    
    $('#apps-activated').val(adSpend['apps-activated']);
    $('#sidebar-apps-activated').val(adSpend['apps-activated']);

    $('#cost-per-acq').val(adSpend['cost-per-acq']);
    $('#sidebar-cost-per-acq').val(adSpend['cost-per-acq']);

    var adImpact = {}
    adImpact['monthly-impressions-per-user'] = $('#ad-impressions-per-user').val();
    adImpact['impression-lift'] = parseInt(adSpend['clicks-purchased'] * adImpact['monthly-impressions-per-user']);
    adImpact['ads-displayed'] = adImpact['impression-lift'] * revProjection['fill-rate'];
    adImpact['total-clicks'] = adImpact['ads-displayed'] * revProjection['ctr'];
    adImpact['additional-earnings'] = adImpact['total-clicks'] * revProjection['projection-cpc'];
    adImpact['compounded-earnings'] = (adImpact['additional-earnings'] * 0.24) + adImpact['additional-earnings'];
    adImpact['ad-impact-year-rev'] = adImpact['additional-earnings'] * (1+0.24)^12;
    adImpact['ecpm'] = adImpact['additional-earnings'] / (adImpact['ads-displayed']/1000);

    $('#ad-impact-fill-rate').val(revProjection['fill-rate'] * 100);
    $('#ad-impact-ctr').val(revProjection['ctr']);
    $('#ad-impact-cpc').val(revProjection['projection-cpc']);
    $('#impression-lift').val(adImpact['impression-lift']);
    $('#ad-impact-impressions').val(adImpact['ads-displayed']);
    $('#ad-impact-ads-displayed').val(adImpact['ads-displayed']);
    $('#ad-impact-total-clicks').val(adImpact['total-clicks']);
    $('#ad-impact-ecpm').val(adImpact['ecpm']);
    $('#ad-impact-add-earnings').val(adImpact['additional-earnings']);
    $('#ad-impact-compound-earnings').val(adImpact['compounded-earnings']);
    $('#ad-impact-year-rev').val(adImpact['ad-impact-year-rev']);
    
    var totalNewRev = adImpact['ad-impact-year-rev'] + yearRevProjection['month-average'];
    $('#total-new-rev').val(totalNewRev);
	$('#sidebar-total-new-rev').val(totalNewRev);
	
	populateECPM(revProjection['ecpm'].toFixed(2));
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

function popOutDataPoints() {
	var currentTop = $(document).scrollTop();
	var ch = containerHeader = $('.container-header');
	var dp = dataPoints = $('#data-points');
	var mc = mainContent = $('#main-content');
	
	if (currentTop > 93) {
		dp.css('position', 'fixed');
		dp.css('top', '10px');
		mc.css('margin-left', '320px');
	}
	else {
		dp.css('position', 'relative');
		mc.css('float', 'left');
		mc.css('margin-left', '0');
	}
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
		
		// keep the data points left box in the view at all times
        $(document).bind('scroll', function() {
			popOutDataPoints();
		});
            
});
