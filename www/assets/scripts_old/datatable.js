function datatable(id,pid,columnsz)
{
   this.tableId=id;
   this.tablepId=pid;
   this.columns=columnsz;
   this.condition="";
   this.sortstr="";
   this.numColumns=0;
   this.cqstring='';
   this.columfilder=new Array();
   this.columfilderm=new Array();
   this.columfildWidth=new Array();
   this.nodata='No data available.';
   this.cpage=0;
   this.sorticon='';
   this.tabledata=null;
   this.preadd=Array();
   this.affixes=Array();
   this.dataupdate=function(data){var tbdy=z(this.tableId+'body');z(this.tableId).removeChild(tbdy); this.setData(data);}
   this.build=function(){tblobjlist[numtabls]=this;tblobjlistkey[numtabls]=this.tableId;numtabls+=1;this.ctable();this.setColumn(this.columns);document.getElementById(pid).appendChild(this.tabledata);}
   this.ctable=function()
               {document.getElementById(pid)
				 var tbl=document.createElement('table');
				     tbl.id= this.tableId;
					 this.tabledata=tbl;
			   }
	this.setColumn=function(columns)
               {
				 var thead=document.createElement('thead');thead.id=this.tableId+'head';
				 var tbl=this.tabledata;//alert(columns.length);
				 var tr=document.createElement('tr');
					 for(var i=0;i<columns.length;i++){var th = document.createElement('th');
					 if(typeof(this.columfildWidth[i])!= "undefined")
					  {
						  th.style.width=this.columfildWidth[i];
					  }
					 if(typeof(this.columfilder[columns[i]])!= "undefined")
					  {
						th.innerHTML = columns[i]+this.sorticon;  
					  }else th.innerHTML = columns[i];
					 this.aevent('click',th,this.lisColumn);
					 tr.appendChild(th);}
					 thead.appendChild(tr);
					 var tr=document.createElement('tr');tr.className="searchbar";
					  for(var i=0;i<columns.length;i++){var td = document.createElement('td');
					  if(typeof(this.columfilder[columns[i]])!= "undefined")
					  {
						   td.innerHTML = '<input type="text" name="'+this.columfilder[columns[i]]+'" id="'+this.tableId+'-'+columns[i]+'" />';
						  this.aevent('keypress',td,dogosearch);
					  }else  td.innerHTML = '';
					 
					 
					 tr.appendChild(td);}
					 thead.appendChild(tr);
					 tbl.appendChild(thead);
					 this.tabledata=tbl;
					 this.numColumns=columns.length;
			   }
			   
	this.lisColumn=function(e){var edcm=getecobj(e);edcm=edcm.tagName.search(/img/i)>=0?getParent(edcm,2):edcm;var po1=getParent(edcm,4);var po=po1.tagName.search(/table/i)>=0?po1:getParent(edcm,5);var edc=getarkey(tblobjlistkey,po.id);
	var obj=tblobjlist[edc];var inds=edcm.innerHTML.replace(/<.*?>/gi,'');
	if(typeof(obj.columfilder[inds])== "undefined")return;
	var cids=obj.columfilder[inds];
	var ordm=typeof(obj.columfilderm[inds])== "undefined"?'desc':obj.columfilderm[inds]=='desc'?'asc':'desc';
	obj.columfilderm[inds]=ordm;
	obj.sortstr='&order='+cids+' '+obj.columfilderm[inds];
	rst(obj.cqstring+'&order='+cids+' '+obj.columfilderm[inds],obj,'sort');
	//alert(obj.columfilderm[inds]);
	 }		   
    this.buildpage=function(pid)
               {
				 var btr=document.createElement('div'); btr.className="paging";
				  btr.innerHTML='<div class="page"><span class="prev  previouspage">Back</span><input type="text" value="1" id="cpage cur-page" class="gopage" /><span class="nextpage">Next</span></div>';
				  
				  document.getElementById(pid==''?this.tablepId:pid).appendChild(btr);
				  var pr=document.getElementsByClassName('previouspage');pr[0].id="ppage-"+this.tableId;
				  var nxt=document.getElementsByClassName('nextpage');nxt[0].id="gpage-"+this.tableId;
				  var gpg=document.getElementsByClassName('gopage');gpg[0].id="npage-"+this.tableId;
				this.aevent('click',pr[0],dopreviouspage);this.aevent('click',nxt[0],donextpage);
				this.aevent('keypress',gpg[0],dogopage);
				 //    for(var i=0;i<columns.length;i++){var th = document.createElement('th');th.innerHTML = columns[i];thead.appendChild(th);}
					// tbl.appendChild(thead);
					// this.tabledata=tbl;
			   }			   	
   this.setData=function(data)
               {
				 var tbody=document.createElement('tbody');tbody.id=this.tableId+'body';
				 var tbl=this.tabledata;//alert(data.length);
				 if(data.length>=1)
				 {
				   for(var i=0;i<data.length;i++)
				   { 
				     var rd=data[i];
					 
					 var tr=document.createElement('tr');
					 if(this.preadd.length>=1)tr=this.adel(this.preadd,'td',tr,true,rd);
				     tr=this.adeldata(rd,'td',tr,false);
					 if(this.affixes.length>=1)tr=this.adel(this.affixes,'td',tr,true,rd);
					
					 tbody.appendChild(tr);
				   }
				   this.numColumns=tr.cells.length;
				 }
				 else
				 
				 {
					var tr=document.createElement('tr');var td=tr.insertCell(0);td.className="nodata";td.align="center";
					td.colSpan=this.numColumns;
					td.innerHTML=this.nodata; tbody.appendChild(tr);
				 }
					 tbl.appendChild(tbody);
					 this.tabledata=tbl;
					 
			   }
	 this.setData1=function(data,n)
               {
				 var tbody=document.createElement('tbody');tbody.id=this.tableId+'body';
				 var tbl=this.tabledata;//alert(data.length);
				 if(data.length>=1)
				 { 
				   for(var i=0;i<data.length;i++)
				   {
				     var rd=data[i];
					 
					 var tr=document.createElement('tr');
					 if(this.preadd.length>=1)tr=this.adel(this.preadd,'td',tr,true,rd);
				     tr=this.adel1(rd,'td',tr,false,rd,n);
					 if(this.affixes.length>=1)tr=this.adel(this.affixes,'td',tr,true,rd);
					
					 tbody.appendChild(tr);
				   }
				   this.numColumns=tr.cells.length;
				 }
				 else
				 
				 {
					var tr=document.createElement('tr');var td=tr.insertCell(0);td.className="nodata";td.align="center";
					td.colSpan=this.numColumns;
					td.innerHTML=this.nodata; tbody.appendChild(tr);
				 }
					 tbl.appendChild(tbody);
					 this.tabledata=tbl;
					 
			   }		   
	this.donextpage=function (){this.dataupdate('');}
	this.dopreviouspage=function (){alert('class next');}
	this.dogopage=function(e){var key = e.which || e.keyCode;
	if (key === 13) { // 13 is enter
     alert('enter')
    }
	else if (key == 46 || key > 31 && (key < 48 || key > 57)){
        e.preventDefault();
        return false;
    }
    return true;}		   
	this.aevent=function(ev,id,myFunction)
	{
		
		var x = id.constructor==String?document.getElementById(id):id; 
		if (x.addEventListener) {                    // For all major browsers, except IE 8 and earlier
			x.addEventListener(ev, myFunction);
		} else if (x.attachEvent) {                  // For IE 8 and earlier versions
			x.attachEvent(ev, myFunction);
		} 
	}
	 this.adeldata=function(rd,ty,pel,c,ar){
	   var cmls=this.columns.length-(this.preadd.length+this.affixes.length);
	 //  alert('===='+cmls);
	   var lm=c?0:1;
	   for(var j=lm;j<=cmls;j++){var td = document.createElement(ty);
   td.innerHTML = c?this.setiValue(ar,rd[j]):rd[j];pel.appendChild(td);}
	   return pel;}		   
   this.adel=function(rd,ty,pel,c,ar){
	   var cmls=this.columns.length-(this.preadd.length+this.affixes.length)
	 //  alert('===='+cmls);
	   var lm=c?0:1;
	   for(var j=lm;j<rd.length;j++){var td = document.createElement(ty);
   td.innerHTML = c?this.setiValue(ar,rd[j]):rd[j];pel.appendChild(td);}
	   return pel;}	
   this.adel1=function(rd,ty,pel,c,ar,nm){
	   var lm=c?0:1;
	   for(var j=lm;j<nm;j++){var td = document.createElement(ty);
   td.innerHTML = c?this.setiValue(ar,rd[j]):rd[j];pel.appendChild(td);}
	   return pel;}			   			   		   				  
	    this.setiValue=function(rd,str){  for(var j=0;j<rd.length;j++){str=this.matRep(str,'{'+(j+1)+'}',rd[j]);} return str;}  
	this.matRep=function(str,ed,v){var sn=0;for(var i=0;i<3;i++){str=str.replace(ed,v);}return str;}
   this.setClass=function(nm){ var tbl=this.tabledata;tbl.className=nm; this.tabledata=tbl;}		   
   this.paging=function(id){}
   this.sort=function(id){}
   this.search=function(id){}
   
}
function donextpage(e){
	
	var edcm=getecobj(e).id.split('-');	var edc=getarkey(tblobjlistkey,edcm[1]);	
	var obj=tblobjlist[edc];;
	var p=parseInt(obj.cpage)+1;//alert(p);
	rst(obj.cqstring,obj,p);//obj.cpage=p;
	
	var gpg=document.getElementsByClassName('gopage');gpg[0].value=p;//alert(p);	
		}
		 
		 function dopreviouspage(e)
		 {
			
			var edcm=getecobj(e).id.split('-');	var edc=getarkey(tblobjlistkey,edcm[1]);		
	        var obj=tblobjlist[edc];
			var p=obj.cpage-1;if(p<0)return;
			rst(obj.cqstring,obj,p);var gpg=document.getElementsByClassName('gopage');gpg[0].value=p;//alert(obj.cqstring); 
		 }
function dogopage(e){
	e = e || window.event;var target = e.target || e.srcElement;//alert(target);
	var key = e.which || e.keyCode;
    if (key === 13) { 
    var el=getecobj(e);var edcm=el.id.split('-');	var edc=getarkey(tblobjlistkey,edcm[1]);		
	var obj=tblobjlist[edc];var p=el.value;if(p<0)return;rst(obj.cqstring,obj,p);
    }
	else if (key == 46 || key > 31 && (key < 48 || key > 57)){
        e.preventDefault();
        return false;
    }
    return true;
	}
function dogosearch(e){
	e = e || window.event;//alert(target);
	var key = e.which || e.keyCode;
    if (key === 13) {
	var el = e.target || e.srcElement; 
    var edcm=el.id.split('-');var edc=getarkey(tblobjlistkey,edcm[0]);		
	var obj=tblobjlist[edc];var p=el.value;
	//alert(p+'--'+obj);
	if(p!=''){var bq='&condition='+el.name+" like '"+p+"%'";obj.condition=bq;rst(obj.cqstring+bq,obj,'search');}
	else {obj.condition='';rst(obj.cqstring,obj,'search');}
    }
	
    return true;
	}	
function getParent(id,n)
  					{
					 var ShObj=id.constructor==String? z(id):id;
					 var TemObj;
					 var DynamicObj=ShObj;
					           for(var i=0;i<n-1;i++)
							   {
					           TemObj=DynamicObj.parentElement?DynamicObj.parentElement:DynamicObj.parentNode;
							   DynamicObj=TemObj;							   
							   }
					     return(DynamicObj);		   
					}	
function rst(url,obj,p){
	
	if(p=='sort'){url+=obj.condition;obj.cpage=0;url+="&"+"oifnm=oi&oiids="+getCheckedelids();
	var gpg=document.getElementsByClassName('gopage');gpg[0].value=1;
	}else if(p=='search'){url+=obj.sortstr;url+="&"+"oifnm=oi&oiids="+getCheckedelids();}
	else{var psrt=typeof obj.sortstr == "undefined"?'':obj.sortstr;
	var pscn=typeof obj.condition == "undefined"?'':obj.condition;
	url+='&page='+p+pscn+psrt;obj.cpage=p;var idx=getCheckedelids();if(idx!=""){url+="&"+"oifnm=oi&oiids="+idx;}}
	//alert(url+"===="+obj+"==="+p);
	SasiyaAjax.Connect_call_back(url,'get','',obj,function(tx,obj){var da=JSON.parse(tx);obj.dataupdate(da.data);});}	
function z(id){return document.getElementById(id);}
function getecobj(e){e = e || window.event;var target = e.target || e.srcElement;return target;}	
function getarkey(ar,str){for(var i=0;i<ar.length;i++){if(ar[i]==str){return i;}}}