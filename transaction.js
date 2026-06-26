$(document).ready(function() {
  function auth() {
    if (localStorage.getItem('logueado') !== 'si') {
      location = 'index.html';
      return false;
    }

    return true;
  }

  function transacciones() {
    return JSON.parse(localStorage.getItem('transacciones')) || [
      { tipo: 'Compra', monto: 1200, fecha: '01/06/2026' },
      { tipo: 'Deposito', monto: 5000, fecha: '10/06/2026' },
      { tipo: 'Transferencia recibida', monto: 2000, fecha: '15/06/2026' }
    ];
  }

  function tipoRaw(tipo) {
    tipo = (tipo || '').toLowerCase();

    if (tipo.indexOf('dep') > -1) return 'deposito';
    if (tipo.indexOf('comp') > -1) return 'compra';
    if (tipo.indexOf('transfer') > -1) return 'transferencia';

    return tipo || 'otros';
  }

  function renderMovimientos(filtro) {
    var $lista = $('#listaMovimientos').empty();
    var data = transacciones().filter(function(item) {
      return filtro === 'todos' || tipoRaw(item.tipo) === filtro;
    });
    var labels = {
      deposito: 'Deposito',
      compra: 'Compra',
      transferencia: 'Transferencia recibida',
      otros: 'Otros'
    };
    var icons = {
      deposito: '[+]',
      compra: '[$]',
      transferencia: '[>]',
      otros: '[*]'
    };

    if (!data.length) {
      $lista.append('<li class="list-group-item">No hay movimientos registrados</li>');
      return;
    }

    $.each(data.reverse(), function(i, item) {
      var tipo = tipoRaw(item.tipo);
      $lista.append('<li class="list-group-item">' + icons[tipo] + ' <strong>' + labels[tipo] + '</strong> - $' + item.monto + ' - ' + item.fecha + '</li>');
    });
  }

  if (!auth()) return;

  renderMovimientos('todos');

  $('#filtroTipo').change(function() {
    renderMovimientos($(this).val());
  });
});
