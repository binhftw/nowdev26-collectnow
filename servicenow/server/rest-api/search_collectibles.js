// Scripted REST resource: Search collectibles
// GET /api/x_1234_team39_co_0/collector/collectibles?q=&category=
(function process(request, response) {
  var SCOPE = 'x_1234_team39_co_0_';
  function qp(name) {
    var v = request.queryParams ? request.queryParams[name] : null;
    if (v == null) return '';
    if (Array.isArray(v)) return v.length ? String(v[0]) : '';
    return String(v);
  }
  var q = qp('q'), category = qp('category');
  var gr = new GlideRecord(SCOPE + 'collectible');
  if (q) { var qc = gr.addQuery('name', 'CONTAINS', q); qc.addOrCondition('series', 'CONTAINS', q); }
  if (category) gr.addQuery('category', category);
  gr.orderBy('name');
  gr.setLimit(50);
  gr.query();
  var items = [];
  while (gr.next()) {
    items.push({
      sys_id: gr.getUniqueValue(), number: gr.getValue('number'), name: gr.getValue('name'),
      category: gr.getDisplayValue('category'), series: gr.getValue('series'),
      edition: gr.getValue('edition'), description: gr.getValue('description')
    });
  }
  response.setStatus(200);
  response.setBody({ count: items.length, collectibles: items });
})(request, response);
