// Inbound Email Action: CollectNow - Create Community Tip from Email
// Target table: x_1234_team39_co_0_tip
// Subject "Tip: ..." becomes the title; the body becomes raw text.
// The source (Facebook / WhatsApp / Discord / Reddit / email) is guessed from the body,
// and the first URL becomes the source link.
(function runAction(current, event, email, logger, classifier) {
  var subject = email.subject || '';
  var title = subject.replace(/^\s*tip:\s*/i, '');
  current.setValue('title', title || 'Untitled tip');

  var body = email.body_text || '';
  current.setValue('raw_text', body);
  current.setValue('status', 'pending');

  if (email.from_sys_id) {
    current.setValue('submitted_by', email.from_sys_id);
  }

  var lower = body.toLowerCase();
  var source = 'email';
  if (lower.indexOf('facebook.com') > -1 || lower.indexOf('fb.com') > -1) {
    source = 'facebook';
  } else if (lower.indexOf('whatsapp') > -1 || lower.indexOf('wa.me') > -1) {
    source = 'whatsapp';
  } else if (lower.indexOf('discord') > -1) {
    source = 'discord';
  } else if (lower.indexOf('reddit.com') > -1) {
    source = 'reddit';
  }
  current.setValue('source', source);

  var urlMatch = body.match(/https?:\/\/[^\s<>"]+/i);
  if (urlMatch) {
    current.setValue('source_link', urlMatch[0]);
  }

  current.insert();
  logger.log('Created Community Tip ' + current.getValue('number') + ' from email: ' + subject, 'CollectNow');
})(current, event, email, logger, classifier);
