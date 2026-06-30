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

  function contactos() {
    return JSON.parse(localStorage.getItem('contactos')) || [];
  }

  function guardarContactos(lista) {
    localStorage.setItem('contactos', JSON.stringify(lista));
  }

  function renderContactos(busqueda) {
    var $lista = $('#listaContactos').empty();
    busqueda = (busqueda || '').toLowerCase();

    $.each(contactos(), function(i, contacto) {
      var texto = (contacto.nombre + ' ' + contacto.alias).toLowerCase();

      if (busqueda && texto.indexOf(busqueda) === -1) return;

      $lista.append('<li class="list-group-item"><input type="radio" name="contacto" value="' + contacto.nombre + '"> <strong>' + contacto.nombre + '</strong> - CBU: ' + contacto.cbu + ' (Alias: ' + contacto.alias + ')</li>');
    });

    if (!$lista.children().length) {
      $lista.append('<li class="list-group-item">No hay contactos</li>');
    }
  }

  if (!auth()) return;

  if (!localStorage.getItem('contactos')) {
    guardarContactos([
      { nombre: 'John Doe', cbu: '123456789', alias: 'jdoe', banco: 'Banco A' },
      { nombre: 'Jane Smith', cbu: '987654321', alias: 'jsmith', banco: 'Banco B' }
    ]);
  }

  renderContactos();

  // Autocompletar en buscar contacto
  var $autoDropdown = $('#autocompleteLista');

  function mostrarAutocomplete(busqueda) {
    busqueda = (busqueda || '').toLowerCase().trim();
    $autoDropdown.empty().hide();

    if (!busqueda) return;

    var resultados = contactos().filter(function(c) {
      return (c.nombre + ' ' + c.alias + ' ' + c.banco).toLowerCase().indexOf(busqueda) > -1;
    });

    if (!resultados.length) return;

    $.each(resultados, function(i, c) {
      $autoDropdown.append(
        '<div class="autocomplete-item" data-nombre="' + c.nombre + '">' +
          '<strong>' + c.nombre + '</strong> <small class="text-muted">(Alias: ' + c.alias + ')</small>' +
        '</div>'
      );
    });

    $autoDropdown.fadeIn(150);
  }

  $('#buscarContacto').on('keyup', function() {
    mostrarAutocomplete($(this).val());
  });

  $('#autocompleteLista').on('click', '.autocomplete-item', function() {
    var nombre = $(this).data('nombre');
    $('#buscarContacto').val(nombre);
    $autoDropdown.fadeOut(100);
    renderContactos(nombre);
  });

  $(document).on('click', function(e) {
    if (!$(e.target).closest('.autocomplete-wrap').length) {
      $autoDropdown.fadeOut(100);
    }
  });

  $('#btnAgregarContacto').click(function() {
    $('#modal').show();
  });

  $('#btnCancelarContacto').click(function() {
    $('#modal').hide();
    $('#formularioContacto')[0].reset();
  });

  $('#formularioContacto').submit(function(e) {
    e.preventDefault();

    var nombre = $('#nombre').val().trim();
    var cbu = $('#cbu').val().trim();
    var alias = $('#alias').val().trim();
    var banco = $('#banco').val().trim();

    if (!nombre || !cbu || !alias) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    if (cbu.replace(/\D/g, '').length < 8) {
      alert('CBU invalido. Debe contener al menos 8 digitos');
      return;
    }

    var data = contactos();
    data.push({ nombre: nombre, cbu: cbu, alias: alias, banco: banco });
    guardarContactos(data);
    renderContactos();
    $('#modal').hide();
    $('#formularioContacto')[0].reset();
  });

  $('#btnBuscar').click(function() {
    renderContactos($('#buscarContacto').val().trim());
  });

  $('#btnLimpiarBusqueda').click(function() {
    $('#buscarContacto').val('');
    renderContactos('');
  });

  $('#listaContactos').on('change', 'input[name="contacto"]', function() {
    $('#listaContactos .list-group-item').removeClass('active');
    $(this).closest('.list-group-item').addClass('active');
    $('#btnEnviarDinero').show();
  });

  $('#btnEnviarDinero').click(function() {
    var seleccionado = $('#listaContactos input[name="contacto"]:checked');
    var monto = parseInt($('#monto').val(), 10);

    if (!seleccionado.length) {
      alert('Por favor selecciona un contacto');
      return;
    }

    if (!monto || monto <= 0) {
      alert('Por favor ingresa un monto valido');
      return;
    }

    if (monto > saldo()) {
      alert('Saldo insuficiente');
      return;
    }

    if (!confirm('Enviar $' + monto + ' a ' + seleccionado.val() + '?')) return;

    guardarSaldo(saldo() - monto);
    agregarTransaccion('Transferencia a ' + seleccionado.val(), monto);
    $('#monto').val('');
    $('#sendConfirmation').text('Envio realizado con exito: $' + monto + ' a ' + seleccionado.val());
    $('#btnEnviarDinero').hide();
    $('#listaContactos .list-group-item').removeClass('active');

    setTimeout(function() {
      $('#sendConfirmation').text('');
    }, 4000);
  });
});
