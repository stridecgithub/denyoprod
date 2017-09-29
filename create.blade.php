@extends('layouts.master')
@section('title', 'Units')

@section('breadCrumbs')
<style>
a.remove_text { color: red !important; }
</style>
<form role="form" action="{{ url('/units/store') }}" method="POST" onsubmit="return validate_frm()">
{{ csrf_field() }}
<div class="page-head">
	<h2 class="pull-left">New Unit</h2>
	<div class="pull-right algn-top">
	<a href="{{ url('/units') }}" class="btn btn-space btn-default btn-icon">
	      <span class="s7-angle-left-circle icon-sep"></span>Back
		  </a>
	<button type="submit" name="sub" class="btn btn-space btn-primary">Save</button>
	</div>

</div>
<link rel="stylesheet" href="{{ asset("assets/css/jquery.atwho.css") }}" />
<link rel="stylesheet" href="{{ asset("assets/css/countrycode/intlTelInput.css") }}" />
@stop

@section('pageBody')
<div class="panel panel-default">
	<div class="panel-heading"><h3>Location</h3></div>

	<div class="panel-body">               
		<div class="row">
			<div class="col-sm-6">
				<div class="form-group">
					<label>Location<span class="text-danger">*</span></label>
					<input type="text" placeholder="Location" name="location" id="loc" class="form-control" required>
				</div>
			</div>            		
		</div>				  
	</div>                
	<div class="panel-heading"><h3>Unit Details</h3></div>		
	<div class="panel-body">                              
		
		<div class="row">
			<div class="col-sm-6">
				<div class="form-group">
					<label>Unit Name<span class="text-danger">*</span></label>
					<input type="text" placeholder="Unit Name" name="unitname" class="form-control" required>
				</div>
			</div>
    			<div class="col-sm-6"> 
                		<div class="form-group">
					<label>Project Name<span class="text-danger">*</span></label>
					<input type="text" placeholder="Project Name" name="projectname" class="form-control" required>
                		</div>
            		</div>
            	</div>
            
            	<div class="row">
			<div class="col-sm-6"> 
                		<div class="form-group">
					<label>Controller Id<span class="text-danger">*</span></label>
					<input type="text" placeholder="Controller id" name="controllerid" onblur="validate_ctrl_id(this.value)" class="form-control" required>
					
					<div id="cid_exists_error"></div>
                		</div>
            		</div>
    			<div class="col-sm-6">
                		<div class="form-group">
                  			<label>Generator Model <span class="text-danger">*</span></label>
                  			<select class="form-control" name="models_id" required>    	
                  				<option value="">Select</option>
						@foreach($enginemodels as $em)
							<option value="{{$em->model_id}}">{{$em->model}}</option>
						@endforeach
				      </select>
                		</div>
            		</div>
            	</div>
				
		<div class="row">
			<div class="col-sm-6"> 
				<div class="form-group">
				  <label>NEA Plate No<span class="text-danger">*</span></label>
				  <input type="text" placeholder="PEA Plate No" name="neaplateno" class="form-control" required>
				</div>
			</div>
        </div>
	</div>
	<div class="panel-heading"><h3>Alarm Settings Details</h3></div>		 
	<div class="panel-body">
		
		<div class="row">			
			<div class="col-sm-12"> 
				<div class="form-group">
					<label><span style="color:#F00; font-size:20px;">Attention</span>
					<div class=""><h5>When thats error on the unit, Alarm Notification will be sent to this following Email and Contact Number</h5></div>
					</label>
					<div id="editable" class="inputor" contentEditable="true" style="min-height:40px; width:48.5%; overflow: hidden; padding:5px; border:1px solid #ccc;"></div>		                  	
					
				</div>
			</div>
                 </div>	
		 <div class="row">
			<div class="col-sm-6"> 
				<div class="form-group">
					<label>Name</label>
					<input type="text" placeholder="Name" name="contact_names[]" class="form-control">
				</div>
			</div>
			<div class="col-sm-6"> 
				<div class="form-group">
					<label>Contact No</label>
					<input type="text" name="contact_numbers[]" id="contact" class="form-control">
				</div>
			</div>
		</div>
		<div id="more_ele"></div>
		
	</div>
	<a style="float:right; margin-right:20px;" href="javascript:void(0)" id="add_more" class="btn btn-primary">Add More</a>
	<div class="panel-heading"><h3>Group Assign</h3></div>		 
	<div class="panel-body">
		
		<div class="row">			
			<div class="col-sm-6"> 
				<div class="form-group">
					<label>Unit Group Assign</label>
					<select name="unitgroups_id" class="form-control">
					<option value="">Select Unit Group</option>
					@foreach($unitgroups as $ug)
						<option value="{{$ug->unitgroup_id}}">{{$ug->unitgroup_name}}</option>
					@endforeach
					</select>
				</div>
			</div>
			<div class="col-sm-6"> 
				<div class="form-group">				
					<label>Company Group<span class="text-danger">*</span></label>
					<select name="companys_id" class="form-control" required>
					<option value="">Select Company Group</option>						  
					@foreach($companies as $company)
						<option value="{{ $company->companygroup_id }}">{{ $company->companygroup_name }}</option>
					@endforeach
					</select>
				</div>
			</div>
		</div>
	</div>

	<input type="hidden" id="form_val" value="1">				
	<input type="hidden" name="timezone" value="{{ date('Y-m-d H:i:s') }}">
	<input type="hidden" name="alarmnotificationto" id="alarmnotificationto" class="form-control" >
	</form>
        </div>				
</div><!--panel-default-->

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.js"></script>
<script type="text/javascript" src="{{ asset('assets/js/countrycode/intlTelInput.js') }}"></script>

<script type="text/javascript">
$(document).ready(function() {
	var tags = [<?php echo $staffids; ?>];
	$('#editable').atwho({
		at: "@",
		data: tags,
		limit: 200,
		callbacks: {
			afterMatchFailed: function(at, el) {
				if (at == '@') {					
					tags.push(el.text().trim().slice(1));
					this.model.save(tags);
					this.insert(el.text().trim());
					return false;
				}
			}			
		}
	});
});

var i=0;
$('#add_more').click(function() {
	++i;

	var ele='';
	ele ='<div id="'+i+'" class="row"><div class="col-sm-6">'+ 
							'<div class="form-group">'+
							  '<label>Name<span class="text-danger">*</span></label>'+
							  '<input type="text" placeholder="Name" name="contact_names[]" class="form-control" required>'+
							'</div>'+
						'</div>'+
	'<div class=\"col-sm-5\">'+
							'<div class=\"form-group\">'+
							  '<label>Contact No<span class=\"text-danger\">*</span></label>'+
							  '<input type=\"text\" name=\"contact_numbers[]\" class=\"form-control\" style=\"min-width:500px;\" required>'+
							  '</div>'+
							  '</div>'+'<div class=\"col-sm-1\"><a style="float:right; padding-top:35px;" href="javascript:void(0)" id="remove_link_'+i+'" class="remove_text" onclick="remove_more_ele('+i+')">x</a></div>'+
							  '</div>';
	$('#more_ele').append(ele);	
	//$('#contact_'+i+).intlTelInput();
});

function remove_more_ele(id) {
	$('#'+id).remove();
	$('#remove_link_'+id).remove();	
} 

$("input[name='contact_numbers[]']").intlTelInput();

function validate_frm() {
	var from_val = $('#form_val').val();
	if(from_val == 1)
	{
		var remarkcontent = $("#editable").html();
		if(remarkcontent == '') {
			alert('Attention should not be empty');
			return false;
		}
		document.getElementById("alarmnotificationto").value = remarkcontent;
		return true;
	}
	else return false;
	
}

function validate_ctrl_id(ctrl_id) {
	$.ajax({
		headers: {'X-CSRF-TOKEN': $('input[name="_token"]').val() },
		method: "POST",
		url : "{{ url('/check_ctrl_id') }}",
		data: {controllerid:ctrl_id,unit_id:0},
		success : function(data) {
			if( data == 1 ) {
				$('#cid_exists_error').text('Controller ID Already exists');
				$('#cid_exists_error').css('color','red');
				$('#form_val').val('2');
				
			}
			else {
				$('#form_val').val('1');
				$('#cid_exists_error').text('');
			}
		},
		error: function(ts) { alert('tsresponseText'); }
	});

}
</script>
              
              @stop
