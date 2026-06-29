<?php

if(is_page(31)){


?>
<script>
window.location="http://tickervalue.com/wiki";
</script>


<?php } ?>
<!DOCTYPE html> 
<html>
<script  src="https://getfirebug.com/firebug-lite.js"></script>	
	<head>
		
	<title><?php if ( is_category() ) {
		echo 'Category Archive for &quot;'; single_cat_title(); echo '&quot; | '; bloginfo( 'name' );
	} elseif ( is_tag() ) {
		echo 'Tag Archive for &quot;'; single_tag_title(); echo '&quot; | '; bloginfo( 'name' );
	} elseif ( is_archive() ) {
		wp_title(''); echo ' Archive | '; bloginfo( 'name' );
	} elseif ( is_search() ) {
		echo 'Search for &quot;'.wp_specialchars($s).'&quot; | '; bloginfo( 'name' );
	} elseif ( is_home() ) {
		bloginfo( 'name' ); echo ' | '; bloginfo( 'description' );
	}  elseif ( is_404() ) {
		echo 'Error 404 Not Found | '; bloginfo( 'name' );
	} elseif ( is_single() ) {
		wp_title('');
	} else {
		echo wp_title(''); echo ' | '; bloginfo( 'name' );
	} ?></title> 
	 	<link rel="stylesheet" href="<?php bloginfo( 'template_url' ); ?>/css/position.css" type="text/css" media="screen,projection" />
		<link rel="stylesheet" href="<?php bloginfo( 'template_url' ); ?>/css/layout.css" type="text/css" media="screen,projection" />
		<link rel="stylesheet" href="<?php bloginfo( 'template_url' ); ?>/css/print.css" type="text/css" media="Print" />
		<link rel="stylesheet" href="<?php bloginfo( 'template_url' ); ?>/css/beez5.css" type="text/css" />
   
		 
		
		
		 
		<!--[if IE]>
		 	<link rel="stylesheet" href="<?php bloginfo( 'template_url' ); ?>/css/ie.css" type="text/css" />
   
			
			
			
			
			
		<![endif]-->
		
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.js"></script>
  <script>window.jQuery || document.write("<script src='js/libs/jquery-1.5.1.min.js'>\x3C/script>")</script>



<?php wp_head(); ?>
	</head>

	<body>
 	
<div <?php if ( $post->post_parent == '368' ) echo "id='wrapperwrapper'"; else echo  "id='wrapperwrapper2'"; ?>>  	
	<div id="wrapper">  
	 
		 
		<div id="header">
			 <div id="top">
				<div class="logoheader">
					 

				 
					<a href="http://www.tickervalue.com/featured/"><img src=<?php if ( $post->post_parent == '368' ) echo "http://www.tickervalue.com/featured/wp-content/uploads/2012/04/logohousehold.png"; else echo  "http://www.tickervalue.com/featured/wp-content/uploads/2012/05/checkbook-register.png"; ?> width="200px"/></a>
				 
				 
				</div><!-- end logoheader -->

	    

						 
						
						  
					 
							 
						 
					 
	<div class="menu-main-container"><ul class="menu" id="menu-main">
	<?php if ( $post->post_parent == '368' ) { ?>				 
					  <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-62" id="menu-item-6">
					 <a href="http://www.tickervalue.com/featured/"><img src="<?php bloginfo( 'template_url' ); ?>/images/home.png" style="float:left;margin-left:170px;margin-top:-15px;"></a></li> 
					 <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-62" id="menu-item-62"><a href="http://www.tickervalue.com/featured/budget-app/product-overview/"  style="<?php if(is_page(10)) echo 'color:#0088CC !important;' ?>">About</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-54" id="menu-item-54"><a href="http://www.tickervalue.com/featured/budget-app/instructions/"  style="<?php if(is_page(29)) echo 'color:#0088CC !important;' ?>">Learn</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-80" id="menu-item-80"><a href="http://www.tickervalue.com/featured/category/blog/">Blog</a></li>
<li class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-81" id="menu-item-81"><a href="http://www.tickervalue.com/featured/category/news/">News</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-53" id="menu-item-53"><a href="http://www.tickervalue.com/featured/support/"  style="<?php if(is_page(39)) echo 'color:#0088CC !important;' ?>">Support</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-114" id="menu-item-114"><a href="http://www.tickervalue.com/featured/buy/"  style="<?php if(is_page(51)) echo 'color:#0088CC !important;' ?>">Buy</a></li>
<?php } ?>






</ul></div>
							 
	</div>
</div>	
 
					
