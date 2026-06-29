
<?php get_header(); ?>

  
 
						<div id="main">
 
<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>						
<div id="maintextsing">	

	<h1 <?php if(is_page('10')){echo "style='margin-left:30px;'";} ?>><?php the_title(); ?>	</h1>
	<?php 
	
	
	
	the_content(); 
	
 
	
	
	?>
 
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
 
