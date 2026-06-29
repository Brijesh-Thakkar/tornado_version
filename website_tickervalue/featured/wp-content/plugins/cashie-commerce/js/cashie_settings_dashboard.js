jQuery(document).ready(function() {

	function getHash (e) {
		
		eval('var obj = ' + e.data); // get JSON object
		
		// Only process our messages
		if (e.origin.indexOf("cashiecommerce.com")<0)
			return false;

		document.profile_form.hash.value = obj.hash; 
		
		if (obj.details_dynamic==true)
		{
		 document.profile_form.details_dynamic.value = 1;
		}
		else
		{
		 document.profile_form.details_dynamic.value = 0;
		}

		//get host
		var host = window.location.host;
		var adminIndex = window.location.pathname.indexOf('/wp-admin');
		if(adminIndex > 0) host += window.location.pathname.substring(0, adminIndex);
		
		if ( (document.profile_form.oldhash.value==null || document.profile_form.oldhash.value=='') && (document.profile_form.hash.value != document.profile_form.oldhash.value) )
		{
			document.profile_form.submit();
		}
		else if (document.profile_form.hash.value != document.profile_form.oldhash.value || obj.user_domain != host)
		{
			document.getElementById('domain-1').innerHTML = obj.user_domain;
			document.getElementById('domain-2').innerHTML = obj.user_domain;
			document.getElementById("hash_overlay").style.display="block";
			document.getElementById("overlay-bg").style.display="block";
			//document.getElementById("signupframe").src = logoutURL; 
			//alert('You have already associated this WordPress site with a different Cashie account. De-activate and re-activate this plugin to use a different Cashie Commerce account.');
		} 		

	}
	
  if(typeof window.addEventListener != 'undefined') { 
		window.addEventListener('message', getHash, false); 
	} 
	else if(typeof window.attachEvent != 'undefined') { 
		window.attachEvent('onmessage', getHash); 
	}
})
