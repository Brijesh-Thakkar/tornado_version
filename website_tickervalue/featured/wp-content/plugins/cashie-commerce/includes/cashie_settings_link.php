<?php
$uri = $_SERVER['REQUEST_URI'];
$uri = substr($uri, 0, strrpos($uri, "/")) . "/cashie_settings.php";
?>
<script type='text/javascript'>
	document.location.href = "<?php echo $uri; ?>";
</script>
