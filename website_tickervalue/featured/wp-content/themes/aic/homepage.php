<?php
/*
Template Name:Home Page
*/
?>
<?php get_header(); ?>

 
	 

						<div id="main" style="margin-top:50px;">
<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>						
<div id="maintexthome">	

	<h1 style="font-size:45px !important;"><?php the_title(); ?>	</h1>
	<?php the_content(); ?>
</div>
<div id="videohome">	
	 <iframe width="560" height="315" src="<?php echo get_post_meta($post->ID, 'youtube', true) ?>" frameborder="0" allowfullscreen></iframe>
	<br>  <A href="<?php echo get_post_meta($post->ID, 'buy', true) ?>"><img src="<?php bloginfo( 'template_url' ); ?>/images/itunes.png" style="width: 150px; margin-top: 10px; float: right; margin-right: 210px;" /></a>
</div>
<?php

endwhile;
 
?>
		 

						 
			</div><!-- back --></div><!-- back -->
 
 
 <div style="clear:both;height:10px;"></div>	
 

 
 </div>	
 
 
 
 
 
 
 
 </div>

 <?php wp_footer(); ?>	
<div id="footerleft"> </div>	

	</body>
</html>
 