


// Open Sidebar
document.getElementById("menu-btn").addEventListener("click", function () {
    document.getElementById("sidenav").classList.add("active");
    document.getElementById("overlay").classList.add("active");
});

// Close Sidebar
document.getElementById("close-btn").addEventListener("click", function () {
    document.getElementById("sidenav").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
});

// Close sidebar if overlay is clicked
document.getElementById("overlay").addEventListener("click", function () {
    document.getElementById("sidenav").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
});





document.addEventListener("DOMContentLoaded", function () {
    let toggles = document.querySelectorAll(".menu-toggle");

    toggles.forEach(toggle => {
        toggle.addEventListener("click", function (e) {
            e.preventDefault();
            let submenu = this.nextElementSibling;
            // let arrow = this.querySelector(".arrow");

            // Check if the submenu is already open
            let isOpen = submenu.style.height && submenu.style.height !== "0px";

            // Close all other submenus and remove active class
            document.querySelectorAll(".submenu").forEach(menu => {
                if (menu !== submenu) {
                    menu.style.height = "0px";
                    menu.previousElementSibling.classList.remove("active");
                    // menu.previousElementSibling.querySelector(".arrow").classList.remove("rotate");
                }
            });

            // Toggle submenu height smoothly
            if (isOpen) {
                submenu.style.height = "0px";
                // arrow.classList.remove("rotate");
                this.classList.remove("active");
            } else {
                submenu.style.height = submenu.scrollHeight + "px";
                // arrow.classList.add("rotate");
                this.classList.add("active");
            }
        });
    });
});




window.addEventListener('scroll', function () {
  if (window.innerWidth >= 768) {
      var header = document.querySelector('header');
      if (window.scrollY > 1) {
          header.classList.add('shrink');
      } else {
          header.classList.remove('shrink');
      }
  }
});






  $(document).ready(function () {
    $('.whats-happening-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: '150px',
      responsive: [
        {
          breakpoint: 767, // This is for mobile screens
          settings: {
            centerPadding: '0px',
          }
        }
      ],
      dots: true, 
      arrows: true,
      autoplay: false,
      autoplaySpeed: 3000
    });
  });


  $(document).ready(function () {
    $('.why-choose-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      arrows: true,
      dots: false,
      speed: 300,
      centerPadding: '0',
      infinite: true,
      autoplaySpeed: 3000,
      autoplay: true,
      prevArrow: '<button type="button" class="slick-prev"><img src="img/arrow_left_yellow.svg" alt="Previous"></button>',
      nextArrow: '<button type="button" class="slick-next"><img src="img/arrow_right_yellow.svg" alt="Next"></button>',
      focusOnSelect: true
    });
  });





  window.addEventListener('scroll', function() {
		const scrollpos = window.scrollY
		// console.log(scrollpos)

		if(scrollpos >= 80) {
			$('#heading').text('Build')
			$('#heading-alt').text('Next')
			$('#heading').css({ color: '#FFCE32' })
			$('#heading-alt').css({ color: '#FFCE32' })
			$('#text').text('Our students embrace an entrepreneurial mindset to drive innovation, Create impact, and lead the change.')
			$('#slider-line').addClass('slider-line-alt').removeClass('slider-line')

      $('.button').css({ 'background-color': '#FFCE32' });

      button
		} else {
			$('#heading').text('Change')
			$('#heading-alt').text('Now')
			$('#heading').css({ color: '#007BFF' })
			$('#heading-alt').css({ color: '#007BFF' })
			$('#text').text('It’s time to shift gears, from being consumers of knowledge to become creators of opportunities.')
			$('#slider-line').removeClass('slider-line-alt').addClass('slider-line')
      $('.button').css({ 'background-color': '#007BFF' });
		}
	})
