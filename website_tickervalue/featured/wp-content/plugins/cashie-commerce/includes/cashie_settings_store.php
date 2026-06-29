<?php 
  global $cashie_plugin_url;
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
      <?php }  // end if ($this->update)?>
      <?php if (!empty($_GET['update'])) { ?>
      	<div id="notify-update"><span>Your product detail page(s) have been created.</span></div>
      <?php } ?>
            
		<iframe src="<?php echo $this->cashie_url; ?>/account/storesettings?<?php echo $this->cashie_url_vars; ?>&origin=<?php echo urlencode($origin); ?>&returnURL=<?php echo urlencode($returnURL); ?>" width="930" height="1150" frameborder="0" style="max-height:100%"></iframe>
    	<form id="profile_form" name="profile_form" method="post" action="">
						<input type="hidden" name="hash"  value="" /> 
            <input type="hidden" name="old_details_dynamic" value="<?php echo $this->option_values['details_dynamic']; ?>" />  
            <input type="hidden" name="details_dynamic" value="" />
            <input type="hidden" name="update_details_dynamic"  value="true" /> 
            <input type="hidden" name="update"  value="true" />            
				</form> 
		</div> <!-- End of wrap -->

