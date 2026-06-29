<?php
function cashie_install ()
{
   global $wpdb, $cashie_partner, $cashie_partner_options_handle;

   if(!get_option($cashie_partner_options_handle))
   {
     add_option($cashie_partner_options_handle, $cashie_partner);
   }
}
?>