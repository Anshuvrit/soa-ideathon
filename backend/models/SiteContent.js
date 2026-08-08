const mongoose = require('mongoose');

// Singleton document holding editable site content: rules, dates, themes, resources
const SiteContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    eventName: { type: String, default: 'SOA Ideathon 2026' },
    eventDate: { type: Date, default: () => new Date('2026-09-01T09:00:00.000Z') },
    rulesMarkdown: { type: String, default: '' },
    themes: [{ type: String }],
    resources: [{ title: String, description: String, link: String }],
    checklist: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);
