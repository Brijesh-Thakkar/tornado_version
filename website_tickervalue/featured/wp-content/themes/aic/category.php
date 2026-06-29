<?php get_header(); ?>

  
		 
						<div id="main">
<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>						
<div id="maintextsingle">	

	<h1><?php the_title(); ?>	</h1>
	<?php 
	
	
	
	the_content(); 
	
	 
	
	
	?>
	<?php if(function_exists('kc_add_social_share')) kc_add_social_share(); ?>
	
</div>
 
<?php

endwhile;
 
?>

			 
	<div class="oldernewer">
		<p class="older"><?php next_posts_link('&laquo; Older Entries') ?></p>
		<p class="newer"><?php previous_posts_link('Newer Entries &raquo;') ?></p>
	</div><!--.oldernewer-->
 
			

<?php get_sidebar(); ?>		 

						 

			 
		 


				</div> <!-- end contentarea -->

			</div><!-- back -->
 
 <div style="clear:both;height:10px;"></div>	
 

 
 </div>	
 
 
 
 
 
 
 
 </div>

 <?php wp_footer(); ?>	
<div id="footerleft"> </div>	

	</body>
</html>
 
