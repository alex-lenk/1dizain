$(document).ready(function () {
    (function ($) {
        $(function () {
            $('.tabs-caption').each(function (i) {
                var storage = localStorage.getItem('tab' + i);

                if (storage) {
                    $(this).find('.tabs-caption__item').removeClass('tabs-caption__active').eq(storage).addClass('tabs-caption__active');
                }
            });

            $('.tabs-caption').on('click', '.tabs-caption__item:not(.tabs-caption__active)', function () {
                $(this).addClass('tabs-caption__active').siblings().removeClass('tabs-caption__active');

                var ulIndex = $('.tabs-caption').index($(this).parents('.tabs-caption'));

                localStorage.removeItem('tab' + ulIndex);
                localStorage.setItem('tab' + ulIndex, $(this).index());
            });
        });
    })(jQuery);

    if((self.parent&&!(self.parent===self))&&(self.parent.frames.length!=0)){self.parent.location=document.location}


    $('.general-content-right__menu').on('click', function () {
        $('.navg').slideToggle();
    });
});
