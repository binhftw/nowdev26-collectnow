// Scripted REST resource: Create watch
// POST /api/x_1234_team39_co_0/collector/watch
// Body: { "collectible": "COL0001006", "max_price": 75, "min_condition": "near_mint", "notify": true }
// The watcher is always the calling user.
(function process(request, response) {
  var SCOPE = 'x_1234_team39_co_0_';
  function toNum(v) { var n = parseFloat(v); return isNaN(n) ? null : n; }
  function resolve(idOrNumber) {
    var gr = new GlideRecord(SCOPE + 'collectible');
    if (gr.get(idOrNumber)) return gr;
    var byNum = new GlideRecord(SCOPE + 'collectible');
    byNum.addQuery('number', idOrNumber);
    byNum.query();
    if (byNum.next()) return byNum;
    return null;
  }
  var body = (request.body && request.body.data) ? request.body.data : {};
  var collectible = body.collectible;
  if (!collectible) { response.setStatus(400); response.setBody({ error: 'collectible is required (sys_id or number)' }); return; }
  var cg = resolve(String(collectible));
  if (!cg) { response.setStatus(404); response.setBody({ error: 'Collectible not found', collectible: collectible }); return; }

  var w = new GlideRecord(SCOPE + 'watch');
  w.initialize();
  w.setValue('collectible', cg.getUniqueValue());
  w.setValue('watcher', gs.getUserID());
  if (body.max_price != null && body.max_price !== '') w.setValue('max_price', body.max_price);
  if (body.min_condition) w.setValue('min_condition', body.min_condition);
  w.setValue('notify', body.notify === false ? false : true);
  w.setValue('active', true);
  var newId = w.insert();
  if (!newId) { response.setStatus(500); response.setBody({ error: 'Could not create watch', detail: w.getLastErrorMessage() }); return; }

  response.setStatus(201);
  response.setBody({ sys_id: newId, number: w.getValue('number'), collectible: cg.getValue('name'), max_price: toNum(w.getValue('max_price')) });
})(request, response);
