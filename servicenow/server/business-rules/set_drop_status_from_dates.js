// Business Rule: CollectNow - Set Drop Status from Dates
// Table: x_1234_team39_co_0_drop | When: before | Insert: true | Update: true
// Derives status (upcoming / live / past) from release_date and end_date.
// With no end date, a drop becomes "past" one day after release.
(function executeRule(current, previous) {
  var now = new GlideDateTime();
  var status = 'upcoming';
  var rel = current.getValue('release_date');
  if (rel) {
    var release = new GlideDateTime(rel);
    if (release.compareTo(now) <= 0) {
      status = 'live';
      var endVal = current.getValue('end_date');
      var end;
      if (endVal) {
        end = new GlideDateTime(endVal);
      } else {
        end = new GlideDateTime(rel);
        end.addDaysUTC(1);
      }
      if (end.compareTo(now) <= 0) {
        status = 'past';
      }
    }
  }
  current.setValue('status', status);
})(current, previous);
