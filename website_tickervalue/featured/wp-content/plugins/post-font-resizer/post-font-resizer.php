<?php
/*
Plugin Name: Post Font Resizer
Description: A plugin that enables visitors to resize fonts.
Version: 0.1
Plugin URI: http://saifulislam.info/my-projects/wordpress-plugins/post-font-resizer
Author: Saiful Islam
Author URI: http://www.saifulislam.info
License: GPL2
*/
global $oplinks;
$oplinks='<div style="clear:both;float:right;"><h3 style="text-align: right;"><span style="font-size: large;"><span style="color: #ff9900;"><span style="color: #000000;"><strong>Font Size</strong></span> <span style="color: #0000ff;">» </span><span style="color: #ff6600;"><a id="plustext" onclick="resizeText(1)" href="javascript:void(0);"><span style="color: #bf1616;">Large</span></a> | <a id="minustext" onclick="resizeText(-1)" href="javascript:void(0);"><span style="color: #bf1616;">Small</span></a></div><br/>';

function fr_js_enqueue() {
    echo '<script type="text/javascript">
          function resizeText(multiplier) {
            if (document.body.style.fontSize == "") {
                document.body.style.fontSize = "1.0em";
            }
            document.body.style.fontSize = parseFloat(document.body.style.fontSize) + (multiplier * 0.2) + "em";
          }
          </script>';
}


function pfr_content_filter($content){//Adds the Font resiz option
    global $oplinks;
    if(is_single()||is_page())$content=$oplinks.$content;
	return $content;
};

add_filter( 'the_content', 'pfr_content_filter' );
add_action('wp_head', 'fr_js_enqueue');
