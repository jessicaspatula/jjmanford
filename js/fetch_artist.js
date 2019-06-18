var myco = "https://mycolectronic.com/";
var fetch_artist = function(info_type, page_loc){

	const request = new XMLHttpRequest();

	url ='https://mycolectronic.com/artist_api/'+info_type+'/index.php';  
	request.open('GET',url );
	request.send(); 
	request.onload = () => {
		if (request.status === 200) {
		   format_artist(info_type,page_loc,JSON.parse(request.response));
		} 
	};
 
	request.onerror = () => {
	   console.log("error")
	};
}

var format_artist = function(info_type,div_id,artist_json){
	switch(info_type){
		case 'painting':
			place_paintings(artist_json,div_id);
		break;
		case 'exhibition':
			place_exhibitions(artist_json);
			place_forthcoming_exhibitions(artist_json,"forthcoming_exhibits");
		break;
		case 'profile':
			place_profile(artist_json,div_id);
		break;
		case 'press':
			place_press(artist_json,div_id);
		break;
		case 'curatorial':
			place_curatorial(artist_json,div_id);
		break;
		default:
	}
}

var place_profile = function(profile, div_id){
	pro = "";
	pro += "<img src=\""+profile.avatar +"\" id=\"jjpic\" />";
	pro += "<div id=\"contacttext\"><p>";  
	pro += " <a href=\"mailto:"+profile.email+"\">";
	pro += " <i class=\"fa fa-envelope-o\"></i> " + profile.email; 
	pro += "</a>";  
	pro +=	" <br>" + 
		" <i class=\"fa fa-phone\"></i>  "+ profile.phone;
	pro +=	"<br>" + 
		" <a href=\""+profile.instagram+"\">"+
			"<i class=\"fa fa-instagram\"></i> Follow JJ</a><br>" + 
		" <a href=\"#box2\" class=\"link press_item\">"+
			"<i class=\"fa fa-paint-brush\"></i> View JJ's Portfolio </a> " + 
	     "</p>" + 
	    " <p id=\"aboutjj\">"+profile.bio+" </p> ";
	pro += "</div>";
	soloDiv = document.getElementById(div_id); 
	soloDiv.innerHTML = pro;   

};

var place_paintings = function(paintings, div_id){
	var album = albumize(paintings,'year');
	//var currentDiv = document.getElementById(div_id); 
	var currentDiv = document.getElementsByClassName("gallereee")[0]; 
	var thumb_menu = "";
	var one_menu = "";
	var htmlAlbums = [];	
	Object.keys(album).forEach(function (feature_group) {
		one_menu = "";
		var newDiv = document.createElement("_"+feature_group); 
		currentDiv.appendChild(newDiv);  
		one_menu += "<div class=\"centered_thumbs\" id=\"_"+feature_group+"\"><center>";
		one_menu += run_thumb(album[feature_group], feature_group, newDiv);
		one_menu += "</center></div>";
		htmlAlbums.push(one_menu)
	});
	htmlAlbums.reverse();
	htmlAlbums.forEach(function(one_menu){
		thumb_menu += one_menu;
	});

	currentDiv.innerHTML = thumb_menu;   
	start_gall();
}

var albumize = function(paintings, feature){
	var album  = {}  ;
	Object.keys(paintings).forEach(function (p) {
		if (!( album.hasOwnProperty(paintings[p][feature]))){
			album[paintings[p][feature]] =[] ;
		}
		album[paintings[p][feature]].push(paintings[p]);
	});
	return album;
}

var run_thumb = function(yr_paintings, yr_int, feature_div){
	var one_thumb = "";
	var caption, href, thumbSrc;
	var thumbLink, thumbImg;
	yr_paintings.forEach( 
		function( one_painting){
			href =     myco+"/Images/JJ/"+ one_painting.filename ;
			thumbSrc = myco+"/Images/JJ/thumbs/tag_"+one_painting.filename
			caption = setCaption(one_painting);

	   		one_thumb += "<a ";
			one_thumb += " class=\"imglink\" ";
			one_thumb += " href=\""+ href +"\" ";
   			one_thumb += " data-caption=\"" + caption + "\"";
   			one_thumb += " >";
			 one_thumb +="<img src=\""+ thumbSrc +"\" " +
			 " class=\"portfolio_thumb\" " +
		  	 " title=\"\" " +
	  	  	 " alt=\"\">"+
	  	  	 " </a>";
			thumbLink = document.createElement("a"); 
			thumbLink.setAttribute("href",href);
			thumbLink.setAttribute("data-caption", caption);
			feature_div.appendChild(thumbLink);  
			var thumbImg = document.createElement("img"); 
			thumbImg.setAttribute("class","portfolio_thumb");
			thumbImg.setAttribute("src", thumbSrc);
			thumbImg.setAttribute("title","");
			thumbImg.setAttribute("alt","");
			thumbLink.appendChild(thumbImg);  
	});
	return one_thumb;
};

var setCaption = function(p){
	var caption = "";
	caption += (p.title !="")  ? p.title + " - ":"";
	caption += (p.series !="") ? "Series: " +p.series + " ":" ";
	caption += (p.width > 0)   ? p.width  + " x " + p.height +" -  ":"";
	caption += (p.medium != "")? p.medium + " -  ":"";
	caption +=     p.year;
	return caption;
} 

var place_exhibitions = function(exhibits){
	var solo_listings = [];	var soloHtml = ""; var soloDiv;
	var group_listings = []; var groupHtml = ""; var groupDiv;

	Object.keys(exhibits).forEach(function (groupType) {
		if(groupType == "Solo" | groupType == "Two-Person"){
			solo_listings = solo_listings.concat(exhibits[groupType]);	
		}else{
			group_listings = exhibits[groupType];	
		}
	});

	solo_listings.sort(sortEndDates);
	group_listings.sort(sortEndDates);

	solo_listings.forEach(function(e){
		soloHtml += formatExhibitDisplay(e);
	});
	group_listings.forEach(function(e){
		groupHtml += formatExhibitDisplay(e);
	});

	soloDiv = document.getElementById("solo_exhibit"); 
	groupDiv = document.getElementById("group_exhibit"); 

	soloDiv.innerHTML = soloHtml;   
	groupDiv.innerHTML = groupHtml;   
	
};

var place_forthcoming_exhibitions = function(es, div_id){
	forthHtml = ''; forthList = [];
	var today = new Date();
	var the_date = formatTodayDate(today);
	Object.keys(es).forEach(function (groupType) {
		es[groupType].forEach(function(e){
			if(e.end_date  >= the_date.toString()){
				forthList.push(e);
			}
		});
	});


	if(forthList.length > 0){	
		forthHtml = '<span class=\"subtitle\" >CURRENT & FORTHCOMING EXHIBITIONS</span>';
		forthHtml += '<p>'
		forthList.forEach(function(e){
			forthHtml += formatExhibitDisplay(e);
		});
		forthHtml += '</p>'
	
		forthDiv = document.getElementById(div_id); 
		forthDiv.innerHTML = forthHtml;   
	}

};

var place_curatorial = function(cur,div_id){
	var solo_listings = [];	var curHtml = ""; var soloDiv;

	cur.sort(sortEndDates);

	cur.forEach(function(e){
		curHtml += formatExhibitDisplay(e);
	});

	soloDiv = document.getElementById(div_id); 
	soloDiv.innerHTML = curHtml;   
};

var place_press = function(press, div_id){
	pressHtml = "";
	press.forEach(function(p){
		pressHtml += formatPressDisplay(p);
	});
	pressDiv = document.getElementById(div_id); 
	pressDiv.innerHTML = pressHtml;   
};
	
var formatPressDisplay = function(p){
	var l = "<li class=\"press_item\">";
	l += "<a class=\"press_link\"";
	l += " href=\""+ p.url + "\" target=\"_blank\" >"; 
	l += p.title; 
	l += "</a> ";
	if(p.publish_date != "0000-00-00" & p.publish_date != null){ 
		l += "("+formatDate(p.publish_date)+")" ; 
	}
	l += "</li> ";
	return l;
};

var formatExhibitDisplay = function(exhibit){
	var l = "<li class=\"exhibit_item\">";
	l += "<span class=\"exhibit_title\">";
	l += exhibit.title; 
	l += "</span> ";
	
	if(exhibit.description != "" & exhibit.description != null){ 
		l += exhibit.description + ", ";
	}


	if(exhibit.gallery != "" & exhibit.gallery != null){ 
		l += exhibit.gallery + ", ";
	}
	l+= exhibit_link_html(exhibit);

	if(exhibit.location != "" & exhibit.location != null){ 
		l += exhibit.location + " ";
	}
	if(exhibit.end_date != "0000-00-00" & exhibit.end_date != null){ 
		l += "("+formatDate(exhibit.end_date)+")" ; 
	}
	l += "</li>";
	return l;
};

var exhibit_link_html = function(e){
	h = "";

	if(e.hasOwnProperty("exhibition_link") & ((e.exhibition_link != "" & e.exhibition_link != null))  ){
	// type: exhibit
		h += " <a target=\"_blank\" class=\"cvlink\" href=\""+e.exhibition_link + "\">";
		if(e.link_text != "" & e.link_text != null){
			h += "<br>"+ e.link_text ;	
		}else{
			h +=    "<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i> "+
				"<span class=\"sr-only\"> (link) </span> ";	
		}
		h += "</a> ";
	}else if(e.hasOwnProperty("curatorial_link") & ((e.curatorial_link != "" & e.curatorial_link != null))  ){
	// type: curatorial
		h += " <a target=\"_blank\" class=\"curlink\"  href=\""+e.curatorial_link + "\">";
		if(e.link_text != "" & e.link_text != null){
			h += "<br>"+e.link_text;	
		}else{
		h += "<i class=\"fa fa-external-link\" aria-hidden=\"true\"></i> <span class=\"sr-only\"> (link) </span> ";	
		}
		h += "</a> ";
	}

	return h;	
};

var formatDate = function(d){
	formatted = "";
	if(d.substring(5,7) != "00"){
		switch(d.substring(5,7)){ case '01': formatted += "Jan "; break; case '02': formatted += "Feb "; break; case '03': formatted += "Mar "; break; case '04': formatted += "Apr "; break; case '05': formatted += "May "; break; case '06': formatted += "June "; break; case '07': formatted += "July "; break; case '08': formatted += "Aug "; break; case '09': formatted += "Sept "; break; case '10': formatted += "Oct "; break; case '11': formatted += "Nov "; break; case '12': formatted += "Dec "; break; default: }
	}
	//if(d.substring(8) != "00"){
	//formatted += d.substring(8) + ", ";
	//}
	formatted += d.substring(0,4);
	return formatted;
};

function formatTodayDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}


function sortEndDates( a, b ) {
  if ( a.end_date > b.end_date ){
    return -1;
  }
  if ( a.end_date < b.end_date ){
    return 1;
  }
  return 0;
}

var get_paintings = function(div_id) {   fetch_artist('painting',div_id);};
var get_exhibits = function(div_id) {    fetch_artist('exhibition',div_id);};
var get_press = function(div_id) {        fetch_artist('press', div_id);};
var get_curatorial = function(div_id) {  fetch_artist('curatorial',div_id);};
var get_profile = function(div_id) {     fetch_artist('profile',div_id);};


