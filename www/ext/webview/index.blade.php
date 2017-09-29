@extends('layouts.master')
@section('title', 'Dashboard')
@section('breadCrumbs')
<style>
       #map {
        height: 400px;
        width: 100%;
       }
</style>
<div class="page-head">
		<h2 class="pull-left">Dashboard</h2>		
</div>
@stop
@section('pageBody')
 <div id="map"></div>
<?php
 use Symfony\Component\HttpFoundation\Session\Session;

 $session = new Session();
 $ses_login_id = $session->get('ses_login_id');
 $dashboardunits = DB::table('view_on_dashboard')->where('view_staff_id', $ses_login_id)->get();			
foreach($dashboardunits as $units) {
	$latlongs[] = DB::table('unit_latlong')->where('latlong_unit_id', $units->view_unit_id)->get();
}
// echo '<pre>';
// print_r($latlongs);
// die;

						// if($latlongs)
						// {
						// }
						?>
<div class="widget widget-fullwidth widget-small own-table">

{!! $dataTable->table() !!}

</div>

@endsection

@push('scripts')

{!! $dataTable->scripts() !!}

<script>

// function initMap() {
        // var uluru = {lat: -25.363, lng: 131.044};
        // var map = new google.maps.Map(document.getElementById('map'), {
          // zoom: 4,
          // center: uluru
        // });
		
  // var contentString = '<div id="content">'+
      // '<div id="siteNotice">'+
      // '</div>'+
      // '<h1 id="firstHeading" class="firstHeading"></h1>'+
      // '<div id="bodyContent">'+
      // '<p> '+
      // 'Heritage Site.</p>'+
      // '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      // 'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      // '(last visited June 22, 2009).</p>'+
      // '</div>'+
      // '</div>';
		// var infowindow = new google.maps.InfoWindow({
			// content: contentString
     	// });
		
		
        // var marker = new google.maps.Marker({
          // position: uluru,
          // map: map
        // });
		// marker.addListener('click', function() {
			// infowindow.open(map, marker);
		// });

      // }
	  
	  
	  //mdv
	  function initMap() {
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap'
    };
                    
    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    map.setTilt(45);
        
    // Multiple Markers
	<?php
	// foreach($latlongs as $latlng) {
		// $latlng[0]->latitude
		// $latlng[0]->longtitude
	// }
	?>
    var markers = [
        ['address ', 1.3249773,103.70307100000002],
    ];
                        
    // Info Window Content
    var infoWindowContent = [
        ['<div class="info_content">' +
        '<h3>London Eye</h3>' +
        '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' +        '</div>'],
        ['<div class="info_content">' +
        '<h3>Palace of Westminster</h3>' +
        '<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
        '</div>']
    ];
        
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
    // Loop through our array of markers & place each one on the map  
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0]
        });
        
        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });
    
}
	  //mdv

</script> 
<script async defer src="https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyD8xmwUm5wwzurbi6N99FyF9_e2traeDcA&callback=initMap"></script>



<script>
$(document).ready(function() {
var table = $('#dataTableBuilder').DataTable();
table
    .column( '0:visible' )
    .order( 'desc' )
    .draw();
} );
</script>
@endpush
