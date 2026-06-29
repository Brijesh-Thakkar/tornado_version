<?php
if(!class_exists('cashie_options')) {
	class cashie_options {
		var $wp_settings_handle; // array handle for general admin settings created via add_option()
		var $wp_customroles_handle = 'cashie_custom_roles'; // array handle for raw custom roles that are created from the psb admin
		var $wp_lastpostvars_handle = 'cashie_last_postvars'; // array handle for last sent general admin settings postvars
		var $default_roles = array('Administrator', 'Editor', 'Author', 'Contributor', 'Subscriber');
		var $post_vars = array();
		var $settings = array();
		var $cashie_url;
		var $cashie_url_vars;
		var $cashie_s3;
				
		function __construct($post_vars = '') {
			global $cashie_url, $cashie_url_vars, $cashie_s3, $cashie_options_handle, $cashie_partner_options_handle;
			$this->post_vars = $this->trim_postvars($post_vars);
			$this->cashie_url = $cashie_url;
			$this->cashie_url_vars = $cashie_url_vars . get_option($cashie_partner_options_handle);
			$this->cashie_s3 = $cashie_s3;
			$this->wp_settings_handle = $cashie_options_handle;
		}
		
		function get_cashie_options() {
			//Default options
			$this->settings = array(
				 'url_cart' => '',
				 'url_checkout' => '',
				 'url_success' => '',
				 'url_failure' => '',
				 'url_catalog' => '',
				 'url_details_dynamic' => '',
				 'detail_pages' => array(),
				 'static_details' => array(),
				 'details_dynamic' => 1,
				 'hash' => '',
				 'current_product_id' => '',
				 'mode' => ''
			);
								 
			// Gets options from the db
			$existing = get_option($this->wp_settings_handle);
			
			if(is_array($existing)) {
				//Adds new array elements to the old options. This is to retain the old options during upgrades.
				$this->settings = array_merge($this->settings, $existing);
				
				//save options
				update_option($this->wp_settings_handle, $this->settings);
			}
			
			$this->settings = get_option($this->wp_settings_handle);
											
			if(!empty($this->post_vars['update_hash'])) {
				$this->update_hash();
			}
			
			// Recreate pages if we have updated the hash or manually want to recreate pages
			if(!empty($this->post_vars['update_hash']) || !empty($this->post_vars['create_pages'])) {		
				$this->verify_pages();
				$this->create_pages();
				$this->details_dynamic();
			}

			if(!empty($this->post_vars['update_details_dynamic'])) {
				$this->details_dynamic();
			}

			if(!empty($this->post_vars['fix_issues']))	{
				//NEEDS TO BE LOGGED IN
				//$this->update_cashie();
			}	

			//Add/delete product detail pages
			if(!empty($this->post_vars['mode'])) {
				$this->detail_page($this->post_vars['mode'], $this->post_vars['product_id'], $this->post_vars['name']);
			}
			
			//Inserts the final set of options into the wp db
			update_option($this->wp_settings_handle, $this->settings);			
			return $this->settings;
		}
		
		function update_cashie() {
			global $cashie_plugin_url;
			$origin = ((empty($_SERVER['HTTPS'])?"http://":"https://").$_SERVER['HTTP_HOST']); 
			$returnURL = ($origin . $_SERVER['REQUEST_URI']);

			echo '<form id="update_cashie" name="update_cashie" method="post" action="'.$this->cashie_url.'/api/users/save_urls">';
				echo '<input type="hidden" name="cart"  value="'.get_permalink($this->settings['url_cart']).'" />';
				echo '<input type="hidden" name="checkout" value="'.get_permalink($this->settings['url_checkout']).'" />'; 
				echo '<input type="hidden" name="success" value="'.get_permalink($this->settings['url_success']).'" />';
				echo '<input type="hidden" name="failure"  value="'.get_permalink($this->settings['url_failure']).'" />';
				echo '<input type="hidden" name="catalog"  value="'.get_permalink($this->settings['url_catalog']).'" />'; 
				echo '<input type="hidden" name="details"  value="'.get_permalink($this->settings['url_details_dynamic']).'" />';
				echo '<input type="hidden" name="static_details"  value="'.json_encode($this->settings['static_details']).'" />'; 
				echo '<input type="hidden" name="returnURL"  value="'.$returnURL.'" />';                
			echo '</form>;';   
			echo '<script type="text/javascript">document.update_cashie.submit();</script>';
		}

		function update_hash() {
			$this->settings['hash'] = $this->post_vars['hash'];
		}
		
		function verify_pages() {						
			$default_pages = array(
				'url_catalog' => 'catalog',
				'url_cart' => 'cart',
				'url_checkout' => 'checkout',
				'url_success' => 'checkout-response-success',
				'url_failure' => 'checkout-response-fail',
				'url_details_dynamic' => 'details'
			);

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
			$cashie_settings = get_option($this->wp_settings_handle);
			$used_pages = array();

			foreach($pages as $key => $page) {
				foreach($default_pages as $token_key => $token) {
					if(strpos($page->post_content, $this->settings['hash'] . '-' . $token . '.js') !== false) {
						if($this->post_vars['update_hash'] && $page->post_status == 'publish') {
							$this->settings[$token_key] = $page->ID;
							$used_pages[] = $token_key;
						}
						else if(isset($this->settings[$token_key]) && $this->settings[$token_key] !== $page->ID) {
							if (count($cashie_settings) < 1 || in_array($page->ID, $cashie_settings)) {
								wp_delete_post($page->ID, true); 
							}
						}
						else if($page->post_status !== 'publish') {
							$my_post = array(
								'ID' => $page->ID,
								'post_status' => 'publish'
							);
							wp_update_post($my_post);
							$this->settings[$token_key] = $page->ID;
							$used_pages[] = $token_key;
						}
						else {
							$used_pages[] = $token_key;
						}
					}
					else if(strpos($page->post_content, '-' . $token . '.js') !== false) {
						if (count($cashie_settings) < 1 || in_array($page->ID, $cashie_settings)) {
							wp_delete_post($page->ID, false);
						}
					}
				}
			}

			//force missing pages to be recreated
			foreach($default_pages as $token_key => $token) {
				if(!in_array($token_key, $used_pages)) unset($this->settings[$token_key]);
			}

			return true;
		}

		function create_pages() {
			if(empty($this->settings['url_cart']) || !empty($this->post_vars['force_create'])) {
				$auto_post = array(
					'ID' => get_page($this->settings['url_cart'])?$this->settings['url_cart']:'',
					'menu_order' => '1',
					'comment_status' => 'closed',
					'ping_status' => 'closed',
					'pinged' => '',
					'post_author' => $current_user->ID,
					'post_category' => '',
					'post_content' => "<script type=\"text\/javascript\">document.write(unescape(\"%3Cscript src='\" + ('https:' == document.location.protocol ? 'https://' : 'http://') + \"".$this->cashie_s3.".s3.amazonaws.com/userjs/".$this->settings['hash']."-cart.js' type='text/javascript'%3E%3C/script%3E\"));<\/script>",
					'post_date' => '',
					'post_date_gmt' => '',
					'post_name' => '',
					'post_parent' => '',
					'post_password' => '',
					'post_status' => 'publish',
					'post_title' => 'Shopping Cart',
					'post_type' => 'page',
					'tags_input' => '',
					'to_ping' => ''
								);
				$this->settings['url_cart'] = wp_insert_post($auto_post);		
			}

			if(empty($this->settings['url_checkout']) || !empty($this->post_vars['force_create'])) {
				$auto_post = array(
					'ID' => get_page($this->settings['url_checkout'])?$this->settings['url_checkout']:'',
					'menu_order' => '2',
					'comment_status' => 'closed',
					'ping_status' => 'closed',
					'pinged' => '',
					'post_author' => $current_user->ID,
					'post_category' => '',
					'post_content' => '<script type="text/javascript">document.write(unescape("%3Cscript src=\'" + (\'https:\' == document.location.protocol ? \'https://\' : \'http://\') + "'.$this->cashie_s3.'.s3.amazonaws.com/userjs/'.$this->settings['hash'].'-checkout.js\' type=\'text/javascript\'%3E%3C/script%3E"));</script>',
					'post_date' => '',
					'post_date_gmt' => '',
					'post_name' => '',
					'post_parent' => $this->settings['url_cart'],
					'post_password' => '',
					'post_status' => 'publish',
					'post_title' => 'Checkout',
					'post_type' => 'page',
					'tags_input' => '',
					'to_ping' => ''
								);		 
				$this->settings['url_checkout'] = wp_insert_post($auto_post);		
			}

			if(empty($this->settings['url_success']) || !empty($this->post_vars['force_create'])) {
				$auto_post = array(
					'ID' => get_page($this->settings['url_success'])?$this->settings['url_success']:'',
					'menu_order' => '',
					'comment_status' => 'closed',
					'ping_status' => 'closed',
					'pinged' => '',
					'post_author' => $current_user->ID,
					'post_category' => '',
					'post_content' => '<script type="text/javascript">document.write(unescape("%3Cscript src=\'" + (\'https:\' == document.location.protocol ? \'https://\' : \'http://\') + "'.$this->cashie_s3.'.s3.amazonaws.com/userjs/'.$this->settings['hash'].'-checkout-response-success.js\' type=\'text/javascript\'%3E%3C/script%3E"));</script>',
					'post_date' => '',
					'post_date_gmt' => '',
					'post_name' => '',
					'post_parent' => $this->settings['url_cart'],
					'post_password' => '',
					'post_status' => 'publish',
					'post_title' => 'Order Success',
					'post_type' => 'page',
					'tags_input' => '',
					'to_ping' => ''
								);		 
				$this->settings['url_success'] = wp_insert_post($auto_post);	
			}

			if(empty($this->settings['url_failure']) || !empty($this->post_vars['force_create'])) {
				$auto_post = array(
					'ID' => get_page($this->settings['url_failure'])?$this->settings['url_failure']:'',
					'menu_order' => '',
					'comment_status' => 'closed',
					'ping_status' => 'closed',
					'pinged' => '',
					'post_author' => $current_user->ID,
					'post_category' => '',
					'post_content' => '<script type="text/javascript">document.write(unescape("%3Cscript src=\'" + (\'https:\' == document.location.protocol ? \'https://\' : \'http://\') + "'.$this->cashie_s3.'.s3.amazonaws.com/userjs/'.$this->settings['hash'].'-checkout-response-fail.js\' type=\'text/javascript\'%3E%3C/script%3E"));</script>',
					'post_date' => '',
					'post_date_gmt' => '',
					'post_name' => '',
					'post_parent' => $this->settings['url_cart'],
					'post_password' => '',
					'post_status' => 'publish',
					'post_title' => 'Order Failed',
					'post_type' => 'page',
					'tags_input' => '',
					'to_ping' => ''
								);		 
				$this->settings['url_failure'] = wp_insert_post($auto_post);					
			}

			if(empty($this->settings['url_catalog']) || !empty($this->post_vars['force_create'])) {
				$auto_post = array(
					'ID' => get_page($this->settings['url_catalog'])?$this->settings['url_catalog']:'',
					'menu_order' => '2',
					'comment_status' => 'closed',
					'ping_status' => 'closed',
					'pinged' => '',
					'post_author' => $current_user->ID,
					'post_category' => '',
					'post_content' => '<script type="text/javascript">document.write(unescape("%3Cscript src=\'" + (\'https:\' == document.location.protocol ? \'https://\' : \'http://\') + "'.$this->cashie_s3.'.s3.amazonaws.com/userjs/'.$this->settings['hash'].'-catalog.js\' type=\'text/javascript\'%3E%3C/script%3E"));</script>[cashieproduct][/cashieproduct]',
					'post_date' => '',
					'post_date_gmt' => '',
					'post_name' => '',
					'post_parent' => '',
					'post_password' => '',
					'post_status' => 'publish',
					'post_title' => 'Products',
					'post_type' => 'page',
					'tags_input' => '',
					'to_ping' => ''
								);		 
				$this->settings['url_catalog'] = wp_insert_post($auto_post);					
			}
		}
	
		function details_dynamic() {
			global $current_user;
			
			if(!empty($this->post_vars['details_dynamic'])) {
				$this->settings['details_dynamic'] = intval($this->post_vars['details_dynamic']);
			}
					
			if(!empty($this->settings['details_dynamic'])){
				if(empty($this->settings['url_details_dynamic']) || !empty($this->post_vars['force_create'])) {
					$auto_post = array(
						'ID' => get_page($this->settings['url_details_dynamic'])?$this->settings['url_details_dynamic']:'',
						'menu_order' => '2',
						'comment_status' => 'closed',
						'ping_status' => 'closed',
						'pinged' => '',
						'post_author' => $current_user->ID,
						'post_category' => '',
						'post_content' => '<script type="text/javascript">document.write(unescape("%3Cscript src=\'" + (\'https:\' == document.location.protocol ? \'https://\' : \'http://\') + "'.$this->cashie_s3.'.s3.amazonaws.com/userjs/'.$this->settings['hash'].'-details.js\' type=\'text/javascript\'%3E%3C/script%3E"));</script>[cashieproduct][/cashieproduct]',
						'post_date' => '',
						'post_date_gmt' => '',
						'post_name' => '',
						'post_parent' => $this->settings['url_catalog'],
						'post_password' => '',
						'post_status' => 'publish',
						'post_title' => 'Product Details',
						'post_type' => 'page',
						'tags_input' => '',
						'to_ping' => ''
					);		 
					$this->settings['url_details_dynamic'] = wp_insert_post($auto_post);
				}				
			}	
			else {
				if(!empty($this->settings['url_details_dynamic'])) {
					wp_delete_post($this->settings['url_details_dynamic'], true); // delete the dynamic detail page
					$this->settings['url_details_dynamic'] = '';
				}
				
				//Get product catalog
				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, $this->cashie_url."/api/users/get_products/".$this->settings['hash']);
				curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		
				//Get the response and close the channel
				$response = curl_exec($ch);
				curl_close($ch);
				
				//Decode the JSON
				$prodArray = json_decode($response);
			
				foreach($prodArray as $id => $obj) {
					$newid = $this->detail_page('add', $id, $obj->name);
					$this->settings['static_details'][$id] = get_permalink($newid); // used to post back to set URL's
				}
			}
		}
		
		function detail_page($mode=null, $product_id=null, $prodname=null) {
			global $current_user;
			$id = '';
			if(!empty($this->settings['detail_pages'][$product_id])) {
				$id = $this->settings['detail_pages'][$product_id]['postid'];
				if(!get_page($id)) {
					$id = '';
				}
			}
			if($mode == "add") {
				$auto_post = array(
					'ID' => $id,
					'menu_order' => '0',
					'comment_status' => 'closed',
					'ping_status' => 'closed',
					'pinged' => '',
					'post_author' => $current_user->ID,
					'post_category' => '',
					//'post_content' => htmlspecialchars_decode($this->post_vars['code']),
					//'post_content' => $this->post_vars['code'],
					'post_content' => '<script type="text/javascript">_cashieProductID='.$product_id.';document.write(unescape("%3Cscript src=\'" + (\'https:\' == document.location.protocol ? \'https://\' : \'http://\') + "'.$this->cashie_s3.'.s3.amazonaws.com/userjs/'.$this->settings['hash'].'-details.js\' type=\'text/javascript\'%3E%3C/script%3E"));</script>',
					'post_date' => '',
					'post_date_gmt' => '',
					'post_name' => '',
					'post_parent' => $this->settings['url_catalog'],
					'post_password' => '',
					'post_status' => 'publish',
					'post_title' => $prodname,
					'post_type' => 'page',
					'tags_input' => '',
					'to_ping' => ''
				);
															
				//Creates page and assigns the return value(page ID) associated with the product id
				$this->settings['detail_pages'][$product_id]['postid'] = wp_insert_post($auto_post);
				$this->settings['detail_pages'][$product_id]['product_id'] = $product_id;
				$this->settings['detail_pages'][$product_id]['name'] = $prodname;						
			}
			else if ($mode == "delete") {
				//delete the product details page
				if(!empty($this->settings['detail_pages'][$product_id])) {
					wp_delete_post($this->settings['detail_pages'][$product_id]['postid'], true); 
					unset($this->settings['detail_pages'][$product_id]['product_id']);
					unset($this->settings['detail_pages'][$product_id]['postid']);
					unset($this->settings['detail_pages'][$product_id]['name']);
					unset($this->settings['detail_pages'][$product_id]);
				}
			}

			//set for use on return to settings page
			$this->settings['current_product_id'] = $product_id; 
			$this->settings['mode'] = $mode;
			return $this->settings['detail_pages'][$product_id]['postid'];
		}

		function trim_postvars($postvars) {
			$trimmed_postvars = array();
			if(is_array($postvars)) {
				foreach($postvars as $key => $value) {
					$trimmed_postvars[trim($key)] = trim($value);
				}
			}
			return $trimmed_postvars;
		}
				
		function assign_new_values() {
			if(is_array($this->post_vars)) {
				foreach ($this->post_vars AS $name => $value) {
					//Checks if the $name exists as a key in $this->settings
					//Assigns the return value to $match_key
					$match_key = $this->multi_array_key_exists($name, $this->settings);
					$multi_keys = explode(':', $match_key);
					$multi_keys_length = count($multi_keys);

					if($multi_keys_length > 0) {
						//If the key belongs to a multi dimensional array, the parser should enter this block
						if($multi_keys_length == 2) {
							//If the key belongs to a two dimensional array
							$this->settings[$multi_keys[0]][$multi_keys[1]] = $value;
						}
						else if ($multi_keys_length == 3) {
							//If the key belongs to a three dimensional array
							$this->settings[$multi_keys[0]][$multi_keys[1]][$multi_keys[2]] = $value;
						}
					}

					if($name == $match_key) {
						//If the key is a base key
						$this->settings[$match_key] = $value;
					}
				}
			}

			return false;
		}
				
		function multi_array_key_exists($needle, $haystack) {
			//Checks if a key exists in the $haystack
			//This function supports three(or more) dimensional array
			foreach($haystack AS $key => $value) {
				if($needle == $key) {
					return $key;
				}
		
				if(is_array($value)) {
					if($this->multi_array_key_exists($needle, $value)) {
						return $key . ":" . $this->multi_array_key_exists($needle, $value);
					}
					else {
						continue;
					}
				}
			}

			return false;
		} 
		
	} // class cashie_options
}
?>