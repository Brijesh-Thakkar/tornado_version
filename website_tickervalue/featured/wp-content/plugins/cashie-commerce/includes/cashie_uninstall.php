<?php
function cashie_uninstall()
{
    global $wpdb, $cashie_options_handle;

    delete_option($cashie_options_handle);
}
?>