<?php

namespace App\Http\Controllers;
use App\Message;
use App\Staff;
use Illuminate\Http\Request;
use DB;
use Mail;
use Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\DataTables\MessageDataTable;
use App\DataTables\SentItemsDataTable;
use Yajra\Datatables\Datatables;
use Symfony\Component\HttpFoundation\Session\Session;

class MessageController extends Controller
{
	/**
	* Display a listing of the resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function index(Request $request, MessageDataTable $dataTable)
	{		
		$ismobile = $request->is_mobile;
		if($ismobile == 1)
		{
			$startindex = $request->startindex; // start limit
			$results = $request->results; // end limit		
			$sort = $request->sort;
			$dir = $request->dir;
			$loginid = $request->loginid;
			$allmessages = DB::table('messagesinbox')->where('reciver_id', $loginid)->get();
			$senderids = $sender_ids = $messagelist = '';
			
			if($sort == 'sendername')
			{
				$sendermessages = DB::select('SELECT * FROM messagesinbox WHERE reciver_id='.$loginid);
				
				//$sendermessages = DB::table('messagesinbox')->groupBy('sender_id')->where('reciver_id', //$loginid)->select()->get();
				
				if(count($sendermessages) > 0)
				{
					foreach($sendermessages as $sendermessage)
					{
						$senderids[] = $sendermessage->sender_id;
					}
					if($senderids)
					{
						$senders = DB::table('staffs')->whereIn('staff_id', $senderids)->orderBy('firstname', 'asc')->get();
						
						if($senders)
						{
							foreach($senders as $sender)
							{
								$sender_ids[] = "'".$sender->staff_id."'";
							}
						}						
					}
				}
				if($sender_ids)
				{
					$sender_ids = @implode(',', $sender_ids);
					$messagelist = DB::table('messagesinbox')->where('reciver_id', $loginid)->orderByRaw("FIELD(sender_id,$sender_ids)".$dir)->skip($startindex)->take($results)->get();
				}
			}
			else
				$messagelist = DB::table('messagesinbox')->where('reciver_id', $loginid)->orderBy($sort, $dir)->skip($startindex)->take($results)->get();
			
			$messages = '';
			if($messagelist)
			{
				$i = 0;
				foreach($messagelist as $message)
				{
					$messageinbox = DB::table('messages')->where('messages_id', $message->messages_id)->get();
					$messages[$i]['message_id'] = $message->messages_id;
					$messages[$i]['sender_id'] = $message->sender_id;
					$messages[$i]['messages_subject'] = $message->messages_subject;
					$messages[$i]['message_body'] = strip_tags($messageinbox[0]->messages_body);
					$messages[$i]['message_date'] = date('d M Y',strtotime($messageinbox[0]->messages_date));
					$messages[$i]['is_favorite'] = $message->messagesinbox_isfavaurite;
					$messages[$i]['message_readstatus'] = $message->messagesinbox_status;
					$messages[$i]['message_priority'] = $message->messagesinbox_priority;
					$messages[$i]['isreply'] = $message->messages_isreply;
					$messages[$i]['time_ago'] = $this->time_elapsed_string($messageinbox[0]->messages_date);
					
					$messages[$i]['receiver_id'] = $messageinbox[0]->reciver_id;
					
					$sender = Staff::where('staff_id', $message->sender_id)->select('firstname', 'photo','personalhashtag')->get();
					if(count($sender) > 0)
					{
						$messages[$i]['sendername'] = $sender[0]->firstname;
						if($sender[0]->photo == '' || $sender[0]->photo == 'undefined') {
							$messages[$i]['senderphoto'] = url('/') . '/images/default.png';	
						}
						else {
							$messages[$i]['senderphoto'] = url('/').'/staffphotos/'.$sender[0]->photo;
						}
						
						$messages[$i]['personalhashtag'] = $sender[0]->personalhashtag;
					}
					else
					{
						$messages[$i]['sendername'] = '';
						$messages[$i]['senderphoto'] = '';
					}
					$attachs = '';
					$attachments = DB::table('messageattachment')->where('message_id', $message->messages_id)->get();
					if($attachments)
					{
						foreach($attachments as $attachment)
						{
							$attachs[] = $attachment->messageresource_filename;
						}
						if($attachs)
							$attachs = @implode('#', $attachs);
					}
					$messages[$i]['attachments'] = $attachs;
					
					++$i;
				}
			}

			return response()->json(['msg' => array('result'=>'success'), 'totalCount'=>$allmessages->count(), 'messages' => $messages]);
		}
		else
		{
			$session = new Session();
			$session->set('ses_from_page', 'inbox');
			return $dataTable->render('Message.index');
		}					
	}

	public function sentitems(Request $request, SentItemsDataTable $dataTable)
	{		
		$ismobile = $request->is_mobile;
		if($ismobile == 1)
		{
			$startindex = $request->startindex; // start limit
			$results = $request->results; // end limit		
			$sort = $request->sort;
			$dir = $request->dir;
			$loginid = $request->loginid;
			$allmessages = DB::table('messages')->where('sender_id', $loginid)->where('messages_status', '0')->orderBy('messages_id', 'desc')->get();
			
			$receiverids = $receiver_ids = $messagelist = $receivernames = $tmpmessages = '';
			if($sort == 'receivername')
			{
				if($allmessages)
				{
					foreach($allmessages as $allmessage)
					{
						$inboxids = DB::table('messagesinbox')->where('messages_id', $allmessage->messages_id)->get();
						if($inboxids)
						{
							foreach($inboxids as $inboxid)
							{
								$receiverids[] = $inboxid->reciver_id;
							}							
						}
					}
				}
				if($receiverids)
				{
					$receiverids = array_unique($receiverids);
					$staffs = DB::table('staffs')->whereIn('staff_id', $receiverids)->orderBy('firstname', 'desc')->get();
					if($staffs)
					{						
						foreach($staffs as $staff)
						{							
							$tmpmessages = DB::table('messagesinbox')->where('sender_id', $loginid)->where('reciver_id', $staff->staff_id)->get();
							if($tmpmessages)
							{
								foreach($tmpmessages as $tmpmessage)
								{
									$receiver_ids[] = "'".$tmpmessage->messages_id."'";
								}
							}
						}
						
					}
				}
				if($receiver_ids)
				{
					$receiver_ids = array_unique($receiver_ids);
					
					$receiver_ids = @implode(',', $receiver_ids);
			
					$messagelist = DB::table('messages')->where('sender_id', $loginid)->where('messages_status', '0')->orderByRaw("FIELD(messages_id, $receiver_ids)". $dir)->skip($startindex)->take($results)->skip($startindex)->take($results)->get();
				}				
			}
			else
				$messagelist = DB::table('messages')->where('sender_id', $loginid)->where('messages_status', '0')->orderBy($sort, $dir)->skip($startindex)->take($results)->get();
			
			$messages = '';
			if(count($messagelist) > 0)
			{
				$i = 0;
				foreach($messagelist as $message)
				{					
					//$messageinbox = DB::table('messagesinbox')->where('messages_id', $message->messages_id)->get();
					$messages[$i]['message_id'] = $message->messages_id;
					$messages[$i]['sender_id'] = $message->sender_id;
					$messages[$i]['messages_subject'] = $message->messages_subject;
					$messages[$i]['message_body'] = strip_tags($message->messages_body);
					$messages[$i]['message_date'] = date('d M Y',strtotime($message->messages_date));
					$messages[$i]['time_ago'] = $this->time_elapsed_string($message->messages_date);
					
					$messages[$i]['message_priority'] = $message->message_priority;
					// if(count($messageinbox) > 0) {
						// $messages[$i]['receiver_id'] = $messageinbox[0]->reciver_id;						
					// }
					$sender = Staff::where('staff_id', $message->sender_id)->select('firstname', 'photo','personalhashtag')->get();
					if(count($sender) > 0)
					{
						$messages[$i]['personalhashtag'] = $sender[0]->personalhashtag;
					}
					else
					{
						$messages[$i]['personalhashtag'] = '';
					}
					$receivernames = $directemails = '';
					$receivers = DB::table('messagesinbox')->where('messages_id', $message->messages_id)->get();
					if($receivers)
					{
						foreach($receivers as $receiver)
						{
							$staff = Staff::where('staff_id',$receiver->reciver_id)->select('firstname')->get();
							if($staff) { $receivernames[] = $staff[0]->firstname; }
						}
					}
					if($message->reciver_id)
					{
						$tmpids = @explode(' ', $message->reciver_id);
						if($tmpids)
						{
							foreach($tmpids as $tmpid)
							{
								if($tmpid[0] != "@") { $receivernames[] = $tmpid; }
							}
						}
					}
					if($receivernames) { 
						$receivernames = @implode(' ', $receivernames);
						if(strlen($receivernames) > 50) { $receivernames = substr($receivernames, 0, 50).'..'; }
						$messages[$i]['receiver_id']   = '@'.$receivernames;
						$messages[$i]['receiver_name'] = $receivernames;
					}
					else {
						$messages[$i]['receiver_id'] = '';
						$messages[$i]['receiver_name'] = '';
					}
					
					$attachs = '';
					$attachments = DB::table('messageattachment')->where('message_id', $message->messages_id)->get();
					if($attachments)
					{
						foreach($attachments as $attachment)
						{
							$attachs[] = $attachment->messageresource_filename;
						}
						if($attachs)
							$attachs = @implode('#', $attachs);
					}
					$messages[$i]['attachments'] = $attachs;
					++$i;
				}
			}
			return response()->json(['msg' => array('result'=>'success'), 'totalCount'=>$allmessages->count(), 'messages' => $messages]);
		}
		else
		{
			$session = new Session();
			$session->set('ses_from_page', 'sentitems');
			return $dataTable->render('Message.sentitems', ['frompage' => 'sentitems']);	
		}				
	}

	/**
	* Show the form for creating a new resource.
	*
	* @return \Illuminate\Http\Response
	*/
	public function create()
	{
		$session = new Session();
		$ses_login_id = $session->get('ses_login_id');
		$company_id = $session->get('ses_company_id');
		$staffids = '';
		if($company_id == 1)
			$staffs = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.deletestatus', '0')->where('users.staffs_id', '!=', $ses_login_id)->where('staffs.non_user', '0')->get();
		else
			$staffs = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.deletestatus', '0')->where('users.staffs_id', '!=', $ses_login_id)->where('staffs.non_user', '0')->whereIn('staffs.company_id', [1, $company_id])->get();
		if($staffs)
		{
			foreach($staffs as $staff)
			{
				$staffids[] = "'".$staff->username."'";
			}
			if(is_array($staffids) && $staffids)
				$staffids = @implode(',', $staffids);
		}

		$microtime = date("YmdHis");
		
		return view('Message.create', ['staffids' => $staffids, 'microtime' => $microtime]);
	}

	

	/**
	* Store a newly created resource in storage.
	*
	* @param  \Illuminate\Http\Request  $request
	* @return \Illuminate\Http\Response
	*/
	public function store(Request $request)
	{		
		date_default_timezone_set('Asia/Singapore');
		$ismobile = $request->is_mobile;
		if($ismobile)
		{
			$loginid = $request->loginid;
		}
		else
		{
			$session = new Session();
			$loginid = $session->get('ses_login_id');
		}
		$toids = $request->to;
		$subject = $request->subject;
		$content = $request->composemessagecontent;
		$copytome = $request->copytome;
		$important = $request->important;
		$microtime = $request->microtime;
		$emailids = '';
		$attachfiles = array();
		if($toids)
		{
			$toids = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($toids));
			$toids = str_replace('</span>', '', $toids);			
			$toids = str_replace('&nbsp;', '', $toids);
			$toids = str_replace('<br>', '', $toids);
			$toids = str_replace('?', '', $toids);
			$toids = str_replace('\xE2\x80\x8D', '', $toids);
			$toids = str_replace('\u200d', '', $toids);	
			$toids = preg_replace('/[^A-Za-z0-9 @_.]/u','', strip_tags($toids));				
			$toids = strip_tags(stripslashes($toids));

			if($copytome == 1)
			{
				$sender = Staff::where('staff_id', $loginid)->select('email')->get();
				if(count($sender) > 0) { $emailids[] = $sender[0]->email; }
				
			}
			
			DB::table('messages')->insert(['sender_id' => $loginid, 'reciver_id' => $toids, 'messages_subject' => $subject, 'messages_body' => $content, 'messages_date' => date("Y-m-d H:i:s"), 'messages_isresource' => '0', 'message_priority' => $important]);
			$messageid = 1;
			$getlastid = DB::table('messages')->orderBy('messages_id', 'desc')->skip(0)->take(1)->get();
			if($getlastid) { $messageid = $getlastid[0]->messages_id; }
			

			$attachments = DB::table('attachments')->where('microtimestamp', $microtime)->get();
			if($attachments)
			{
				foreach($attachments as $attachment)
				{
					$attachfiles[] = url('/').'/attachments/'.$attachment->attachment;
					DB::table('messageattachment')->insert(['message_id' => $messageid, 'messageresource_filename' => $attachment->attachment]);
					DB::table('attachments')->where('attachment_id', $attachment->attachment_id)->delete();
				}
			}

			$sender = Staff::where('staff_id', $loginid)->select('email', 'firstname')->get();
			$replyto = $sender[0]->email;
			$sendername = $sender[0]->firstname;
			
			$toids = @explode(' ', $toids);
			
			for($i = 0; $i < count($toids); $i++)
			{
				$to = $toids[$i];
				if($to[0] == '@')
				{
					$staff = Staff::where('personalhashtag', $to)->where('status','0')->select('staff_id', 'email')->get();
					if(count($staff) > 0)
					{
						$emailids[] = $staff[0]->email;
						$msgto = $staff[0]->staff_id;
						
						DB::table('messagesinbox')->insert(['messages_id' => $messageid, 'sender_id' => $loginid, 'reciver_id' => $msgto, 'messages_subject' => $subject, 'messagesinbox_date' => date("Y-m-d H:i:s"), 'messagesinbox_priority' => $important]);
						
						$notifycontent = 'New Message <br>by: '.$sendername.'<br>'.$subject;
						
						DB::table('pushnotifications')->insert(['notify_subject' => $subject, 'notify_by' => $loginid, 'notify_to' => $msgto, 'notify_type' => 'M', 'table_id' => $messageid, 'notify_content' => $notifycontent]);
					}
				}
				else
				{					
					
					if(filter_var($to, FILTER_VALIDATE_EMAIL)) {
						$emailids[] = $to;
					}
				}
			}
			
			
			if($emailids)
			{				
				$data = array( 'replytoemail' => $replyto, 'subject' => $subject, 'content' => $content);
		
				Mail::send('emails.service', $data, function ($m) use ($data, $emailids, $attachfiles)  {
					$m->from('cip@stridececommerce.com', 'Denyo');
					$m->replyTo($data['replytoemail'], $name = null);
					$m->bcc('balamurugan@webneo.in', '');
					$m->to($emailids, '');
					$m->subject($data['subject']);	
					
					foreach($attachfiles as $attachfile)
					{
						$m->attach($attachfile);
					}
					
				});
			}
		}
		if($ismobile == 1)
		{
			$msg = array(array('Error' => '0','result'=>'Message sent successfully'));			
			return response()->json(['msg' => $msg]);
		}	
		else {
			$session->getFlashBag()->add('msg_sent','Message sent successfully');
			return redirect('/messages');
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
		$session = new Session();
		$ses_login_id = $session->get('ses_login_id');
		$company_id = $session->get('ses_company_id');
		$frompage = $session->get('ses_from_page');		
		DB::table('messagesinbox')->where('messages_id', $id)->update(['messagesinbox_status' => '1']);
		$msginbox = DB::table('messagesinbox')->where('messages_id', $id)->get();		
		DB::table('pushnotifications')->where('table_id', $id)->where('notify_to',$ses_login_id)->update(['notify_to_readstatus' => '1']);
		$messagedetails = DB::table('messages')->where('messages_id', $id)->get();
		 
		$messagedetails = $messagedetails[0];
		$msgbody = $messagedetails->messages_body;
		@preg_match('/(<img[^>]+>)/i', $msgbody, $matches);
		$inlineimage = @$matches[0];
		
		
		$microtime = date('YmdHis');		
		$staffids = '';
		if($company_id == 1)
			$staffs = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.deletestatus', '0')->where('users.staffs_id', '!=', $ses_login_id)->where('staffs.non_user', '0')->get();
		else
			$staffs = DB::table('users')->join('staffs', 'staffs.staff_id', '=', 'users.staffs_id')->where('users.deletestatus', '0')->where('users.staffs_id', '!=', $ses_login_id)->where('staffs.non_user', '0')->whereIn('staffs.company_id', [1, $company_id])->get();
		if(count($staffs) > 0)
		{
			foreach($staffs as $staff)
			{
				$staffids[] = "'".$staff->username."'";
			}
			if(is_array($staffids) && $staffids)
				$staffids = @implode(',', $staffids);
		}
		$sender = Staff::where('staff_id', $messagedetails->sender_id)->select('firstname', 'photo', 'email', 'personalhashtag')->get();
		if($sender) { $sender = $sender[0]; }
		$receivers = '';
		$receiverids = $messagedetails->reciver_id;
		if($receiverids)
		{
			$receiverids = @explode(' ', $receiverids);
			foreach($receiverids as $receiver)
			{
				if($receiver[0] == "@")
				{
					$staff = Staff::where('personalhashtag', $receiver)->select('firstname', 'email')->get();
					$receivers .= $staff[0]->firstname.' <'.$staff[0]->email.'>\n';
				}
			}
		}
		$user = DB::table('staffs')->where('staff_id', $ses_login_id)->get();
		if(count($user) > 0) { $userdata = $user[0]; }
		$attachments = DB::table('messageattachment')->where('message_id', $id)->get();
		return view('Message.show', ['messagedetails' => $messagedetails, 'microtime' => $microtime, 'staffids' => $staffids, 'sender' => $sender, 'receivers' => $receivers, 'attachments' => $attachments, 'inlineimage'=>$inlineimage,'userdata' => $userdata,'msginbox'=>$msginbox,'frompage'=>$frompage]);
	}

	public function replyforward(Request $request) {		
		date_default_timezone_set('Asia/Singapore');
		if($request->is_mobile == 1) {
			$loginid = $request->loginid;			
		}
		else {
			$session = new Session();
			$loginid = $session->get('ses_login_id');
		}
		$toids = $request->to;
		$subject = $request->subject;
		$content = $request->composemessagecontent;
		$copytome = $request->copytome;
		$important = $request->important;
		$microtime = $request->microtime;
		$chkreply = $request->submit;
		$forwardmsgid = $request->forwardmsgid;
		$emailids = '';
		$attachfiles = [];
		$isreply = 0;
		if($toids)
		{
			$toids = str_replace('<span data-atwho-at-query="@" class="atwho-inserted">', '', trim($toids));
			$toids = str_replace('</span>', '', $toids);			
			$toids = str_replace('&nbsp;', '', $toids);
			$toids = str_replace('<br>', '', $toids);
			$toids = str_replace('?', '', $toids);
			$toids = str_replace('\xE2\x80\x8D', '', $toids);
			$toids = str_replace('\u200d', '', $toids);	
			$toids = preg_replace('/[^A-Za-z0-9 @_.]/u','', strip_tags($toids));				
			$toids = strip_tags(stripslashes($toids));

			if($chkreply == "Reply")
			{
				$isreply = 1;
				$subject = "RE: ".$subject;
			}
			
			if($copytome == 1)
			{
				$sender = Staff::where('staff_id', $loginid)->select('email')->get();
				if($sender) { $emailids[] = $sender[0]->email; }
			}
			
			DB::table('messages')->insert(['sender_id' => $loginid, 'reciver_id' => $toids, 'messages_subject' => $subject, 'messages_body' => $content, 'messages_date' => date("Y-m-d H:i:s"), 'messages_isresource' => '0', 'message_priority' => $important]);
			$messageid = 1;
			$getlastid = DB::table('messages')->orderBy('messages_id', 'desc')->skip(0)->take(1)->get();
			if($getlastid) { $messageid = $getlastid[0]->messages_id; }

			$attachments = DB::table('attachments')->where('microtimestamp', $microtime)->get();
			if($attachments)
			{
				foreach($attachments as $attachment)
				{
					$attachfiles[] = url('/').'/attachments/'.$attachment->attachment;
					DB::table('messageattachment')->insert(['message_id' => $messageid, 'messageresource_filename' => $attachment->attachment]);
					DB::table('attachments')->where('attachment_id', $attachment->attachment_id)->delete();
				}
			}
			if($chkreply != "Reply") {
				$tmpattachments = DB::table('messageattachment')->where('message_id', $forwardmsgid)->get();
				
				if($tmpattachments)
				{
					foreach($tmpattachments as $attachment)
					{
						$attachfiles[] = url('/').'/attachments/'.$attachment->messageresource_filename;
						DB::table('messageattachment')->insert(['message_id' => $messageid, 'messageresource_filename' => $attachment->messageresource_filename]);
					}
				}
			}
			
			$sender = Staff::where('staff_id', $loginid)->select('email', 'firstname')->get();
			if(count($sender) > 0) {
				$replyto = $sender[0]->email;
				$sendername = $sender[0]->firstname;

			}
			
			$to[0] = '';
			
			$toids = @explode(' ', $toids);
			for($i = 0; $i < count($toids); $i++)
			{
				$to = $toids[$i];				
				if($to[0] == '@')
				{
					$staff = Staff::where('personalhashtag', $to)->select('staff_id', 'email')->get();
					if($staff)
					{
						$emailids[] = $staff[0]->email;
						$msgto = $staff[0]->staff_id;
						
						DB::table('messagesinbox')->insert(['messages_id' => $messageid, 'sender_id' => $loginid, 'reciver_id' => $msgto, 'messages_subject' => $subject, 'messagesinbox_date' => date("Y-m-d H:i:s"), 'messagesinbox_priority' => $important]);
						
						$notifycontent = 'New Message<br/>by: '.$sendername.'<br/>'.$subject;
						
						DB::table('pushnotifications')->insert(['notify_subject' => $subject, 'notify_by' => $loginid, 'notify_to' => $msgto, 'notify_type' => 'M', 'table_id' => $messageid, 'notify_content' => $notifycontent]);
					}
				}
				else
				{
					$emailids[] = $to;
				}
			}
			
			if($emailids)
			{				
				$data = array( 'replytoemail' => $replyto, 'subject' => $subject, 'content' => $content);
		
				Mail::send('emails.service', $data, function ($m) use ($data, $emailids, $attachfiles)  {
					$m->from('cip@stridececommerce.com', 'Denyo');
					$m->replyTo($data['replytoemail'], $name = null);
					$m->bcc('balamurugan@webneo.in', '');
					$m->to($emailids, '');
					$m->subject($data['subject']);	
					foreach($attachfiles as $attachfile)
					{
						$m->attach($attachfile);
					}
				});
			}
		}
		
		if($request->is_mobile == 1) {
			$msg = array(array('Error' => '0','result'=>'Message sent successfully'));			
			return response()->json(['msg' => $msg]);
		}
		else {
			if($chkreply == "Reply") {
				$session->getFlashBag()->add('reply_sent','Reply Message Sent Successfully');
			}
			else {
				$session->getFlashBag()->add('forward_sent','Forward Message Sent Successfully');
			}
			return redirect('/messages');
		}
	}

	/**
	* Show the form for editing the specified resource.
	*
	* @param  int  $id
	* @return \Illuminate\Http\Response
	*/
	public function edit($id)
	{
	//
	}

	/**
	* Update the specified resource in storage.
	*
	* @param  \Illuminate\Http\Request  $request
	* @param  int  $id
	* @return \Illuminate\Http\Response
	*/
	public function update(Request $request, $id)
	{
	//
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
	
	public function delete($id, $frompage)
	{
		$session = new Session();		
		$loginid = $session->get('ses_login_id');
		
		if($frompage == 'inbox') {
			DB::table('messagesinbox')->where('reciver_id', $loginid)->where('messages_id', $id)->delete();
			return redirect('/messages');
		}
		else {
			DB::table('messages')->where('messages_id', $id)->where('sender_id', $loginid)->update(['messages_status' => '1']);
			return redirect('/sentitems');
		}	
	}

	public function composemailattachments(Request $request)
	{
		$microtime = $request->microtimestamp;
		$isphotos = $request->isphotos;
		if (!empty($_FILES)) 
		{						
			$file = Input::file('file');
			//$destinationPath = public_path().'/attachments/'.$foldername;	
			$destinationPath = public_path().'/attachments/';		
			$timestamp = str_replace([' ', ':'], '-', date("YmdHis"));
			$filename = $timestamp."_123_".$file->getClientOriginalName();
			$upload_success = Input::file('file')->move($destinationPath, $filename);			
			if( $upload_success ) {	
				if($isphotos == 0)	
					DB::table('attachments')->insert(['attachment' => $filename, 'microtimestamp' => $microtime, 'isfiles' => '1']);	
				else
					DB::table('attachments')->insert(['attachment' => $filename, 'microtimestamp' => $microtime, 'isphotos' => '1']);				
				return Response::json('success', 200);
			} else {
			   	return Response::json('error', 400);
			}
		} 
	}
	
	public function clearexistingattachments(Request $request)
	{
		$microtime = $request->microtime;
		$type = $request->type;
		if($type == 'photos')
		{
			DB::table('attachments')->where('microtimestamp', $microtime)->where('isphotos', '1')->delete();
		}
		else
		{
			DB::table('attachments')->where('microtimestamp', $microtime)->where('isfiles', '1')->delete();
		}
		//echo 'Cleared';
	}

	public function getcomposeimages(Request $request)
	{
		$result = '';
		$microtime = $request->microtime;
		$attachments = DB::table('attachments')->where('microtimestamp', $microtime)->where('isphotos', '1')->get();
		if($attachments)
		{
			foreach($attachments as $attachment)
			{
				$result[] = $attachment->attachment;
				DB::table('attachments')->where('attachment_id', $attachment->attachment_id)->delete();
			}
			if($result)
			{
				$result = @implode('#|#', $result);
			}
		}
		echo $result;
	}

	public function getcomposefiles(Request $request)
	{
		$result = '';
		$microtime = $request->microtime;
		$attachments = DB::table('attachments')->where('microtimestamp', $microtime)->where('isfiles', '1')->get();
		if($attachments)
		{
			foreach($attachments as $attachment)
			{
				$result[] = $attachment->attachment_id.'-#-'.$attachment->attachment;
			}
			if($result)
			{
				$result = @implode('#|#', $result);
			}
		}
		echo $result;
	}

	public function removeattachfile(Request $request)
	{
		$result = '';
		$microtime = $request->microtime;
		$fileid = $request->fileid;
		
		DB::table('attachments')->where('attachment_id', $fileid)->delete();
		$attachments = DB::table('attachments')->where('microtimestamp', $microtime)->where('isfiles', '1')->get();
		if($attachments)
		{
			foreach($attachments as $attachment)
			{
				$result[] = $attachment->attachment_id.'-#-'.$attachment->attachment;
			}
			if($result)
			{
				$result = @implode('#|#', $result);
			}
		}
		
		echo $result;
	}

	public function actions(Request $request)
	{
		$session = new Session();
		if($request->is_mobile == 1) {
			$loginid = $request->ses_login_id;			
			$decodedarr = json_decode($request->messageids,true);
			$messageids = array_column($decodedarr,'id');
//			 echo '<pre>';
 // print_r($request->messageids);
  //print_r($messageids);
//  die;
		}
		else {
			$loginid = $session->get('ses_login_id');
			$messageids = $request->messageids;			 
		}
		$frompage = $request->frompage;
		
		$action = $request->actions;
		if($messageids)
		{
			if($action == 'Delete')
			{
				if($frompage == 'inbox')
				DB::table('messagesinbox')->where('reciver_id', $loginid)->whereIn('messages_id', $messageids)->delete();
				else
				{
					DB::table('messages')->where('sender_id', $loginid)->whereIn('messages_id', $messageids)->update(['messages_status'=>'1']);
				}
			}
			else {
				DB::table('messagesinbox')->whereIn('messages_id', $messageids)->update(['messagesinbox_status' => '0']);
				if($request->is_mobile == 1) {
					$msg = array(array('Error' => '0','result'=>'Message status changed to Unread successfully'));
					return response()->json(['msg'=>$msg]);
				}
			}				
			
			if($frompage == 'inbox') {
				
return redirect('/messages');
			}				
			else
				return redirect('/sentitems');			
		}
	}

	public function setfavorite(Request $request)
	{
		$favstatus = '';
		$ismobile = $request->is_mobile;
		$messageid = $request->messageid;
		if($ismobile == 1)
		{
			$loginid = $request->loginid;
		}
		else
		{
			$session = new Session();
			$loginid = $session->get('ses_login_id');
		}
		$chkexist = DB::table('messagesinbox')->where('reciver_id', $loginid)->where('messages_id', $messageid)->where('messagesinbox_isfavaurite', '1')->get();
		if(count($chkexist) > 0)
		{
			$favstatus = 'unfav';
			DB::table('messagesinbox')->where('reciver_id', $loginid)->where('messages_id', $messageid)->update(['messagesinbox_isfavaurite' => '0']);
		}
		else
		{
			$favstatus = 'fav';
			DB::table('messagesinbox')->where('reciver_id', $loginid)->where('messages_id', $messageid)->update(['messagesinbox_isfavaurite' => '1']);
		}

		if($ismobile == 1)
		{
			$messagelist = DB::table('messagesinbox')->where('reciver_id', $loginid)->orderBy('messages_id', 'desc')->get();
			$messages = '';
			if($messagelist)
			{
				$i = 0;
				foreach($messagelist as $message)
				{
					$messageinbox = DB::table('messages')->where('messages_id', $message->messages_id)->get();
					$messages[$i]['message_id'] = $message->messages_id;
					$messages[$i]['sender_id'] = $message->sender_id;
					$messages[$i]['messages_subject'] = $message->messages_subject;
					$messages[$i]['message_body'] = strip_tags($messageinbox[0]->messages_body);
					$messages[$i]['message_date'] = $messageinbox[0]->messages_date;
					$messages[$i]['is_favorite'] = $message->messagesinbox_isfavaurite;
					$messages[$i]['message_readstatus'] = $message->messagesinbox_status;
					$messages[$i]['message_priority'] = $message->messagesinbox_priority;
					$messages[$i]['isreply'] = $message->messages_isreply;
					$sender = Staff::where('staff_id', $message->sender_id)->select('firstname', 'photo')->get();
					if($sender)
					{
						$messages[$i]['sendername'] = $sender[0]->firstname;
						$messages[$i]['senderphoto'] = url('/').'/staffphotos/'.$sender[0]->photo;
					}
					else
					{
						$messages[$i]['sendername'] = '';
						$messages[$i]['senderphoto'] = '';
					}
					$attachs = '';
					$attachments = DB::table('messageattachment')->where('message_id', $message->messages_id)->get();
					if($attachments)
					{
						foreach($attachments as $attachment)
						{
							$attachs[] = $attachment->messageresource_filename;
						}
						if($attachs)
							$attachs = @implode('#', $attachs);
					}
					$messages[$i]['attachments'] = $attachs;
					++$i;
				}
			}

			return response()->json(['msg' => array('result' => 'Messsage successfully added in favorites'), 'totalCount' =>$messagelist->count(), 'messages' => $messages]);			
		}
		else
			echo $favstatus;
	}
	
	//Api
	function changereadunread(Request $request) {
		if($request->frompage == 'inbox') {
			$checkexists = DB::table('messagesinbox')->where('messages_id', $request->message_id)->where('reciver_id',$request->ses_login_id)->count();
			if($checkexists > 0) {			
				DB::table('messagesinbox')->where('messages_id', $request->message_id)->where('reciver_id',$request->ses_login_id)->update(['messagesinbox_status' => '1']);	
				return response()->json(['msg'=>array(array('Error' => '0','result'=>'Message changed to Read'))]);
			}
			else {
				
				return response()->json(['msg'=>array(array('Error' => '1'))]);
			}

		}
		else {

			$checkexists = DB::table('messagesinbox')->where('messages_id', $request->message_id)->where('sender_id',$request->ses_login_id)->count();
			if($checkexists > 0) {
			
				DB::table('messagesinbox')->where('messages_id', $request->message_id)->where('sender_id',$request->ses_login_id)->update(['messagesinbox_status' => '1']);	
				return response()->json(['msg'=>array(array('Error' => '0','result'=>'Message changed to Read in sent items'))]);
			}
			else {
				return response()->json(['msg'=>array(array('Error' => '1'))]);
			}


		}
	}
	
	/**
	*
	* @return Time ago (general function)
	*/
	function time_elapsed_string($datetime, $full = false) {
		$now = new \DateTime;
		$ago = new \DateTime($datetime);
		$diff = $now->diff($ago);

		$diff->w = floor($diff->d / 7);
		$diff->d -= $diff->w * 7;

		$string = array(
			'y' => 'year',
			'm' => 'month',
			'w' => 'week',
			'd' => 'day',
			'h' => 'hour',
			'i' => 'minute',
			's' => 'second',
		);
		foreach ($string as $k => &$v) {
			if ($diff->$k) {
				$v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
			} else {
				unset($string[$k]);
			}
		}

		if (!$full) $string = array_slice($string, 0, 1);
		return $string ? implode(', ', $string) . ' ago' : 'just now';
	}
	
	public function getmessagedetails(Request $request) {
		$messagelist = DB::table('messagesinbox')->where('messages_id', $request->messageid)->get();
		$messages = '';		
			if($messagelist)
			{
				$i = 0;
				foreach($messagelist as $message)
				{
					$messageinbox = DB::table('messages')->where('messages_id', $message->messages_id)->get();
					$messages[$i]['message_id'] = $message->messages_id;
					$messages[$i]['sender_id'] = $message->sender_id;
					$messages[$i]['messages_subject'] = $message->messages_subject;
					$messages[$i]['message_body'] = strip_tags($messageinbox[0]->messages_body);
					$messages[$i]['message_date'] = date('d M Y H:i A',strtotime($messageinbox[0]->messages_date));
					$messages[$i]['is_favorite'] = $message->messagesinbox_isfavaurite;
					$messages[$i]['message_readstatus'] = $message->messagesinbox_status;
					$messages[$i]['message_priority'] = $message->messagesinbox_priority;
					$messages[$i]['isreply'] = $message->messages_isreply;
					$messages[$i]['time_ago'] = $this->time_elapsed_string($messageinbox[0]->messages_date);
					
					$messages[$i]['receiver_id'] = $messageinbox[0]->reciver_id;
					
					$sender = Staff::where('staff_id', $message->sender_id)->select('firstname', 'photo','personalhashtag')->get();
					if(count($sender) > 0)
					{
						$messages[$i]['sendername'] = $sender[0]->firstname;
						if($sender[0]->photo == '' || $sender[0]->photo == 'undefined') {
							$messages[$i]['senderphoto'] = url('/') . '/images/default.png';	
						}
						else {
							$messages[$i]['senderphoto'] = url('/').'/staffphotos/'.$sender[0]->photo;
						}
						
						$messages[$i]['personalhashtag'] = $sender[0]->personalhashtag;
					}
					else
					{
						$messages[$i]['sendername'] = '';
						$messages[$i]['senderphoto'] = '';
					}
					$attachs = '';
					$attachments = DB::table('messageattachment')->where('message_id', $message->messages_id)->get();
					if($attachments)
					{
						foreach($attachments as $attachment)
						{
							$attachs[] = $attachment->messageresource_filename;
						}
						if($attachs)
							$attachs = @implode('#', $attachs);
					}
					$messages[$i]['attachments'] = $attachs;
					++$i;
				}
			}

			return response()->json(['msg' => array('result'=>'success'), 'messages' => $messages]);

	}
	
}
