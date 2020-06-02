var enablePWA = true;
if(enablePWA) {
	// SERVICE WORKER
	//if('serviceWorker' in navigator) {
	//	navigator.serviceWorker.register('./js/sw.js');
	//};https://ted-dunstone.github.io/ted-dunstone/EvieGame/
	
	if ('serviceWorker' in navigator) {
        	window.addEventListener('load', function() {
            		navigator.serviceWorker.register('src/sw.js',{scope: 'https://ted-dunstone.github.io/ted-dunstone/EvieGame/'}).then(function(registration) {
                	console.log('ServiceWorker registration successful with scope: ', registration.scope);
		    }, function(err) {
			console.log('ServiceWorker registration failed: ', err);
		    });
		});
	 }
	// NOTIFICATIONS TEMPLATE
	Notification.requestPermission().then(function(result) {
		if(result === 'granted') {
			exampleNotification();
		}
	});
	function exampleNotification() {
		var notifTitle = 'Lasso';
		var notifBody = 'Created by Evie Dunstone';
		var notifImg = 'img/icons/icon-512.png';
		var options = {
			body: notifBody,
			icon: notifImg
		}
		var notif = new Notification(notifTitle, options);
		setTimeout(exampleNotification, 30000);
	}
}

var gameConfig = {
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 960, //640,
		height: 640 //
	},
	physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
	scene: [Boot, Preloader, MainMenu, Settings, Story, HudOverlay, Game]
}
game = new Phaser.Game(gameConfig);
window.focus();
