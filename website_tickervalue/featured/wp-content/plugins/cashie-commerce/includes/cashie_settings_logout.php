<?php 
$origin = ((empty($_SERVER['HTTPS'])?"http://":"https://").$_SERVER['HTTP_HOST']); 
$returnURL = ($origin . $_SERVER['REQUEST_URI']);
$returnURL = str_replace("cashie_settings.php_logout", "cashie_settings.php", $returnURL);
?>

<div class="wrap">  
   <iframe src="<?php echo $this->cashie_url; ?>/logout?<?php echo $this->cashie_url_vars; ?>&origin=<?php echo urlencode($origin); ?>&returnURL=<?php echo urlencode($returnURL); ?>&plugin_version=<?php echo cashie_get_version(); ?>" width="930" height="1200" frameborder="0" style="max-height:100%"></iframe>
</div> <!-- End of wrap -->