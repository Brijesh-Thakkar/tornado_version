<?php
if (!class_exists('cashie_settings'))
{

	class cashie_settings
	{
		var $post_vars;
		var $option_values;
		var $update;
		var $custom_roles;
		var $cashie_url;
		var $cashie_url_vars;
		var $cashie_s3;
				
		function __construct($post_vars)
		{
			global $cashie_url, $cashie_url_vars, $cashie_s3, $cashie_partner_options_handle;
			$this->post_vars = $post_vars;
			$this->cashie_url = $cashie_url;
			$this->cashie_url_vars = $cashie_url_vars . get_option($cashie_partner_options_handle);
			$this->cashie_s3 = $cashie_s3;
			add_shortcode( 'cashieproduct', array( __CLASS__, "product_data" ) );
		}

		function product_data($args, $content=""){
			//$option = self::option_get();
			$default_args = array('debug' => 0,'silentdebug' => 0, 'function' => 0, 'mode'=>'new');
			extract( shortcode_atts( $default_args, $args));
			$four0four_used = false;
			//Debug settings
			if($debug == 1){
				error_reporting(E_ALL);
				ini_set("display_errors","1");
			}
			
			if($function == 0):
				if( $mode == "new" || ($option["preparse"] == 0 && $mode == "new") ){
					$content = strip_tags($content);
					$content = preg_replace("/\[{1}([\/]*)([a-zA-z\/]{1}[a-zA-Z0-9]*[^\'\"])([a-zA-Z0-9 \!\"\£\$\%\^\&\*\*\(\)\_\-\+\=\|\\\,\.\/\?\:\;\@\'\#\~\{\}\¬\¦\`\<\>]*)([\/]*)([\]]{1})/ix","<$1$2$3>",$content,"-1");
					$content = htmlspecialchars($content, ENT_NOQUOTES);
					$content = str_replace("&amp;#8217;","'",$content);
					$content = str_replace("&amp;#8216;","'",$content);
					$content = str_replace("&amp;#8242;","'",$content);
					$content = str_replace("&amp;#8220;","\"",$content);
					$content = str_replace("&amp;#8221;","\"",$content);
					$content = str_replace("&amp;#8243;","\"",$content);
					$content = str_replace("&amp;#039;","'",$content);
					$content = str_replace("&#039;","'",$content);
					$content = str_replace("&amp;#038;","&",$content);
					$content = str_replace("&amp;gt;",'>',$content);
					$content = str_replace("&amp;lt;",'<',$content);
					$content = htmlspecialchars_decode($content);
				}
				else{
					$content =(htmlspecialchars($content,ENT_QUOTES));
					$content = str_replace("&amp;#8217;","'",$content);
					$content = str_replace("&amp;#8216;","'",$content);
					$content = str_replace("&amp;#8242;","'",$content);
					$content = str_replace("&amp;#8220;","\"",$content);
					$content = str_replace("&amp;#8221;","\"",$content);
					$content = str_replace("&amp;#8243;","\"",$content);
					$content = str_replace("&amp;#039;","'",$content);
					$content = str_replace("&#039;","'",$content);
					$content = str_replace("&amp;#038;","&",$content);
					$content = str_replace("&amp;lt;br /&amp;gt;"," ", $content);
					$content = htmlspecialchars_decode($content);
					$content = str_replace("<br />"," ",$content);
					$content = str_replace("<p>"," ",$content);
					$content = str_replace("</p>"," ",$content);
					$content = str_replace("[br/]","<br/>",$content);
					$content = str_replace("\\[","&#91;",$content);
					$content = str_replace("\\]","&#93;",$content);
					$content = str_replace("[","<",$content);
					$content = str_replace("]",">",$content);
					$content = str_replace("&#91;",'[',$content);
					$content = str_replace("&#93;",']',$content);
					$content = str_replace("&gt;",'>',$content);
					$content = str_replace("&lt;",'<',$content);
				}
			else:
				//function selected
				$snippet = self::snippet_get($function);
				if( sizeof( $snippet ) == 0){
					$four0four_used = true;
					$content = self::snippet_404();
				}
				else{
					$content = stripslashes($snippet->function);
				}
			endif;
			ob_start();
			eval($content);
			if($debug == 1||$silentdebug == 1){
				if($silentdebug == 1){
					echo "\n\n<!-- ALLOW PHP SILENT DEBUG MODE - - > \n\n\n";
				}else{
					echo "<p align='center'>Allow PHP Debug</p>";
				}
				if($four0four_used){
					$content = "Function id : $function : cannot be found<br/>";
				}else{
					$content =(htmlspecialchars($content,ENT_QUOTES));
				}
				echo "<pre>".$content."</pre>";
				if($silentdebug == 1){
					echo "\n\n\n<- - END ALLOW PHP SILENT DEBUG MODE -->\n\n";
				}else{
					echo "<p align='center'>End Allow PHP Debug</p>";
				}
			}

			self::get_product_details($args);	
			return ob_get_clean();		

		}
		
		function cashie_admin_init()
		{
			//Registers options page stylesheet
			wp_register_style('cashie_stylesheet', plugins_url('/css/settings.css', dirname(__FILE__)));
			wp_register_script( 'cashie_js_utils', plugins_url('/js/utils.js', dirname(__FILE__)));
			wp_register_script( 'cashie_js_dashboard', plugins_url('/js/cashie_settings_dashboard.js', dirname(__FILE__)));
			wp_register_script( 'cashie_js_profile', plugins_url('/js/cashie_settings_profile.js', dirname(__FILE__)));
			wp_register_script( 'cashie_js_products', plugins_url('/js/cashie_settings_products.js', dirname(__FILE__)));
			wp_register_script( 'cashie_js_store', plugins_url('/js/cashie_settings_store.js', dirname(__FILE__)));
		}
				
		function create_menu()
		{
			//creates new top-level menu
			add_menu_page('Cashie Commerce', 'Cashie Commerce', 'administrator', __FILE__, null, plugins_url('/images/icon_cashie.png', dirname(__FILE__)));
			
			// First submenu has same slug as top level menu so that it is the default selected when top level menu is clicked
			$page = add_submenu_page( __FILE__, 'Cashie Commerce', 'Dashboard', 'administrator', __FILE__, array($this, 'settings_dashboard'));
			add_action( 'admin_print_styles-' . $page, array($this, 'cashie_admin_styles') );
			add_action('admin_print_scripts-' . $page, array($this, 'cashie_dashboard_js') );
			
			$page = add_submenu_page( __FILE__, 'Cashie Commerce', 'Products', 'administrator', __FILE__.'_products', array($this, 'settings_products'));
			add_action( 'admin_print_styles-' . $page, array($this, 'cashie_admin_styles') );
			add_action('admin_print_scripts-' . $page, array($this, 'cashie_products_js') );
			
			$page = add_submenu_page( __FILE__, 'Cashie Commerce', 'Promotions', 'administrator', __FILE__.'_promotions', array($this, 'settings_promotions'));
			add_action( 'admin_print_styles-' . $page, array($this, 'cashie_admin_styles') );
			
			$page = add_submenu_page( __FILE__, 'Cashie Commerce', 'Orders', 'administrator', __FILE__.'_transactions', array($this, 'settings_transactions'));
			add_action( 'admin_print_styles-' . $page, array($this, 'cashie_admin_styles') );
			
			$page = add_submenu_page( __FILE__, 'Cashie Commerce', 'Storefronts', 'administrator', __FILE__.'_storefronts', array($this, 'settings_storefronts'));
			add_action( 'admin_print_styles-' . $page, array($this, 'cashie_admin_styles') );
			
			$page = add_submenu_page( __FILE__, 'Cashie Commerce', 'Settings', 'administrator', __FILE__.'_store', array($this, 'settings_store'));
			add_action( 'admin_print_styles-' . $page, array($this, 'cashie_admin_styles') );
			add_action('admin_print_scripts-' . $page, array($this, 'cashie_store_js') );
			
			$page = add_submenu_page( __FILE__, 'Cashie Commerce', 'Design', 'administrator', __FILE__.'_pages', array($this, 'settings_pages'));
			add_action( 'admin_print_styles-' . $page, array($this, 'cashie_admin_styles') );
			
			$page = add_submenu_page( __FILE__, 'Cashie Commerce', 'Account', 'administrator', __FILE__.'_profile', array($this, 'settings_profile'));
			add_action( 'admin_print_styles-' . $page, array($this, 'cashie_admin_styles') );
			add_action('admin_print_scripts-' . $page, array($this, 'cashie_profile_js') );
			
			/* LOGOUT OPITON
			$page = add_submenu_page( __FILE__, 'Cashie Commerce', 'Log out', 'administrator', __FILE__.'_logout', array($this, 'settings_logout'));
			add_action( 'admin_print_styles-' . $page, array($this, 'cashie_admin_styles') );
			*/

			$page = add_submenu_page( __FILE__, 'Cashie Commerce', 'Help', 'administrator', __FILE__.'_help', array($this, 'settings_help'));
			add_action( 'admin_print_styles-' . $page, array($this, 'cashie_admin_styles') );
			
			//Triggers instantiation of psb_Options class
			$this->init_options();								
		}
			
		function cashie_admin_styles()
		{
			//It will be called only on your plugin admin page, enqueue our stylesheet here
			wp_enqueue_style('cashie_stylesheet');
		}
		
		function cashie_dashboard_js()
		{
			wp_enqueue_script( 'cashie_js_utils' );
			wp_enqueue_script( 'cashie_js_dashboard');
		}
		
		function cashie_products_js()
		{
			wp_enqueue_script( 'cashie_js_utils' );
			wp_enqueue_script( 'cashie_js_products');
		}
		
		function cashie_store_js()
		{
			wp_enqueue_script( 'cashie_js_utils' );
			wp_enqueue_script( 'cashie_js_store');
		}
		
		function cashie_profile_js()
		{
			wp_enqueue_script( 'cashie_js_utils' );
			wp_enqueue_script( 'cashie_js_profile');
		}
			
		function init_options()
		{

			if (class_exists('cashie_options'))
			{	
				//only instantiates options when form is submitted
				if (!empty($this->post_vars['update']))
				{
					//instantiates psb_Options class and pass post_vars to it
					$cashie_options = new cashie_options($this->post_vars);				

					if ($this->verify_current_hash() !== $this->post_vars['hash'])
						$this->update = true;
					else
						$this->update = false;

				}

				if (!empty($this->post_vars['hide_tab']))
				{	
					global $cashie_options_handle;
					$cashie_sertings = get_option($cashie_options_handle);
			
					if (strlen($cashie_sertings)) {
						$cashie_sertings['hide_error'] = true;
						update_option( $cashie_options_handle, $cashie_sertings);
					}
				}

			}

			if (isset($cashie_options))
			{				
				//updates options and retrieves the options array, only do that when form is submitted
				$this->option_values = $cashie_options->get_cashie_options();
			} 
			else
			{					
				//gets options array from the the db directly when coming from other admin menus-- no form is submitted.
				$this->option_values = get_option('cashie_admin_options');
			}
			
		}
		
		function verify_current_hash () {

			$new_setup = true;
			$current_hash = '';

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
				'post_status' => 'publish,inherit,pending,private,future,draft,trash'
			); 

			$pages = get_pages($args);
			
			foreach ($pages as $key => $page) {	

				$new_setup = ($page->post_title == 'Products' ? false : $new_setup);			
				$new_setup = ($page->post_title == 'Shopping Cart' ? false : $new_setup);
				$new_setup = ($page->post_title == 'Checkout' ? false : $new_setup);
				$new_setup = ($page->post_title == 'Order Success' ? false : $new_setup);
				$new_setup = ($page->post_title == 'Order Failed' ? false : $new_setup);
				$new_setup = ($page->post_title == 'Product Details' ? false : $new_setup);

				if (!$new_setup) {
					$current_hash = $page->post_content;
				}
			}
		

			//Get current hash
			if (!empty($current_hash)) {
				$pos = stripos($current_hash, 'cashie.s3.amazonaws.com/userjs/');		
				$current_hash = substr($current_hash, $pos);
				$current_hash = str_replace('cashie.s3.amazonaws.com/userjs/', '', $current_hash);
				$pos = stripos($current_hash, '-');		
				$current_hash = substr($current_hash, 0, $pos);		
			} 

			return $current_hash;

		}

		function parse_to_string($beginning_string, $ending_string, $custom_string = '') {
		    if('' != $custom_string) {
				preg_match_all("($beginning_string.*$ending_string)siU", $custom_string, $matching_data);
				return $matching_data[0][0];
		    }
			else {
				return false;
			}
		}

		function js_to_php($beginning_string, $custom_string='') {
			if('' != $custom_string) {
				if($beginning_string == 'months:') {
					//Get for begining of months:
					$startofMonths = strrpos($custom_string, $beginning_string.' [');	
					//Get end of Months
					$stringLength = strlen($custom_string);
					$endofMonths = strrpos($custom_string, "'],");
					$endofMonths = $stringLength - $endofMonths - 2;
					$endofMonths = -1 * abs($endofMonths);
					
					//Strip months array
					$full_string = substr($custom_string, $startofMonths, $endofMonths);
					
					//Remove Months: from string
					$full_string = str_replace($beginning_string, "", $full_string);
					$full_string = trim( preg_replace( '/\s+/', ' ', $full_string ) ); 
					
					$search = array("'", "[", "]", "\", \"","\"\"");
					$replace = array("\"", "", "", "\"", "\"");
					$full_string = str_replace($search, $replace, $full_string);
					$full_string = explode('"', $full_string);
					return $full_string;
				}
				else {
					$full_string = self::parse_to_string($beginning_string.' {', '}', $custom_string);
					$full_string = str_replace($beginning_string, "", $full_string);
					$full_string = trim( preg_replace( '/\s+/', ' ', $full_string ) );  
					$full_string = '"'.$full_string;
					
					$full_string = str_replace(": '", "\" : '", $full_string);
					$search = array("'", "{", "}", ",", "\" ");
					$replace = array("\"", "", "", ", \"", "\"");				
					
					$full_string = str_replace($search, $replace, $full_string);
					return json_decode('{'.$full_string.'}', true);	
				}

			}
			else {
				return false;
			}
		}

		function get_product_details ($args) {
				
			//Set cashie variables
			global $cashie_s3, $cashie_options_handle, $post;
			$cashie_admin_options = get_option($cashie_options_handle);		
			$page_id = $post->ID;
			$cashie_s3_domain = $cashie_s3;
			$catalog_id = $cashie_admin_options['url_catalog'];
			$hash =	$cashie_admin_options['hash'];
			$cid = ($_GET['cid'] ? $_GET['cid'] : 0);
			$cid = ($_GET['CID'] ? $_GET['CID'] : $cid);

			$http_protocole = 'https://';

			if (empty($_SERVER['HTTPS']) && isset($_SERVER['HTTP_USER_AGENT']))
			{
				preg_match('/MSIE ([0-9]\.[0-9])/',$_SERVER['HTTP_USER_AGENT'],$matches);
				if(isset($matches[1]) && floatval($matches[1])<9) {
					 $http_protocole = "http://";
				}
			}
		
			if ($cid > 0 && $hash !== 0  && $catalog_id !== $page_id) {

				$product_id = $_GET['cid'];
				$json_url =  $http_protocole.$cashie_s3.".s3.amazonaws.com/catalog/".$hash."/products/".$product_id.".js";
				$result = wp_remote_get( $json_url );
				$full_string = $result['body'];
				$full_string = str_replace("_cashieProduct=", "", $full_string);
				$full_string = str_replace("};", "}", $full_string);
				$product = json_decode($full_string, true); 
			
				echo '<noscript>';
				
				echo '<div itemscope itemtype="http://schema.org/Product">';

					echo '<span itemprop="name">'.$product['name'].'</span>';

					foreach ($product['images'] as $key => $value) {	
						echo '<img src='. $http_protocole.$cashie_s3.'.s3.amazonaws.com/catalog/'.$hash.'/images/'.$value.'" alt="'.$product['name'].'"" />';	
					}	

				 	echo '<div itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating">';
				 		echo 'Rated <span itemprop="ratingValue">'.$product['ratings']['average'].'</span>/5 based on <span itemprop="reviewCount">'.$product['ratings']['votes'].'</span> customer reviews';
				 	echo '</div>';

				  	echo 'Product description:';
				  	echo '<span itemprop="description">'.$product['desc'].'<br>'.$product['long_desc'].'</span>';

				  	echo 'Customer reviews:';
				  	foreach ($product['reviews'] as $key => $value) {
				  		echo '<div itemprop="review" itemscope itemtype="http://schema.org/Review">';
					    	echo '<span itemprop="name">'.$value['review'].'</span>';
					   		echo '<meta itemprop="datePublished" content="'.date('y-m-d', $value['inserted']).'">'.$value['inserted_formatted'];
					    	echo '<div itemprop="reviewRating" itemscope itemtype="http://schema.org/Rating">';
					      		echo '<span itemprop="ratingValue">'.$value['rating'].'</span>/';
					   		echo '</div>';
					    	echo '<span itemprop="description">'.$value['review'].'</span>';
					  	echo '</div>';
					}
				 
				echo '</div>';

				echo '<h2>'.$product['name'].'</h2><br>';
				echo 'Price: '.$product['price'].'<br>';
				echo 'Descripiton: '.$product['desc'].'<br>';
				echo 'Product type: '.$product['type'].'<br>';
				echo 'Long description: '.$product['long_desc'].'<br>';

				echo 'Product weight: '.$product['weight'].'<br>';
				echo 'Product sku: '.$product['sku'].'<br>';
				echo 'Images:<br>';
				foreach ($product['images'] as $key => $value) {				
					echo '<img itemprop="image" border="0" src="'. $http_protocole.$cashie_s3.'.s3.amazonaws.com/catalog/'.$hash.'/images/'.$value.'" ><br>';
				}		

				echo 'Product options: <br>';
				foreach ($product['options'] as $key => $value) {
				
					echo $value['name'].': ';
					$row_count = 0;
				
					foreach ($value['opts'] as $opts_key => $opts) {
						if ($row_count > 0) echo ', ';
						echo $opts;
						$row_count++;
						//echo ' $' . $product['variations'][$key.','.$opts_key]['price'];
					}				

					echo '<br>';
				}

				echo 'Product categories: <br>';
				$row_count = 0;
				foreach ($product['categories'] as $key => $value) {
					if ($row_count > 0) echo ', ';
					echo $value['name'];
					$row_count++;
				}
				
				echo '</noscript>';

			}

			if ($catalog_id == $page_id) {

				$json_url =  $http_protocole.$cashie_s3.".s3.amazonaws.com/userjs/".$hash."-catalog-mobile.js";
				$content = wp_remote_get($json_url);

				$_cashieData = json_decode($content['body'], TRUE);				

				echo '<noscript>';

				foreach ($_cashieData['products'] as $key => $product) {

					echo '<div itemscope itemtype="http://schema.org/Product">';
						echo '<span itemprop="name">'.$product['name'].'</span>';
						echo 'Product URL';
						echo '<span itemprop="url">'.$product['details_url'].'&cid='.$product['id'].'#cid='.$product['id'].'</span>';
						echo 'Product description:';
				  		echo '<span itemprop="description">'.$product['desc'].'<br>'.$product['long_desc'].'</span>';
						foreach ($product['images'] as $key => $value) {				
							echo '<img itemprop="image" border="0" src="'. $http_protocole.$cashie_s3.'.s3.amazonaws.com/catalog/'.$hash.'/images/'.$value.'" ><br>';
						}	
						
					echo '</div>';
				}

				echo '</noscript>';
				
			}
			
		}

		function settings_dashboard()
		{ 
			include_once('cashie_settings_dashboard.php');
		}
		
		function settings_store()
		{ 
		  if (empty($this->option_values['hash']))
				include_once('cashie_settings_link.php');
			else
		    include_once('cashie_settings_store.php');
		}
		
		function settings_categories()
		{ 
		  if (empty($this->option_values['hash']))
				include_once('cashie_settings_link.php');
			else
				include_once('cashie_settings_categories.php');
		}
		
		function settings_pages()
		{ 
		  if (empty($this->option_values['hash']))
				include_once('cashie_settings_link.php');
			else
				include_once('cashie_settings_pages.php');
		}
		
		function settings_products()
		{ 
		  if (empty($this->option_values['hash']))
				include_once('cashie_settings_link.php');
			else
				include_once('cashie_settings_products.php');
		}
		
		function settings_promotions()
		{ 
		  if (empty($this->option_values['hash']))
				include_once('cashie_settings_link.php');
			else
				include_once('cashie_settings_promotions.php');
		}
		
		function settings_storefronts()
		{ 
		  if (empty($this->option_values['hash']))
				include_once('cashie_settings_link.php');
			else
				include_once('cashie_settings_storefronts.php');
		}
		
		function settings_transactions()
		{ 
			if (empty($this->option_values['hash']))
				include_once('cashie_settings_link.php');
			else
		  	include_once('cashie_settings_transactions.php');
		}
		
		function settings_billing()
		{ 
			if (empty($this->option_values['hash']))
				include_once('cashie_settings_link.php');
			else
		  	include_once('cashie_settings_billing.php');
		}
		
		function settings_profile()
		{ 
			if (empty($this->option_values['hash']))
				include_once('cashie_settings_link.php');
			else
				include_once('cashie_settings_profile.php');  
		}
		
		function settings_help()
		{ 
			include_once('cashie_settings_help.php');  
		}

		function settings_logout()
		{ 
			include_once('cashie_settings_logout.php');  
		}
		
	} // class cashie_settings
	
} // if (!class_exists('cashie_settings'))


if (class_exists('cashie_settings'))
{
	//instantiates this class
	$cashie_settings = new cashie_settings($_POST);

	if (isset($cashie_settings))
	{
		//loads settings page css script
		add_action('admin_init', array(&$cashie_settings, 'cashie_admin_init'));
		//initializes display of settings page
		add_action('admin_menu', array(&$cashie_settings, 'create_menu'));
	}
}	