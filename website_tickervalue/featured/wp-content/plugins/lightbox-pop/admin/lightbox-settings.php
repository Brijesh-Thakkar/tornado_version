<?php
	// Load the options
$xyz_tinymce=get_option('xyz_tinymce');
if($xyz_tinymce==1)
{
	require( dirname( __FILE__ ) . '/tinymce_filters.php' );
}
	if (isset($_POST['xyz_lbx_html']))
	{
		
		$xyz_lbx_iframe=$_POST['xyz_lbx_iframe'];
		$xyz_lbx_repeat_interval_timing=$_POST['xyz_lbx_repeat_interval_timing'];
		$xyz_lbx_html=stripslashes($_POST['xyz_lbx_html']);
$xyz_lbx_showing_option="0,0,0";
		$xyz_lbx_display_position=$_POST['xyz_lbx_display_position'];
		$xyz_lbx_top=abs(intval($_POST['xyz_lbx_top']));
	 $xyz_lbx_bottom=abs(intval($_POST['xyz_lbx_bottom']));
		$xyz_lbx_width=abs(intval($_POST['xyz_lbx_width']));
		$xyz_lbx_height=abs(intval($_POST['xyz_lbx_height']));
		  $xyz_lbx_left=abs(intval($_POST['xyz_lbx_left']));
		
		$xyz_lbx_right=abs(intval($_POST['xyz_lbx_right']));
		$xyz_lbx_delay=abs(intval($_POST['xyz_lbx_delay']));
		$xyz_lbx_page_count=abs(intval($_POST['xyz_lbx_page_count']));
		$xyz_lbx_repeat_interval=abs(intval($_POST['xyz_lbx_repeat_interval']));
		$xyz_lbx_mode=$_POST['xyz_lbx_mode'];
		$xyz_lbx_z_index=intval($_POST['xyz_lbx_z_index']);
		$xyz_lbx_opacity=abs(intval($_POST['xyz_lbx_opacity']));
		$xyz_lbx_color=$_POST['xyz_lbx_color'];
		
		 $xyz_lbx_bg_color=$_POST['xyz_lbx_bg_color'];		
		$xyz_lbx_corner_radius=abs(intval($_POST['xyz_lbx_corner_radius']));
		$xyz_lbx_top_dim=$_POST['xyz_lbx_top_dim'];
		$xyz_lbx_left_dim=$_POST['xyz_lbx_left_dim'];
		$xyz_lbx_right_dim=$_POST['xyz_lbx_right_dim'];
		$xyz_lbx_bottom_dim=$_POST['xyz_lbx_bottom_dim'];
		$xyz_lbx_width_dim=$_POST['xyz_lbx_width_dim'];
		$xyz_lbx_height_dim=$_POST['xyz_lbx_height_dim'];
                $xyz_lbx_border_color=$_POST['xyz_lbx_border_color'];
//$xyz_lbx_border_dim=$_POST['xyz_lbx_border_dim'];
		$xyz_lbx_border_width=abs(intval($_POST['xyz_lbx_border_width']));
		$xyz_lbx_page_option=$_POST['xyz_lbx_page_option'];
		$xyz_lbx_close_button_option=$_POST['xyz_lbx_close_button_option'];
		$xyz_lbx_positioning=$_POST['xyz_lbx_positioning'];
		$xyz_lbx_position_predefined=$_POST['xyz_lbx_position_predefined'];
		
		
		
		if($xyz_lbx_page_option==2)
		{
			$lbx_pgf=0;
			$lbx_pof=0;
			$lbx_hp=0;
			if(isset($_POST['xyz_lbx_pages']))
				$lbx_pgf=1;
			if(isset($_POST['xyz_lbx_posts']))
				$lbx_pof=1;
			if(isset($_POST['xyz_lbx_hp']))
				$lbx_hp=1;
		
			$xyz_lbx_showing_option=$lbx_pgf.",".$lbx_pof.",".$lbx_hp;
		
			update_option('xyz_lbx_showing_option',$xyz_lbx_showing_option);
		
		}
		
$old_page_count=get_option('xyz_lbx_page_count');
$old_repeat_interval=get_option('xyz_lbx_repeat_interval');
if(isset($_POST['xyz_lbx_cookie_resett']))
{
?>	
	<script language="javascript">

 var cookie_date = new Date ( );  // current date & time
 cookie_date.setTime ( cookie_date.getTime() - 1 );

  document.cookie = "_xyz_lbx_pc=; expires=" + cookie_date.toGMTString()+ ";path=/";
  document.cookie = "_xyz_lbx_until=; expires=" + cookie_date.toGMTString()+ ";path=/";


</script>
	
	
<?php 	
}
		
		update_option('xyz_lbx_html',$xyz_lbx_html);
		update_option('xyz_lbx_top',$xyz_lbx_top);
		update_option('xyz_lbx_width',$xyz_lbx_width);
		update_option('xyz_lbx_right',$xyz_lbx_right);
		update_option('xyz_lbx_bottom',$xyz_lbx_bottom);
		update_option('xyz_lbx_height',$xyz_lbx_height);
		update_option('xyz_lbx_left',$xyz_lbx_left);
		update_option('xyz_lbx_delay',$xyz_lbx_delay);
		update_option('xyz_lbx_page_count',$xyz_lbx_page_count);
		update_option('xyz_lbx_repeat_interval',$xyz_lbx_repeat_interval);
		update_option('xyz_lbx_repeat_interval_timing',$xyz_lbx_repeat_interval_timing);
		update_option('xyz_lbx_mode',$xyz_lbx_mode);
		update_option('xyz_lbx_z_index',$xyz_lbx_z_index);
		update_option('xyz_lbx_opacity',$xyz_lbx_opacity);
		update_option('xyz_lbx_color',$xyz_lbx_color);
		update_option('xyz_lbx_corner_radius',$xyz_lbx_corner_radius);
		update_option('xyz_lbx_top_dim',$xyz_lbx_top_dim);
		update_option('xyz_lbx_height_dim',$xyz_lbx_height_dim);	
		update_option('xyz_lbx_left_dim',$xyz_lbx_left_dim);
		update_option('xyz_lbx_bottom_dim',$xyz_lbx_bottom_dim);
		update_option('xyz_lbx_right_dim',$xyz_lbx_right_dim);

		update_option('xyz_lbx_width_dim',$xyz_lbx_width_dim);
		update_option('xyz_lbx_border_color',$xyz_lbx_border_color);

//update_option('xyz_lbx_border_dim',$xyz_lbx_border_dim);
		update_option('xyz_lbx_border_width',$xyz_lbx_border_width);
		update_option('xyz_lbx_bg_color',$xyz_lbx_bg_color);
		update_option('xyz_lbx_page_option',$xyz_lbx_page_option);
		update_option('xyz_lbx_close_button_option',$xyz_lbx_close_button_option);
		update_option('xyz_lbx_iframe',$xyz_lbx_iframe);
	
		update_option('xyz_lbx_display_position',$xyz_lbx_display_position);
		
		update_option('xyz_lbx_positioning',$xyz_lbx_positioning);
		
		
			update_option('xyz_lbx_position_predefined',$xyz_lbx_position_predefined);
		
		?><br>
		
<div  class="system_notice_area_style1" id="system_notice_area">Settings updated successfully.<span id="system_notice_area_dismiss">Dismiss</span></div>
<?php
}


?>
<style type="text/css">
label{
cursor:default;


}
</style>
<script type="text/javascript">
 
  jQuery(document).ready(function() {
    jQuery('#lbxcolorpicker').hide();
    jQuery('#lbxcolorpicker').farbtastic("#xyz_lbx_color");
    jQuery("#xyz_lbx_color").click(function(){jQuery('#lbxcolorpicker').slideToggle();});
    jQuery('#lbxbordercolorpicker').hide();
    jQuery('#lbxbordercolorpicker').farbtastic("#xyz_lbx_border_color");
    jQuery("#xyz_lbx_border_color").click(function(){jQuery('#lbxbordercolorpicker').slideToggle();});
    
    jQuery('#lbxbgcolorpicker').hide();
    jQuery('#lbxbgcolorpicker').farbtastic("#xyz_lbx_bg_color");
    jQuery("#xyz_lbx_bg_color").click(function(){jQuery('#lbxbgcolorpicker').slideToggle();});
   
    
  });
  function bgchange()
  {
	  var v;
v=document.getElementById('xyz_lbx_page_option').value;
if(v==1)
{
	document.getElementById('automatic').style.display='block';
	document.getElementById('shopt').style.display='none';	
	document.getElementById('shortcode').style.display='none';		
}
if(v==2)
{
	document.getElementById('shopt').style.display='block';
	document.getElementById('shortcode').style.display='none';
	document.getElementById('automatic').style.display='none';	
}
if(v==3)

{
	document.getElementById('shortcode').style.display='block';	
	document.getElementById('shopt').style.display='none';	
	document.getElementById('automatic').style.display='none';
}
  }
  function cdcheck()
  {

	 var display_mech;
	 display_mech=document.getElementById('xyz_lbx_mode').value;
	 if(display_mech=="delay_only")
	 {
		 
		 document.getElementById('xyz_lbx_delaysec').style.display='';
		 document.getElementById('xyz_lbx_pages').style.display='none';
	 }
	 if(display_mech=="page_count_only")
	 {
		 
		 document.getElementById('xyz_lbx_delaysec').style.display='none';
		 document.getElementById('xyz_lbx_pages').style.display='';
	 }
	 if(display_mech=="both")
	 {
		 
		 document.getElementById('xyz_lbx_delaysec').style.display='';
		 document.getElementById('xyz_lbx_pages').style.display='';
	 }


  }

  function lbxdispcoord()
  {
	  var disp_position;
	 disp_position=document.getElementById('xyz_lbx_display_position').value;
	

	
if(disp_position==1)
{
	 document.getElementById('xyz_lbx_pos_left').style.display='';	
	 document.getElementById('xyz_lbx_pos_top').style.display='';
	 document.getElementById('xyz_lbx_pos_right').style.display='none';	
	 document.getElementById('xyz_lbx_pos_bottom').style.display='none';
}

if(disp_position==2)
{
	 document.getElementById('xyz_lbx_pos_left').style.display='none';	
	 document.getElementById('xyz_lbx_pos_top').style.display='';
	 document.getElementById('xyz_lbx_pos_right').style.display='';	
	 document.getElementById('xyz_lbx_pos_bottom').style.display='none';
}
if(disp_position==3)
{
	 document.getElementById('xyz_lbx_pos_left').style.display='';	
	 document.getElementById('xyz_lbx_pos_top').style.display='none';
	 document.getElementById('xyz_lbx_pos_right').style.display='none';	
	 document.getElementById('xyz_lbx_pos_bottom').style.display='';
}
if(disp_position==4)
{
	 document.getElementById('xyz_lbx_pos_left').style.display='none';	
	 document.getElementById('xyz_lbx_pos_top').style.display='none';
	 document.getElementById('xyz_lbx_pos_right').style.display='';	
	 document.getElementById('xyz_lbx_pos_bottom').style.display='';
}



	
  }
  function lbxdisplaydef()
  {
	  var disp_positioning;
	 disp_positioning=document.getElementById('xyz_lbx_positioning').value;
		
		 
			 document.getElementById('xyz_lbx_position').style.display='';
			 if(disp_positioning==1)
			 {
				 document.getElementById('xyz_lbx_predefined').style.display='none';
				 document.getElementById('xyz_lbx_display_pos').style.display=''; 
				 lbxdispcoord();
				 
			 }
			 else

			 {	

				 document.getElementById('xyz_lbx_predefined').style.display='';
				 document.getElementById('xyz_lbx_display_pos').style.display='none';
				 
				 document.getElementById('xyz_lbx_pos_left').style.display='none';	
				 document.getElementById('xyz_lbx_pos_top').style.display='none';
				 document.getElementById('xyz_lbx_pos_right').style.display='none';	
				 document.getElementById('xyz_lbx_pos_bottom').style.display='none';
				
				 document.getElementById('xyz_lbx_pos_width').style.display='';	
				 document.getElementById('xyz_lbx_pos_height').style.display='';
				
		 }
 
  }
</script>
<div >
<?php  $xyz_lbx_top_dim=get_option('xyz_lbx_top_dim');
$xyz_lbx_left_dim=get_option('xyz_lbx_left_dim');
$xyz_lbx_right_dim=get_option('xyz_lbx_right_dim');
$xyz_lbx_bottom_dim=get_option('xyz_lbx_bottom_dim');
$xyz_lbx_height_dim=get_option('xyz_lbx_height_dim');
$xyz_lbx_width_dim=get_option('xyz_lbx_width_dim');
$xyz_lbx_close_button_option=get_option('xyz_lbx_close_button_option');
$xyz_lbx_cookie_resett=get_option('xyz_lbx_cookie_resett');
$xyz_lbx_iframe=get_option('xyz_lbx_iframe');

$xyz_lbx_display_position=get_option('xyz_lbx_display_position');
$xyz_lbx_positioning=get_option('xyz_lbx_positioning');
$xyz_lbx_position_predefined=get_option('xyz_lbx_position_predefined');

?>
<h2>Lightbox Settings</h2>
<form method="post" >
<?php 
$xyz_lbx_showing_option=get_option('xyz_lbx_showing_option');
$xyz_lbx_sh_arr=explode(",", $xyz_lbx_showing_option);
?>
<table  class="widefat" style="width:98%">
<tr valign="top" >
<td  scope="row" style="width: 50%" ><h3>  Content</h3></td>
<td></td>
</tr>
<tr valign="top">

<td scope="row" colspan="1"><label for="lbx_referar_message_show_option">Show referrer URL based messages? </label></td><td style="color: red; ">Available in premium version only </td>
</tr>



<tr valign="top" >
<td colspan="2" >

<?php the_editor(get_option('xyz_lbx_html'),'xyz_lbx_html');?></td>
</tr>

<tr valign="top" id="xyz_lbx_pos"><td scope="row" colspan="2"><h3> Position Settings</h3></td></tr>
<tr valign="top" id="xyz_lbx_position">
<td scope="row"><label for="xyz_lbx_positioning">Positioning</label></td>
<td><select  name="xyz_lbx_positioning"   id="xyz_lbx_positioning"  onchange="lbxdisplaydef()">
<option value ="1" <?php if($xyz_lbx_positioning=='1') echo 'selected'; ?>>Manually edit</option>
<option value ="2" <?php if($xyz_lbx_positioning=='2') echo 'selected'; ?>>Predefined settings</option>

</select></td>
</tr>
<tr valign="top" id="xyz_lbx_display_pos">

<td scope="row" colspan="1"><label for="xyz_lbx_display_position"> Display Position </label></td><td>


<select name="xyz_lbx_display_position" id="xyz_lbx_display_position"  onchange="lbxdispcoord()">

<option value ="1" <?php if($xyz_lbx_display_position=='1') echo 'selected'; ?> >From  Top Left</option>

<option value ="2" <?php if($xyz_lbx_display_position=='2') echo 'selected'; ?> >From Top Right </option>
<option value ="3" <?php if($xyz_lbx_display_position=='3') echo 'selected'; ?> >From Bottom Left</option>
<option value ="4" <?php if($xyz_lbx_display_position=='4') echo 'selected'; ?> >From Bottom Right</option>
</select>
</td>

</tr>
<tr valign="top" id="xyz_lbx_predefined">

<td scope="row" colspan="1"><label for="xyz_lbx_position_predefined">Choose a predefined position </label>	</td><td>


<select name="xyz_lbx_position_predefined" id="xyz_lbx_position_predefined"  >

<option value ="1" <?php if($xyz_lbx_position_predefined=='1') echo 'selected'; ?> >On top left corner </option>

<option value ="2" <?php if($xyz_lbx_position_predefined=='2') echo 'selected'; ?> >On left center </option>
<option value ="3" <?php if($xyz_lbx_position_predefined=='3') echo 'selected'; ?> >On bottom left cornor</option>


<option value ="4" <?php if($xyz_lbx_position_predefined=='4') echo 'selected'; ?> >On bottom center </option>

<option value ="5" <?php if($xyz_lbx_position_predefined=='5') echo 'selected'; ?> >On bottom right corner </option>
<option value ="6" <?php if($xyz_lbx_position_predefined=='6') echo 'selected'; ?> >On right center</option>
<option value ="7" <?php if($xyz_lbx_position_predefined=='7') echo 'selected'; ?> >On top right corner </option>

<option value ="8" <?php if($xyz_lbx_position_predefined=='8') echo 'selected'; ?> >On top center </option>
<option value ="9" <?php if($xyz_lbx_position_predefined=='9') echo 'selected'; ?> >Absolute center</option>
</select>
</td>

</tr>
<tr valign="top" id="xyz_lbx_pos_top">
<td scope="row"><label for="xyz_lbx_top"> Top coordinate</label></td>
<td><input name="xyz_lbx_top" type="text" id="xyz_lbx_top"  value="<?php print(get_option('xyz_lbx_top')); ?>" size="40" /><select  name="xyz_lbx_top_dim"   id="xyz_lbx_top_dim" >
<option value ="px" <?php if($xyz_lbx_top_dim=='px') echo 'selected'; ?>>px</option>
<option value ="%" <?php if($xyz_lbx_top_dim=='%') echo 'selected'; ?>>%</option>

</select></td>
</tr>
<tr valign="top" id="xyz_lbx_pos_left">
<td scope="row"><label for="xyz_lbx_left"> Left coordinate</label></td>
<td><input name="xyz_lbx_left" type="text" id="xyz_lbx_left"  value="<?php print(get_option('xyz_lbx_left')); ?>" size="40" /><select  name="xyz_lbx_left_dim"   id="xyz_lbx_left_dim" >
<option value ="px" <?php if($xyz_lbx_left_dim=='px') echo 'selected'; ?>>px</option>
<option value ="%" <?php if($xyz_lbx_left_dim=='%') echo 'selected'; ?>>%</option>

</select></td>
</tr>

<tr valign="top" id="xyz_lbx_pos_right">
<td scope="row"><label for="xyz_lbx_right"> Right coordinate</label></td>
<td><input name="xyz_lbx_right" type="text" id="xyz_lbx_right"  value="<?php print(get_option('xyz_lbx_right')); ?>" size="40" /><select  name="xyz_lbx_right_dim"   id="xyz_lbx_right_dim" >
<option value ="px" <?php if($xyz_lbx_right_dim=='px') echo 'selected'; ?>>px</option>
<option value ="%" <?php if($xyz_lbx_right_dim=='%') echo 'selected'; ?>>%</option>

</select></td>
</tr>
<tr valign="top" id="xyz_lbx_pos_bottom">
<td scope="row"><label for="xyz_lbx_bottom"> Bottom coordinate</label></td>
<td><input name="xyz_lbx_bottom" type="text" id="xyz_lbx_bottom"  value="<?php print(get_option('xyz_lbx_bottom')); ?>" size="40" /><select  name="xyz_lbx_bottom_dim"   id="xyz_lbx_bottom_dim" >
<option value ="px" <?php if($xyz_lbx_bottom_dim=='px') echo 'selected'; ?>>px</option>
<option value ="%" <?php if($xyz_lbx_bottom_dim=='%') echo 'selected'; ?>>%</option>

</select></td>
</tr>
<tr valign="top" id="xyz_lbx_pos_width">
<td scope="row"><label for="xyz_lbx_width"> Width</label></td>
<td><input name="xyz_lbx_width" type="text" id="xyz_lbx_width"  value="<?php print(get_option('xyz_lbx_width')); ?>" size="40" /><select  name="xyz_lbx_width_dim"   id="xyz_lbx_width_dim" >
<option value ="px" <?php if($xyz_lbx_width_dim=='px') echo 'selected'; ?>>px</option>
<option value ="%" <?php if($xyz_lbx_width_dim=='%') echo 'selected'; ?>>%</option>

</select>
</td>
</tr>
<tr valign="top" id="xyz_lbx_pos_height">
<td scope="row"><label for="xyz_lbx_height"> Height</label></td>
<td><input name="xyz_lbx_height" type="text" id="xyz_lbx_height"  value="<?php print(get_option('xyz_lbx_height')); ?>" size="40" /><select  name="xyz_lbx_height_dim"   id="xyz_lbx_height_dim" >
<option value ="px" <?php if($xyz_lbx_height_dim=='px') echo 'selected'; ?>>px</option>
<option value ="%" <?php if($xyz_lbx_height_dim=='%') echo 'selected'; ?>>%</option>

</select></td>
</tr>
<?php
$xyz_lbx_mode=get_option('xyz_lbx_mode');
$xyz_lbx_page_option=get_option('xyz_lbx_page_option');
$xyz_lbx_repeat_interval_timing=get_option('xyz_lbx_repeat_interval_timing');
?>
<tr valign="top"><td scope="row" colspan="2"><h3> Display Logic Settings</h3></td></tr>
<tr valign="top">
<td scope="row"><label for="xyz_lbx_mode"> Display logic </label></td>
<td><select  name="xyz_lbx_mode"   id="xyz_lbx_mode"  onchange="cdcheck()">
<option value ="delay_only" <?php if($xyz_lbx_mode=='delay_only') echo 'selected'; ?>>Based on delay </option>
<option value ="page_count_only" <?php if($xyz_lbx_mode=='page_count_only') echo 'selected'; ?>>Based on  number of pages browsed </option>
<option value ="both" <?php if($xyz_lbx_mode=='both') echo 'selected'; ?>>Based on both </option>
</select></td>
</tr>
<tr valign="top" id="xyz_lbx_delaysec">
<td scope="row"><label for="xyz_lbx_delay"> Delay in seconds before popup appears </label></td>
<td><input name="xyz_lbx_delay" type="text" id="xyz_lbx_delay"  value="<?php print(get_option('xyz_lbx_delay')); ?>" size="40" /> sec</td>
</tr>

<tr valign="top" id="xyz_lbx_pages">
<td scope="row"><label for="xyz_lbx_page_count">Number of pages to browse before popup appears</label></td>
<td><input name="xyz_lbx_page_count" type="text" id="xyz_lbx_page_count"  value="<?php print(get_option('xyz_lbx_page_count')); ?>" size="40" /> pages</td>
</tr>
<tr valign="top">
<td scope="row"><label for="xyz_lbx_repeat_interval"> Repeat interval for a user </label></td>
<td ><input name="xyz_lbx_repeat_interval" type="text" id="xyz_lbx_repeat_interval"  value="<?php print(get_option('xyz_lbx_repeat_interval')); ?>" size="40" /> 

<select name="xyz_lbx_repeat_interval_timing" id="xyz_lbx_repeat_interval_timing" >
<option value ="1" <?php if($xyz_lbx_repeat_interval_timing=='1') echo 'selected'; ?> >Hrs </option>

<option value ="2" <?php if($xyz_lbx_repeat_interval_timing=='2') echo 'selected'; ?> >Minutes </option>
</select>
</td>

</tr>
<tr valign="top" >
<td scope="row" colspan="1"><label for="lbx_display_trigger"> Display trigger</label></td><td style="color: red; ">Available in premium version only </td></tr>
				<tr valign="top" id="xyz_lbx_close">

<td scope="row" colspan="1"><label for="xyz_lbx_bgimage_option"> Close button option </label></td><td>


<select name="xyz_lbx_close_button_option" id="xyz_lbx_close_button_option"  >

<option value ="1" <?php if($xyz_lbx_close_button_option=='1') echo 'selected'; ?> >Yes </option>

<option value ="0" <?php if($xyz_lbx_close_button_option=='0') echo 'selected'; ?> >No </option>
</select>
</td>

</tr>
<tr valign="top">

<td scope="row" colspan="1"><label for="xyz_lbx_bgimage_option">Display as iframe </label></td><td>


<select name="xyz_lbx_iframe" id="xyz_lbx_iframe"  >

<option value ="1" <?php if($xyz_lbx_iframe=='1') echo 'selected'; ?> >Yes </option>

<option value ="0" <?php if($xyz_lbx_iframe=='0') echo 'selected'; ?> >No </option>
</select>
</td>

</tr>

<tr valign="top">

<td scope="row" colspan="1"><label for="lbx_display_device">Target display devices </label></td><td style="color: red; ">Available in premium version only </td></tr>
<tr valign="top"><td scope="row" colspan="2"><h3> Popup Closing Settings</h3></td></tr>




<tr valign="top" id="lbx_close" >

<td scope="row" colspan="1"><label for="lbx_bgimage_option"> Close mode </label></td><td style="color: red; ">Available in premium version only </td></tr>
<tr valign="top" >

<td scope="row" colspan="1"><label for="lbx_bgimage_option"> Auto close after timeout </label></td><td style="color: red; ">Available in premium version only </td></tr>
<tr valign="top"><td scope="row" colspan="2"><h3> Javascript Callback Settings</h3></td></tr>
<tr valign="top">
<td scope="row"><label for="lbx_show_callback">Callback on popup display</label></td>
<td style="color: red; ">Available in premium version only </td>
</tr>
<tr valign="top">
<td scope="row"><label for="lbx_hide_callback">Callback on popup hide</label></td>
<td style="color: red; ">Available in premium version only </td>
</tr>
<tr valign="top"><td scope="row" colspan="2"><h3> Style Settings</h3></td></tr>
<tr valign="top">
<td scope="row"><label for="xyz_lbx_z_index"> Z index</label></td>
<td><input name="xyz_lbx_z_index" type="text" id="xyz_lbx_z_index"  value="<?php print(get_option('xyz_lbx_z_index')); ?>" size="40" /> </td>
</tr>
<tr valign="top" id="xyz_lbx_overopa">
<td scope="row"><label for="xyz_lbx_opacity"> Overlay opacity(0-100)</label></td>
<td><input name="xyz_lbx_opacity" type="text" id="xyz_lbx_opacity" value="<?php print(get_option('xyz_lbx_opacity')); ?>" size="40" /> </td>
</tr>
<tr valign="top" id="xyz_lbx_overcl">
<td scope="row"><label for="xyz_lbx_color"> Overlay color</label></td>
<td><input name="xyz_lbx_color" type="text" id="xyz_lbx_color"  value="<?php print(get_option('xyz_lbx_color')); ?>" size="40" /> <div id="lbxcolorpicker"></div> </td>
</tr>
<tr valign="top" id="lbx_bg_opt">

<td scope="row" colspan="1"><label for="lbx_bgimage_option"> Overlay image option</label></td><td style="color:red; ">Available in premium version only </td></tr>
<tr valign="top" >
<td scope="row"><label for="xyz_lbx_bg_color"> Background color</label></td>
<td><input name="xyz_lbx_bg_color" type="text" id="xyz_lbx_bg_color"  value="<?php print(get_option('xyz_lbx_bg_color')); ?>" size="40" /> <div id="lbxbgcolorpicker"></div> </td>
</tr>
<tr valign="top">
<td scope="row"><label for="xyz_lbx_border_color"> Border color</label></td>
<td><input name="xyz_lbx_border_color" type="text" id="xyz_lbx_border_color"  value="<?php print(get_option('xyz_lbx_border_color')); ?>" size="40" /> <div id="lbxbordercolorpicker"></div> </td>
</tr>
<tr valign="top">
<td scope="row"><label for="xyz_lbx_border_width">  Border  width </label></td>
<td><input name="xyz_lbx_border_width" type="text" id="xyz_lbx_border_width"  value="<?php print(get_option('xyz_lbx_border_width')); ?>" size="40" /> 

<!-- <select  name="xyz_lbx_top_dim"   id="xyz_lbx_top_dim" >
<option value ="px" <?php if($xyz_lbx_border_dim=='px') echo 'selected'; ?>>px</option>
<option value ="%" <?php if($xyz_lbx_border_dim=='%') echo 'selected'; ?>>%</option>
</select>-->
px



 </td>
</tr>
<tr valign="top" id="xyz_lbx_rad">
<td scope="row"><label for="xyz_lbx_corner_radius">  Border  radius </label></td>
<td><input name="xyz_lbx_corner_radius" type="text" id="xyz_lbx_corner_radius"  value="<?php print(get_option('xyz_lbx_corner_radius')); ?>" size="40" /> px </td>
</tr>

<tr valign="top"><td scope="row" colspan="2"><h3> Placement Settings</h3></td></tr>


<tr valign="top" id="pgopt" ><td scope="row"><label for="xyz_lbx_page_option"> Placement mechanism </label></td>
<td>
<select name="xyz_lbx_page_option" id="xyz_lbx_page_option" onchange="bgchange()">
<option value ="1" <?php if($xyz_lbx_page_option=='1') echo 'selected'; ?> >Automatic </option>
<option value ="2" <?php if($xyz_lbx_page_option=='2') echo 'selected'; ?> >Specific Pages</option>
<option value ="3" <?php if($xyz_lbx_page_option=='3') echo 'selected'; ?> >Manual </option>
</select></td></tr>


<tr valign="top" ><td scope="row" ></td><td>
<span  id="automatic" >Popup will load in all pages</span>
<span  id="shopt" >
<input name="xyz_lbx_pages" value="<?php echo $xyz_lbx_sh_arr[0];?>"<?php if($xyz_lbx_sh_arr[0]==1){?> checked="checked"<?php } ?> type="checkbox"> On Pages 
<input name="xyz_lbx_posts" value="<?php echo $xyz_lbx_sh_arr[1];?>"<?php if($xyz_lbx_sh_arr[1]==1){?> checked="checked"<?php }?>  type="checkbox"> On Posts
<input name="xyz_lbx_hp" value="<?php echo $xyz_lbx_sh_arr[2];?>"<?php if($xyz_lbx_sh_arr[2]==1){?> checked="checked"<?php }?>  type="checkbox"> On Home page 
</span>
<span  id="shortcode" >Use this short code in your pages - [xyz_lbx_default_code]</span>
</td>
</tr>



<!--  <tr valign="top" id="automatic"  style="display: none"><td scope="row" ></td><td >(Popup will load in all pages)</td>
</tr>
<tr valign="top" id="shortcode"  style="display: none"><td scope="row"></td><td>Use this short code in your pages - [xyz_lbx_default_code]</td>
</tr>-->


<tr valign="top">
<td scope="row"><label for="xyz_lcookie_resett"><h3>Reset cookies ? </h3>
 </label></td>
<td><input name="xyz_lbx_cookie_resett" type="checkbox" id="xyz_lbx_cookie_resett"   <?php  echo 'checked'; ?> /> 
(This is just for your testing purpose. If you want to see a popup  immediately after you make changes in any settings, you have to reset the cookies.)
 </td>
</tr>
<tr>
<td scope="row"> </td>
<td><br>
<input type="submit" value=" Update Settings " /></td>
</tr>

</table>


</form>

</div>

<script type="text/javascript">
bgchange();
cdcheck();
lbxdisplaydef();
</script>
