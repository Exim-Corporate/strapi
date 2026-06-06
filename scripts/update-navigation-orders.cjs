'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../../frontend/.env') });
const http = require('http');
const TOKEN = process.env.STRAPI_TOKEN;
const BASE = 'http://localhost:1337';

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE + path);
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      method, hostname: url.hostname, port: url.port || 80,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json', Authorization: 'Bearer ' + TOKEN,
        ...(data ? {'Content-Length': Buffer.byteLength(data)} : {}),
      },
    };
    const req = http.request(opts, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          if (res.statusCode >= 400) { console.error('  ERR ' + res.statusCode + ' [' + method + ' ' + url.pathname + ']: ' + JSON.stringify(j.error || j).substring(0,200)); resolve(null); }
          else resolve(j);
        } catch(e) { console.error('  PARSE ERR: ' + d.substring(0,200)); resolve(null); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

const LOCALES = ['en','de','fr','es'];

const SERVICE_ORDERS = {
  'artificial-intelligence':     {headerOrder:1, footerOrder:1},
  'virtual-cto':                 {headerOrder:2, footerOrder:2},
  'enterprise-search':           {headerOrder:3, footerOrder:3},
  'ai-chatbots':                 {headerOrder:4, footerOrder:4},
  'cloud-services':              {headerOrder:5, footerOrder:5},
  'data-engineering':            {headerOrder:6, footerOrder:6},
  'custom-software-development': {headerOrder:7, footerOrder:7},
  'web-application-development': {headerOrder:8, footerOrder:8},
  'mobile-development':          {headerOrder:9, footerOrder:9},
};

const INDUSTRY_ORDERS = {
  'finance-fintech':  {headerOrder:1,  footerOrder:1},
  'banking':          {headerOrder:2,  footerOrder:2},
  'healthcare':       {headerOrder:3,  footerOrder:3},
  'retail':           {headerOrder:4,  footerOrder:4},
  'education-edtech': {headerOrder:5,  footerOrder:5},
  'e-commerce':       {headerOrder:6,  footerOrder:6},
  'logistics':        {headerOrder:7,  footerOrder:7},
  'manufacturing':    {headerOrder:8,  footerOrder:8},
  'insurance':        {headerOrder:9,  footerOrder:9},
  'pharmaceuticals':  {headerOrder:10, footerOrder:10},
  'automotive':       {headerOrder:11, footerOrder:11},
  'food-beverage':    {headerOrder:12, footerOrder:12},
};

async function fetchPages(endpoint, locale, status, fields) {
  const q = new URLSearchParams({locale, 'pagination[limit]':'100', status: status||'draft'});
  (fields||['title','slug','footerOrder','headerOrder']).forEach((f,i) => q.set('fields['+i+']', f));
  const r = await request('GET', '/api/'+endpoint+'?'+q);
  return r && r.data ? r.data : [];
}

async function publish(endpoint, docId, locale) {
  const q = locale ? '?locale='+locale : '';
  return request('POST', '/api/'+endpoint+'/'+docId+'/actions/publish'+q);
}

async function updateOrders(endpoint, orderMap) {
  console.log('\n=== '+endpoint+' ===');
  const enPages = await fetchPages(endpoint, 'en', 'draft', ['title','slug']);
  const bySlug = {};
  enPages.forEach(p => bySlug[p.slug] = p.documentId);
  console.log('  Found '+enPages.length+' en pages');

  // Update headerOrder (non-localized) - one PUT per documentId
  for (const [slug, orders] of Object.entries(orderMap)) {
    const docId = bySlug[slug];
    if (!docId) { console.warn('  WARN: missing '+slug); continue; }
    const r = await request('PUT', '/api/'+endpoint+'/'+docId, {data:{headerOrder:orders.headerOrder}});
    if (r) console.log('  ho '+slug+'='+orders.headerOrder+' OK');
  }

  // Update footerOrder for each locale
  for (const locale of LOCALES) {
    const pages = await fetchPages(endpoint, locale, 'draft', ['title','slug','footerOrder']);
    for (const p of pages) {
      const orders = orderMap[p.slug];
      if (!orders) continue;
      const r = await request('PUT', '/api/'+endpoint+'/'+p.documentId+'?locale='+locale, {data:{footerOrder:orders.footerOrder}});
      if (r) console.log('  fo['+locale+'] '+p.slug+'='+orders.footerOrder+' OK');
    }
    // Publish all after updating locale
    for (const p of pages) {
      if (!orderMap[p.slug]) continue;
      await publish(endpoint, p.documentId, locale);
      console.log('  pub['+locale+'] '+p.slug+' OK');
    }
  }
}

async function updateHeaderNavGroupTitles() {
  console.log('\n=== header-navigation group titles ===');
  const translations = {
    en: { aiPrimary:'Core Services', aiExtra:'Full-Cycle Development', expPrimary:'Core Sectors', expExtra:'Extended Expertise' },
    de: { aiPrimary:'Kernservices', aiExtra:'Full-Cycle-Entwicklung', expPrimary:'Kernsektoren', expExtra:'Erweiterte Expertise' },
    fr: { aiPrimary:'Services clés', aiExtra:'Développement Full-Cycle', expPrimary:'Secteurs clés', expExtra:'Expertise étendue' },
    es: { aiPrimary:'Servicios principales', aiExtra:'Desarrollo Full-Cycle', expPrimary:'Sectores principales', expExtra:'Experiencia ampliada' },
  };
  for (const locale of LOCALES) {
    const t = translations[locale];
    const r = await request('PUT', '/api/header-navigation?locale='+locale, {
      data: {
        aiDevelopmentDropdown: { primaryGroupTitle: t.aiPrimary, extraGroupTitle: t.aiExtra },
        expertiseDropdown:     { primaryGroupTitle: t.expPrimary, extraGroupTitle: t.expExtra },
      }
    });
    if (r) console.log('  '+locale+': group titles updated OK');
  }
}

async function fixAiChatbotsKI() {
  console.log('\n=== ai-chatbots KI check ===');
  for (const locale of LOCALES) {
    const q = new URLSearchParams({locale, 'filters[slug][$eq]':'ai-chatbots', 'pagination[limit]':'1', status:'draft', 'populate[hero]':'true'});
    const res = await request('GET', '/api/service-pages?'+q);
    const page = res && res.data && res.data[0];
    if (!page) { console.log('  '+locale+': not found'); continue; }
    const src = JSON.stringify({title:page.title, hero:page.hero});
    const hasKI = /\bKI\b|KI-/.test(src);
    if (!hasKI) { console.log('  '+locale+': "'+page.title+'" OK'); continue; }
    console.log('  '+locale+': fixing KI errors in "'+page.title+'"...');
    const fix = s => s.replace(/KI-Chatbots/gi,'AI Chatbots').replace(/\bKI-/g,'AI-').replace(/\bKI\b/g,'AI');
    const updates = { title: fix(page.title) };
    if (page.hero) updates.hero = JSON.parse(fix(JSON.stringify(page.hero)));
    const r = await request('PUT', '/api/service-pages/'+page.documentId+'?locale='+locale, {data:updates});
    if (r) {
      await publish('service-pages', page.documentId, locale);
      console.log('  '+locale+': fixed & published OK');
    }
  }
}

async function verify() {
  console.log('\n=== Verification ===');
  const svc = await fetchPages('service-pages','en','published');
  svc.sort((a,b) => (a.headerOrder||999)-(b.headerOrder||999));
  console.log('Services:');
  svc.forEach(s => {
    const e = SERVICE_ORDERS[s.slug];
    console.log('  '+(e&&s.headerOrder===e.headerOrder&&s.footerOrder===e.footerOrder?'OK':'FAIL')+' '+s.slug+': ho='+s.headerOrder+' fo='+s.footerOrder);
  });
  const ind = await fetchPages('industry-pages','en','published');
  ind.sort((a,b) => (a.headerOrder||999)-(b.headerOrder||999));
  console.log('Industries:');
  ind.forEach(i => {
    const e = INDUSTRY_ORDERS[i.slug];
    console.log('  '+(e&&i.headerOrder===e.headerOrder&&i.footerOrder===e.footerOrder?'OK':'FAIL')+' '+i.slug+': ho='+i.headerOrder+' fo='+i.footerOrder);
  });
  // Header nav check
  const q = new URLSearchParams({locale:'en',
    'populate[aiDevelopmentDropdown][populate][links][fields][0]':'slug',
    'populate[aiDevelopmentDropdown][populate][links][fields][1]':'headerOrder',
    'populate[aiDevelopmentDropdown][populate][extraLinks][fields][0]':'slug',
    'populate[aiDevelopmentDropdown][populate][extraLinks][fields][1]':'headerOrder',
    'populate[expertiseDropdown][populate][links][fields][0]':'slug',
    'populate[expertiseDropdown][populate][links][fields][1]':'headerOrder',
    'populate[expertiseDropdown][populate][extraLinks][fields][0]':'slug',
    'populate[expertiseDropdown][populate][extraLinks][fields][1]':'headerOrder',
  });
  const nav = await request('GET', '/api/header-navigation?'+q);
  const nd = nav && nav.data;
  if (nd) {
    const ai = nd.aiDevelopmentDropdown; const ex = nd.expertiseDropdown;
    console.log('Header Nav EN:');
    console.log('  AI primary="'+ai.primaryGroupTitle+'" extra="'+ai.extraGroupTitle+'"');
    console.log('  AI links: '+((ai.links||[]).map(x=>x.slug+'('+x.headerOrder+')').join(', ')));
    console.log('  AI extra: '+((ai.extraLinks||[]).map(x=>x.slug+'('+x.headerOrder+')').join(', ')));
    console.log('  Exp primary="'+ex.primaryGroupTitle+'" extra="'+ex.extraGroupTitle+'"');
    console.log('  Exp links: '+((ex.links||[]).map(x=>x.slug+'('+x.headerOrder+')').join(', ')));
    console.log('  Exp extra: '+((ex.extraLinks||[]).map(x=>x.slug+'('+x.headerOrder+')').join(', ')));
  }
}

async function main() {
  await updateOrders('service-pages', SERVICE_ORDERS);
  await updateOrders('industry-pages', INDUSTRY_ORDERS);
  await updateHeaderNavGroupTitles();
  await fixAiChatbotsKI();
  await verify();
  console.log('\nDone!');
}
main().catch(e => { console.error('FATAL:', e); process.exit(1); });
