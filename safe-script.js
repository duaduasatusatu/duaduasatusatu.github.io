<script>
    // Disable right-click context menu (desktop only)
    if (!('ontouchstart' in window)) {
      document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
      });
    }

    // Visitor counter
    (function () {
      try {
        var key = 'visitor_counter_daily_v1';
        var now = new Date();
        var dayKey = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
        var payload = JSON.parse(localStorage.getItem(key) || '{}');
        if (!payload || typeof payload !== 'object') payload = {};
        if (payload.day !== dayKey) { payload.day = dayKey; payload.count = 0; }
        payload.count = (Number(payload.count) || 0) + 1;
        localStorage.setItem(key, JSON.stringify(payload));
        var el = document.getElementById('visitorCounter');
        if (el) el.textContent = payload.count.toLocaleString('id-ID');
      } catch(e) {}
    })();

    // Simulated stats for display
    (function() {
      var players = Math.floor(Math.random() * 1500) + 800;
      var winners = Math.floor(Math.random() * 50) + 20;
      var elPlayers = document.getElementById('totalPlayers');
      var elWinners = document.getElementById('totalWinners');
      if (elPlayers) elPlayers.textContent = players.toLocaleString('id-ID') + '+';
      if (elWinners) elWinners.textContent = winners.toLocaleString('id-ID') + '+';
    })();