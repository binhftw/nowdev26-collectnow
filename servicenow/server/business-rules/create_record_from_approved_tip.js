// Business Rule: CollectNow - Create Record from Approved Tip
// Table: x_1234_team39_co_0_tip | When: before | Insert: false | Update: true
// Condition: status CHANGES TO approved
// A Drop tip creates a linked Drop; a Listing/Restock tip creates a linked Store Listing.
// Approval is blocked (with a clear message) when required data is missing.
(function executeRule(current, previous) {
  var tipType = current.getValue('tip_type');
  var collectible = current.getValue('collectible');
  var store = current.getValue('store');

  if (!tipType) {
    gs.addErrorMessage('Set a Tip Type (Drop, Restock or Listing) before approving this tip.');
    current.setAbortAction(true);
    return;
  }
  if (!collectible || !store) {
    gs.addErrorMessage('Fill in Matched Collectible and Matched Store before approving this tip.');
    current.setAbortAction(true);
    return;
  }

  if (tipType == 'drop') {
    if (current.resulting_drop.nil()) {
      if (!current.getValue('suggested_date')) {
        gs.addErrorMessage('Fill in Suggested Date (the release date) before approving a Drop tip.');
        current.setAbortAction(true);
        return;
      }
      var drop = new GlideRecord('x_1234_team39_co_0_drop');
      drop.initialize();
      drop.setValue('name', current.getValue('title'));
      drop.setValue('collectible', collectible);
      drop.setValue('store', store);
      drop.setValue('release_date', current.getValue('suggested_date'));
      if (current.getValue('suggested_price')) {
        drop.setValue('retail_price', current.getValue('suggested_price'));
      }
      var dropId = drop.insert();
      if (dropId) {
        current.setValue('resulting_drop', dropId);
        gs.addInfoMessage('Created drop ' + drop.getValue('number') + ' from this tip.');
      }
    }
  } else {
    if (current.resulting_listing.nil()) {
      var listing = new GlideRecord('x_1234_team39_co_0_listing');
      listing.initialize();
      listing.setValue('collectible', collectible);
      listing.setValue('store', store);
      listing.setValue('availability', 'in_stock');
      if (current.getValue('suggested_price')) {
        listing.setValue('price', current.getValue('suggested_price'));
      }
      if (current.getValue('source_link')) {
        listing.setValue('listing_url', current.getValue('source_link'));
      }
      var listingId = listing.insert();
      if (listingId) {
        current.setValue('resulting_listing', listingId);
        gs.addInfoMessage('Created store listing ' + listing.getValue('number') + ' from this tip.');
      }
    }
  }
})(current, previous);
