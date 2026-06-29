<?php
/*
Plugin Name: Cashie Commerce
Description: The easiest way to sell successfully on your WordPress site. Our shopping cart works with any theme, is easy to setup and you can manage your store directly from your WordPress admin.
Version: 2.5.3
Author: Cashie Commerce, Inc.
*/

// Global variables
global $cashie_url, $cashie_url_vars, $cashie_s3, $cashie_plugin_url, $cashie_partner, $cashie_partner_options_handle, $cashie_options_handle;

$cashie_url = "https://cashiecommerce.com";
// IE8 throws security errors if WP is non-ssl and you try to connect to SSL server
if (empty($_SERVER['HTTPS']) && isset($_SERVER['HTTP_USER_AGENT']))
{
	preg_match('/MSIE ([0-9]\.[0-9])/',$_SERVER['HTTP_USER_AGENT'],$matches);
	if(isset($matches[1]) && floatval($matches[1])<9) {
		$cashie_url = "http://cashiecommerce.com";
	}
}

$cashie_url_vars = "headless=true&utm_campaign=plugin_admin&utm_medium=WordPress_Plugin&utm_source=";
$cashie_s3 = "cashie";
$cashie_plugin_url = plugin_dir_url(__FILE__);
$cashie_partner_options_handle = "cashie_partner";
$cashie_options_handle = "cashie_admin_options";

include_once(dirname (__FILE__) . '/includes/cashie_partner.php'); // make sure this is first include to set global partner variable
include_once(dirname (__FILE__) . '/includes/cashie_install.php');
include_once(dirname (__FILE__) . '/includes/cashie_uninstall.php');
include_once(dirname (__FILE__) . '/includes/cashie_options.php');
include_once(dirname (__FILE__) . '/includes/cashie_settings.php');

if (!class_exists('cashie'))
{
	class cashie {
		var $post_vars;
		var $option_values;
		var $wp_user_obj;
		var $psb_mp_types;
		var $psb_query;
		var $psb_ipn;
		var $paypal_email;
		var $currency;		
		
		function __construct() {		
			add_action( 'admin_init', array( $this, 'action_admin_init' ) );
			// Hook into the 'wp_dashboard_setup' action to register our other functions
			add_action('wp_dashboard_setup', array($this, 'add_dashboard_widgets'));
			// Hook into the 'wp_dashboard_setup' action to register our function
			add_action('wp_dashboard_setup', array($this, 'remove_dashboard_widgets'));
			// Hook into the 'wp_dashboard_setup' action to validate cashie pages
			add_action('wp_dashboard_setup', array($this, 'cashie_pages_validation'));
		}
		
		function action_admin_init() {
			// only hook up these filters if we're in the admin panel, and the current user has permission
			// to edit posts and pages
			if ( current_user_can( 'edit_posts' ) && current_user_can( 'edit_pages' ) ) {
				add_filter('tiny_mce_before_init', array($this, 'filter_mce_init') );
				add_filter( 'mce_buttons', array( $this, 'filter_mce_button' ) );
				add_filter( 'mce_external_plugins', array( $this, 'filter_mce_plugin' ) );
			}
		}
	
		function filter_mce_init($initArray) {
			global $cashie_url, $cashie_url_vars, $cashie_s3, $cashie_partner_options_handle;
			
			$initArray['cashie_url'] = $cashie_url;
			$initArray['cashie_url_vars'] = $cashie_url_vars . get_option($cashie_partner_options_handle);
			$initArray['cashie_s3'] = $cashie_s3;
			$initArray['extended_valid_elements'] .= ",script[*]";
			return $initArray;
		}
		
		function filter_mce_button( $buttons ) {
			// add a separation before our button
			array_push( $buttons, '|', 'cashie_atc' );
			return $buttons;
		}
		
		function filter_mce_plugin( $plugins ) {
			// this plugin file will work the magic of our button
			$plugins['cashie_atc'] = plugin_dir_url( __FILE__ ) . 'cashie_mce_plugin.js';
			$plugins['cashie_image_translation'] = plugin_dir_url( __FILE__ ) . 'cashie_mce_plugin.js';
			return $plugins;
		}

		// Create our Dashboard widget
		function dashboard_widget_function() {
			global $cashie_url, $cashie_partner;
			echo '<iframe src="'.$cashie_url.'/getblog/post/1240?utm_source='.$cashie_partner.'&utm_medium=WordPress_Plugin&utm_campaign=wpdashboard" width="530px" height="500px" framespacing=0 frameborder=no border=0 scrolling=no></iframe>';    
		} 

		// Create the function used in the action hook
		function add_dashboard_widgets() {
		    wp_add_dashboard_widget('cashie_dashboard_widget', 'Creating a successful store with Cashie Commerce', array($this, 'dashboard_widget_function'));    
		}

		//Cashie plugin validation //
		//Create our Dashboard widget
		function cashie_pages_validation_function() {	
			if(!empty($this->cashie_pages_notpublished)) {
				echo 'The following Cashie Commerce pages are not published: <strong>' . implode(', ', $this->cashie_pages_notpublished) . '</strong><br>';
			}
			if(!empty($this->cashie_pages_missing)) {
				echo 'The following Cashie Commerce pages are missing: <strong>' . implode(', ', $this->cashie_pages_missing) . '</strong><br>';
			}

			echo '
			<style type="text/css">
			.cc_form { display: inline-block; margin-bottom: 0; }
			#hide_tab { margin-left: 7px; }
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
				filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#ec762f\', endColorstr=\'#ea6617\',GradientType=0 ); /* IE6-8 */
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
				filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#ff9900\', endColorstr=\'#ff8d00\',GradientType=0 ); /* IE6-8 */
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
				/* IE9 SVG, needs conditional override of \'filter\' to \'none\' */
				background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzk5OTk5OSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzk5OTk5OSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjUxJSIgc3RvcC1jb2xvcj0iIzkyOTI5MiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4ZDhkOGQiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);
				background: -moz-linear-gradient(top,  #999999 0%, #999999 50%, #929292 51%, #8d8d8d 100%); /* FF3.6+ */
				background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#999999), color-stop(50%,#999999), color-stop(51%,#929292), color-stop(100%,#8d8d8d)); /* Chrome,Safari4+ */
				background: -webkit-linear-gradient(top,  #999999 0%,#999999 50%,#929292 51%,#8d8d8d 100%); /* Chrome10+,Safari5.1+ */
				background: -o-linear-gradient(top,  #999999 0%,#999999 50%,#929292 51%,#8d8d8d 100%); /* Opera 11.10+ */
				background: -ms-linear-gradient(top,  #999999 0%,#999999 50%,#929292 51%,#8d8d8d 100%); /* IE10+ */
				background: linear-gradient(to bottom,  #999999 0%,#999999 50%,#929292 51%,#8d8d8d 100%); /* W3C */
				filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#999999\', endColorstr=\'#8d8d8d\',GradientType=0 ); /* IE6-8 */
			}
			.button-normal-size {
				font-size: 12px;
				font-weight: bold;
				text-align: center;
				padding: 4px 10px;
				display: inline-block;
				border-radius: 2px;
				text-decoration: none;
				border: 0;
				cursor: pointer;
			}
			</style>
			<br>
			<form id="pages_form" name="pages_form" class="cc_form" method="post" action="">
    			<input type="hidden" name="create_pages"  value="true" />
    			<input type="hidden" name="update"  value="true" />
    			<input type="submit" value="Fix all pages" class="button-action button-normal-size" name="fix_issues">
    		</form>
    		<form id="hide_tab" name="hide_tab" class="cc_form" method="post" action="">
    			<input type="hidden" name="hide_tab" value="true" />
    			<input type="submit" value="Hide this error" class="button-gray button-normal-size" name="hide_tab">
    		</form>';
		} 

		//Create the function used in the action hook
		function cashie_pages_validation() {
			global $cashie_options_handle;
			$this->cashie_pages_notpublished = $this->cashie_pages_missing = array();

			//Show error tab
			//$cashie_settings['hide_error'] = false;
			//update_option( $cashie_options_handle, $cashie_settings);

			if(strlen($cashie_options_handle) > 2) {
				//Set list of cashie pages
				$cashie_ids = '';		
				$cashie_settings = get_option($cashie_options_handle);
				if(empty($cashie_settings['hash'])) return false;

				//Update flag to show dashboard error tab
				if(!isset($cashie_settings['hide_error'])) {
					$cashie_settings['hide_error'] = false;
					update_option( $cashie_options_handle, $cashie_settings);
				}

				if(empty($cashie_settings['hide_error'])) {
					foreach( $cashie_settings as $key => $url_id ) {			
						if(stristr($key, 'url_') > -1) {
							$cashie_ids .= $url_id.',';
			  			}
			  			if(stristr($key, 'detail_pages') > -1 && !empty($url_id)) {
							$cashie_ids .= $url_id.',';
			  			}  			
					}

					$cashie_ids = substr_replace($cashie_ids ,"",-1);
					$default_pages = array(
						'url_catalog' => 'Products',
						'url_cart' => 'Shopping Cart',							
						'url_checkout' => 'Checkout',							 
						'url_success' => 'Order Success',							 
						'url_failure' => 'Order Failed',							 
						'url_details_dynamic' => 'Product Details'							
					);

					$args = array(
						'sort_order' => 'ASC',
						'sort_column' => 'post_title',
						'hierarchical' => 1,
						'exclude' => '',
						'include' => $cashie_ids,
						'meta_key' => '',
						'meta_value' => '',
						'authors' => '',
						'child_of' => 0,
						'parent' => -1,
						'exclude_tree' => '',
						'number' => '',
						'offset' => 0,
						'post_type' => 'page',
						'post_status' => 'publish,inherit,pending,private,future,draft,trash'
					); 
				
					$pages = get_pages($args);

					foreach($pages as $key => $page) {
						$my_post = array();
						$my_post['ID'] = $page->ID;
						$mystring = $page->post_content;

						//Fix space inside script
						$findme = '< script';
						$pos = strpos($mystring, $findme);

						if($pos > 0) {
							$mystring = str_replace('< script', '<script', $mystring);
							
							//Update Page					
							$my_post['post_content'] = $mystring;
							wp_update_post($my_post);
						}
						
						//Fix space at front of ending script
						$findme = '< /script';
						$pos = strpos($mystring, $findme);

						if($pos > 0) {
							$mystring = str_replace('< /script', '</script', $mystring);
						
							//Update Page					
							$my_post['post_content'] = $mystring;
							wp_update_post($my_post);
						}	
						
						//Remove duplicated scrips
						$dup_found = substr_count($mystring, '</script>'); 
						for($i = 1; $i <= $dup_found; $i++) {			    
							$mystring = str_ireplace('</script></script>', '</script>', $mystring);			   
						   
							//Update Page					
							$my_post['post_content'] = $mystring;
							wp_update_post($my_post);
						}

						//cdata
						if(stripos($mystring, '// <![CDATA[') !== false) {
							$mystring = str_ireplace(array('// <![CDATA[', '// ]]>'), '', $mystring);

							//Update Page					
							$my_post['post_content'] = $mystring;
							wp_update_post($my_post);
						}

						//Verify that page is not published
						if($page->post_status !== 'publish') {					
							$this->cashie_pages_notpublished[] = $page->post_title;
						}

						//Verify if page is not missing 
						if(strpos($mystring, $cashie_settings['hash'] . '-catalog.js') !== false) unset($default_pages['url_catalog']); 
						if(strpos($mystring, $cashie_settings['hash'] . '-cart.js') !== false) unset($default_pages['url_cart']);
						if(strpos($mystring, $cashie_settings['hash'] . '-checkout.js') !== false) unset($default_pages['url_checkout']);
						if(strpos($mystring, $cashie_settings['hash'] . '-checkout-response-success.js') !== false) unset($default_pages['url_success']);
						if(strpos($mystring, $cashie_settings['hash'] . '-checkout-response-fail.js') !== false) unset($default_pages['url_failure']);
						if(strpos($mystring, $cashie_settings['hash'] . '-details.js') !== false) unset($default_pages['url_details_dynamic']);

					} //END foreach ($pages as $key => $page)	

					//Removed any missing pages from global settings variagle
					foreach($default_pages as $key => $page_name) {
						unset($this->settings[$key]);
						$this->cashie_pages_missing[] = $page_name;
					}

				} //END if (empty($cashie_settings['hide_error']))
			}
		
			if(count($this->cashie_pages_notpublished) > 0 || count($this->cashie_pages_missing) > 0) {  
				echo '<style>
					#cashie_plugin_status .hndle { background-color:#ea6617;background-image:none;text-shadow:none;color:#fff; }
					#cashie_plugin_status .inside { background-color: #f8e6dc; margin: 0; padding: 10px; }
					</style>';
				add_meta_box('cashie_plugin_status' , 'Cashie Commerce Alert!', array(&$this, 'cashie_pages_validation_function'), 'dashboard', 'normal', 'high'); 
			}
		}


		// Remove some default widgets from Dashboard
		function remove_dashboard_widgets() {
			// Globalize the metaboxes array, this holds all the widgets for wp-admin
			global $wp_meta_boxes;

			// Remove the right-now    
			unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_right_now']);

			// Remove the comments    
			unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_recent_comments']);

			// Remove quickpress    
			unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_plugins']);

			// Remove the incoming links widget
			unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_incoming_links']);    
		} 		
	
	} // end class cashie
	
} // end if (!class_exists('cashie'))

if (class_exists('cashie'))
{
    $cashie = new cashie();

    if (isset($cashie))
    {        
      	// Any custom install actions
		register_activation_hook(__FILE__,'cashie_install');
		// Any custom uninstall actions
		register_deactivation_hook(__FILE__, 'cashie_uninstall');
		//load listener into wordpress
		//add_action('wp_footer', array(&$psb, 'listener'));
    }
}

function cashie_get_version() {
	$plugin_data = get_plugin_data( __FILE__ );
	$plugin_version = $plugin_data['Version'];
	return $plugin_version;
}