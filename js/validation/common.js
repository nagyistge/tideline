var Joi = require('joi');

module.exports = Joi.object().keys({
  // deviceTime is the raw, non-timezone-aware string, so won't validate as isoDate()
  deviceTime: Joi.string().regex(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
  // all IDs must be alphanumeric plus - or _ but no other special characters
  id: Joi.string().regex(/^[A-Za-z0-9\-\_]+$/).required(),
  // some types optionally have a joinKey, with the same characters requirements as IDs
  // _ not included here because that only occurs in IDs not generated server-side
  joinKey: Joi.string().regex(/^[A-Za-z0-9\-]+$/),
  normalTime: Joi.string().isoDate(),
  type: Joi.string().valid([
    'basal-rate-segment',
    'bolus',
    'cbg',
    // NB: other than allowing the type, deviceMeta doesn't get validated
    // because it doesn't get visualized
    // only deviceMetas transformed into basal-rate-segments are visualized
    'deviceMeta',
    'message',
    'settings',
    'smbg',
    'wizard']).invalid(['basal-settings-segment', 'fill']).required()
});