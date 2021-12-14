
$(document).ready(()=>{


    $("#preloader").delay(55000).fadeOut("slow", ()=>{
      $("body").css("overflow-y", "scroll");
    }); 

    $("#preloader video").click( function (){
        if( $("#preloader video").prop('muted') ) {
              $("#preloader video").prop('muted', false);
        } else {
          $("#preloader video").prop('muted', true);
        }
      });

      var clipboard = new ClipboardJS('.btn');

clipboard.on('success', function(e) {
    e.clearSelection();
    $('.toast').addClass('show')
    setTimeout(function() {
      $(".toast").removeClass("show");
      }, 3000);
      
});
});

$('.toast-body button').on('click', ()=>{
  $('.toast').removeClass('show')
})

function skippreloader(){
    $("#preloader").hide();
    $(".preloader-vid").trigger('pause');
    $("body").css("overflow-y", "scroll");
}