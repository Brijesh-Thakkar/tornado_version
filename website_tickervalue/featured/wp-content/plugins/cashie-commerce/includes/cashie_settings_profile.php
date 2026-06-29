<?php 
  $origin = ((empty($_SERVER['HTTPS'])?"http://":"https://").$_SERVER['HTTP_HOST']); 
	$returnURL = ($origin . $_SERVER['REQUEST_URI']);
?>
<div class="wrap">
    <?php if ($this->update) { ?>
            <form id="updateurl_form" name="updateurl_form" method="post" action="<?php echo $this->cashie_url; ?>/api/users/save_urls">
						<input type="hidden" name="cart"  value="<?php echo get_permalink($this->option_values['url_cart']); ?>" /> 
            <input type="hidden" name="checkout" value="<?php echo get_permalink($this->option_values['url_checkout']); ?>" />  
            <input type="hidden" name="success" value="<?php echo get_permalink($this->option_values['url_success']); ?>" />
            <input type="hidden" name="failure"  value="<?php echo get_permalink($this->option_values['url_failure']); ?>" />
            <input type="hidden" name="catalog"  value="<?php echo get_permalink($this->option_values['url_catalog']); ?>" /> 
            <input type="hidden" name="details"  value="<?php echo get_permalink($this->option_values['url_details_dynamic']); ?>" />  
            <input type="hidden" name="static_details"  value='<?php echo json_encode($this->option_values['static_details']); ?>' />  
            <input type="hidden" name="returnURL"  value="<?php echo $returnURL."&update=1"; ?>" />          
				</form>   
        <script type="text/javascript">
				  document.updateurl_form.submit();
				</script>
				<?php } // end if ($this->update) ?>
        <?php if (!empty($_GET['update'])) { ?>
      	<div id="notify-update"><span>Your store pages have been recreated.</span></div>
      <?php } ?>
    
    
   <iframe src="<?php echo $this->cashie_url; ?>/account/profile?<?php echo $this->cashie_url_vars; ?>&origin=<?php echo urlencode($origin); ?>&returnURL=<?php echo urlencode($returnURL); ?>&plugin_version=<?php echo cashie_get_version(); ?>" width="930" height="1200" frameborder="0" style="max-height:100%"></iframe>
   
<br />
<link href="https://fonts.googleapis.com/css?family=Varela" rel="stylesheet" type="text/css" />
<div style="border: solid 1px #DBDBBB;margin-top: 20px;padding: 20px;position: relative; width: 760px;">
<h2 style="font-size: 14px; color: #333; margin: 0; padding: 0; line-height: 14px;">Recreate your store pages</h2>
	<p class="contentarea" style="position: relative;font-family: 'Varela', Arial, sans-serif;border: 1px solid #BCE8F1;padding: 10px;font-size: 13px !important;-webkit-box-shadow: 2px 2px 5px #EEE;box-shadow: 2px 2px 5px #EEE;margin: 10px 0 0 0;color: #3A87AD !important;background-color: #D9EDF7;overflow: hidden;line-height:16px;width:740px;">Cashie has created the following pages in your site: <a href="<?php echo get_permalink($this->option_values['url_catalog']); ?>" target="_blank">Product Catalog</a>, <?php if (!empty($this->option_values['url_details_dynamic'])) { ?><a href="<?php echo get_permalink($this->option_values['url_details_dynamic']); ?>" target="_blank">Product Details</a>, <?php } else { ?>Product Detail Pages, <?php } ?><a href="<?php echo get_permalink($this->option_values['url_cart']); ?>" target="_blank">Shopping Cart</a>, <a href="<?php echo get_permalink($this->option_values['url_checkout']); ?>" target="_blank">Checkout</a>, <a href="<?php echo get_permalink($this->option_values['url_success']); ?>" target="_blank">Order Success</a>, <a href="<?php echo get_permalink($this->option_values['url_failure']); ?>" target="_blank">Order Failure</a>. To ensure that our online store functions properly, you should not delete these pages or modify their URLs. If you need Cashie Commerce to recreate these pages, click the "Recreate Pages" button below.</p>
   <br />
   <form id="pages_form" name="pages_form" method="post" action="">
						<input type="hidden" name="create_pages"  value="true" />
            <input type="hidden" name="force_create"  value="true" />
						<input type="hidden" name="update"  value="true" />           
					<div class="buttons"><a class="button-action" onclick="javascript:confirmPages();" alt="Recreate your store pages if something is not working or you deleted one of the pages." title="Recreate your store pages if something is not working or you deleted one of the pages.">Recreate Pages</a></div>           
				</form>
</div>

</div> <!-- End of wrap -->