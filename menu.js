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

  $('#saldo').text('$' + saldo());

  $('#btnDepositar').click(function() {
    $('#mensajeRedireccion').text('Redirigiendo a depositar');
    setTimeout(function() {
      location = 'deposit.html';
    }, 500);
  });

  $('#btnEnviar').click(function() {
    $('#mensajeRedireccion').text('Redirigiendo a enviar dinero');
    setTimeout(function() {
      location = 'sendmoney.html';
    }, 500);
  });

  $('#btnMovimientos').click(function() {
    $('#mensajeRedireccion').text('Redirigiendo a ultimos movimientos');
    setTimeout(function() {
      location = 'transaction.html';
    }, 500);
  });

  $('#btnSalir').click(function() {
    localStorage.removeItem('logueado');
    location = 'index.html';
  });
});
