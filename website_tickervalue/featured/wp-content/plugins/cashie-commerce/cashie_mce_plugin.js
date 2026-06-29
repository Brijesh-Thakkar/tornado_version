
// closure to avoid namespace collision
(function(){
	// creates the plugin

	tinymce.create('tinymce.plugins.cashie_atc', {
		// creates control instances based on the control's id.
		// our button's id is "cashie_atc"
		init : function(ed, url) {
			ed.addCommand('cashie_atc', function() {
				ed.windowManager.open({
					file : url + '/cashie_atc.htm',
					width : 960 + parseInt(ed.getLang('cashie_atc.delta_width', 0)),
					height : 630 + parseInt(ed.getLang('cashie_atc.delta_height', 0)),
					background: '#fff',
					inline : 1
				}, {
					plugin_url : url
				});
			});
			
			ed.addButton('cashie_atc', {title : 'Insert Product', cmd : 'cashie_atc', image: url + '/images/icon_addtocart.png' });
	
		}
	});
	
	// register the plugin
	tinymce.PluginManager.add('cashie_atc', tinymce.plugins.cashie_atc);
	
	// Translate Cashie code snippets
	tinymce.create('tinymce.plugins.cashie_image_translation', {
		init : function(ed, url) {
			var cashie_image = '<img src="' + url + '/images/productspage.jpg" class="cashie_image_translation mceItemNoResize" />', cls = 'cashie_image_translation';
			var cashie_regex = /<script[^>]*>(\/\/ <\!\[CDATA\[)?[^<]*cashie[^<]*(cart\.js|checkout\.js|response-success\.js|response-failure\.js|addtocart\.js|catalog\.js|details\.js)[^<]*<\/script>|[cashieproduct[^>]*\]/g;

			// Register commands
			ed.addCommand('cashie_image_translation', function() {
				ed.execCommand('mceInsertContent', 0, cashie_image);
			});
			
			ed.onInit.add(function() {
				if (ed.theme.onResolveName) {
					ed.theme.onResolveName.add(function(th, o) {
						if (o.node.nodeName == 'IMG' && ed.dom.hasClass(o.node, cls))
							o.name = 'cashie_image_translation';
					});
				}
			});

			ed.onClick.add(function(ed, e) {
				e = e.target;

				if (e.nodeName === 'IMG' && ed.dom.hasClass(e, cls))
					ed.selection.select(e);
					
				ed.execCommand("mceRepaint");
			});

			ed.onNodeChange.add(function(ed, cm, n) {
				cm.setActive('cashie_image_translation', n.nodeName === 'IMG' && ed.dom.hasClass(n, cls));
			});

			// Runs when switching to Visual mode
			ed.onBeforeSetContent.add(function(ed, o) {
					o.content = o.content.replace(cashie_regex, function(im) {
						// For some reason WP likes putting in CDATA tags for script tags, remove them
						im = im.replace(/\/\/\s*\<\!\[CDATA\[/g, '').replace(/\/\/\s*\]\]\>/, '');
						
						// Figure out correct image
						var myIMG = "cashie_cart_image.png";
						if (im.indexOf('checkout.js')>0)
						{
							myIMG = "cashie_checkout_image.png";
						}
						else if (im.indexOf('addtocart.js')>0 || im.indexOf('_cashieATCOnly=true') > 0)
						{
							myIMG = "cashie_atc_image.png";
						}
						else if (im.indexOf('response-success.js')>0)
						{
							myIMG = "cashie_success_image.png";
						}
						else if (im.indexOf('response-failure.js')>0)
						{
							myIMG = "cashie_fail_image.png";
						}
						else if (im.indexOf('catalog.js')>0)
						{
							myIMG = "cashie_catalog_image.png";
						}
						else if (im.indexOf('details.js')>0)
						{
							myIMG = "cashie_details_image.png";
						}
						im = '<img src="' + url + '/images/'+myIMG+'" class="cashie_image_translation mceItemNoResize" title="' + escape(im) + '"/>';
						return im;
					});
			});

		  // Runs when switching to HTML mode
			ed.onPostProcess.add(function(ed, o) {
				if (o.get)
					o.content = o.content.replace(/<img[^>]+>/g, function(im) {
						//alert(im);
						if (im.indexOf('class="cashie_image_translation"') !== -1)
						{
							matches = im.match(/title="([^"]+)"/);
							im = unescape(matches[0].replace('title="','').replace('"',''));
						}
						return im;
					});
			});
		}
	});
	
	// register
	tinymce.PluginManager.add('cashie_image_translation', tinymce.plugins.cashie_image_translation);
	
})()