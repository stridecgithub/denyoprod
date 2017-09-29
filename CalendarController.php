<?php

namespace App\Http\Controllers;
use DB;
use App\Staff;
use App\Service;
use App\Alarm;
use App\Unit;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Mail;

class CalendarController extends Controller
{
	/**
	* Display a listing of the resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function index(Request $request) {		
		date_default_timezone_set('Asia/Singapore');
		$ismobile = $request->is_mobile;		
		if($ismobile == 1)
		{
			$events = $services = $alarms = $alarmslist = $eventslist = $serviceslist = $allservices = '';
			$allservicesqry = $allevents = $allalarmslist = '';
			$allalarms = array();
			$loginid = $request->loginid;	
			$company_id = $request->companyid;
			$staff = Staff::where('staff_id', $loginid)->select('personalhashtag')->get();
			$hashtag = $staff[0]->personalhashtag;		
			$date = date("Y-m-d", strtotime($request->date));
			$highlightdots = [];
			$highlightsarr = [];
			$monthyear = '01-'.$request->month;			
			$noofdays = date('t',strtotime($monthyear));
			$j = 0;	
			$activeunits = Unit::where('deletestatus', '0')->get();			
			if(count($activeunits) > 0) {					
				foreach($activeunits as $unit) {						
					$activeunitidarr[] = $unit->unit_id;
				}
				$activeunitids = @implode(",", $activeunitidarr);				
			}
			for($i=1; $i<=$noofdays; $i++) {
				$isalarmavailable = $isserviceavailable = $iseventavailable = $chkalarms = $chkservice = $chkevent = 0;
				$monthdate = $i.'-'.$request->month;
				$monthdate = date("Y-m-d", strtotime($monthdate));
				if($company_id == 1) {					
						
					$chkevent = DB::select('SELECT * FROM events WHERE event_deletestatus="0" AND event_date = "'.$monthdate.'" AND (event_added_by = "'.$loginid.'" OR event_remark LIKE "%'.$hashtag.'%")');
					if($activeunitids) {						
						$chkservice = DB::select('SELECT * FROM services WHERE deletestatus = 0 AND service_unitid IN ('.$activeunitids.') AND next_service_date LIKE "'.$monthdate.'%"');										
						
						$chkalarms = DB::select('SELECT * FROM alarms WHERE alarm_unit_id IN ('.$activeunitids.') AND alarm_received_date LIKE "'.$monthdate.'%"');
				
					}
					if(count($chkalarms) > 0) {
						$isalarmavailable = 1;				
					}
					if(count($chkservice) > 0) {
						$isserviceavailable = 1;						
					}
					else {
						if($activeunitids) {
							$chkservice = DB::select('SELECT * FROM services WHERE deletestatus = 0 AND next_service_date = "'.$monthdate.'"  AND service_unitid IN ('.$activeunitids.')');

						}
						if(count($chkservice) > 0) {
							$isserviceavailable = 1;						
						}						
					}
					if(count($chkevent) > 0) {
						$iseventavailable = 1;					
					}
				}
				else {					
					$units = Unit::where('deletestatus', '0')->where('companys_id', $company_id)->get();
					if(count($units) > 0) {					
						foreach($units as $unit)
						{
							$unitidarr[] = $unit->unit_id;
						}
						$unitids = @implode(",", $unitidarr);						
						
						if($unitids) {						
							$chkservice = DB::select('SELECT * FROM services WHERE deletestatus = 0 AND service_unitid IN ('.$unitids.') AND next_service_date LIKE "'.$monthdate.'%"');							
						
							
							
							$chkalarms = DB::select('SELECT * FROM alarms WHERE alarm_unit_id IN ('.$unitids.') AND alarm_received_date LIKE "'.$monthdate.'%"');
					
						}
						if(count($chkalarms) > 0) {
							$isalarmavailable = 1;				
						}
						if(count($chkservice) > 0) {
							$isserviceavailable = 1;						
						}
						else {
							$chkservice = DB::select('SELECT * FROM services WHERE deletestatus = 0 AND next_service_date = "'.$monthdate.'" AND service_unitid IN ('.$unitids.')');
							if(count($chkservice) > 0) {
								$isserviceavailable = 1;						
							}						
						}
					}
						$chkevent = DB::select('SELECT * FROM events WHERE event_deletestatus="0" AND event_date = "'.$monthdate.'" AND (event_added_by = "'.$loginid.'" OR event_remark LIKE "%'.$hashtag.'%")');
						if(count($chkevent) > 0) {
							$iseventavailable = 1;					
						}						
					
				}


				if(isset($request->type)) {


					if($request->type=='all') {
							if($isalarmavailable == 1 && $isserviceavailable == 1 && $iseventavailable == 1) {
							$highlightdots[$j]['date'] = $monthdate;
							$highlightdots[$j]['class'] = 'alarm_service_event';
							} else if($isalarmavailable == 1 && $isserviceavailable == 1 && $iseventavailable == 0) {					
							$highlightdots[$j]['date'] = $monthdate;					
							$highlightdots[$j]['class'] = 'alarm_service';					
							} else if($isalarmavailable == 1 && $isserviceavailable == 0 && $iseventavailable == 1) {
							$highlightdots[$j]['date'] = $monthdate;
							$highlightdots[$j]['class'] = 'alarm_event';
							} else if($isalarmavailable == 1 && $isserviceavailable == 0 && $iseventavailable == 0) {
							$highlightdots[$j]['date'] = $monthdate;
							$highlightdots[$j]['class'] = 'alarm';
							} else if($isalarmavailable == 0 && $isserviceavailable == 1 && $iseventavailable == 1) {
							$highlightdots[$j]['date'] = $monthdate;
							$highlightdots[$j]['class'] = 'service_event';
							} else if($isalarmavailable == 0 && $isserviceavailable == 1 && $iseventavailable == 0) {
							$highlightdots[$j]['date'] = $monthdate;
							$highlightdots[$j]['class'] = 'service';
							} else if($isalarmavailable == 0 && $isserviceavailable == 0 && $iseventavailable == 1) {
							$highlightdots[$j]['date'] = $monthdate;
							$highlightdots[$j]['class'] = 'event';
							}
					}else if($request->type=='service') {
								if($isserviceavailable == 1) {
								$highlightdots[$j]['date'] = $monthdate;
								$highlightdots[$j]['class'] = 'service';
							}
					 }else if($request->type=='event') {
								//echo "fsdfdsfsf";exit;

								if($iseventavailable == 1) {
							$highlightdots[$j]['date'] = $monthdate;
							$highlightdots[$j]['class'] = 'event';
							}


					}else if($request->type=='alarm') {

								if($isalarmavailable == 1) {
							$highlightdots[$j]['date'] = $monthdate;
							$highlightdots[$j]['class'] = 'alarm';
							}


					}
					

				}else{
					if($isalarmavailable == 1 && $isserviceavailable == 1 && $iseventavailable == 1) {
						$highlightdots[$j]['date'] = $monthdate;
						$highlightdots[$j]['class'] = 'alarm_service_event';
					} else if($isalarmavailable == 1 && $isserviceavailable == 1 && $iseventavailable == 0) {					
						$highlightdots[$j]['date'] = $monthdate;					
						$highlightdots[$j]['class'] = 'alarm_service';					
					} else if($isalarmavailable == 1 && $isserviceavailable == 0 && $iseventavailable == 1) {
						$highlightdots[$j]['date'] = $monthdate;
						$highlightdots[$j]['class'] = 'alarm_event';
					} else if($isalarmavailable == 1 && $isserviceavailable == 0 && $iseventavailable == 0) {
						$highlightdots[$j]['date'] = $monthdate;
						$highlightdots[$j]['class'] = 'alarm';
					} else if($isalarmavailable == 0 && $isserviceavailable == 1 && $iseventavailable == 1) {
						$highlightdots[$j]['date'] = $monthdate;
						$highlightdots[$j]['class'] = 'service_event';
					} else if($isalarmavailable == 0 && $isserviceavailable == 1 && $iseventavailable == 0) {
						$highlightdots[$j]['date'] = $monthdate;
						$highlightdots[$j]['class'] = 'service';
					} else if($isalarmavailable == 0 && $isserviceavailable == 0 && $iseventavailable == 1) {
						$highlightdots[$j]['date'] = $monthdate;
						$highlightdots[$j]['class'] = 'event';
					}
				}				
				$j++;
			}			
			
			foreach($highlightdots as $hl) {
				$highlightsarr[] = array('date'=>$hl['date'],'class'=>$hl['class']); 
			}
			$eventslist_qry = DB::select('SELECT * FROM events WHERE event_deletestatus="0" AND (event_added_by = "'.$loginid.'" OR event_remark LIKE "%'.$hashtag.'%")');
			$allevents = DB::select('SELECT * FROM events WHERE event_deletestatus="0" AND event_date = "'.$date.'" AND (event_added_by = "'.$loginid.'" OR event_remark LIKE "%'.$hashtag.'%")');
			
			if(count($eventslist_qry) > 0) {
				$i = 0;			
				foreach($eventslist_qry as $event)
				{
					$eventslist[$i]['event_id'] = $event->event_id;
					$eventslist[$i]['event_title'] = $event->event_title;
					$eventslist[$i]['event_date'] = $event->event_date;
					$eventslist[$i]['event_time'] = $event->event_time;
					if($event->event_date == '0000-00-00' || $event->event_time == '') {
						$eventslist[$i]['formatted_datetime'] = '';
					}
					else {
						$formatted = $event->event_date . $event->event_time;
						$eventslist[$i]['formatted_datetime'] = date('d M Y h:i A',strtotime($formatted));
					}					
					$eventslist[$i]['event_location'] = $event->event_location;
					$eventslist[$i]['event_remark'] = $event->event_remark;
					$eventslist[$i]['event_added_by'] = $event->event_added_by;
					$addedby = Staff::where('staff_id', $event->event_added_by)->select('firstname')->get();
					if($addedby)
						$eventslist[$i]['event_addedby_name'] = $addedby[0]->firstname;
					else
						$eventslist[$i]['event_addedby_name'] = '';
					++$i;
				}
			}	
			if($company_id == 1)
			{
				$allservicesqry = DB::select('SELECT * FROM services WHERE deletestatus = 0 AND next_service_date = "'.$date.'"  AND service_unitid IN ('.$activeunitids.') ');
				if($activeunitids) {

					$serviceslist = DB::select('SELECT * FROM services WHERE deletestatus = 0 AND service_unitid IN ('.$activeunitids.')');
					
					$alarmslist = DB::select('SELECT * FROM alarms WHERE alarm_unit_id IN ('.$activeunitids.') AND alarm_received_date LIKE "'.$date.'%"');
					
					$allalarmslist = DB::select('SELECT * FROM alarms WHERE alarm_unit_id IN ('.$activeunitids.') AND alarm_received_date LIKE "'.$date.'%"');	
				}							
			}
			else
			{
				$services = $alarms = $unitids = '';
				$units = Unit::where('deletestatus', '0')->where('companys_id', $company_id)->get();
				if($units)
				{
					foreach($units as $unit)
					{
						$unitids[] = $unit->unit_id;
					}
					$unitids = @implode(",", $unitids);					
					
					if($unitids) {					
						$allservicesqry = DB::select('SELECT * FROM services WHERE deletestatus = 0 AND service_unitid IN ('.$unitids.') AND next_service_date = "'.$date.'"');
						
						$serviceslist = DB::select('SELECT * FROM services WHERE deletestatus = 0 AND service_unitid IN ('.$unitids.')');
						
						$alarmslist = DB::select('SELECT * FROM alarms WHERE alarm_unit_id IN ('.$unitids.')');
						
						$allalarmslist = DB::select('SELECT * FROM alarms WHERE alarm_unit_id IN ('.$unitids.') AND alarm_received_date LIKE "'.$date.'%"');			
					}					
				}
			}
	
			if($allevents)
			{	
				$i = 0;			
				foreach($allevents as $event)
				{
					$events[$i]['event_id'] = $event->event_id;
					$events[$i]['event_title'] = $event->event_title;
					if($event->event_date == '0000-00-00' || $event->event_time == '0000-00-00') {
						$events[$i]['formatted_datetime'] = '';
					}
					else {
						$formatted = $event->event_date . $event->event_time;
						$events[$i]['formatted_datetime'] = date('d M Y h:i A',strtotime($formatted));
					}
					$events[$i]['event_date'] = $event->event_date;
					$events[$i]['event_time'] = $event->event_time;
					
					$events[$i]['event_location'] = $event->event_location;
					$events[$i]['event_remark'] = $event->event_remark;
					$events[$i]['event_added_by'] = $event->event_added_by;
					$addedby = Staff::where('staff_id', $event->event_added_by)->select('firstname')->get();
					if($addedby)
						$events[$i]['event_addedby_name'] = $addedby[0]->firstname;
					else
						$events[$i]['event_addedby_name'] = '';
					++$i;
				}
			}
			if($allservicesqry)
			{
				$i = 0;
				foreach($allservicesqry as $service)
				{
					$services[$i]['service_id'] = $service->service_id;
					$services[$i]['service_unitid'] = $service->service_unitid;
					$unitname = Unit::where('unit_id',$service->service_unitid)->select('unitname')->get();					
					if(count($unitname) > 0) {
						$services[$i]['unitname'] = $unitname[0]->unitname;
					} else { 
						$services[$i]['unitname'] = '';
					}					
					$services[$i]['serviced_by'] = $service->serviced_by;
					if($service->serviced_datetime != '0000-00-00') {					
										$services[$i]['serviced_datetime'] = $service->serviced_datetime;
					}
					else {
						$services[$i]['serviced_datetime'] = '';
					}
					$services[$i]['service_subject'] = $service->service_subject;
					$services[$i]['service_remark'] = $service->service_remark;
					$services[$i]['service_priority'] = $service->service_priority;
					
					if($service->next_service_date == '0000-00-00') {
						$services[$i]['next_service_date'] = '';
					}
					else {
						$services[$i]['next_service_date'] = $service->next_service_date;
					}
					if($service->serviced_time == '0000-00-00') {
						$services[$i]['serviced_time'] = '';
					}
					else {
						$services[$i]['serviced_time'] = $service->serviced_time;
					}
					$formatted = $service->next_service_date;
					if($service->serviced_time != '0000-00-00'){
					$services[$i]['formatted_datetime'] = date('d M Y',strtotime($formatted)).' '.$service->serviced_time;

					}else{
						$services[$i]['formatted_datetime'] = date('d M Y',strtotime($formatted));
					}
					

					/*if($service->next_service_date != '0000-00-00' && $service->serviced_time != '0000-00-00') {
						$formatted = $service->next_service_date . $service->serviced_time;
						$services[$i]['formatted_datetime'] = date('d M Y h:i A',strtotime($formatted));
					}
					else if($service->next_service_date != '0000-00-00' && $service->next_service_date != '') {
						$services[$i]['formatted_datetime'] = date('d M Y h:i A',strtotime($service->next_service_date));
					}else {
						$services[$i]['formatted_datetime'] = date('d M Y h:i A',strtotime($service->serviced_time));
					}*/					
									
					
					$services[$i]['is_request'] = $service->is_request;
					$staff = Staff::where('staff_id', $service->serviced_by)->select('firstname')->get();
					if(count($staff) > 0)
						$services[$i]['serviced_by_name'] = $staff[0]->firstname;
					else
						$services[$i]['serviced_by_name'] = '';

					$unitdata = Unit::where('unit_id',$service->service_unitid)->get();
					if(count($unitdata) > 0)
						$services[$i]['service_location'] = $unitdata[0]->location;
					
					++$i;
				}
			}
			if($allalarmslist)
			{
				$i = 0;
				foreach($allalarmslist as $alarm)
				{
					$alarms[$i]['alarm_id'] = $alarm->alarm_id;
					$alarms[$i]['alarm_unit_id'] = $alarm->alarm_unit_id;
					$unitdata = DB::table('units')->where('unit_id',$alarm->alarm_unit_id)->get();
					if(count($unitdata) > 0) {
						$alarms[$i]['alarm_location'] = $unitdata[0]->location;
						$alarms[$i]['unitname']       = $unitdata[0]->unitname;
 					}
					else {
						$alarms[$i]['alarm_location'] = '';
						$alarms[$i]['unitname'] = '';
					}
					$alarms[$i]['alarm_name'] = $alarm->alarm_name;
					$alarms[$i]['alarm_assgined_by'] = $alarm->alarm_assigned_by;
					if($alarm->alarm_assigned_by > 0)
					{
						$assignby = Staff::where('staff_id', $alarm->alarm_assigned_by)->select('firstname')->get();
						$alarms[$i]['alarm_assginedby_name'] = $assignby[0]->firstname;
					}
					else
						$alarms[$i]['alarm_assginedby_name'] = '';
					$alarms[$i]['alarm_assgined_to'] = $alarm->alarm_assigned_to;
					if($alarm->alarm_assigned_to > 0)
					{
						$assignto = Staff::where('staff_id', $alarm->alarm_assigned_to)->select('firstname')->get();
						$alarms[$i]['alarm_assginedto_name'] = $assignto[0]->firstname;
					}
					else
						$alarms[$i]['alarm_assginedto_name'] = '';
										
					
					if($alarm->alarm_assigned_date != '0000-00-00 00:00:00') {
						$alarms[$i]['alarm_assigned_date'] = $alarm->alarm_assigned_date;
						$alarms[$i]['date_time'] = date('d M Y H:i:s',strtotime($alarm->alarm_assigned_date));
					}
					else {
						$alarms[$i]['alarm_assigned_date'] = '';
						$alarms[$i]['date_time'] = '';
					}
					
					
					$alarms[$i]['formatted_datetime'] = date('d M Y h:i A',strtotime($alarm->alarm_received_date));
					
					$alarms[$i]['alarm_received_date'] =  date("Y-m-d", strtotime($alarm->alarm_received_date)) . ', ' . date("H:i A",strtotime($alarm->alarm_received_date));
					$alarms[$i]['alarm_status'] = $alarm->alarm_status;
					$alarms[$i]['alarm_priority'] = $alarm->alarm_priority;
					$alarms[$i]['alarm_remark'] = $alarm->alarm_remark;
					++$i;
				}
			}
			//allalarms starts
			$i = 0;
			if(count($alarmslist) > 0 && is_array($alarmslist)) {
				
				foreach($alarmslist as $alarm)
				{
					$allalarms[$i]['alarm_id'] = $alarm->alarm_id;
					$allalarms[$i]['alarm_unit_id'] = $alarm->alarm_unit_id;
					
					
					
					$unitdata = DB::table('units')->where('unit_id',$alarm->alarm_unit_id)->get();
					if(count($unitdata) > 0) {
						$allalarms[$i]['alarm_location'] = $unitdata[0]->location;
						$allalarms[$i]['unitname'] = $unitdata[0]->unitname;
					}
					else {
						$allalarms[$i]['alarm_location'] = '';
						$allalarms[$i]['unitname'] = '';
					}
					$allalarms[$i]['alarm_name'] = $alarm->alarm_name;
					$allalarms[$i]['alarm_assgined_by'] = $alarm->alarm_assigned_by;
					if($alarm->alarm_assigned_by > 0)
					{
						$assignby = Staff::where('staff_id', $alarm->alarm_assigned_by)->select('firstname')->get();
						$allalarms[$i]['alarm_assginedby_name'] = $assignby[0]->firstname;
					}
					else
						$allalarms[$i]['alarm_assginedby_name'] = '';
					$allalarms[$i]['alarm_assgined_to'] = $alarm->alarm_assigned_to;
					if($alarm->alarm_assigned_to > 0)
					{
						$assignto = Staff::where('staff_id', $alarm->alarm_assigned_to)->select('firstname')->get();
						$allalarms[$i]['alarm_assginedto_name'] = $assignto[0]->firstname;
					}
					else
						$allalarms[$i]['alarm_assginedto_name'] = '';
										
					
					if($alarm->alarm_assigned_date != '0000-00-00 00:00:00') {
						$allalarms[$i]['alarm_assigned_date'] = $alarm->alarm_assigned_date;
						$allalarms[$i]['date_time'] = date('d M Y H:i:s',strtotime($alarm->alarm_assigned_date));
					}
					else {
						$allalarms[$i]['alarm_assigned_date'] = '';
						$allalarms[$i]['date_time'] = '';
					}
					
					$allalarms[$i]['alarm_received_date'] =  date("Y-m-d", strtotime($alarm->alarm_received_date)) . ', ' . date("H:i A",strtotime($alarm->alarm_received_date));
					
					$allalarms[$i]['formatted_datetime'] = date('d M Y h:i A',strtotime($alarm->alarm_received_date));
					
					$allalarms[$i]['alarm_status'] = $alarm->alarm_status;
					$allalarms[$i]['alarm_priority'] = $alarm->alarm_priority;
					$allalarms[$i]['alarm_remark'] = $alarm->alarm_remark;
					++$i;
				}
			}
			//allalarms
			if(count($serviceslist) > 0 && is_array($serviceslist)) {
				$i = 0;
				foreach($serviceslist as $service)
				{
					$allservices[$i]['service_id'] = $service->service_id;
					$allservices[$i]['service_unitid'] = $service->service_unitid;
					$unitname = Unit::where('unit_id',$service->service_unitid)->select('unitname')->get();					
					if(count($unitname) > 0) {
						$allservices[$i]['unitname'] = $unitname[0]->unitname;
					}
					else {
						$allservices[$i]['unitname'] = '';
					}
					$allservices[$i]['serviced_by'] = $service->serviced_by;
					if($service->serviced_datetime != '0000-00-00') {
						$allservices[$i]['serviced_datetime'] = $service->serviced_datetime;
					}					
					else {
						$allservices[$i]['serviced_datetime'] = '';;
					}
					
					$allservices[$i]['service_subject'] = $service->service_subject;
					$allservices[$i]['service_remark'] = $service->service_remark;
					$allservices[$i]['service_priority'] = $service->service_priority;
					
					if($service->next_service_date == '0000-00-00') {
						$allservices[$i]['next_service_date'] = '';
					}
					else {
						$allservices[$i]['next_service_date'] = $service->next_service_date;
					}
					if($service->serviced_time == '0000-00-00') {
						$allservices[$i]['serviced_time'] = '';
					}
					else {
						$allservices[$i]['serviced_time'] = $service->serviced_time;
					}
					$formatted = $service->next_service_date;
					if($service->serviced_time != '0000-00-00'){
					$allservices[$i]['formatted_datetime'] = date('d M Y',strtotime($formatted)).' '.$service->serviced_time;

					}else{
						$allservices[$i]['formatted_datetime'] = date('d M Y',strtotime($formatted));
					}
					/*if($service->serviced_time != '0000-00-00' && $service->next_service_date != '0000-00-00') {
						$formatted = $service->serviced_datetime . $service->serviced_time;
						$allservices[$i]['formatted_datetime'] = date('d M Y h:i A',strtotime($formatted));
					}
					else {				
						if($service->next_service_date != '0000-00-00') {
							$formatted = $service->next_service_date;
							$allservices[$i]['formatted_datetime'] = date('d M Y h:i A',strtotime($formatted));
						}
						else {
							$allservices[$i]['formatted_datetime'] = '';
						}						
					}*/					
					
					$allservices[$i]['is_request'] = $service->is_request;
					$staff = Staff::where('staff_id', $service->serviced_by)->select('firstname')->get();
					if(count($staff) > 0)
						$allservices[$i]['serviced_by_name'] = $staff[0]->firstname;
					else
						$allservices[$i]['serviced_by_name'] = '';

					$unitdata = Unit::where('unit_id',$service->service_unitid)->where('deletestatus','0')->get();
					if(count($unitdata) > 0) {
						$allservices[$i]['service_location'] = $unitdata[0]->location;
					}
					else {
						$allservices[$i]['service_location'] = '';
					}
					++$i;
				}
			}
//
			$msg = array('result'=>'success');	
			
			return response()->json(['msg' => $msg, 'events' => $events, 'services' => $services, 'alarms' => $alarms, 'allservices' => $allservices, 'allalarms' => $allalarms, 'allevents' => $eventslist,'highlightdots'=>$highlightsarr]);
			
		}
		else
		{
			$session = new Session();
			$hashtag = '';
			$unitids = array(0);
			$ses_login_id = $session->get('ses_login_id');
			$company_id = $session->get('ses_company_id');
			$unitsdropdown = DB::table('units')->where('deletestatus',0)->where('companys_id', $company_id)->select('unit_id','unitname')->get();
			$events = $services = $alarms = $alarmslist = $eventslist = $serviceslist = '';
			
			
			$date = date("Y-m-d");
			$staff = Staff::where('staff_id', $ses_login_id)->select('personalhashtag')->get();
			if(count($staff) > 0)
				$hashtag = $staff[0]->personalhashtag;		
			
			$eventslist = DB::select('SELECT * FROM events WHERE event_deletestatus=0 AND (event_added_by = "'.$ses_login_id.'" OR event_remark LIKE "%'. $hashtag.'%")');
			
			$units = Unit::where('deletestatus', '0')->get();
			if(count($units) > 0) {
				foreach($units as $unit) {						
					$unitids[] = $unit->unit_id;
				}
			}
			if($company_id == 1) {
				if($unitids) {
					$serviceslist = Service::where('deletestatus', '0')->whereIn('service_unitid',$unitids)->get();
					$alarmslist = Alarm::select('*')->whereIn('alarm_unit_id',$unitids)->get();
				}				
			}
			else {
				$services = $alarms = $unitids = '';
				$units = Unit::where('deletestatus', '0')->where('companys_id', $company_id)->get();
				if($units)
				{
					foreach($units as $unit)
					{
						$unitids[] = $unit->unit_id;
					}					
					if($unitids)
					{
					$serviceslist = Service::where('deletestatus', '0')->whereIn('service_unitid', $unitids)->get();					
					$alarmslist = DB::table('alarms')->whereIn('alarm_unit_id', $unitids)->get();
					}						
				}
			}
			
		$staffs = DB::table('users')->where('company_id', $company_id)->get();
		$staffids = '';
		if(count($staffs) >0) {
			foreach($staffs as $staff) {
				$staffids[] = "'".$staff->username."'";
			}
			if(is_array($staffids) && $staffids)
				$staffids = @implode(',', $staffids);
		}
				
		//user role view access STARTS
		$role_id = $session->get('role_id');
		$eveviewaccess = DB::table('role_permissions')->where('role_id',$role_id)->where('module_name','2')->where('page_name','7')->where('view_action','1')->get();
		$serviceviewaccess = DB::table('role_permissions')->where('role_id',$role_id)->where('module_name','2')->where('page_name','18')->where('view_action','1')->get();
		$alarmviewaccess = DB::table('role_permissions')->where('role_id',$role_id)->where('module_name','2')->where('page_name','19')->where('view_action','1')->get();		
		
		if(count($eveviewaccess) == 0) {
			$eventslist='';
		}
		if(count($serviceviewaccess) == 0) {
			$serviceslist='';
		}
		if(count($alarmviewaccess) == 0) {
			$alarmslist='';
		}
		//user role view access ENDS
		
		if(!isset($request->type)) {
							return view('Calendar.index', ['eventslist' => $eventslist, 'serviceslist' => $serviceslist, 'alarmslist' => $alarmslist,'ses_login_id'=>$ses_login_id,'unitsdropdown'=>$unitsdropdown
				,'staffids'=>$staffids]);
			
		}
		if($request->type == 'all') {
							return view('Calendar.index', ['eventslist' => $eventslist, 'serviceslist' => $serviceslist, 'alarmslist' => $alarmslist,'ses_login_id'=>$ses_login_id,'unitsdropdown'=>$unitsdropdown
				,'staffids'=>$staffids]);
			}
			if($request->type == 'event') {
							return view('Calendar.index', ['eventslist' => $eventslist, 'serviceslist' => array(), 'alarmslist' => array(),'ses_login_id'=>$ses_login_id,'unitsdropdown'=>$unitsdropdown
			,'staffids'=>$staffids]);
			}
			if($request->type == 'service') {
							return view('Calendar.index', ['eventslist' => array(), 'serviceslist' => $serviceslist, 'alarmslist' => array(),'ses_login_id'=>$ses_login_id,'unitsdropdown'=>$unitsdropdown
			,'staffids'=>$staffids]);
			}
			if($request->type == 'alarm') {
							return view('Calendar.index', ['eventslist' => array(), 'serviceslist' => array(), 'alarmslist' => $alarmslist,'ses_login_id'=>$ses_login_id,'unitsdropdown'=>$unitsdropdown
			,'staffids'=>$staffids]);
			}



		//

		}
	}	

	public function getunitdata($unitid, $ismobile)
	{
		$units = Unit::where('unit_id', $unitid)->select('unit_id', 'unitname', 'projectname', 'location')->get();
		$msg = array('result'=>'success');				
		return response()->json(['msg' => $msg, 'unitdata' => $units]);
	}

	/**
	* Show the form for creating a new resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function create()
	{
		$session = new Session();
		$event_added_by = $session->get('ses_login_id');
		$company_id = $session->get('ses_company_id');
		if($company_id == 1) {
			$staffs = DB::table('users')->where('deletestatus','0')->where('staffs_id','!=',$event_added_by)->get();
		}
		else
			$staffs = DB::table('users')->where('deletestatus','0')->where('staffs_id','!=',$event_added_by)->where('company_id', $company_id)->get();
		
		$staffids = '';
		if($staffs) {
			foreach($staffs as $staff) {
				$staffids[] = "'".$staff->username."'";
			}
			if(is_array($staffids) && $staffids)
				$staffids = @implode(',', $staffids);
		}
		if($company_id == 1)
		$unitsdropdown = DB::table('units')->where('deletestatus',0)->select('unit_id','unitname')->get();
		else
		$unitsdropdown = DB::table('units')->where('deletestatus',0)->where('companys_id', $company_id)->select('unit_id','unitname')->get();
		return view('Calendar.create',['unitsdropdown'=>$unitsdropdown,'event_added_by'=>$event_added_by,'staffids'=>$staffids]);
	}

	/**
	* Store a newly created resource in storage.
	*
	* @param  \Illuminate\Http\Request  $request
	* @return \Illuminate\Http\Response
	*/
	public function store(Request $request)	
	{
		$session = new Session();
		$ses_login_id = $session->get('ses_login_id');
		$ismobile = $request->is_mobile;
		$event_type = $request->event_type;
		$event_title = $request->event_title;
		$event_location = $request->event_location;
		$event_date = $request->event_date;
		$event_time = $request->event_time;
		$event_added_by = $request->event_added_by;
		$event_remark = $request->service_remark;
		$remark = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($event_remark));
		$remark = str_replace('</span>', '', $remark);
		$remark = str_replace('&nbsp;', '', $remark);
		$remark = str_replace('<br>', '', $remark);
		$remark = str_replace('?', '', $remark);
		$remark = str_replace('\xE2\x80\x8D', '', $remark);
		$remark = strip_tags($remark);		
		$remark = preg_replace('/[^A-Za-z0-9 @]/u','', strip_tags($remark));
		$tableid = 0;
		$staff = Staff::where('staff_id', $request->event_added_by)->select('firstname', 'email')->get();
		if($request->service_unitid) {
		$unit = Unit::where('unit_id', $request->service_unitid)->select('unitname', 'projectname', 'location')->get();
		}
		//echo $remark; 
		if($event_type == "Event")
		{
			$type = "E";
			DB::table('events')->insert(['event_title' => $event_title, 'event_location' => $event_location, 'event_date' => $event_date, 'event_time' => $event_time, 'event_added_by' => $event_added_by, 'event_remark' => $remark]);
			$events = DB::table('events')->orderBy('event_id', 'desc')->skip(0)->take(1)->get();
			
			if($events) { $tableid = $events[0]->event_id; }
			
			$emailids = $mentionids = '';
			$hashtags = @explode(' ', $remark);
			if($hashtags)
			{
				foreach($hashtags as $hashtag)
				{		
					$chkhashtag = substr($hashtag, 0,1); 	
					$hashtag = preg_replace('/[^A-Za-z\-]/', '', $hashtag);					
					if($chkhashtag == "@")
					{
						$hashtag = '@'.$hashtag;
						$staffs = Staff::where('personalhashtag', $hashtag)->select('email', 'staff_id')->get();
						if(count($staffs))
						{
							if (filter_var($staffs[0]->email, FILTER_VALIDATE_EMAIL)) {
								$emailids[] = $staffs[0]->email;
							}
							
							$notifycontent = $remark;
						// Insert data for send push notifications
							DB::table('pushnotifications')->insert(['notify_by' => $request->event_added_by, 'notify_to' => $staffs[0]->staff_id, 'notify_type' => $type, 'table_id' => $tableid,'notify_content' => $notifycontent,'notify_subject' => $request->event_title]);
							
						}
					}
				}
			}			
			
			if($emailids && is_array($emailids))
			{
				$content = '<table width="100%" cellpadding="5" cellspacing="5">';
				$content .= '<tr><td><b>Event Info:</b><br></td></tr>';				
				$content .= '<tr><td>Event Title: '.$event_title.'</td></tr>';
				$content .= '<tr><td>Event Date: '.date('d M Y',strtotime($event_date)).'</td></tr>';
				$content .= '<tr><td>Event Location: '.$event_location.'</td></tr>';
				$content .= '<tr><td>Remark: '.$remark.'</td></tr>';
				$content .= '</table>';			
				$subject = $request->event_title;
				$replyto = $staff[0]->email;
				$data = array( 'replytoemail' => $replyto, 'subject' => $subject, 'content' => $content);		
				Mail::send('emails.service', $data, function ($m) use ($data, $emailids)  {
					$m->from('cip@stridececommerce.com', 'Denyo');
					$m->replyTo($data['replytoemail'], $name = null);
					$m->bcc('balamurugan@webneo.in', '');
					$m->to($emailids, '')->subject($data['subject']);
				});
			}
//notify						
		}
		else
		{
			$type = "S";
			$unit_id = $request->service_unitid;	
			DB::table('services')->insert(['service_unitid' => $unit_id, 'serviced_by' => $event_added_by, 'next_service_date' => $event_date, 'serviced_time' => $event_time, 'service_subject' => $event_title, 'service_remark' => $remark, 'serviced_datetime' => '0000-00-00']);	
			$services = DB::table('services')->where('deletestatus', '0')->orderBy('service_id', 'desc')->skip(0)->take(1)->get();
			if($services) { $tableid = $services[0]->service_id; }
			//notify
			$emailids = $mentionids = '';
			$hashtags = @explode(' ', $remark);
			if($hashtags)
			{
				foreach($hashtags as $hashtag)
				{		
					$chkhashtag = substr($hashtag, 0,1); 	
					$hashtag = preg_replace('/[^A-Za-z\-]/', '', $hashtag);					
					if($chkhashtag == "@")
					{
						$hashtag = '@'.$hashtag;
						$staffs = Staff::where('personalhashtag', $hashtag)->select('email', 'staff_id')->get();
						if(count($staffs))
						{
							$emailids[] = $staffs[0]->email;
							//$notifycontent = $request->event_title.'\n'.$request->event_location.'\n'.$request->event_date.'\n'.$request->event_time;
							$notifycontent = $remark;		
			$notifys = DB::table('notification_content')->where('notify_type', 'S')->get();
			if(count($notifys))
			{
				$notify_content = $notifys[0]->notify_for.'<br>'.$notifys[0]->notify_content;
				$notify_content = str_replace('#NAME#', $staff[0]->firstname, $notify_content);
				$notify_content = str_replace('#UNITNAME#', $unit[0]->unitname, $notify_content);
				$notify_content = str_replace('#PROJECTNAME#', $unit[0]->projectname, $notify_content);
				$notify_content = str_replace('#SUBJECT#', $remark, $notify_content);
				$notifycontent = str_replace('#DATEANDTIME#', date('d M Y h:iA'), $notify_content);
				$notifycontent = nl2br($notifycontent);
			}						
						// Insert data for send push notifications
						DB::table('pushnotifications')->insert(['notify_content' => $notifycontent, 'notify_subject'=> $event_title, 'notify_by' => $request->event_added_by, 'notify_to' => $staffs[0]->staff_id, 'notify_type' => $type, 'table_id' => $tableid]);	
						
						}
					}
				}
			}

			if( count($emailids) != 0 && is_array($emailids) )
			{
				$content = '<table width="100%" cellpadding="5" cellspacing="5">';
				$content .= '<tr><td><b>Servicing Info:</b><br></td></tr>';
				$content .= '<tr><td>Unit Name: '.$unit[0]->unitname.'</td></tr>';
				$content .= '<tr><td>Project Name: '.$unit[0]->projectname.'</td></tr>';
				$content .= '<tr><td>Location: '.$unit[0]->location.'</td></tr>';
				$content .= '<tr><td>Serviced By: '.$staff[0]->firstname.'</td></tr>';			
				$content .= '<tr><td>Next Servicing Date: '.date("d M Y", strtotime($request->event_date)).'</td></tr>';
				$content .= '<tr><td>Remark: '.$remark.'</td></tr>';
				$content .= '</table>';			
				$subject = $request->event_title;
				$replyto = $staff[0]->email;
				$data = array( 'replytoemail' => $replyto, 'subject' => $subject, 'content' => $content);		
				Mail::send('emails.service', $data, function ($m) use ($data, $emailids)  {
					$m->from('cip@stridececommerce.com', 'Denyo');
					$m->replyTo($data['replytoemail'], $name = null);
					$m->bcc('balamurugan@webneo.in', '');
					$m->to($emailids, '')->subject($data['subject']);
				});
			}
//notify
		}
		// get the personalhashtags from remark
		
		

		if($request->is_mobile == 1) {
			$msg = array(array('Error' => '0','result'=> $event_type.' details created successfully'));			
			return response()->json(['msg'=>$msg]);
		}
		else {
			if($event_type == "Event")			
				$session->getFlashBag()->add('calendar_created', 'Event created successfully');			
			else
				$session->getFlashBag()->add('calendar_created', 'Service created successfully');			
			return redirect('/calendar')->with('alert', $event_type.' details created successfully');	
		}
	}

	/**
	* Display the specified resource.
	*
	* @param  int  $id
	* @return \Illuminate\Http\Response
	*/
	public function show($id)
	{
	//
	}

	/**
	* Show the form for editing the specified resource.
	*
	* @param  int  $id
	* @return \Illuminate\Http\Response
	*/
	public function editevent($eventid)
	{
		$session = new Session();
		$event_added_by = $session->get('ses_login_id');
		$company_id = $session->get('ses_company_id');
		
		if($event_added_by == 1) {
			$staffs = DB::table('users')->where('deletestatus','0')->where('staffs_id','!=',$event_added_by)->get();

		}
		else
			$staffs = DB::table('users')->where('deletestatus','0')->where('staffs_id','!=',$event_added_by)->where('company_id', $company_id)->get();

		$staffids = '';
		if($staffs) {
			foreach($staffs as $staff) {
				$staffids[] = "'".$staff->username."'";
			}
			if(is_array($staffids) && $staffids)
				$staffids = @implode(',', $staffids);
		}
		
		$units = DB::table('units')->where('deletestatus',0)->select('unit_id','unitname')->get();
		$editevents = DB::table('events')->where('event_id',$eventid)->get();
		return view('Calendar.edit',['units'=>$units,'event_added_by'=>$event_added_by,'etype'=>1,
		'editevents'=>$editevents,'staffids'=>$staffids]);			
	}
	
	public function editservice($serviceid)
	{
		$session = new Session();		
		$event_added_by = $session->get('ses_login_id');
		$company_id = $session->get('ses_company_id');
		if($event_added_by == 1) {
			$staffs = DB::table('users')->where('deletestatus','0')->where('staffs_id','!=',$event_added_by)->get();
		}
		else
		$staffs = DB::table('users')->where('deletestatus','0')->where('staffs_id','!=',$event_added_by)->where('company_id', $company_id)->get();
	
		$staffids = '';
		if($staffs) {
			foreach($staffs as $staff) {
				$staffids[] = "'".$staff->username."'";
			}
			if(is_array($staffids) && $staffids)
				$staffids = @implode(',', $staffids);
		}
		if($company_id == 1)
		$units = DB::table('units')->where('deletestatus',0)->select('unit_id','unitname')->get();
		else
		$units = DB::table('units')->where('deletestatus',0)->where('companys_id',$company_id)->select('unit_id','unitname')->get();
		
		$editservice = DB::table('services')->where('service_id',$serviceid)->get();
		
		if(count($editservice) > 0) {
			$loc_projectname = DB::table('units')->where('unit_id',$editservice[0]->service_unitid)->select('location','projectname')->get();
		}
		
		//else $editservice = array();
		
		return view('Calendar.edit',['units'=>$units,'event_added_by'=>$event_added_by,'etype'=>2,'staffids'=>$staffids,'editservice'=>$editservice,'loc_projectname'=>$loc_projectname]);
	}

	/**
	* Update the specified resource in storage.
	*
	* @param  \Illuminate\Http\Request  $request
	* @param  int  $id
	* @return \Illuminate\Http\Response
	*/
	public function update(Request $request)
	{
		$ismobile = $request->is_mobile;		
		$session = new Session();
		if($ismobile == 1)				
			$event_added_by = $request->ses_login_id;
		else 
			$event_added_by = $request->event_added_by;
		
		$event_type = $request->event_type;
		$event_title = $request->event_title;
		$event_location = $request->event_location;
		$event_date = $request->event_date;
		$event_time = $request->event_time;
		
		$event_remark = $request->event_remark;
		
			$remark = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($event_remark));
			$remark = str_replace('</span>', '', $remark);
			$remark = str_replace('&nbsp;', '', $remark);
			$remark = str_replace('<br>', '', $remark);
			$remark = str_replace('?', '', $remark);
			$remark = str_replace('\xE2\x80\x8D', '', $remark);
			$remark = str_replace('\u200d', '', $remark);     
			$remark = preg_replace('/[^A-Za-z0-9 @]/u','', strip_tags($remark));
			$remark = strip_tags(stripslashes($remark));
			$remark = strip_tags($remark);

		$tableid = 0;
		$staff = Staff::where('staff_id', $request->event_added_by)->select('firstname', 'email')->get();
		if($request->service_unitid) {
			$unit = Unit::where('unit_id', $request->service_unitid)->select('unitname', 'projectname', 'location')->get();
		}
		if($event_type == "Event")
		{
			$type = "E";
			DB::table('events')->where('event_id',$request->id)->update(['event_title' => $event_title, 'event_location' => $event_location, 'event_date' => $event_date, 'event_time' => $event_time, 'event_added_by' => $event_added_by, 'event_remark' => $remark]);
			
			$events = DB::table('events')->orderBy('event_id', 'desc')->skip(0)->take(1)->get();
			//echo $events[0]->event_id; die;
			if($events) { $tableid = $events[0]->event_id; }
		}
		else
		{
			$type = "S";
			$unit_id = $request->service_unitid;	
			DB::table('services')->where('service_id',$request->id)->update(['service_unitid' => $unit_id, 'serviced_by' => $event_added_by, 'next_service_date' => $event_date, 'serviced_time' => $event_time, 'service_subject' => $event_title, 'service_remark' => $remark, 'serviced_datetime' => '0000-00-00']);	
			$services = DB::table('services')->where('deletestatus', '0')->orderBy('service_id', 'desc')->skip(0)->take(1)->get();
			if($services) { $tableid = $services[0]->service_id; }

		}
		if($ismobile == 1) {
			$msg = array(array('Error' => '0','result'=>'Calendar updated successfully'));
			return response()->json(['msg'=>$msg]);			
		}
		else {
			if($event_type == "Event")
				$session->getFlashBag()->add('calendar_updated', 'Event updated successfully');			
			else
				$session->getFlashBag()->add('calendar_updated', 'Service updated successfully');						
			return redirect('/calendar');
		}
	}
	
	/**
	* Remove the specified resource from storage.
	*
	* @param  int  $id
	* @return \Illuminate\Http\Response
	*/
	public function destroy($id)
	{
		//
	}
	
	public function deleteevent($eventid,$ismobile) {
		
		DB::table('events')->where('event_id',$eventid)->update(['event_deletestatus'=>'1']);
		if($ismobile==1) {
			//$dashboards = DB::table('companygroups')->where('companygroup_id',$id)->update(array('deletestatus' => '1'));
			$msg = array(array('Error' => '0','result'=>'Event Deleted Successfully'));
			return response()->json(['msg'=>$msg]);
		}
		else {
			$session = new Session();		
			$session->getFlashBag()->add('calendarevent_deleted', 'Event deleted successfully');			
			return redirect('/calendar');
		}
	}
	
	public function deleteservice($serviceid,$ismobile) {	
		DB::table('services')->where('service_id',$serviceid)->update(['deletestatus'=>'1']);
		if($ismobile==1) {
			//$dashboards = DB::table('companygroups')->where('companygroup_id',$id)->update(array('deletestatus' => '1'));
			$msg = array(array('Error' => '0','result'=>'Service Deleted Successfully'));
			return response()->json(['msg'=>$msg]);
		}
		else {
			$session = new Session();		
			$session->getFlashBag()->add('calendarservice_deleted', 'Service deleted successfully');			
			return redirect('/calendar');
		}
	}
	
	public function deletealarm($alarm_id,$ismobile) {	
		DB::table('alarms')->where('alarm_id',$alarm_id)->update(['alarm_status'=>'1']);
		if($ismobile==1) {
			//$dashboards = DB::table('companygroups')->where('companygroup_id',$id)->update(array('deletestatus' => '1'));
			$msg = array(array('Error' => '0','result'=>'Alarm Deleted Successfully'));
			return response()->json(['msg'=>$msg]);
		}
		else {
			$session = new Session();		
			$session->getFlashBag()->add('calendaralarm_deleted', 'Alarm deleted successfully');			
			return redirect('/calendar');
		}
	}

	public function automaticlocation(Request $request)
	{
		$unitid = $request->unitid;
		$unitdata = Unit::where('unit_id', $unitid)->select('location', 'projectname')->get();		
		echo $unitdata[0]->location.'#'.$unitdata[0]->projectname;
	}
	
	public function eventdetailbyid(Request $request) {
		$eventdataqry = DB::table('events')->where('event_id',$request->eventid)->get();
		if(count($eventdataqry) > 0) {	
			$i=0;
			foreach($eventdataqry as $event) {
				$eventslist[$i]['event_id'] = $event->event_id;
				$eventslist[$i]['event_title'] = $event->event_title;
				$eventslist[$i]['event_date'] = date('d M Y',strtotime($event->event_date));
				$eventslist[$i]['event_time'] = $event->event_time;
				$eventslist[$i]['event_location'] = $event->event_location;
				$eventslist[$i]['event_remark'] = $event->event_remark;
				//$eventslist[$i]['event_added_by'] = $event->event_added_by;
				$addedby = Staff::where('staff_id', $event->event_added_by)->select('firstname')->get();
				if($addedby)
				$eventslist[$i]['event_addedby_name'] = $addedby[0]->firstname;
				else
				$eventslist[$i]['event_addedby_name'] = '';
				++$i;
			}	
			$msg = array('result'=>'success');							
		}
		else {
			$eventslist = '';
		}
		return response()->json(['msg' => $msg, 'eventslist' => $eventslist]);			
	}

}
