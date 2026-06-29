jQuery(document).ready(function() {

	function getData (e) {
		
		eval('var obj = ' + e.data); // get JSON object
		
		// Only process our messages
		if (e.origin.indexOf("cashiecommerce.com")<0)
			return false;

		if (document.products_form.details_dynamic.value!=1) // we're using static product detail pages so create/delete pages accordingly
		{
			document.products_form.mode.value = obj.mode;
			document.products_form.product_id.value = obj.product_id;
			if (obj.mode=="add")
			{
				document.products_form.name.value = obj.name;
				document.products_form.description.value = obj.description;
				document.products_form.code.value = obj.code;
			}
			document.products_form.submit();
		}
		else // dynamic detail page so just reload the page
		{
			window.location.href = window.location.href;
		}
	}
	
  if(typeof window.addEventListener != 'undefined') { 
		window.addEventListener('message', getData, false); 
	} 
	else if(typeof window.attachEvent != 'undefined') { 
		window.attachEvent('onmessage', getData); 
	}
})
