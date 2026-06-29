<?php 
  $origin = ((empty($_SERVER['HTTPS'])?"http://":"https://").$_SERVER['HTTP_HOST']); 
	$returnURL = ($origin . $_SERVER['REQUEST_URI']);
?>
<div class="wrap">
    <?php if ($this->update && $this->option_values['mode']=="add") { ?>
        <form id="updateurl_form" name="updateurl_form" method="post" action="<?php echo $this->cashie_url; ?>/api/users/save_details_url">
            <input type="hidden" name="product_id"  value="<?php echo $this->option_values['current_product_id']; ?>" /> 
            <input type="hidden" name="url"  value="<?php echo get_permalink($this->option_values['detail_pages'][$this->option_values['current_product_id']]['postid']); ?>" />  
            <input type="hidden" name="returnURL"  value="<?php echo $returnURL."&update=1"; ?>" />          
				</form>   
        <script type="text/javascript">
				  document.updateurl_form.submit();
				</script>
		<?php } ?>
    <?php if (!empty($_GET['update']) && $this->option_values['mode']=="add") { ?>
      	<div id="notify-update"><span>Your corresponding product detail page has also been created.</span></div>
      <?php } ?>
    <?php if ($this->update && $this->option_values['mode']=="delete") { ?>
    	<div id="notify-update"><span>Your corresponding product detail page has also been deleted.</span></div>
    <?php } ?>
    
   <iframe id="cashie_frame" src="<?php echo $this->cashie_url; ?>/account/catalog?<?php echo $this->cashie_url_vars; ?>&origin=<?php echo urlencode($origin); ?>&returnURL=<?php echo urlencode($returnURL); ?>" width="930" height="1100" frameborder="0" style="max-height:100%"></iframe>
   <form id="products_form" name="products_form" method="post" action="">
						<input type="hidden" name="product_id"  value="" /> 
            <input type="hidden" name="name" value="" />
            <input type="hidden" name="description" value="" />  
            <input type="hidden" name="code" value="" />
            <input type="hidden" name="details_dynamic" value="<?php echo $this->option_values['details_dynamic']; ?>" />
            <input type="hidden" name="mode"  value="" /> 
            <input type="hidden" name="update"  value="true" />            
				</form>
</div> <!-- End of wrap -->