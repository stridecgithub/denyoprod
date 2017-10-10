<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Html\HtmlServiceProvider;
use App\Http\Requests;
use App;
use PDF;
use DB;
use Symfony\Component\HttpFoundation\Session\Session;
use File;
use Response;
use Excel;
use Mail;
use Illuminate\Support\Facades\Schema;

class ReportController extends Controller {

    	public function index(Request $request) {
		$ismobile = $request->is_mobile;		
		$templates = DB::table('reporttemplate')->where('delete_status', '0')->get();
		$templatecolors = $templatedata = $actualhistorydata = [];
		$userunitgroups = '';
		if($ismobile == 0)
		{
			$session = new Session();						
			$company = $session->get('ses_company_id');
			$ses_login_id = $session->get('ses_login_id');			
		}
		else
		{
			$company = $request->companyid;
			$ses_login_id = $request->loginid;
		}
		if ($company == 1) {
		    $units = DB::table('units')->where('deletestatus', '0')->get();
		} else {
		    $units = DB::table('units')->where('companys_id', $company)->where('deletestatus', '0')->get();
		}		

		if($ismobile == 0) {
			return view('Reports.index', ['units' => $units, 'templates' => $templates, 'actualhistorydata' => $actualhistorydata, 'fromdate' => '', 'todate' => '', 'unitid' => '', 'timeframe' => '', 'templateid' => '', 'templatedata' => $templatedata, 'seltype' => '', 'exportto' => '', 'templatecolors' => $templatecolors]);
		} else {
			return response()->json(['msg' => array('result'=>'success'), 'templates' => $templates, 'units' => $units]);
		}
    	}

	public function viewreport(Request $request)
	{
		//set_time_limit(0);
		ini_set('max_execution_time', 500);
		$ismobile = $request->is_mobile;
		$unitid = $request->input('selunit');
		$timeframe = $request->input('seltimeframe');
		$templateid = $request->input('seltemplate');
		$fromdate = $request->input('from');
		$fromdate = date("Y-m-d", strtotime($fromdate));
		$real_fromdate = date("Y-m-d", strtotime($fromdate));
		$todate = $request->input('to');
		$todate = date("Y-m-d", strtotime($todate));
		$seltype = $request->input('seltype');
		$exportto = $request->input('exportto');
		$action = $request->input('action');
		$templatedata[] = 'DATEANDTIME';
		$templatecolors = '';
		$firstdata = array();
		$actualhistorydata = [];
		
		if($ismobile == 0) {
			$session = new Session();
			$loginid = $session->get('ses_login_id');
			$companyid = $session->get('ses_company_id');
		}
		else {
			$loginid = $request->loginid;
			$companyid = $request->companyid;
		}
		if ($companyid == 1) {
		    $units = DB::table('units')->where('deletestatus', '0')->get();
		} else {		    
		    $units = DB::table('units')->where('companys_id', $companyid)->where('deletestatus', '0')->get();
		}

		$templates = DB::table('reporttemplate')->get();

		$staffres = DB::table('staffs')->where('staff_id', $loginid)->get();
		if (count($staffres) > 0) {
			$staffname = $staffres[0]->firstname;
			$staffemail = $staffres[0]->email;
		}
		$unitres = DB::table('units')->where('unit_id', $unitid)->get();
		if (count($unitres) > 0) {
			$unitname = $unitres[0]->unitname;
			$projectname = $unitres[0]->projectname;
		}
		$rtemplate = DB::table('reporttemplate')->where('id', $templateid)->get();
		if ($rtemplate) {
			$templatename = $rtemplate[0]->templatename;
		}

		//get table heading from the reporttemplate table
		$templateres = DB::table('reporttemplate')->where('id', $templateid)->get();
		if (count($templateres) > 0) {
			$tmp = $templateres[0]->availableheading;
		    	if ($tmp) {
		        	$tmparr = @explode("#", $tmp);
				if (count($tmparr) > 0) {
					$templatedatares = DB::table('reporttemplatedata')->whereIn('availabledata', $tmparr)->get(); 
					if (count($templatedatares) > 0) {
						foreach ($templatedatares as $template) {
							$templatedata[] = $template->datacode;
							$templatecolors[$template->datacode] = $template->colorcode;
						}
					}
				}
		    	}
		}
//schema starts

		if (Schema::hasTable('unitdatahistory_' . $unitid)) {
    

		$tmpdatacodes = $templatedata;
		//for first record - start
		foreach ($templatedata as $templatecode) {
			$i = 0;
			$firstres = DB::table('unitdatahistory_' . $unitid)->where('code', $templatecode)->whereBetween('date', [$fromdate, $todate])->orderBy('todateandtime', 'desc')->skip(0)->take(1)->get();
			if (count($firstres) > 0) {
				if ($i == 0) {
					$firstdata['DATEANDTIME'] = $firstres[0]->todateandtime;
					$firstdata['DATE'] = $firstres[0]->date;
				}
				$firstdata[$templatecode] = $firstres[0]->currentval;
				$i++;
			} else {
				
				$firstdata[$templatecode] = '0';
			}
		}
		//for first record - end

		$actualhistorydata = $unithistory = [];
		$highertime = $lowertime = '';

		$chktime = '23:59:00';
		if($todate == date('Y-m-d'))
			$chktime = date("H:i:s");

		$lowerres = DB::table('unitdatahistory_'.$unitid)->whereIn('code', $templatedata)->where('todateandtime', 'LIKE', "$fromdate%")->orderBy('todateandtime', 'asc')->skip(0)->take(1)->get();
		if(count($lowerres) > 0) { 
			$lowertime = $lowerres[0]->todateandtime; 
		} else {
			//$lowerres = DB::table('unitdatahistory_'.$unitid)->whereIn('code', $templatedata)->where('todateandtime', '>', $fromdate.' 00:00:00')->orderBy('todateandtime', 'asc')->skip(0)->take(1)->get();

			$tdata = @implode("','", $templatedata);
			
			$qry = "SELECT * FROM unitdatahistory_".$unitid." WHERE code IN ('".$tdata."') AND todateandtime > '".$fromdate." 00:00:00' ORDER BY todateandtime ASC LIMIT 1";
			$lowerres = DB::select($qry);
			if(count($lowerres) > 0) { 
				$lowertime = $lowerres[0]->todateandtime; 
			}
		}
		//echo $lowertime;
		$higherres = DB::table('unitdatahistory_'.$unitid)->whereIn('code', $templatedata)->where('todateandtime', 'LIKE', "$todate%")->orderBy('todateandtime', 'desc')->skip(1)->take(1)->get();
		if(count($higherres) > 0) { 
			$highertime = $higherres[0]->todateandtime; 
		} else {
			//$higherres = DB::table('unitdatahistory_'.$unitid)->whereIn('code', $templatedata)->where('todateandtime', 'LIKE', "$fromdate%")->orderBy('todateandtime', 'desc')->skip(1)->take(1)->get();
			$tdata = @implode("','", $templatedata);
			
			$qry = "SELECT * FROM unitdatahistory_".$unitid." WHERE code IN ('".$tdata."') AND todateandtime < '".$todate." 00:00:00' ORDER BY todateandtime DESC LIMIT 1";
			$higherres = DB::select($qry);
			
			if(count($higherres) > 0) { 
				$highertime = $higherres[0]->todateandtime; 
			}
		}	
		
		//echo $highertime; exit;
		if($timeframe == "continues") {				
			$unithistory = DB::table('unitdatahistory_' . $unitid)->whereIn('code', $templatedata)->whereBetween('todateandtime', [$lowertime, $highertime])->orderBy('todateandtime', 'desc')->get();
		}

		$historydata = $datetimearr = [];
		if(count($unithistory) > 0) {			
			foreach($unithistory as $data) {
				$datetimearr[] = $data->todateandtime;
				$historydata[$data->todateandtime][$data->code] = $data->currentval;
			}		
		}
		
		if($action == "view" && $highertime && $lowertime) {
			
			$i = 0;
			$stilltime = $highertime;
			if($timeframe == "continues") {
				while($highertime >= $lowertime) {
					if($i == 86400) {
						break;
					}
					if(in_array($highertime, $datetimearr)) 	
						$stilltime = $highertime;
					foreach($templatedata as $templatecode) {
						if($templatecode != "DATEANDTIME") {	
							if(isset($historydata[$stilltime][$templatecode]))					
								$actualhistorydata[$i][$templatecode] = $historydata[$stilltime][$templatecode];
							else
								$actualhistorydata[$i][$templatecode] = $firstdata[$templatecode];
						} else {
							$actualhistorydata[$i]['DATEANDTIME'] = $highertime;
						}					
					}
					$highertime = date("Y-m-d h:i:s", strtotime($highertime . '-1 seconds'));
					++$i;
				}
				
			}
			else if($timeframe == "1time") {				
				while($fromdate <= $todate) {				
					$date = $fromdate;
					$unithistory = DB::table('unitdatahistory_'.$unitid)->whereIn('code', $templatedata)->where('date', $date)->orderBy('todateandtime', 'desc')->get();
					if(count($unithistory) > 0) {
						foreach($unithistory as $data) {						
							$historydata[$data->date][$data->code] = $data->currentval;
						}
					}
					else {
						$previousdate = date("Y-m-d", strtotime($date . '-1 days'));
						foreach($templatedata as $templatecode) {
							if($templatecode != "DATEANDTIME") {
								if(isset($historydata[$previousdate][$templatecode]))
									$historydata[$date][$templatecode] = $historydata[$previousdate][$templatecode];
								else
									$historydata[$date][$templatecode] = $firstdata[$templatecode];
							} else { 
								$historydata[$date][$templatecode] = $date;
							}
						}
					}
					$fromdate = date("Y-m-d", strtotime($date . '+1 days'));
				}
			
				if($historydata) {
					$i = 0;	
					foreach($historydata as $date => $history) {					
						foreach($templatedata as $templatecode) {
							if($templatecode != "DATEANDTIME") {	
								if(isset($history[$templatecode]))					
									$actualhistorydata[$i][$templatecode] = $history[$templatecode];
								else
									$actualhistorydata[$i][$templatecode] = $firstdata[$templatecode];
							} else {
								$actualhistorydata[$i]['DATEANDTIME'] = $date;
							}					
						}					
						++$i;	
					}
				}
			}
			
			if($seltype == 1) { //export as pdf
				$pdfcontent = '';
				$logo = url('/') . "/images/denyoreportlogo.png";
				$pdfcontent .= '<table style="width:100%;" border="0" cellpadding="0" cellspacing="0">';
				$pdfcontent .= '<tr><td><font size="24">Reports</font><br>' . date("d M Y h:i A") . '</td>';
				$pdfcontent .= '<td></td><td></td><td><img src="' . $logo . '" alt="Denyo" ></td></tr>';
				$pdfcontent .= '<tr><td colspan="3">' . $unitname . '</td><td></td></tr>';
				$pdfcontent .= '<tr><td style="white-space: nowrap;">' . $projectname . '</td><td style="white-space: nowrap;">Start Date: ' . $real_fromdate . '</td><td style="white-space: nowrap;">End Date: ' . $todate . '</td><td style="white-space: nowrap;">Time Frame: ' . $timeframe . '</td></tr>';
				$pdfcontent .= '</table>';
				$pdfcontent .= '<table style="width:100%; border-color:#CCC; padding-top:20px;" border="1" cellpadding="0" cellspacing="0">';
				$pdfcontent .= '<tr>';
				if ($templatedata) {
				    foreach ($templatedata as $templatecode) {
				        $pdfcontent .= '<th style="text-align:left; padding:5px; font-size:11px;">' . $templatecode . '</th>';
				    }
				}
				$pdfcontent .= '</tr>';
				foreach ($actualhistorydata as $actualhistory) {
				    if (is_array($actualhistory)) {
				        $pdfcontent .= '<tr>';
				        if ($templatedata) {
				            foreach ($templatedata as $templatecode) {
				                $pdfcontent .= '<td style="padding:5px; font-size:11px;">';
				                if ($templatecode == "DATEANDTIME")
				                    $pdfcontent .= date("d M Y H:i:s", strtotime($actualhistory[$templatecode]));
				                else
				                    $pdfcontent .= $actualhistory[$templatecode];
				                $pdfcontent .= '</td>';
				            }
				            $pdfcontent .= '</tr>';
				        }
				    }
				}
				$pdfcontent .= '</table>';
								
				$filename = strtolower(str_replace(' ', '_', $unitname));
				$filename = $filename.'_'.time();

				$pdf = App::make('dompdf.wrapper');
				$pdf->loadHTML($pdfcontent)->setPaper('a4', 'landscape')->setWarnings(false);
				if ($ismobile == "1") {
					
					$pdf->save(public_path('reports_'.$filename.'.pdf'));

					return response()->json(['msg' => array('result'=>'success'), 'pdf' => url('reports_'.$filename.'.pdf') ]);
				    
				} else {
				    return $pdf->download('reports_'.$filename.'.pdf');
				}
			} else if($seltype == 2) {
				$data = "";
				$colcount = count($templatedata);
				$datetime[] = date("d M Y H:i:s");
				$unit[] = $unitname;
				$heading = '';
				//for empty cells
				for ($i = 1; $i < $colcount; $i++) {
				    //$title[] = '';
				    $datetime[] = '';
				    $unit[] = '';
				}
				foreach ($templatedata as $templatecode) {
				    $heading[] = $templatecode;
				}
				$data[] = array('Reports');
				$data[] = $datetime;
				$data[] = $unit;
				$data[] = array($projectname, 'Start Date: ' . date("d M Y", strtotime($real_fromdate)), 'End Date: ' . date("d M Y", strtotime($todate)), 'Time Frame: ' . $timeframe);
				$data[] = $heading;
				$historycount = count($actualhistorydata) + 5;
				foreach ($actualhistorydata as $actualhistory) {
				    $content = '';
				    if (is_array($actualhistory)) {
				        if ($templatedata) {
				            foreach ($templatedata as $templatecode) {
				                $tmpcodes[] = "'" . $templatecode . "'";
				                if ($templatecode == "DATEANDTIME")
				                    $content[] = date("d M Y h:i:s", strtotime($actualhistory[$templatecode]));
				                else
				                    $content[] = $actualhistory[$templatecode];
				            }
				            $data[] = $content;
				        }
				    }
				}
				//$data[] = array($content);
				$reportname = 'report_' . $projectname . '_' . date("Ymd", strtotime($fromdate)) . '_to_' . date("Ymd", strtotime($todate));
				$excel = App::make('excel');
				Excel::create($reportname, function($excel) use($data) {
				    $excel->sheet('report', function($sheet) use($data) {
				        $sheet->fromArray($data);
				        for ($i = 0; $i < 100; $i++)
				            $sheet->setSize('A' . $i, 20, 20);
				        $sheet->cells('A6:P6', function($cells) {
				            $cells->setBackground('#F1F1F1');
				            $cells->setFontSize(11);
				            $cells->setFontWeight('bold');
				        });
				    });
				})->export('xls');
			}
			
		}		
		else if($action != 'view') {
			
			$content = 'Hi<br>';
			$content .= 'Report details:<br><br>';
			$content .= 'Unit Name: ' . $unitname . '<br><br>';
			$content .= 'Project Name: ' . $projectname . '<br><br>';
			$content .= 'From Date: ' . date("d M Y", strtotime($fromdate)) . '<br><br>';
			$content .= 'To Date: ' . date("d M Y", strtotime($todate)) . '<br><br>';
			$content .= 'Time Frame: ' . $timeframe . '<br><br>';
			$content .= 'Report Template: ' . $templatename . '<br>';
			$data = array('replytoemail' => $staffemail, 'subject' => 'Request Report', 'content' => $content);
			Mail::send('emails.service', $data, function ($m) use ($data) {
			$m->from('cip@stridececommerce.com', 'Denyo');
			$m->replyTo($data['replytoemail'], $name = null);
			
			$m->to('balamurugan@webneo.in', 'bala')->subject($data['subject']);
			//$m->to('balamurugan@webneo.in','bala')->subject($data['subject']);
			});
			$actualhistorydata = [];
			if($ismobile == 1) {
				return response()->json(['msg'=>array('result' => 'success'), 'request' => 'request successfully sent']);
			}
		}

		if($ismobile == 1) {
			if($exportto == 'graph') {
				if($templatedata) {
					foreach($templatedata as $templatecode) {
						$tmpdatacodes[] = "'".$templatecode."'";
						if($templatecode != 'DATEANDTIME') {
							$tmpdatacolors[] = "'#".$templatecolors[$templatecode]."'";
						}
					}
					if($tmpdatacodes) {
						$tmpdatacodes = @implode(",", $tmpdatacodes);
					}
					if($tmpdatacolors) {
						$tmpdatacolors = @implode(",", $tmpdatacolors);
					}
				}
				return view('Reports.graphreport', ['units' => $units, 'templates' => $templates, 'fromdate' => $fromdate, 'todate' => $todate, 'unitid' => $unitid, 'timeframe' => $timeframe, 'templateid' => $templateid, 'templatedata' => $templatedata, 'firstdata' => $firstdata, 'actualhistorydata' => $actualhistorydata, 'seltype' => $seltype, 'exportto' => $exportto, 'templatecolors' => $templatecolors,'tmpdatacodes'=>$tmpdatacodes,'tmpdatacolors'=>$tmpdatacolors]);
			}
			return response()->json(['msg' => array('result'=>'success'), 'reportdata' => $actualhistorydata]);
		} else {			
			return view('Reports.index', ['units' => $units, 'templates' => $templates, 'fromdate' => $fromdate, 'todate' => $todate, 'unitid' => $unitid, 'timeframe' => $timeframe, 'templateid' => $templateid, 'templatedata' => $templatedata, 'firstdata' => $firstdata, 'actualhistorydata' => $actualhistorydata, 'seltype' => $seltype, 'exportto' => $exportto, 'templatecolors' => $templatecolors]);

			}
		//schema
		}
	}


    public function mobviewreport(Request $request) {
        //print_r($request->input());	exit;
        $userid = $request->input('userid');
        $unitid = $request->input('selunit');
        $timeframe = $request->input('seltimeframe');
        $templateid = $request->input('seltemplate');
        $fromdate = $request->input('from');
        $fromdate = date("Y-m-d", strtotime($fromdate));
        $todate = $request->input('to');
        $todate = date("Y-m-d", strtotime($todate));
        $action = $request->input('action');
        $seltype = $request->input('seltype');
        $exportto = $request->input('exportto');
        $templatedata[] = 'DATEANDTIME';
        $templatecolors = '';
        $firstdata = array();
        $actualhistorydata = [];
        $templateres = DB::table('reporttemplate')->where('id', $templateid)->get();
        if ($templateres) {
            $tmp = $templateres[0]->availabledata;
            if ($tmp) {
                $tmparr = @explode("#|#", $tmp);
                if ($tmparr) {
                    $templatedatares = DB::table('reporttemplatedata')->whereIn('id', $tmparr)->get();
                    if ($templatedatares) {
                        foreach ($templatedatares as $template) {
                            $templatedata[] = $template->datacode;
                            $templatecolors[$template->datacode] = $template->colorcode;
                        }
                    }
                }
            }
        }
        $tmpdatacodes = $templatedata;
        //for first record - start
        foreach ($templatedata as $templatecode) {
            $i = 0;
            $firstres = DB::table('unitdatahistory_' . $unitid)->where('code', $templatecode)->whereBetween('date', [$fromdate, $todate])->orderBy('todateandtime', 'asc')->skip(0)->take(1)->get();
            //print_r($firstres);
            if ($firstres) {
                if ($i == 0) {
                    $firstdata['DATEANDTIME'] = $firstres[0]->todateandtime;
                    $firstdata['DATE'] = $firstres[0]->date;
                }
                $firstdata[$templatecode] = $firstres[0]->currentval;
                $i++;
            } else {
                $firstdata[$templatecode] = '';
            }
        }
        //for first record - end	
        $actualhistorydata = $unithistory = '';
        if ($timeframe == "1time") {
            //$unithistory = DB::table('unitdatahistory_'.$unitid)->whereIn('code', $templatedata)->whereBetween('date', [$fromdate, $todate])->orderBy('id', 'desc')->groupBy('date')->get();
            $i = 0;
            $res = DB::table('unitdatahistory_' . $unitid)->whereIn('code', $templatedata)->whereBetween('date', [$fromdate, $todate])->orderBy('todateandtime', 'desc')->groupBy('date')->get();
            if ($res) {
                $i = 0;
                foreach ($res as $data) {
                    $datacodearr[] = 'DATEANDTIME';
                    $dateres = DB::table('unitdatahistory_' . $unitid)->where('date', $data->date)->orderBy('id', 'desc')->skip(0)->take(1)->get();
                    if ($dateres) {
                        $actualhistorydata[$i]['DATEANDTIME'] = $dateres[0]->todateandtime;
                        foreach ($templatedata as $templatecode) {
                            $finalres = DB::table('unitdatahistory_' . $unitid)->where('code', $templatecode)->where('todateandtime', $dateres[0]->todateandtime)->skip(0)->take(1)->get();
                            if ($finalres) {
                                $datacodearr[] = $templatecode;
                                $actualhistorydata[$i][$templatecode] = $finalres[0]->currentval;
                            } else {
                                $tmpres = DB::table('unitdatahistory_' . $unitid)->where('date', $data->date)->where('code', $templatecode)->orderBy('id', 'desc')->skip(0)->take(1)->get();
                                if ($tmpres) {
                                    $datacodearr[] = $templatecode;
                                    $actualhistorydata[$i][$templatecode] = $tmpres[0]->currentval;
                                } else if ($templatecode != "DATEANDTIME") {
                                    //echo $templatecode;
                                    $datacodearr[] = $templatecode;
                                    $actualhistorydata[$i][$templatecode] = '';
                                }
                            }
                        }
                        if ($datacodearr && is_array($datacodearr)) {
                            // $tmpdatacodes - report template codes
                            $result = array_diff($tmpdatacodes, $datacodearr);
                        }
                        if ($result && is_array($result)) {
                            foreach ($result as $remaining) {
                                $actualhistorydata[$i][$remaining] = $firstdata[$remaining];
                            }
                        }
                    }
                    $i++;
                }
            }
        } else {
            $unithistory = DB::table('unitdatahistory_' . $unitid)->whereIn('code', $templatedata)->whereBetween('date', [$fromdate, $todate])->orderBy('todateandtime', 'desc')->groupBy(['date'])->get();
        }
        if ($action == "view") {
            if ($unithistory) {
                $i = 0;
                $incrementtime = $firsttime = $secondtime = '';
                foreach ($unithistory as $unithistorydata) {
                    $datacodearr = $result = '';
                    $dateandtime = $unithistorydata->todateandtime;
                    $chkres = DB::table('unitdatahistory_' . $unitid)->where('todateandtime', $dateandtime)->whereIn('code', $templatedata)->get();
                    if ($chkres) {
                        $actualhistorydata[$i]['TIMESTAMP'] = $dateandtime;
                        //print_r($actualhistorydata[$i]['TIMESTAMP']);
                        $datacodearr[] = 'DATEANDTIME';
                        foreach ($chkres as $chkdata) {
                            $datacodearr[] = $chkdata->code;
                            $actualhistorydata[$i][$chkdata->code] = $chkdata->currentval;
                        }
                        if ($datacodearr && is_array($datacodearr)) {
                            // $tmpdatacodes - report template codes
                            $result = array_diff($tmpdatacodes, $datacodearr);
                        }
                        if ($result && is_array($result)) {
                            foreach ($result as $remaining) {
                                $actualhistorydata[$i][$remaining] = $firstdata[$remaining];
                            }
                        }
                        if ($firsttime == '') {
                            $firsttime = $dateandtime;
                        } else {
                            $secondtime = $dateandtime;
                            $tmpsecondtime = $tmpfirsttime = $firsttime;
                            if (strtotime($firsttime) > strtotime($secondtime)) {
                                //++$i;
                                $diff = strtotime($tmpsecondtime) - strtotime($secondtime);
                                for ($t = 0; $t < $diff; $t = $t + 60) {
                                    $tmpsecondtime = date("Y-m-d h:i:s", strtotime($tmpfirsttime . '-1 minutes'));
                                    $tmpfirsttime = $tmpsecondtime;
                                    $actualhistorydata[$i]['DATEANDTIME'] = $tmpsecondtime;
                                    foreach ($tmpdatacodes as $tmpdatacode) {
                                        if (isset($actualhistorydata[$i][$tmpdatacode]))
                                            $actualhistorydata[$i][$tmpdatacode] = $actualhistorydata[$i][$tmpdatacode];
                                        else {
                                            $nextres = DB::table('unitdatahistory_' . $unitid)->where('todateandtime', '!=', $firsttime)->where('code', $tmpdatacode)->orderBy('id', 'desc')->get();
                                            if (count($nextres) > 0) {
                                                $actualhistorydata[$i][$tmpdatacode] = $nextres[0]->currentval;
                                            } else
                                                $actualhistorydata[$i][$tmpdatacode] = '';
                                        }
                                    }
                                    $i++;
                                }
                            }
                            $firsttime = $secondtime;
                        }
                    }
                    $i++;
                }
            }
        }
        else {
            $adminid = $userid;
            $incrementtime = $firsttime = $secondtime = '';
            $unitname = $projectname = $templatename = $staffname = $staffemail = '';
            $staffres = DB::table('staff')->where('id', $adminid)->get();
            if ($staffres) {
                $staffname = $staffres[0]->name;
                $staffemail = $staffres[0]->email;
            }
            $unitres = DB::table('units')->where('id', $unitid)->get();
            if ($unitres) {
                $unitname = $unitres[0]->name;
                $projectname = $unitres[0]->projectname;
            }
            $rtemplate = DB::table('reporttemplate')->where('id', $templateid)->get();
            if ($rtemplate) {
                $templatename = $rtemplate[0]->templatename;
            }
            $content = 'Hi<br>';
            $content .= 'Report details:<br><br>';
            $content .= 'Unit Name: ' . $unitname . '<br><br>';
            $content .= 'Project Name: ' . $projectname . '<br><br>';
            $content .= 'From Date: ' . date("d M Y", strtotime($fromdate)) . '<br><br>';
            $content .= 'To Date: ' . date("d M Y", strtotime($todate)) . '<br><br>';
            $content .= 'Time Frame: ' . $timeframe . '<br><br>';
            $content .= 'Report Template: ' . $templatename . '<br>';
            $data = array('replytoemail' => $staffemail, 'subject' => 'Request Report', 'content' => $content);
            Mail::send('emails.service', $data, function ($m) use ($data) {
                $m->from('cip@stridececommerce.com', 'Denyo');
                $m->replyTo($data['replytoemail'], $name = null);
                $m->bcc('arun@stridec.com', 'arun');
                $m->to('balamurugan@webneo.in', 'bala')->subject($data['subject']);
                //$m->to('balamurugan@webneo.in','bala')->subject($data['subject']);
            });
            $actualhistorydata = [];
        }
        $templates = DB::table('reporttemplate')->get();
        return view('Reports.mobviewreport', ['templates' => $templates, 'fromdate' => $fromdate, 'todate' => $todate, 'unitid' => $unitid, 'timeframe' => $timeframe, 'templateid' => $templateid, 'templatedata' => $templatedata, 'firstdata' => $firstdata, 'actualhistorydata' => $actualhistorydata, 'seltype' => $seltype, 'exportto' => $exportto, 'templatecolors' => $templatecolors]);
    }

    public function exportreport(Request $request) {
        
        $unitid = $request->input('selunit');
        $timeframe = $request->input('seltimeframe');
        $templateid = $request->input('seltemplate');
        $fromdate = $request->input('from');
        $fromdate = date("Y-m-d", strtotime($fromdate));
        $todate = $request->input('to');
        $todate = date("Y-m-d", strtotime($todate));
        $templatedata[] = 'DATEANDTIME';
        $seltype = $request->input('seltype');
        $frompage = $request->input('frompage');

        //get table heading from the reporttemplate table
		$templateres = DB::table('reporttemplate')->where('id', $templateid)->get();
		if (count($templateres) > 0) {
			$tmp = $templateres[0]->availableheading;
		    	if ($tmp) {
		        	$tmparr = @explode("#", $tmp);
				if (count($tmparr) > 0) {
					$templatedatares = DB::table('reporttemplatedata')->whereIn('availabledata', $tmparr)->get();
					if (count($templatedatares) > 0) {
						foreach ($templatedatares as $template) {
							$templatedata[] = $template->datacode;
							$templatecolors[$template->datacode] = $template->colorcode;
						}
					}
				}
		    	}
		}

		$tmpdatacodes = $templatedata;

		//for first record - start
		foreach ($templatedata as $templatecode) {
			$i = 0;
			$firstres = DB::table('unitdatahistory_' . $unitid)->where('code', $templatecode)->whereBetween('date', [$fromdate, $todate])->orderBy('todateandtime', 'desc')->skip(0)->take(1)->get();
			if (count($firstres) > 0) {
				if ($i == 0) {
					$firstdata['DATEANDTIME'] = $firstres[0]->todateandtime;
					$firstdata['DATE'] = $firstres[0]->date;
				}
				$firstdata[$templatecode] = $firstres[0]->currentval;
				$i++;
			} else {
				$firstdata[$templatecode] = '';
			}
		}
		//for first record - end

		$actualhistorydata = $unithistory = [];
		$highertime = $lowertime = '';

		$chktime = '23:59:00';
		if($todate == date('Y-m-d'))
			$chktime = date("H:i:s");
		
		
		$lowerres = DB::table('unitdatahistory_'.$unitid)->whereIn('code', $templatedata)->where('todateandtime', 'LIKE', "$fromdate%")->orderBy('todateandtime', 'asc')->skip(0)->take(1)->get();
		if(count($lowerres) > 0) { $lowertime = $lowerres[0]->todateandtime; }

		$higherres = DB::table('unitdatahistory_'.$unitid)->whereIn('code', $templatedata)->where('todateandtime', 'LIKE', "$todate%")->orderBy('todateandtime', 'desc')->skip(1)->take(1)->get();
		if(count($higherres) > 0) { $highertime = $higherres[0]->todateandtime; }
		
		//$unithistory = DB::table('unitdatahistory_' . $unitid)->whereIn('code', $templatedata)->whereBetween('date', [$fromdate, $todate])->where('todateandtime', '<=', $todate.' '.$chktime)->orderBy('todateandtime', 'desc')->get();
		
		$unithistory = DB::table('unitdatahistory_' . $unitid)->whereIn('code', $templatedata)->whereBetween('todateandtime', [$lowertime, $highertime])->orderBy('todateandtime', 'desc')->get();

		$historydata = '';
		$datetimearr = [];
		if(count($unithistory) > 0) {			
			foreach($unithistory as $data) {
				$datetimearr[] = $data->todateandtime;
				$historydata[$data->todateandtime][$data->code] = $data->currentval;
			}
		}
		
		//print_r($historydata);
		//exit;
		//$highertime = '2017-08-04 21:54:53';
		//$lowertime = '2017-08-04 14:00:31';

		if($highertime && $lowertime) {
			$i = 0;
			$stilltime = $highertime;
			while($highertime >= $lowertime) {
				if(in_array($highertime, $datetimearr)) 	
					$stilltime = $highertime;
				
				foreach($templatedata as $templatecode) {
					if($templatecode != "DATEANDTIME") {	
						$actualhistorydata[$i][$templatecode] = $historydata[$stilltime][$templatecode];
					} else {
						$actualhistorydata[$i]['DATEANDTIME'] = $highertime;
					}					
				}
				$highertime = date("Y-m-d H:i:s", strtotime($highertime . '-1 seconds'));
				++$i;
			}
		}
        $pdfcontent = $tmpcodes = '';
        if ($actualhistorydata) {
            $logo = url('/') . "/images/denyoreportlogo.png";
            $unitname = $projectname = '';
            $unitres = DB::table('units')->where('unit_id', $unitid)->get();
            if ($unitres) {
                $unitname = $unitres[0]->unitname;
                $projectname = $unitres[0]->projectname;
            }
            if ($seltype == "1") {
                $pdfcontent .= '<table style="width:100%;" border="0" cellpadding="0" cellspacing="0">';
                $pdfcontent .= '<tr><td><font size="24">Reports</font><br>' . date("d M Y h:i A") . '</td>';
                $pdfcontent .= '<td></td><td></td><td><img src="' . $logo . '" alt="Denyo" ></td></tr>';
                $pdfcontent .= '<tr><td colspan="3">' . $unitname . '</td><td></td></tr>';
                $pdfcontent .= '<tr><td style="white-space: nowrap;">' . $projectname . '</td><td style="white-space: nowrap;">Start Date: ' . $fromdate . '</td><td style="white-space: nowrap;">End Date: ' . $todate . '</td><td style="white-space: nowrap;">Time Frame: ' . $timeframe . '</td></tr>';
                $pdfcontent .= '</table>';
                $pdfcontent .= '<table style="width:100%; border-color:#CCC; padding-top:20px;" border="1" cellpadding="0" cellspacing="0">';
                $pdfcontent .= '<tr>';
                if ($templatedata) {
                    foreach ($templatedata as $templatecode) {
                        $pdfcontent .= '<th style="text-align:left; padding:5px;">' . $templatecode . '</th>';
                    }
                }
                $pdfcontent .= '</tr>';
                foreach ($actualhistorydata as $actualhistory) {
                    if (is_array($actualhistory)) {
                        $pdfcontent .= '<tr>';
                        if ($templatedata) {
                            foreach ($templatedata as $templatecode) {
                                $pdfcontent .= '<td style="padding:5px;">';
                                if ($templatecode == "DATEANDTIME")
                                    $pdfcontent .= date("d M Y H:i:s", strtotime($actualhistory[$templatecode]));
                                else
                                    $pdfcontent .= $actualhistory[$templatecode];
                                $pdfcontent .= '</td>';
                            }
                            $pdfcontent .= '</tr>';
                        }
                    }
                }
                $pdfcontent .= '</table>';
                $pdf = App::make('dompdf.wrapper');
                $pdf->loadHTML($pdfcontent);
                if ($frompage == "app") {
                    $pdf->save(storage_path(public_path() . '/reportdetails.pdf'));
                } else {
                    return $pdf->stream('reportdetails.pdf');
                }
                //$pdf->save(storage_path(public_path().'/reportdetails.pdf'));
            } else if ($seltype == "2") {
                $data = "";
                $colcount = count($templatedata);
                //$title[] = 'Reports';
                $datetime[] = date("d M Y H:i:s");
                $unit[] = $unitname;
                $heading = '';
                //for empty cells
                for ($i = 1; $i < $colcount; $i++) {
                    //$title[] = '';
                    $datetime[] = '';
                    $unit[] = '';
                }
                foreach ($templatedata as $templatecode) {
                    $heading[] = $templatecode;
                }
                $data[] = array('Reports');
                $data[] = $datetime;
                $data[] = $unit;
                $data[] = array($projectname, 'Start Date: ' . date("d M Y", strtotime($fromdate)), 'End Date: ' . date("d M Y", strtotime($todate)), 'Time Frame: ' . $timeframe);
                $data[] = $heading;
                $historycount = count($actualhistorydata) + 5;
                foreach ($actualhistorydata as $actualhistory) {
                    $content = '';
                    if (is_array($actualhistory)) {
                        if ($templatedata) {
                            foreach ($templatedata as $templatecode) {
                                $tmpcodes[] = "'" . $templatecode . "'";
                                if ($templatecode == "DATEANDTIME")
                                    $content[] = date("d M Y H:i:s", strtotime($actualhistory[$templatecode]));
                                else
                                    $content[] = $actualhistory[$templatecode];
                            }
                            $data[] = $content;
                        }
                    }
                }
                //$data[] = array($content);
                $reportname = 'report_' . $projectname . '_' . date("Ymd", strtotime($fromdate)) . '_to_' . date("Ymd", strtotime($todate));
                $excel = App::make('excel');
                Excel::create($reportname, function($excel) use($data) {
                    $excel->sheet('report', function($sheet) use($data) {
                        $sheet->fromArray($data);
                        //$sheet->mergeCells('A1:D4');
                        /* $sheet->setSize('A5', 20, 20);
                          $sheet->mergeCells('A5:F5');
                          $sheet->cells('A5:F5', function($cells) {
                          $cells->setFontSize(16);
                          $cells->setFontWeight('bold');
                          }); */
                        for ($i = 0; $i < 100; $i++)
                            $sheet->setSize('A' . $i, 20, 20);
                        $sheet->cells('A6:P6', function($cells) {
                            $cells->setBackground('#F1F1F1');
                            $cells->setFontSize(11);
                            $cells->setFontWeight('bold');
                        });
                    });
                })->export('xls');
            }
        }
        /* $pdf = App::make('dompdf.wrapper');		
          $pdf->loadHTML($pdfcontent);
          return $pdf->stream('reportdetails.pdf'); */
    }

    public function reportchart() {
        if (!$session->get('loginid')) {
            Session::flash('message', 'Session is Out Please Login Again!');
            return redirect('/');
        }
        $userunitgroups = '';
        $clientid = $session->get('clientid');
        $company = $session->get('companyid');
        $companyres = DB::table('grouptbl')->where('id', $company)->where('deletestatus', '0')->get();
        if ($companyres[0]->type == '1') {
            $totalunits = DB::table('grouptbl')->get();
            if ($totalunits) {
                foreach ($totalunits as $totalunit) {
                    $userunitgroups[] = $totalunit->id;
                }
            }
        } else {
            $userunitgroups[] = $clientid;
        }
        Session::put('unitclientid', $userunitgroups);
        $unitclientid = $session->get('unitclientid');
        $units = DB::table('units')->whereIn('companygroupid', $unitclientid)->where('activestatus', '0')->get();
        $templates = DB::table('reporttemplate')->get();
        return view('Reports.graph', ['units' => $units, 'templates' => $templates, 'actualhistorydata' => '', 'fromdate' => '', 'todate' => '', 'unitid' => '', 'timeframe' => '', 'templateid' => '', 'templatedata' => '']);
    }

}
