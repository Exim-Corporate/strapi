/* jshint esversion: 9 */
const { compileStrapi, createStrapi } = require('@strapi/core');

const SERVICE_ORDERS = {
  'artificial-intelligence':     { headerOrder: 1 },
  'virtual-cto':                 { headerOrder: 2 },
  'enterprise-search':           { headerOrder: 3 },
  'ai-chatbots':                 { headerOrder: 4 },
  'cloud-services':              { headerOrder: 5 },
  'data-engineering':            { headerOrder: 6 },
  'custom-software-development': { headerOrder: 7 },
  'web-application-development': { headerOrder: 8 },
  'mobile-development':          { headerOrder: 9 },
};

const INDUSTRY_ORDERS = {
  'finance-fintech':  { headerOrder: 1 },
  'banking':          { headerOrder: 2 },
  'healthcare':       { headerOrder: 3 },
  'retail':           { headerOrder: 4 },
  'education-edtech': { headerOrder: 5 },
  'e-commerce':       { headerOrder: 6 },
  'logistics':        { headerOrder: 7 },
  'manufacturing':    { headerOrder: 8 },
  'insurance':        { headerOrder: 9 },
  'pharmaceuticals':  { headerOrder: 10 },
  'automotive':       { headerOrder: 11 },
  'food-beverage':    { headerOrder: 12 },
};

async function updateAndPublish(app, uid, orderMap) {
  const ds = app.documents(uid);
  const locales = ['en', 'de', 'fr', 'es'];
  const label = uid.split('::')[1].split('.')[0];

  const pages = await ds.findMany({ locale: 'en', status: 'published', pagination: { page: 1, pageSize: 100 } });
  const list = Array.isArray(pages) ? pages : (pages.results || []);
  console.log('  ' + label + ': ' + list.length + ' published docs');

  for (const page of list) {
    const orders = orderMap[page.slug];
    if (!orders) continue;
    await ds.update({ documentId: page.documentId, locale: 'en', data: { headerOrder: orders.headerOrder } });
    for (const locale of locales) {
      try { await ds.publish({ documentId: page.documentId, locale }); } catch (_) {}
    }
    console.log('  ' + page.slug + ' headerOrder=' + orders.headerOrder + ' OK');
  }
}

async function verify(app, uid, orderMap) {
  const ds = app.documents(uid);
  const pages = await ds.findMany({ locale: 'en', status: 'published', pagination: { page: 1, pageSize: 100 } });
  const list = (Array.isArray(pages) ? pages : (pages.results || [])).sort((a, b) => (a.headerOrder || 999) - (b.headerOrder || 999));
  list.forEach(p => {
    const exp = orderMap[p.slug];
    console.log((exp && p.headerOrder === exp.headerOrder ? '  OK' : '  FAIL') + ' ' + p.slug + ' ho=' + p.headerOrder);
  });
}

(async () => {
  const ctx = await compileStrapi();
  const app = await createStrapi(ctx).load();
  try {
    console.log('=== service-pages ===');
    await updateAndPublish(app, 'api::service-page.service-page', SERVICE_ORDERS);
    console.log('\n=== industry-pages ===');
    await updateAndPublish(app, 'api::industry-page.industry-page', INDUSTRY_ORDERS);
    console.log('\n=== Verify services ===');
    await verify(app, 'api::service-page.service-page', SERVICE_ORDERS);
    console.log('\n=== Verify industries ===');
    await verify(app, 'api::industry-page.industry-page', INDUSTRY_ORDERS);
  } finally {
    await app.destroy();
  }
})().catch(e => { console.error('FATAL:', e.message || e); process.exit(1); });
