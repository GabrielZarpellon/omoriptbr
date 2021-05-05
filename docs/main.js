const GALERIA_IMAGES = [
	'img/galeria/1.png',
	'img/galeria/2.jpg',
	'img/galeria/3.jpg',
	'img/galeria/4.jpg',
	'img/galeria/5.jpg',
	'img/galeria/6.png',
	'img/galeria/7.png',
	'img/galeria/8.png',
	'img/galeria/9.jpg',
	'img/galeria/10.jpg',
	'img/galeria/11.jpg',
];

$(function () {
	$('.page').hide();

	showPage('inicio');
	$('.navitem').on('click', function () {
		if ($(this).data('link')) {
			window.open($(this).data('link'), '_blank');
		} else {
			$('.page').fadeOut(1000);
			setTimeout(() => {
				showPage($(this).data('page'));
			}, 900);
		}
	});

	$('.gallery-close').on('click', function () {
		$('#gallery-big').hide();
	});

	$('.gallery-next').on('click', function () {
		let curr = $('#gallery-big .gallery-img').data('imgindex');
		let index = curr + 1;
		if (index > GALERIA_IMAGES.length - 1) {
			index = 0;
		}
		$('#gallery-big .gallery-img').attr('src', GALERIA_IMAGES[index]).data('imgindex', index);
	});

	$('.gallery-prev').on('click', function () {
		let curr = $('#gallery-big .gallery-img').data('imgindex');
		let index = curr - 1;
		if (index < 0) {
			index = GALERIA_IMAGES.length - 1;
		}
		$('#gallery-big .gallery-img').attr('src', GALERIA_IMAGES[index]).data('imgindex', index);
	});
});

function showPage(page) {
	if (page === 'inicio') {
		$('.maintitle').hide(0);
		$('#page-inicio').fadeIn(1000);
		$('.maintitle').fadeIn(5000);
	} else if (page === 'galeria') {
		$('.galeria').empty();

		for (let i = 0; i < GALERIA_IMAGES.length; i++) {
			$('.galeria').append(
				$('<div></div>').addClass('imgdiv').append(
					$('<img></img>').attr('src', GALERIA_IMAGES[i]).on('click', function () {
						$('#gallery-big .gallery-img').attr('src', GALERIA_IMAGES[i]).data('imgindex', i);
						$('#gallery-big').css('display', 'flex');
					})
				).css('opacity', '0')
			);
		}

		let index = 0;
		const nextImage = function () {
			const img = $('.galeria>.imgdiv').eq(index);
			if (img) {
				img.animate({ opacity: 1.0 }, 500, 'swing', nextImage);
			}

			index++;
		}

		nextImage()
		$('#page-galeria').show();
	} else if (page === 'contato') {
		$('.person').hide();
		$('#page-contato').show();

		const nextPerson = function () {
			if ($('.person:hidden').length) {
				$('.person:hidden:first').fadeIn();
				setTimeout(nextPerson, 500);
			}
		}

		nextPerson();
	} else if (page === 'baixar') {
		$('#page-baixar').fadeIn(1000);
	}
}
