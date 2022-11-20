import './modernizr';
import './sprite';

const range = $('#range');
const rangeVal = $('#range_val');
const burgerMenu = $('#burger_menu');
const nav = $('.nav');
const navList = $('.nav__list');
const btnOrder = $('#order');
const blockOrder = $('.content');
const tablet = 768;
const animateDuration = 1000;

$(function () {
    $('#select_type').select2({
        minimumResultsForSearch: Infinity,
        placeholder: $(this).attr('data-placeholder'),
        width: 'style',
    });

    nav.on('click', function () {
        if ($(window).width() < tablet) {
            $('body').removeClass('menu-open');
        }
    });

    navList.on('click', function (e) {
        e.stopPropagation();
    });

    btnOrder.on('click', function () {
        $('html, body').animate({
            scrollTop: blockOrder.offset().top - $('.header').outerHeight()
        }, animateDuration);
    });

    range.on('input', function () {
        const val = $(this).val();
        rangeVal.text(`${val}%`);
    });

    burgerMenu.on('click', function () {
        $('body').toggleClass('menu-open');
    });

    $(window).on('resize', function () {
        if ($(window).width() < tablet) {
            $('body').removeClass('menu-open');
        }
    });
});