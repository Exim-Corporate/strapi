'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../../frontend/.env') });
const http = require('http');

const TOKEN = process.env.STRAPI_TOKEN;

function fetchJSON(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:1337${path}`, { headers: { Authorization: `Bearer ${TOKEN}` } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(new Error(d.substring(0,300))); } });
    }).on('error', reject);
  });
}

async function main() {
  // Check header nav for all locales
  for (const locale of ['en', 'de', 'fr', 'es']) {
    const q = new URLSearchParams({
      locale,
      'populate[aiDevelopmentDropdown][populate][links][fields][0]': 'title',
      'populate[aiDevelopmentDropdown][populate][links][fields][1]': 'slug',
      'populate[aiDevelopmentDropdown][populate][links][fields][2]': 'footerOrder',
      'populate[aiDevelopmentDropdown][populate][extraLinks][fields][0]': 'title',
      'populate[aiDevelopmentDropdown][populate][extraLinks][fields][1]': 'slug',
      'populate[aiDevelopmentDropdown][populate][extraLinks][fields][2]': 'footerOrder',
      'populate[expertiseDropdown][populate][links][fields][0]': 'title',
      'populate[expertiseDropdown][populate][links][fields][1]': 'slug',
      'populate[expertiseDropdown][populate][links][fields][2]': 'footerOrder',
      'populate[expertiseDropdown][populate][extraLinks][fields][0]': 'title',
      'populate[expertiseDropdown][populate][extraLinks][fields][1]': 'slug',
      'populate[expertiseDropdown][populate][extraLinks][fields][2]': 'footerOrder',
    });
    const nav = await fetchJSON(`/api/header-navigation?${q}`);
    const d = nav.data;
    console.log(`\n=== ${locale.toUpperCase()} ===`);
    if (d) {
      console.log('AI label:', d.aiDevelopmentDropdown?.label);
      console.log('AI primaryGroupTitle:', d.aiDevelopmentDropdown?.primaryGroupTitle);
      console.log('AI extraGroupTitle:', d.aiDevelopmentDropdown?.extraGroupTitle);
      console.log('AI links:', (d.aiDevelopmentDropdown?.links || []).map(x => `${x.slug}(fo:${x.footerOrder})`).join(', '));
      console.log('AI extraLinks:', (d.aiDevelopmentDropdown?.extraLinks || []).map(x => `${x.slug}(fo:${x.footerOrder})`).join(', '));
      console.log('Exp label:', d.expertiseDropdown?.label);
      console.log('Exp primaryGroupTitle:', d.expertiseDropdown?.primaryGroupTitle);
      console.log('Exp extraGroupTitle:', d.expertiseDropdown?.extraGroupTitle);
      console.log('Exp links:', (d.expertiseDropdown?.links || []).map(x => `${x.slug}(fo:${x.footerOrder})`).join(', '));
      console.log('Exp extraLinks:', (d.expertiseDropdown?.extraLinks || []).map(x => `${x.slug}(fo:${x.footerOrder})`).join(', '));
    } else {
      console.log('ERROR:', JSON.stringify(nav).substring(0, 200));
    }
  }

  // Check ai-chatbots content for KI errors in all locales
  console.log('\n=== AI Chatbots content check ===');
  for (const locale of ['en', 'de', 'fr', 'es']) {
    const q2 = new URLSearchParams({
      locale,
      'filters[slug][$eq]': 'ai-chatbots',
      'populate[hero]': 'true',
      'pagination[limit]': '1',
      'status': 'published',
    });
    const res = await fetchJSON(`/api/service-pages?${q2}`);
    const page = res.data && res.data[0];
    if (page) {
      const heroText = JSON.stringify(page.hero || {});
      const hasKI = heroText.toLowerCase().includes(' ki ') || heroText.includes('KI-');
      console.log(`${locale}: title="${page.title}" hasKI=${hasKI}`);
    } else {
      console.log(`${locale}: not found`);
    }
  }
}

main().catch(console.error);
