var enablePWA = true;
if(enablePWA) {
	// SERVICE WORKER
	//if('serviceWorker' in navigator) {
	//	navigator.serviceWorker.register('./js/sw.js');
	//};https://ted-dunstone.github.io/ted-dunstone/EvieGame/
	
	if ('serviceWorker' in navigator) {
        	window.addEventListener('load', function() {
            		navigator.serviceWorker.register('sw.js',{scope: '/ted-dunstone/EvieGame/'}).then(function(registration) {
                	console.log('ServiceWorker registration successful with scope: ', registration.scope);
		    }, function(err) {
			console.log('ServiceWorker registration failed: ', err);
		    });
		});
	 }

	 let deferredPrompt;
		window.addEventListener('beforeinstallprompt', function (e) {
			console.log('beforeinstallprompt triggered');
			e.preventDefault();
			deferredPrompt = e;
			modal.style.display = 'block';
		});
		// Get the modal
		var modal = document.getElementById('myModal');
		// Get the <span> element that closes the modal
		var span = document.getElementsByClassName('close')[0];
		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = 'none';
			}
		}
		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
			modal.style.display = 'none';
		}
		function offlinePrompt() {
			deferredPrompt.prompt();
		}
	// NOTIFICATIONS TEMPLATE
	/*Promise.resolve(Notification.requestPermission()).then(function(permission) {
    		if(permission === 'granted') {
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
	}*/
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
