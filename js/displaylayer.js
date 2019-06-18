var pageWidth = function() {return window.innerWidth != null? window.innerWidth : document.documentElement && document.documentElement.clientWidth ?       document.documentElement.clientWidth : document.body != null ? document.body.clientWidth : null;} 
var pageHeight = function() {return  window.innerHeight != null? window.innerHeight : document.documentElement && document.documentElement.clientHeight ?  document.documentElement.clientHeight : document.body != null? document.body.clientHeight : null;} 

function getB(){
  var bae
  try //Firefox, Opera 8.0+, Safari 
    { bae = new XMLHttpRequest(); }
  catch(e){ //Internet Explorer
    try { bae = new ActiveXObject("Msxml2.XMLHTTP"); }
    catch(e){ try { bae = new ActiveXObject("Microsoft.XMLHTTP"); }
      catch(e){ 
	alert("Errp")
        return false; }
    }
  } return bae;
}
 
function randbg(){
  var bae = getB();
  bae.onreadystatechange = function(){ 
   if(bae.readyState == 4) 
   respy(bae.responseText);   
  };
  bae.open("POST", "http://mycolectronic.com/artist_api/randBG.php", true); 
  bae.send((pageHeight()-35)+'-'+pageWidth());
}
 
function respy(r){ document.getElementById('randBG').innerHTML = r; }
 
