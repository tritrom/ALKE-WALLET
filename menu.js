$(document).ready(function() {
  function saldo() {
    return parseInt(localStorage.getItem('saldo'), 10) || 0;
  }

  function auth() {
    if (localStorage.getItem('logueado') !== 'si') {
      location = 'index.html';
      return false;
    }

    return true;
  }

  if (!auth()) return;

  // Animación de entrada: fadeInUp para la card
  $('.card').addClass('anim-fade-in-up');
  $('#mensajeRedireccion').hide();

  // Animación de saldo: efecto contador
  var $saldo = $('#saldo');
  var finalSaldo = saldo();
  $saldo.text('$0');
  $({ count: 0 }).animate({ count: finalSaldo }, {
    duration: 800,
    easing: 'swing',
    step: function() {
      $saldo.text('$' + Math.round(this.count));
    },
    complete: function() {
      $saldo.text('$' + finalSaldo).addClass('anim-count');
      $('.balance-card').addClass('highlight');
      setTimeout(function() {
        $('.balance-card').removeClass('highlight');
      }, 800);
    }
  });

  function redirectWithAnimation(url, mensaje) {
    var $msg = $('#mensajeRedireccion');
    $msg.text(mensaje).fadeIn(300);
    $('.btn').prop('disabled', true).addClass('anim-pulse');
    setTimeout(function() {
      $('.card').fadeOut(400, function() {
        location = url;
      });
    }, 300);
  }

  $('#btnDepositar').click(function() {
    redirectWithAnimation('deposit.html', 'Redirigiendo a depositar...');
  });

  $('#btnEnviar').click(function() {
    redirectWithAnimation('sendmoney.html', 'Redirigiendo a enviar dinero...');
  });

  $('#btnMovimientos').click(function() {
    redirectWithAnimation('transaction.html', 'Redirigiendo a últimos movimientos...');
  });

  $('#btnSalir').click(function() {
    localStorage.removeItem('logueado');
    redirectWithAnimation('index.html', 'Cerrando sesión...');
  });
});
