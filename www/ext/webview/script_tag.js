<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.js"></script>
<script>
$(document).ready(function() {
  $("#company_id").change(function()
  {
       var companygroupid = document.getElementById("company_id").value;
       //alert(companygroupid);
       window.location = "/orgchart?company_id="+companygroupid;
    });
		$('.popup-close').click(function(){
		$('.style-popup').hide();
		});
});
function pushimage(id) {
	var token = $('input[name=_token]').val();     
	 $.ajax({
		headers: {'X-CSRF-TOKEN': token},
		method: "POST",
		url : "http://denyoappv2.stridecdev.com/orgchart/getdetails",
		data: {id: id},   
		success : function(data){   
			//alert(data);    
			var result = data.split("#");			
			var name=result[0];
			var lanme=result[1];
			var email=result[2];
			var mobile="tel:"+result[3];
		var img=result[4];			
      //var company=result[4];
			var jobposition=result[5];
			var hashtag=result[6];
      var staffid=result[7];
      //var orgid=result[9];
  //    var parentid=result[10];
    document.getElementById("staffid").value=staffid;
	document.getElementById("orgname").innerHTML=name;
	document.getElementById("orglastname").innerHTML=lanme;
	document.getElementById("orgemail").innerHTML=email;
	document.getElementById("orgmobile").innerHTML=mobile;
	//document.getElementById("orgmobile").href=mobile; 
	document.getElementById("role").innerHTML=jobposition;
	document.getElementById("hashtag").innerHTML=hashtag;
	document.getElementById("orgimage").src =img;
            if(hashtag=="")
            {
                document.getElementById('hashtagblock').style.display = "none";
                document.getElementById("staffdetails").style.display = "block";
                document.getElementById("orgimage").src =img;
                document.getElementById("parentid").value=parentid;
		document.getElementById('hashtagedit').style.display = "none";
		document.getElementById('deletenonuser').style.display = "block";
                document.getElementById('deleteuser').style.display = "none";
            }
            else
            {
               document.getElementById('hashtagblock').style.display = "block"; 
               document.getElementById("staffid").value=staffid;
               document.getElementById("staffdetails").style.display = "none";
               document.getElementById("orgimage").src =img;
               document.getElementById("hashtag").innerHTML=hashtag;
               document.getElementById("parentid").value=parentid;
		document.getElementById('hashtagedit').style.display = "block";
		document.getElementById('deleteuser').style.display = "block";
               document.getElementById('deletenonuser').style.display = "none";
            }
		},
		error: function(ts) { 
		alert(ts.responseText) 
		}
	}); 
	$('.style-popup').css('display', 'block');
}
function staffdetail()
{
  var id=document.getElementById("staffid").value;
///photos/{photo}/edit
  window.location = "orgchart/"+id+"/edit";
}

function nonuserdelete()
{
//	console.log('sds');
  var staff_id=document.getElementById("staffid").value;
  //var deletedetails=document.getElementById("orgid").value;
  //var groupid = document.getElementById("usergroupid").value;
  //var staffid=document.getElementById("staffid").value;
    var token = $('input[name=_token]').val();     
   $.ajax({
    headers: {'X-CSRF-TOKEN': token},
    method: "POST",
    url : "http://denyoappv2.stridecdev.com/orgchart/deletedetails",
    data: {staffid:staffid,is_mobile:0},   
    success : function(data){
      alert(data);
      window.location = '/orgchart/'+staffid+'/0/delete';
      },
    error: function(ts) { alert(ts.responseText) }
  }); 
}
</script>
	<script src="http://denyoappv2.stridecdev.com/assets/lib/jquery/jquery.min.js" type="text/javascript"></script>
	<script src="http://denyoappv2.stridecdev.com/assets/lib/jquery.nanoscroller/javascripts/jquery.nanoscroller.min.js" type="text/javascript"></script>
	<script src="http://denyoappv2.stridecdev.com/assets/js/main.js" type="text/javascript"></script>
	<script src="http://denyoappv2.stridecdev.com/assets/lib/bootstrap/dist/js/bootstrap.min.js" type="text/javascript"></script>
		<script src="http://denyoappv2.stridecdev.com/assets/js/app-form-elements.js" type="text/javascript"></script>
		<!--script src="http://denyoappv2.stridecdev.com/assets/lib/datatables/plugins/buttons/js/buttons.flash.js" type="text/javascript"></script>
	<script src="http://denyoappv2.stridecdev.com/assets/lib/datatables/plugins/buttons/js/buttons.print.js" type="text/javascript"></script>
	<script src="http://denyoappv2.stridecdev.com/assets/lib/datatables/plugins/buttons/js/buttons.colVis.js" type="text/javascript"></script>
	<script src="http://denyoappv2.stridecdev.com/assets/lib/datatables/plugins/buttons/js/buttons.bootstrap.js" type="text/javascript"></script>
	<script src="http://denyoappv2.stridecdev.com/assets/js/app-tables-datatables.js" type="text/javascript"></script>

	<script src="http://denyoappv2.stridecdev.com/assets/lib/parsley/parsley.min.js" type="text/javascript"></script>
	<script src="http://denyoappv2.stridecdev.com/assets/lib/datetimepicker/js/bootstrap-datetimepicker.min.js" type="text/javascript"></script>
	<script src="http://denyoappv2.stridecdev.com/assets/lib/select2/js/select2.min.js" type="text/javascript"></script>
	<!--script src="http://denyoappv2.stridecdev.com/assets/lib/bootstrap-slider/js/bootstrap-slider.js" type="text/javascript"></script-->
	
	
	<script type="text/javascript">
	$(document).ready(function(){
		var routeaction = 'index';
		var routecontroller = 'OrgchartController';
		//initialize the javascript
		App.init();
		if(routeaction == "index"  && routecontroller != "OrgchartController")
			App.dataTables();
		else if(routeaction == "unitdetails")
			App.chartsSparklines();
		else
			App.formElements();
		// $('form').parsley();
		//App.formElements();
	});
	</script>