<?php 
	global $cashie_logged_in;
  $origin = ((empty($_SERVER['HTTPS'])?"http://":"https://").$_SERVER['HTTP_HOST']); 
	$returnURL = ($origin . $_SERVER['REQUEST_URI']);
?>
<script type="text/javascript">
var logoutURL = "<?php echo $this->cashie_url; ?>/logout?<?php echo $this->cashie_url_vars; ?>&origin=<?php echo urlencode($origin); ?>&returnURL=<?php echo urlencode($returnURL); ?>&plugin_version=<?php echo cashie_get_version(); ?>";

function hash_exit () {

  document.getElementById("signupframe").src = logoutURL; 
  document.getElementById("hash_overlay").style.display="none";
  document.getElementById("overlay-bg").style.display="none";

}

function hash_continue () {
  document.getElementById("hash_overlay").style.display="none";
  document.getElementById("overlay-bg").style.display="none";
  document.profile_form.submit();
}

function confirmLogin()
{
	if (confirm("WARNING: Have you already added Cashie Commerce to another website outside of WordPress? Any existing shopping cart created with your Cashie Commerce account will stop working after you sign in here. To avoid this, you should create a new Cashie Commerce account for this WordPress site. Would you like to continue and login?"))
	{
		document.getElementById("loginarea").style.display = "none";
		document.getElementById("signupframe").src = "<?php echo $this->cashie_url; ?>/login?<?php echo $this->cashie_url_vars; ?>&origin=<?php echo urlencode($origin); ?>&returnURL=<?php echo urlencode($returnURL); ?>&plugin_version=<?php echo cashie_get_version(); ?>";
	}
}
</script>
<style type="text/css">
.wrap {
  position: relative;
}
.existing {
	font-size:18px !important;
	font-weight:bold !important;
	color:#5BA81F !important;
	margin:5px 0px !important;
}
.overlay {
  display: none;
  position: fixed;
  top: 165px;
  left: 570px; 
  z-index: 5;
  width: 600px;
  margin-left: -300px; 
  background-color: #fff; 
  padding: 15px;
  color: #666;
  border-radius: 2px;
  border: 5px solid #5ba81f;
}
.overlay .buttons_div {
  text-align: center;
  margin: 10px -10px -10px -10px;
  padding: 10px;
  border-radius: 0 0 3px 3px;
}
.overlay h4 {
  margin: 0 0 10px 0;
  padding: 0;
  font-size: 18px;
  color: #5BA71F;
  font-weight: bold;
}
.overlay .desc {
  font-size: 12px !important;
  line-height: 1.3em;
}
.button-action {
  color: #fff !important;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  padding: 15px 20px;
  display: inline-block;
  border-radius: 2px;
  text-decoration: none;
  border: 0;
  cursor: pointer;  
  background: #ec762f; /* Old browsers */
  background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2VjNzYyZiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI2ViNzIyOCIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjUxJSIgc3RvcC1jb2xvcj0iI2ViNmQyMSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlYTY2MTciIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);
  background: -moz-linear-gradient(top,  #ec762f 0%, #eb7228 50%, #eb6d21 51%, #ea6617 100%); /* FF3.6+ */
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ec762f), color-stop(50%,#eb7228), color-stop(51%,#eb6d21), color-stop(100%,#ea6617)); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(top,  #ec762f 0%,#eb7228 50%,#eb6d21 51%,#ea6617 100%); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(top,  #ec762f 0%,#eb7228 50%,#eb6d21 51%,#ea6617 100%); /* Opera 11.10+ */
  background: -ms-linear-gradient(top,  #ec762f 0%,#eb7228 50%,#eb6d21 51%,#ea6617 100%); /* IE10+ */
  background: linear-gradient(to bottom,  #ec762f 0%,#eb7228 50%,#eb6d21 51%,#ea6617 100%); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ec762f', endColorstr='#ea6617',GradientType=0 ); /* IE6-8 */
}
.button-action:hover {  
  background: #ff9900; /* Old browsers */
  background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmOTkwMCIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI2ZmOTkwMCIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjUxJSIgc3RvcC1jb2xvcj0iI2ZmOTIwMCIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZjhkMDAiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);
  background: -moz-linear-gradient(top,  #ff9900 0%, #ff9900 50%, #ff9200 51%, #ff8d00 100%); /* FF3.6+ */
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ff9900), color-stop(50%,#ff9900), color-stop(51%,#ff9200), color-stop(100%,#ff8d00)); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(top,  #ff9900 0%,#ff9900 50%,#ff9200 51%,#ff8d00 100%); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(top,  #ff9900 0%,#ff9900 50%,#ff9200 51%,#ff8d00 100%); /* Opera 11.10+ */
  background: -ms-linear-gradient(top,  #ff9900 0%,#ff9900 50%,#ff9200 51%,#ff8d00 100%); /* IE10+ */
  background: linear-gradient(to bottom,  #ff9900 0%,#ff9900 50%,#ff9200 51%,#ff8d00 100%); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ff9900', endColorstr='#ff8d00',GradientType=0 ); /* IE6-8 */
}
.button-gray {
  color: #fff !important;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  padding: 15px 20px;
  display: inline-block;
  border-radius: 2px;
  text-decoration: none;
  border: 0;
  cursor: pointer;
  
  background: #999999; /* Old browsers */
  /* IE9 SVG, needs conditional override of 'filter' to 'none' */
  background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzk5OTk5OSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzk5OTk5OSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjUxJSIgc3RvcC1jb2xvcj0iIzkyOTI5MiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4ZDhkOGQiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);
  background: -moz-linear-gradient(top,  #999999 0%, #999999 50%, #929292 51%, #8d8d8d 100%); /* FF3.6+ */
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#999999), color-stop(50%,#999999), color-stop(51%,#929292), color-stop(100%,#8d8d8d)); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(top,  #999999 0%,#999999 50%,#929292 51%,#8d8d8d 100%); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(top,  #999999 0%,#999999 50%,#929292 51%,#8d8d8d 100%); /* Opera 11.10+ */
  background: -ms-linear-gradient(top,  #999999 0%,#999999 50%,#929292 51%,#8d8d8d 100%); /* IE10+ */
  background: linear-gradient(to bottom,  #999999 0%,#999999 50%,#929292 51%,#8d8d8d 100%); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#999999', endColorstr='#8d8d8d',GradientType=0 ); /* IE6-8 */
}
#hash-continue {
  margin-right: 5px;
}
#overlay-bg {
  background-color: rgba(255, 255, 255, .7);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: none;
}
</style>
<div class="wrap">
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
    <?php if ($this->update) { ?>         
        <script type="text/javascript">
				  document.updateurl_form.submit();
				</script>
    <?php } // end if ($this->update)?>
    <?php if (!empty($_GET['update'])) { ?>
    	<div id="notify-update"><span>Your WordPress site has been linked to your Cashie Commerce account and your shopping cart pages have been generated.</span></div>
    <?php } ?>
    <?php
    $cashie_page_found = false;
    $args = array(
        'sort_order' => 'ASC',
        'sort_column' => 'ID',
        'hierarchical' => 0,
        'exclude' => '',
        'include' => '',
        'meta_key' => '',
        'meta_value' => '',
        'authors' => '',
        'child_of' => 0,
        'parent' => -1,
        'exclude_tree' => '',
        'number' => '',
        'offset' => 0,
        'post_type' => 'page',
        'post_status' => 'publish,inherit,pending,private,future,draft'
    ); 
    $pages = get_pages($args);
    foreach($pages as $key => $page) {
      if((strpos($page->post_content, 'cashie.s3') !== false || strpos($page->post_content, 'cashie-') !== false)) $cashie_page_found = true;
    }
    if((empty($this->option_values['hash']) || $this->option_values['hash'] == 'undefined') && !$cashie_page_found) { ?>
    <iframe src="<?php echo $this->cashie_url; ?>/sign_up?<?php echo $this->cashie_url_vars; ?>&origin=<?php echo urlencode($origin); ?>&returnURL=<?php echo urlencode($returnURL); ?>&plugin_version=<?php echo cashie_get_version(); ?>" width="930" height="2000" frameborder="0" name="signupframe" id="signupframe" style="max-height:100%"></iframe>
    <?php } else { ?>
   <iframe src="<?php echo $this->cashie_url; ?>/login?<?php echo $this->cashie_url_vars; ?>&origin=<?php echo urlencode($origin); ?>&returnURL=<?php echo urlencode($returnURL); ?>&plugin_version=<?php echo cashie_get_version(); ?>" width="930" height="1000" frameborder="0" name="signupframe" id="signupframe" style="max-height:100%"></iframe>
   <?php } ?>
   <form id="profile_form" name="profile_form" method="post" action="">
						<input type="hidden" name="hash"  value="" /> 
            <input type="hidden" name="oldhash" value="<?php echo $this->option_values['hash']; ?>" />  
            <input type="hidden" name="details_dynamic" value="" />
            <input type="hidden" name="update_hash"  value="true" /> 
            <input type="hidden" name="update"  value="true" />            
				</form>        
</div> <!-- End of wrap -->
<!-- Unmatch Hash overlay -->
<div id="overlay-bg"></div>
<div class="overlay" id="hash_overlay">
  <h4>Cashie Commerce Account Alert</h4>
  <p class="desc">
    Your Cashie Commerce account is currently installed on <strong id="domain-1">domain</strong>. If you would like to move your account to this website, choose <strong>Overwrite Settings</strong> and Cashie Commerce will move your store for you. If you are not moving your store, please log out and sign into the account associated with <strong id="domain-2">domain</strong>.
  </p>
  <div class="buttons_div">
    <input type="submit" name="hash-continue" id="hash-continue" class="button-gray" onClick="hash_continue()" value="Overwrite Settings">
    <input type="submit" name="hash-exit" id="hash-exit" class="button-action" onclick="hash_exit()" value="Sign Out">
  </div>
</div>