<?php
/*

Template Name: Left Sidebar

*/
?>

 
<?php get_header(); ?>

                   
			 
 
						<div id="main">
<div id="leftsidebar">		
		
<?php
 if($post->post_parent)
  $children = wp_list_pages("title_li=&child_of=".$post->post_parent."&echo=0");
  else
  $children = wp_list_pages("title_li=&child_of=".$post->ID."&echo=0");
  
  if (is_page(array(8,10,12,14,19,17))) { ?>
  
  <ul>
  <li class="page_item page-item-10"><img src="<?php bloginfo( 'template_url' ); ?>/images/Misc.png" style="float:left;margin-right:10px;" width="50px" /><a href="http://www.tickervalue.com/featured/about/product/"  style="<?php if(is_page(10)) echo 'color:#0088CC !important;' ?>">Product</a></li>
  <li class="page_item page-item-12"><img src="<?php bloginfo( 'template_url' ); ?>/images/Video.png"  style="float:left;margin-right:10px;" width="50px"  /><a href="http://www.tickervalue.com/featured/about/videos/"  style="<?php if(is_page(12)) echo 'color:#0088CC !important;' ?>">Videos</a></li>
  <li class="page_item page-item-14"><img src="<?php bloginfo( 'template_url' ); ?>/images/Smiley.png"  style="float:left;margin-right:10px;" width="50px"  /><a href="http://www.tickervalue.com/featured/about/testimonials/"  style="<?php if(is_page(14)) echo 'color:#0088CC !important;' ?>">Testimonials</a></li>
  <li class="page_item page-item-19"><img src="<?php bloginfo( 'template_url' ); ?>/images/Mail.png"  style="float:left;margin-right:10px;" width="50px"  /><a href="http://www.tickervalue.com/featured/about/contact/"  style="<?php if(is_page(19)) echo 'color:#0088CC !important;' ?>">Contact</a></li>
  <li class="page_item page-item-17"><img src="<?php bloginfo( 'template_url' ); ?>/images/Recyclebin-Full.png"  style="float:left;margin-right:10px;" width="50px"  /><a href="http://www.tickervalue.com/featured/about/samples/"  style="<?php if(is_page(17)) echo 'color:#0088CC !important;' ?>">Samples</a></li>
  </ul>
  
  <?php }  
  ?>
  <ul>
  <?php // echo $children; ?>
  </ul>
  
  <?php
  if (is_page(array(27,29,31,33,37))) { ?>
  
  <ul>
  <li class="page_item page-item-29"><img src="<?php bloginfo( 'template_url' ); ?>/images/Doc.png"  style="float:left;margin-right:10px;" width="50px"  /><a href="http://www.tickervalue.com/featured/learn/instructions/"  style="<?php if(is_page(29)) echo 'color:#0088CC !important;' ?>">Instructions</a></li>
<li class="page_item page-item-31"><img src="<?php bloginfo( 'template_url' ); ?>/images/Wikipedia-icon.png"  style="float:left;margin-right:10px;" width="50px"  /><a href="http://www.tickervalue.com/featured/learn/wiki/"  style="<?php if(is_page(31)) echo 'color:#0088CC !important;' ?>">Wiki</a></li>
<li class="page_item page-item-33"><img src="<?php bloginfo( 'template_url' ); ?>/images/Win.png"  style="float:left;margin-right:10px;" width="50px"  /><a href="http://www.tickervalue.com/featured/learn/templates/"  style="<?php if(is_page(33)) echo 'color:#0088CC !important;' ?>">Templates</a></li>
<li class="page_item page-item-37"><img src="<?php bloginfo( 'template_url' ); ?>/images/Picture.png"  style="float:left;margin-right:10px;" width="50px"  /><a href="http://www.tickervalue.com/featured/learn/graphics/"  style="<?php if(is_page(37)) echo 'color:#0088CC !important;' ?>">Graphics</a></li>
  </ul>
  <ul>
  <?php //echo $children; ?>
  </ul>
  <?php } ?>	
  
 
  <?php
  if (is_page(array(39,43,41,45,47))) { ?>  
  <ul>
  <li class="page_item page-item-43"><img src="<?php bloginfo( 'template_url' ); ?>/images/Close.png"  style="float:left;margin-right:10px;" width="50px"  /><a href="http://www.tickervalue.com/featured/support/bugs/" style="<?php if(is_page(43)) echo 'color:#0088CC !important;' ?>">Bugs</a></li>
<li class="page_item page-item-41"><img src="<?php bloginfo( 'template_url' ); ?>/images/Info.png"  style="float:left;margin-right:10px;" width="50px"  /><a href="http://www.tickervalue.com/featured/support/faq/"  style="<?php if(is_page(41)) echo 'color:#0088CC !important;' ?>">FAQ</a></li>
<li class="page_item page-item-45"><img src="<?php bloginfo( 'template_url' ); ?>/images/Help.png"  style="float:left;margin-right:10px;" width="50px"  /><a href="http://www.tickervalue.com/featured/support/help/"  style="<?php if(is_page(45)) echo 'color:#0088CC !important;' ?>">Help</a></li>
<li class="page_item page-item-47"><img src="<?php bloginfo( 'template_url' ); ?>/images/Mail.png"  style="float:left;margin-right:10px;" width="50px"  /><a href="http://www.tickervalue.com/featured/support/contact/"  style="<?php if(is_page(47)) echo 'color:#0088CC !important;' ?>">Contact</a></li>
  </ul>
  
   <?php } ?>	
  
   
<?php  dynamic_sidebar( 'SidebarResize' ); ?>
  
  
   
  
  
  
  
  
  
  
  
</div>  
<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>						
<div id="maintextsingleright">	

	<h1 <?php if(is_page('10')){echo "style='margin-left:30px;'";} ?>><?php the_title(); ?>	</h1>
	<?php 
	
	
	
	the_content(); 
	
 
	
	
	?>
<br><br><br>
<?php if(function_exists('kc_add_social_share')) kc_add_social_share(); ?>
	
</div>

	
<?php

endwhile;
 
?>
 

						</div><!-- end main -->
				 
	
 
					</div><!-- end wrapper -->

 
 <div style="clear:both;height:10px;"></div>	
 

 
 </div>	
 
 
 
 
 
 
 
 </div>

 <?php wp_footer(); ?>	
<div id="footerleft"> </div>	

	</body>
</html>
 
