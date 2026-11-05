// Scripted REST resource: Collectible context
// GET /api/x_1234_team39_co_0/collector/collectible/{id}
// {id} accepts a sys_id or a collectible number (e.g. COL0001012).
// Returns sales history, live/upcoming drops, current listings and a computed market summary.
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

  var id = request.pathParams.id;
  var gr = resolve(id);
  if (!gr) { response.setStatus(404); response.setBody({ error: 'Collectible not found', id: id }); return; }
  var cid = gr.getUniqueValue();

  // Previous sales (newest first) -> last sold + average sold price
  var sales = [], sum = 0, priced = 0;
  var sg = new GlideRecord(SCOPE + 'sale');
  sg.addQuery('collectible', cid);
  sg.orderByDesc('sale_date');
  sg.query();
  while (sg.next()) {
    var sp = toNum(sg.getValue('sale_price'));
    if (sp !== null) { sum += sp; priced++; }
    sales.push({
      sys_id: sg.getUniqueValue(), number: sg.getValue('number'), price: sp,
      sale_date: sg.getValue('sale_date'), condition: sg.getDisplayValue('item_condition'),
      marketplace: sg.getDisplayValue('marketplace'), store: sg.getDisplayValue('store'),
      url: sg.getValue('sale_url')
    });
  }
  var lastSold = sales.length ? sales[0] : null;
  var avg = priced ? Math.round((sum / priced) * 100) / 100 : null;

  // Live and upcoming drops, soonest first
  var currentDrops = [], upcomingDrops = [];
  var dg = new GlideRecord(SCOPE + 'drop');
  dg.addQuery('collectible', cid);
  dg.addQuery('status', 'IN', 'live,upcoming');
  dg.orderBy('release_date');
  dg.query();
  while (dg.next()) {
    var drop = {
      sys_id: dg.getUniqueValue(), number: dg.getValue('number'), name: dg.getValue('name'),
      store: dg.getDisplayValue('store'), status: dg.getValue('status'),
      release_date: dg.getValue('release_date'), end_date: dg.getValue('end_date'),
      retail_price: toNum(dg.getValue('retail_price'))
    };
    if (drop.status === 'live') currentDrops.push(drop); else upcomingDrops.push(drop);
  }

  // Listings, cheapest first; lowest price ignores sold-out listings
  var listings = [], lowest = null;
  var lg = new GlideRecord(SCOPE + 'listing');
  lg.addQuery('collectible', cid);
  lg.orderBy('price');
  lg.query();
  while (lg.next()) {
    var price = toNum(lg.getValue('price'));
    var availRaw = lg.getValue('availability');
    listings.push({
      sys_id: lg.getUniqueValue(), number: lg.getValue('number'), store: lg.getDisplayValue('store'),
      price: price, condition: lg.getDisplayValue('item_condition'),
      availability: lg.getDisplayValue('availability'), url: lg.getValue('listing_url')
    });
    if (availRaw !== 'sold_out' && price !== null && (lowest === null || price < lowest)) lowest = price;
  }

  // Deal signal: lowest in-stock price vs. average sold price
  var dealSignal = null;
  if (lowest !== null && avg !== null && avg > 0) {
    var diff = (lowest - avg) / avg;
    if (diff <= -0.15) dealSignal = 'great_deal';
    else if (diff <= 0.1) dealSignal = 'fair';
    else dealSignal = 'overpriced';
  }

  response.setStatus(200);
  response.setBody({
    collectible: {
      sys_id: gr.getUniqueValue(), number: gr.getValue('number'), name: gr.getValue('name'),
      category: gr.getDisplayValue('category'), series: gr.getValue('series'),
      edition: gr.getValue('edition'), description: gr.getValue('description')
    },
    market: {
      last_sold_price: lastSold ? lastSold.price : null,
      last_sold_date: lastSold ? lastSold.sale_date : null,
      average_sold_price: avg, sales_count: sales.length,
      lowest_current_price: lowest, deal_signal: dealSignal
    },
    previous_sales: sales, current_drops: currentDrops,
    upcoming_drops: upcomingDrops, current_listings: listings
  });
})(request, response);
