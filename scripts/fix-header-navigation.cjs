'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { compileStrapi, createStrapi } = require('@strapi/core');

const LOCALES = ['en', 'de', 'fr', 'es'];

const LABELS = {
  en: { services: 'Services', expertise: 'Expertise' },
  de: { services: 'Dienstleistungen', expertise: 'Expertise' },
  fr: { services: 'Services', expertise: 'Expertise' },
  es: { services: 'Servicios', expertise: 'Expertise' },
};

const SERVICE_PRIMARY = ['artificial-intelligence', 'virtual-cto', 'enterprise-search', 'ai-chatbots', 'cloud-services', 'data-engineering'];
const SERVICE_EXTRA = ['custom-software-development', 'web-application-development', 'mobile-development'];
const INDUSTRY_PRIMARY = ['finance-fintech', 'banking', 'healthcare', 'retail', 'education-edtech', 'e-commerce'];
const INDUSTRY_EXTRA = ['logistics', 'manufacturing', 'insurance', 'pharmaceuticals', 'automotive', 'food-beverage'];

async function getMap(ds, locale, slugs) {
  const res = await ds.findMany({ locale, status: 'published', pagination: { page: 1, pageSize: 100 } });
  const list = Array.isArray(res) ? res : (res.results || []);
  const map = new Map();
  for (const item of list) {
    if (slugs.includes(item.slug)) map.set(item.slug, item.documentId);
  }
  return map;
}

(async () => {
  const ctx = await compileStrapi();
  const app = await createStrapi(ctx).load();
  try {
    const ds = app.documents('api::header-navigation.header-navigation');
    for (const locale of LOCALES) {
      const serviceMap = await getMap(app.documents('api::service-page.service-page'), locale, [...SERVICE_PRIMARY, ...SERVICE_EXTRA]);
      const industryMap = await getMap(app.documents('api::industry-page.industry-page'), locale, [...INDUSTRY_PRIMARY, ...INDUSTRY_EXTRA]);
      const navRes = await ds.findMany({ locale, status: 'published' });
      const nav = Array.isArray(navRes) ? navRes[0] : (navRes.results ? navRes.results[0] : navRes);
      if (!nav) {
        console.log(locale + ': header navigation not found');
        continue;
      }

      const payload = {
        aiDevelopmentDropdown: {
          label: LABELS[locale].services,
          primaryGroupTitle: locale === 'de' ? 'Kernservices' : locale === 'fr' ? 'Services principaux' : locale === 'es' ? 'Servicios principales' : 'Core services',
          links: {
            connect: SERVICE_PRIMARY.map(slug => ({ documentId: serviceMap.get(slug), status: 'published' })).filter(x => x.documentId),
          },
          extraGroupTitle: locale === 'de' ? 'Full-Cycle-Entwicklung' : locale === 'fr' ? 'Développement Full-Cycle' : locale === 'es' ? 'Desarrollo Full-Cycle' : 'Full-Cycle Development',
          extraLinks: {
            connect: SERVICE_EXTRA.map(slug => ({ documentId: serviceMap.get(slug), status: 'published' })).filter(x => x.documentId),
          },
        },
        expertiseDropdown: {
          label: LABELS[locale].expertise,
          primaryGroupTitle: locale === 'de' ? 'Kernsektoren' : locale === 'fr' ? 'Secteurs clés' : locale === 'es' ? 'Sectores principales' : 'Core Sectors',
          links: {
            connect: INDUSTRY_PRIMARY.map(slug => ({ documentId: industryMap.get(slug), status: 'published' })).filter(x => x.documentId),
          },
          extraGroupTitle: locale === 'de' ? 'Erweiterte Expertise' : locale === 'fr' ? 'Expertise étendue' : locale === 'es' ? 'Experiencia ampliada' : 'Extended Expertise',
          extraLinks: {
            connect: INDUSTRY_EXTRA.map(slug => ({ documentId: industryMap.get(slug), status: 'published' })).filter(x => x.documentId),
          },
        },
      };

      await ds.update({ documentId: nav.documentId, locale, data: payload });
      console.log(locale + ': updated and published');
    }

    const verify = await ds.findMany({ locale: 'en', status: 'published' });
    const nav = Array.isArray(verify) ? verify[0] : (verify.results ? verify.results[0] : verify);
    console.log('EN header labels:', nav.aiDevelopmentDropdown?.label, nav.expertiseDropdown?.label);
  } finally {
    await app.destroy();
  }
})().catch(err => { console.error(err); process.exit(1); });
