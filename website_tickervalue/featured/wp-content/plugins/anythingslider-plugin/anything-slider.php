<?php
/*
  Plugin Name: Anything Slider
  Plugin URI: http://di-side.com/wordpress-plugins/anything-slider
  Description: Anything Slider for Wordpress
  Version: 1.0
  Author: Pietrino Atzeni
  Author URI: http://di-side.com
  License: GPL2

  Copyright 2011 Di-SiDE (info@di-side.com)

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 2 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
 */

register_activation_hook(__FILE__, 'wp_anythingslider_activate');
function wp_anythingslider_activate() {
  $settings = getAnythingSliderSettings();
  foreach ($settings as $setting) {
    add_option('wp_anythingslider_' . $setting[0], $setting[3]);
  }
}

add_action('admin_menu', 'wp_anythingslider_add_menu');
function wp_anythingslider_add_menu() {
  $page = add_options_page('Anything Slider', 'Anything Slider', 'administrator', 'wp_anythingslider_menu', 'wp_anythingslider_menu_function');
}
function wp_anythingslider_menu_function() {
  ?>

  <div class="wrap">
    <h2>Anything Slider</h2>
    <form method="post" action="options.php">
  <?php settings_fields('wp_anythingslider_settings'); ?>
      <table class="form-table">
      <?php $settings = getAnythingSliderSettings(); ?>
      <?php foreach ($settings as $setting) : ?>
        <tr valign="top">
          <th scope="row"><?php echo $setting[0]; ?></th>
          <td>
          <?php if ($setting[1] == 'boolean') : ?>
            <?php $selected = get_option('wp_anythingslider_' . $setting[0]) == 'true'; ?>
            <?php $checked = $selected ? ' checked="checked"' : ''; ?>
            <input type="checkbox" value="true" 
              name="wp_anythingslider_<?php echo $setting[0]; ?>" 
              <?php echo $checked; ?> />
          <?php else : ?>
            <input type="text" name="wp_anythingslider_<?php echo $setting[0]; ?>" 
              id="wp_anythingslider_<?php echo $setting[0]; ?>" size="20" 
              value="<?php echo get_option('wp_anythingslider_' . $setting[0]); ?>" />
          <?php endif  ?>
          </td>
        </tr>
        <tr valign="top">
          <td scope="row">Default: <strong><?php echo htmlentities($setting[3]); ?></strong></td>
          <td>Example: <strong><?php echo htmlentities($setting[4]); ?></strong></td>
        </tr>      
      <?php endforeach; ?>
      </table>

      <p class="submit">
        <input type="submit" class="button-primary" value="<?php _e('Save Changes') ?>" />
      </p>
    </form>
  </div>

<?php 

}

add_action('admin_init', 'wp_anythingslider_init');
function wp_anythingslider_init() {
  $settings = getAnythingSliderSettings();
  foreach ($settings as $setting) {
    register_setting('wp_anythingslider_settings', 'wp_anythingslider_' . $setting[0]);
  }
}


wp_enqueue_script('jquery.easing', 
  WP_PLUGIN_URL . '/wp-anything-slider/js/jquery.easing.1.2.js', 
  array('jquery'), '1.2', true);
wp_enqueue_script('anythingslider', 
  WP_PLUGIN_URL . '/wp-anything-slider/js/jquery.anythingslider.js', 
  array('jquery'), '1.5.17', true);
wp_enqueue_script('anythingslider.fx', 
  WP_PLUGIN_URL . '/wp-anything-slider/js/jquery.anythingslider.fx.js', 
  array('jquery'), '1.3', true);
wp_enqueue_style('anythingslider.styles', 
  WP_PLUGIN_URL . '/wp-anything-slider/css/anythingslider.css');

function show_anythingslider() {
  $options = array();
  $settings = getAnythingSliderSettings();

  foreach ($settings as $setting) {
    $name = 'wp_anythingslider_' . $setting[0];
    $value = get_option($name);

    if ($setting[1] === 'boolean')
      $value = $value == 'true' ? 'true' : 'false';

    if (!empty($value) && $value != $setting[3])
      $options[] = sprintf('%s: %s', $setting[0], ($setting[1] == 'string' ? "'" . $value . "'" : $value));
  }

  ?>

  <script type="text/javascript">
    jQuery(function($) {
      $('.anythingslider').anythingSlider(<?php echo '{' . implode(", \n\t", $options) . "}\n"; ?>
      );
      
      $('.anythingslider img').show();
    });
  </script>

  <?php
}

function getAnythingSliderSettings() {
  $settings = array(
      // *********** Appearance ***********          
      array('width', 'integer', 'Override the default CSS width', 'null', ''),
      array('height', 'integer', 'Override the default CSS height', 'null', ''),
      array('expand', 'boolean', 'If true, the entire slider will expand to fit the parent element', 'false', 'true'),
      array('resizeContents', 'boolean', 'If true, solitary images/objects in the panel will expand to fit the viewport', 'true', 'false'),
      array('showMultiple', 'boolean', 'Set this value to a number and it will show that many slides at once', 'false', 'true'),
      array('tooltipClass', 'string', 'Class added to navigation & start/stop button (text copied to title if it is hidden by a negative text indent)', 'tooltip', ''),
      array('theme', 'string', 'Theme name; choose from: minimalist-round, minimalist-square, metallic, construction, cs-portfolio', 'default', ''),
      array('themeDirectory', 'string', 'Theme directory & filename {themeName} is replaced by the theme value above', 'css/theme-{themeName}.css', ''),
      // *********** Navigation ***********
      array('startPanel', 'Initial panel', '1', '2'),
      array('hashTags', 'boolean', 'Should links change the hashtag in the URL?', 'true', 'false'),
      array('infiniteSlides', 'boolean', 'If false, the slider will not wrap', 'true', 'false'),
      array('enableKeyboard', 'boolean', 'If false, keyboard arrow keys will not work for the current panel', 'true', 'false'),
      array('buildArrows', 'boolean', 'If true, builds the forwards and backwards buttons', 'true', 'false'),
      array('toggleArrows', 'boolean', 'If true, side navigation arrows will slide out on hovering & hide @ other times', 'false', 'true'),
      array('buildNavigation', 'boolean', 'If true, builds a list of anchor links to link to each panel', 'true', 'false'),
      array('enableNavigation', 'boolean', 'If false, navigation links will still be visible, but not clickable', 'true', 'false'),
      array('toggleControls', 'boolean', 'If true, slide in controls (navigation + play/stop button) on hover and slide change, hide @ other times', 'false', 'true'),
      array('appendControlsTo', 'string', 'A HTML element (jQuery Object, selector or HTMLNode) to which the controls will be appended if not null', 'null', ''),
      array('navigationFormatter', 'function', 'Details at the top of the file on this use (advanced use)', 'null', ''),
      array('forwardText', 'string', 'Link text used to move the slider forward (hidden by CSS, replaced with arrow image)', '&raquo;', 'Next'),
      array('backText', 'string', 'Link text used to move the slider back (hidden by CSS, replace with arrow image)', '&laquo;', 'Previous'),
      // *********** Slideshow options ***********
      array('enablePlay', 'boolean', 'If false, the play/stop button will still be visible, but not clickable', 'true', 'false'),
      array('autoPlay', 'boolean', 'This turns off the entire slideshow FUNCTIONALY, not just if it starts running or not', 'true', 'false'),
      array('autoPlayLocked', 'boolean', 'If true, user changing slides will not stop the slideshow', 'false', 'true'),
      array('startStopped', 'boolean', 'If autoPlay is on, this can force it to start stopped', 'false', 'true'),
      array('pauseOnHover', 'boolean', 'If true & the slideshow is active, the slideshow will pause on hover', 'true', 'false'),
      array('resumeOnVideoEnd', 'boolean', 'If true & the slideshow is active & a  youtube video is playing, it will pause the autoplay until the video is  complete', 'true', 'false'),
      array('stopAtEnd', 'boolean', 'If true & the slideshow is active, the  slideshow will stop on the last page. This also stops the rewind effect  when infiniteSlides is false', 'false', 'true'),
      array('playRtl', 'boolean', 'If true, the slideshow will move right-to-left', 'false', 'true'),
      array('startText', 'string', 'Start button text', 'Start', 'Play'),
      array('stopText', 'string', 'Stop button text', 'Stop', 'Pause'),
      array('delay', 'integer', 'How long between slideshow transitions in AutoPlay mode (in milliseconds)', '3000', '1000'),
      array('resumeDelay', 'integer', 'Resume slideshow after user interaction, only if autoplayLocked is true (in milliseconds)', '15000', '5000'),
      array('animationTime', 'integer', 'How long the slideshow transition takes (in milliseconds)', '600', '1000'),
      array('easing', 'string', 'Anything other than "linear" or "swing" requires the easing plugin', 'swing', 'linear'),
  );

  return $settings;
}

