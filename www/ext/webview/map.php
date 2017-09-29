<!DOCTYPE html>
<html lang="en">

<head>
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <style>
        .error {
            color: #FF0000;
        }
    </style>

</head>

<body>
    <div class="am-content">
        <style>
            #map {
                height: 400px;
                width: 100%;
            }
        </style>
        <div id="map"></div>
        <script src="http://denyoappv2.stridecdev.com/assets/lib/jquery/jquery.min.js" type="text/javascript"></script>
        <script type="text/javascript">
            (function (window, $) { window.LaravelDataTables = window.LaravelDataTables || {}; window.LaravelDataTables["dataTableBuilder"] = $("#dataTableBuilder").DataTable({ "serverSide": true, "processing": true, "ajax": "", "columns": [{ "name": "unit_id", "data": "unit_id", "title": "Unit Id", "orderable": true, "searchable": true, "attributes": [] }, { "name": "group", "data": "group", "title": "Group", "orderable": true, "searchable": true, "attributes": [] }, { "name": "unitname", "data": "unitname", "title": "Unitname", "orderable": true, "searchable": true, "attributes": [] }, { "name": "projectname", "data": "projectname", "title": "Projectname", "orderable": true, "searchable": true, "attributes": [] }, { "name": "location", "data": "location", "title": "Location", "orderable": true, "searchable": true, "attributes": [] }, { "name": "running_hours", "data": "running_hours", "title": "Running Hours", "orderable": true, "searchable": true, "attributes": [] }, { "name": "next_servicing_date", "data": "next_servicing_date", "title": "Next Servicing Date", "orderable": true, "searchable": true, "attributes": [] }, { "name": "gen_status", "data": "gen_status", "title": "Gen Status", "orderable": true, "searchable": true, "attributes": [] }, { "name": "favorite", "data": "favorite", "title": "Favorite", "orderable": true, "searchable": true, "attributes": [] }, { "defaultContent": "", "data": "action", "name": "action", "title": "Action", "render": null, "orderable": false, "searchable": false, "width": "130px", "attributes": [] }] }); })(window, jQuery);
        </script>


        <script>
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
                var markers = [
                    ['address ', 1.3249773, 103.70307100000002],
                ];

                // Info Window Content
                var infoWindowContent = [
                    ['<div class="info_content">' +
                        '<h3>London Eye</h3>' +
                        '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' + '</div>'],
                    ['<div class="info_content">' +
                        '<h3>Palace of Westminster</h3>' +
                        '<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
                        '</div>']
                ];

                // Display multiple markers on a map
                var infoWindow = new google.maps.InfoWindow(), marker, i;

                // Loop through our array of markers & place each one on the map  
                for (i = 0; i < markers.length; i++) {
                    var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
                    bounds.extend(position);
                    marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: markers[i][0]
                    });

                    // Allow each marker to have an info window    
                    google.maps.event.addListener(marker, 'click', (function (marker, i) {
                        return function () {
                            infoWindow.setContent(infoWindowContent[i][0]);
                            infoWindow.open(map, marker);
                        }
                    })(marker, i));

                    // Automatically center the map fitting all markers on the screen
                    map.fitBounds(bounds);
                }

                // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
                var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function (event) {
                    this.setZoom(14);
                    google.maps.event.removeListener(boundsListener);
                });

            }
	  //mdv
        </script>
        <script async defer src="https://maps.googleapis.com/maps/api/js?v=3&key= AIzaSyD8xmwUm5wwzurbi6N99FyF9_e2traeDcA&callback=initMap"></script>



        <script>
            $(document).ready(function () {
                var table = $('#dataTableBuilder').DataTable();
                table
                    .column('0:visible')
                    .order('desc')
                    .draw();
            });
        </script>
</body>

</html>