$(document).ready(function() {
  function guardarSaldo(valor) {
    localStorage.setItem('saldo', valor);
  }

  $('#loginForm').submit(function(e) {
    e.preventDefault();

    var usuario = $('#email').val();
    var password = $('#password').val();

    if (usuario === 'usuario@wallet.com' && password === '12345') {
      localStorage.setItem('logueado', 'si');
      guardarSaldo(60000);
      $('#alertPlaceholder').html('<div class="alert alert-success">Login exitoso!</div>');
      setTimeout(function() {
        location = 'menu.html';
      }, 800);
    } else {
      $('#alertPlaceholder').html('<div class="alert alert-danger">Email o contrasena incorrectos</div>');
    }
  });
});
