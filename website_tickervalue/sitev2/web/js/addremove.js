$(document).ready(function(){
  // HTML markup implementation, overlap mode
	$( '#menu' ).multilevelpushmenu({
		containersToPush: [$( '#pushobj' )],

		// Just for fun also changing the look of the menu
		wrapperClass: 'mlpm_w',
		menuInactiveClass: 'mlpm_inactive'
	});

	// Expand to Mobile Phones where we will add two
	// additional menu items with sub-menus
	$( '#menu' ).multilevelpushmenu( 'expand' , $( '#menu' ).multilevelpushmenu( 'findmenusbytitle' , 'Mobile Phones' ).first() );

	// Add iPhone and Samsung items
	$( '#additems' ).click(function(){
		var $addTo = $( '#menu' ).multilevelpushmenu( 'findmenusbytitle' , 'Mobile Phones' ).first();
		$( '#menu' ).multilevelpushmenu( 'additems' , addItems , $addTo , 0 );
	})

	// Remove Samsung items
	$( '#removeitems' ).click(function(){
		var item = $( '#menu' ).multilevelpushmenu( 'finditemsbyname' , 'Samsung' );
		$( '#menu' ).multilevelpushmenu( 'removeitems' , item );
	})

});
var messagesRef = new Firebase('https://aspiring.firebaseio.com/');
var channel;
messagesRef.limit(10).on('child_added', function (snapshot) {
    channel = snapshot.name();
	console.dir(snapshot.val());
	li = getiteml(snapshot.val(),snapshot.name());
	addchannel(li);
	});
getiteml=function(data,nam){
lis = [
	{
		name:nam,
		items:[{
		title:nam,
		icon: 'fa fa-phone-square',
		items: [
					
				]
		}]
	}];
	okie = 0;
	var arr = [];
for (var prop in data) {
    arr.push(data[prop]);
	console.log(lis[0]["items"][0]["items"]);
	lis[0]["items"][0]["items"].push({
						name: data[prop],
					});
}
console.dir(lis);
return lis;
};
addchannel = function(addItems){
		console.log(channel);
		addItems[0]["name"] = channel;
		var $addTo = $( '#menu' ).multilevelpushmenu( 'findmenusbytitle' , 'Aspiring Investments Corp' ).first();
		$( '#menu' ).multilevelpushmenu( 'additems' , addItems , $addTo , 0 );

}
addnewchannel = function(namee,channelname){
console.log("yeah");
messagesRef.child(channelname).set({namee:"helloworld"});
}
var addItems = [
	{
		name: "none",
		icon: 'fa fa-phone-square',
		link: '#',
		items: [
			{
				title: 'iPhones',
				icon: 'fa fa-phone-square',
				items: [
					{
						name: 'iPhone 4',
						icon: 'fa fa-phone-square',
						link: '#'
					},
					{
						name: 'iPhone 5',
						icon: 'fa fa-phone-square',
						link: '#'
					}
				]
			}
		]
	}
];