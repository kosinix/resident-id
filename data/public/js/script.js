// Extend Quill
Quill.prototype.getHtml = function () {
    return this.container.querySelector('.ql-editor').innerHTML;
};



jQuery(document).ready(function($){
    $('.toggler').on('click', function(){
        $('body').toggleClass('hide-menu')
    })
})