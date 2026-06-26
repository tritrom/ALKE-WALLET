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

  $('#saldoActual').text('$' + saldo());

  $('#formularioDeposito').submit(function(e) {
    e.preventDefault();

    var monto = parseInt($('#monto').val(), 10);

    if (!monto || monto <= 0) {
      $('#alert-container').html('<div class="alert alert-warning">Por favor ingresa un monto valido</div>');
      $('#depositMessage').text('');
      return;
    }

    guardarSaldo(saldo() + monto);
    agregarTransaccion('Deposito', monto);
    $('#alert-container').html('<div class="alert alert-success">Deposito realizado con exito: $' + monto + '</div>');
    $('#depositMessage').text('Has depositado $' + monto + '.');
    $('#saldoActual').text('$' + saldo());

    setTimeout(function() {
      location = 'menu.html';
    }, 2000);
  });
});
