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
    var $mensaje = $('#mensajeMovimientos');
    var data = transacciones().filter(function(item) {
      return filtro === 'todos' || tipoRaw(item.tipo) === filtro;
    });
    var labels = {
      deposito: 'Depósito',
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
    var filtroLabels = {
      todos: 'todos los movimientos',
      deposito: 'depósitos',
      compra: 'compras',
      transferencia: 'transferencias recibidas'
    };

    if (!data.length) {
      $lista.append('<li class="list-group-item">No hay movimientos registrados</li>');
      if ($mensaje.length) {
        $mensaje.text('No se encontraron ' + (filtroLabels[filtro] || 'movimientos')).fadeIn(300);
      }
      return;
    }

    $.each(data.slice().reverse(), function(i, item) {
      var tipo = tipoRaw(item.tipo);
      var $li = $('<li class="list-group-item item-enter">' + icons[tipo] + ' <strong>' + labels[tipo] + '</strong> — $' + item.monto + ' — ' + item.fecha + '</li>');
      $lista.append($li);
      // Animación escalonada de cada item
      setTimeout(function() {
        $li.addClass('item-enter-active');
      }, i * 60);
    });

    // Mensaje dinámico con cantidad de resultados
    if ($mensaje.length) {
      $mensaje.text('Mostrando ' + data.length + ' ' + (filtroLabels[filtro] || 'movimientos')).fadeIn(300);
    }
  }

  if (!auth()) return;

  // Animación de entrada
  $('.card').addClass('anim-fade-in-up');

  // Agregar contenedor para mensaje dinámico debajo del filtro
  $('#filtroTipo').closest('.form-group').after('<div id="mensajeMovimientos" class="text-muted mb-3" style="display:none;"></div>');

  renderMovimientos('todos');

  $('#filtroTipo').change(function() {
    var $lista = $('#listaMovimientos');
    $lista.fadeOut(200, function() {
      renderMovimientos($('#filtroTipo').val());
      $lista.fadeIn(300);
    });
  });
});
