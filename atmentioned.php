<?php
header('Access-Control-Allow-Origin: *');
//error_reporting(-1);
//ini_set('display_errors', 'On');
// Define database connection parameters
$hn      = 'localhost';
$un      = 'denyoappv2';
$pwd     = 'RfS4aE4Wxq2daL0D';
$db      = 'denyoappv2';
$cs      = 'utf8';

// Set up the PDO parameters
$dsn  = "mysql:host=" . $hn . ";port=3306;dbname=" . $db . ";charset=" . $cs;
$opt  = array(
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
        PDO::ATTR_EMULATE_PREPARES   => false,
       );
// Create a PDO instance (connect to the database)
$pdo  = new PDO($dsn, $un, $pwd, $opt);
$data = array();
extract($_GET);
$tem=$_GET['tem'];
$act=$_GET['act'];
$companyId=$_GET['companyId'];
$userId=$_GET['userId'];
try {
   // echo "select username from users where username like '$tem%'";


	//$queryStr = "SELECT * FROM staffs WHERE status = 0 AND company_id IN (1, $comapnyId)";

if($act=='message'){
  if($companyId != '1'){
	$queryStr = "SELECT * FROM staffs WHERE status = 0 AND company_id IN (1, $companyId) AND non_user = 0 AND staff_id != ".$userId;
  }else{
    	$queryStr = "SELECT * FROM staffs WHERE status = 0 AND non_user = 0";
  }  
}elseif($act=='unit'){
  if($companyId != '1'){
	$queryStr = "SELECT * FROM staffs WHERE status = 0 AND non_user = 0 AND company_id =". $companyId;
  }else{
    	$queryStr = "SELECT * FROM staffs WHERE status = 0 AND non_user = 0";
  }  
}else{
   if($companyId != '1'){
	$queryStr = "SELECT * FROM staffs WHERE status = 0 AND non_user = 0 AND company_id =". $companyId. " AND staff_id != ".$userId;
   }else{
	$queryStr = "SELECT * FROM staffs WHERE status = 0 AND non_user = 0";
     }
}
 

//echo $queryStr;
//exit;
 //$queryStr="select username from users where username like '$tem%'";
      $stmt    = $pdo->query($queryStr);
	  	echo "<ul class='uls'>";
     // if(count($stmt->fetch(PDO::FETCH_OBJ))==0){echo "<li>No data match</li>";};
     //$rowcount  = $stmt->fetch(PDO::FETCH_OBJ);
    // echo $rowcount;
   // $result = mysqli_query($queryStr);  
   // $number_of_rows = mysqli_num_rows($result);  
    //if($number_of_rows==0){echo "<li>No data match</li>";};
    $sno=0;
      while($row  = $stmt->fetch(PDO::FETCH_OBJ))
      {
        $sno++;
        if($row->personalhashtag!=''){
		echo "<li onclick='setct(this)'>".$row->personalhashtag."</li>";
        }
      }
       if($sno==0){echo "<li>No data match</li>";};
	  echo "</ul>";
	break;

	        // Return data as JSON
      //echo json_encode($data);
}
catch(PDOException $e)
{
	echo $e->getMessage();
}
// API access key from Google API's Console
exit;



?>
