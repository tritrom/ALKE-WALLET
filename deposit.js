$(document).ready(function() {
  function saldo() {
    return parseInt(localStorage.getItem('saldo'), 10) || 0;
  }

  function guardarSaldo(valor) {
    localStorage.setItem('saldo', valor);
  }

  function transacciones() {
    return JSON.parse(localStorage.getItem('transacciones')) || [
      { tipo: 'Compra', monto: 1200, fecha: '01/06/2026' },
      { tipo: 'Deposito', monto: 5000, fecha: '10/06/2026' },
      { tipo: 'Transferencia recibida', monto: 2000, fecha: '15/06/2026' }
    ];
  }

  function guardarTransacciones(lista) {
    localStorage.setItem('transacciones', JSON.stringify(lista));
  }

  function agregarTransaccion(tipo, monto) {
    var lista = transacciones();
    var hoy = new Date();
    var fecha = ('0' + hoy.getDate()).slice(-2) + '/' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '/' + hoy.getFullYear();

    lista.push({ tipo: tipo, monto: monto, fecha: fecha });
    guardarTransacciones(lista);
  }

  function auth() {
    if (localStorage.getItem('logueado') !== 'si') {
      location = 'index.html';
      return false;
    }

    return true;
  }

  if (!auth()) return;

  // Animación de entrada
  $('.card').addClass('anim-fade-in-up');

  // Mostrar saldo inicial
  $('#saldoActual').text('Saldo actual: $' + saldo()).hide().fadeIn(600);

  $('#formularioDeposito').submit(function(e) {
    e.preventDefault();

    var monto = parseInt($('#monto').val(), 10);

    if (!monto || monto <= 0) {
      $('#alert-container').html('<div class="alert alert-warning">Por favor ingresa un monto valido</div>').hide().fadeIn(300);
      $('#depositMessage').text('').hide();
      return;
    }

    var nuevoSaldo = saldo() + monto;
    guardarSaldo(nuevoSaldo);
    agregarTransaccion('Deposito', monto);

    // Mensaje dinámico de éxito con animación
    var $alert = $('#alert-container').hide();
    $alert.html('<div class="alert alert-success">Depósito realizado con éxito: $' + monto + '</div>').fadeIn(400);

    // Actualizar saldo con animación contador
    var $saldo = $('#saldoActual');
    var saldoAnterior = saldo() - monto;
    $saldo.text('Saldo actual: $0');
    $({ count: 0 }).animate({ count: nuevoSaldo }, {
      duration: 600,
      easing: 'swing',
      step: function() {
        $saldo.text('Saldo actual: $' + Math.round(this.count));
      },
      complete: function() {
        $saldo.text('Saldo actual: $' + nuevoSaldo);
      }
    });

    // Mensaje dinámico secundario
    var $msg = $('#depositMessage').hide();
    $msg.text('Has depositado $' + monto + ' — tu nuevo saldo es $' + nuevoSaldo).fadeIn(400);

    // Deshabilitar botón y animar salida
    $(this).find('button').prop('disabled', true).text('Depósito exitoso, redirigiendo...');

    setTimeout(function() {
      $('.card').fadeOut(400, function() {
        location = 'menu.html';
      });
    }, 2000);
  });
});
