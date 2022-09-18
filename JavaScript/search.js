const f = document.getElementById('form');
      const q = document.getElementById('query');
      const google = 'https://primetech.gq/?s';
      const site = '=';

      function submitted(event) {
        event.preventDefault();
        const url = google + site + '' + q.value;
        const win = window.open(url);
        win.focus();
      }

      f.addEventListener('submit', submitted);
