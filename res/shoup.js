/* shoup.org: page loading and various shiny effects for the picture frame/letters. */
var shoup = {
	'letters': 'shoup',
	'letterCount': 0,
	'letterNextArray': [],
	'picTotal': 6,
	'picImages': [],
	'picCurrent': '',
	'picShowTime': 5000,
	'hue': 0,
	'fadeLong': 4000,
	'fadeShort': 1000,

	'init': function() {
		$('#shoup').show().animate({ 'marginTop': '75px', opacity: 1 }, shoup.fadeShort, function() {
			var page = null, tmp = null, domainParts = document.domain.toLowerCase().split('.')
			shoup.initLetters();
			if(domainParts.length == 3 && $.inArray(domainParts[0], ['www', 'index', 'mail']) < 0)
				page = domainParts[0];
			else if(location.hash && (tmp=location.hash.match(/^#?([a-z0-9_-]+)/i)))
				page = tmp[1];
			if(page)
				shoup.initPage(page);
			else
				$('#shoup-info').fadeIn(shoup.fadeShort);
		});
	},
	'initLetters': function() {
		for(var l in shoup.letters.split('')) {
			var img = new Image();
			img.onload = shoup.initLettersCounter;
			img.src = '/res/' + shoup.letters[l] + '.png';
		}
	},
	'initLettersCounter': function() {
		if(++shoup.letterCount < 5)
			return;
		$('.hue').fadeIn(shoup.fadeLong, function() {
			$('#s,#h,#o,#u,#p').click(function() {
				$(this).fadeOut(shoup.fadeShort, function() {
					$(this).fadeIn(shoup.fadeShort);
				});
			});
		});
		setInterval(shoup.updateHue, 25);
		setTimeout(shoup.picLoad, shoup.picShowTime);
	},
	'initPage': function(page) {
		document.title += ': ' + page;
		$.get(page + '.htm?' + Math.random(), function(html) {
			$('#shoup-page').html(html).slideDown();
		}, 'html').fail(function() {
			$('#shoup-page').html('No content found for: "<b>' + page + '</b>"').slideDown();
		});
	},
	'letterNext': function() {
		if(shoup.letterNextArray.length == 0) {
			shoup.letterNextArray = shoup.letters.split('');
			shoup.letterNextArray.sort(function() { return .5 - Math.random(); });
		}
		return shoup.letterNextArray.pop();
	},
	'picNext': function() {
		if(shoup.picImages.length == 0) {
			for(var i=0; i < shoup.picTotal; i++)
				shoup.picImages.push('/pic/' + i + '.png');
			shoup.picImages.sort(function() { return .5 - Math.random(); });
		}
		shoup.picCurrent = shoup.picImages.pop();
		return shoup.picCurrent;
	},
	'picLoad': function() {
		var img = new Image();
		img.onload = shoup.picLoaded;
		img.onerror = shoup.picLoad;
		img.src = shoup.picNext();
	},
	'picLoaded': function() {
		var html = '<div class="shoup-pic" style="background-image:url(' + shoup.picCurrent + ');"></div>';
		$('#' + shoup.letterNext()).html(html);
		$('.shoup-pic').fadeIn(shoup.fadeLong, function() {
			setTimeout(function() {
				$('.shoup-pic').fadeOut(shoup.fadeLong, function() {
					$('.shoup-pic').remove();
					setTimeout(shoup.picLoad, shoup.picShowTime);
				});
			}, shoup.picShowTime);
		});
	},
	'updateHue': function() {
		if(++shoup.hue >= 360) shoup.hue = 0;
		$('.hue').css('-webkit-filter', 'hue-rotate(' + shoup.hue + 'deg)');
	}
}
$(document).ready(function() {
	document.domain = 'shoup.org';
	var img = new Image();
	img.onload = shoup.init;
	img.onerror = function() { $('body').html($('noscript').html()); }
	img.src = '/res/shoup.png';
});
