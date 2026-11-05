// Scripted REST resource: List watches
// GET /api/x_1234_team39_co_0/collector/watches
// The caller's active watches, each with matching live/upcoming drops.
(function process(request, response) {
  var SCOPE = 'x_1234_team39_co_0_';
  function toNum(v) { var n = parseFloat(v); return isNaN(n) ? null : n; }
  var w = new GlideRecord(SCOPE + 'watch');
  w.addQuery('watcher', gs.getUserID());
  w.addQuery('active', true);
  w.orderByDesc('sys_created_on');
  w.query();
  var out = [];
  while (w.next()) {
    var cid = w.getValue('collectible');
    var drops = [];
    var dg = new GlideRecord(SCOPE + 'drop');
    dg.addQuery('collectible', cid);
    dg.addQuery('status', 'IN', 'live,upcoming');
    dg.orderBy('release_date');
    dg.query();
    while (dg.next()) {
      drops.push({ number: dg.getValue('number'), name: dg.getValue('name'), status: dg.getValue('status'), store: dg.getDisplayValue('store'), release_date: dg.getValue('release_date') });
    }
    out.push({
      sys_id: w.getUniqueValue(), number: w.getValue('number'), collectible: w.getDisplayValue('collectible'),
      max_price: toNum(w.getValue('max_price')),
      notify: (w.getValue('notify') === 'true' || w.getValue('notify') === '1'),
      matching_drops: drops
    });
  }
  response.setStatus(200);
  response.setBody({ count: out.length, watches: out });
})(request, response);
