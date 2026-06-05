const { compileStrapi, createStrapi } = require('@strapi/core');

const CTA_URL = '/#contact-us';

const PAGE_CONTENT = {
  'api::home-page.home-page': {
    typeLabel: 'home-page',
    byLocale: {
      en: {
        title: 'Need a reliable delivery team?',
        description:
          'We help you ship faster with pre-vetted developers, designers, QA engineers, and a process that keeps delivery predictable.',
        buttonText: 'Book a call',
        buttonUrl: CTA_URL,
        imageAlt: 'AS Exim homepage CTA image',
      },
      de: {
        title: 'Brauchen Sie ein zuverlässiges Delivery-Team?',
        description:
          'Wir helfen Ihnen, schneller zu liefern — mit vorgeprüften Entwicklern, Designern und QA Engineers sowie einem planbaren Prozess.',
        buttonText: 'Gespräch buchen',
        buttonUrl: CTA_URL,
        imageAlt: 'AS Exim Startseiten-CTA-Bild',
      },
      fr: {
        title: 'Besoin d’une équipe de livraison fiable ?',
        description:
          'Nous vous aidons à livrer plus vite avec des développeurs, designers et QA ingénieurs pré-sélectionnés et un process clair.',
        buttonText: 'Réserver un appel',
        buttonUrl: CTA_URL,
        imageAlt: 'Image CTA de la page d’accueil AS Exim',
      },
      es: {
        title: '¿Necesitas un equipo de entrega fiable?',
        description:
          'Te ayudamos a entregar más rápido con desarrolladores, diseñadores y QA preseleccionados y un proceso predecible.',
        buttonText: 'Reservar una llamada',
        buttonUrl: CTA_URL,
        imageAlt: 'Imagen CTA de la página principal de AS Exim',
      },
    },
  },
  'api::blog-page.blog-page': {
    typeLabel: 'blog-page',
    byLocale: {
      en: {
        title: 'Want to turn ideas into shipped products?',
        description:
          'Talk to our team about delivery scope, team setup, and the fastest way to move your next product from draft to launch.',
        buttonText: 'Request a proposal',
        buttonUrl: CTA_URL,
        imageAlt: 'AS Exim blog CTA image',
      },
      de: {
        title: 'Möchten Sie Ideen in fertige Produkte verwandeln?',
        description:
          'Sprechen Sie mit unserem Team über Umfang, Teamaufbau und den schnellsten Weg von der Idee zum Launch.',
        buttonText: 'Angebot anfordern',
        buttonUrl: CTA_URL,
        imageAlt: 'AS Exim Blog-CTA-Bild',
      },
      fr: {
        title: 'Envie de transformer vos idées en produits livrés ?',
        description:
          'Parlez à notre équipe du périmètre, de la configuration d’équipe et du moyen le plus rapide d’aller du concept au lancement.',
        buttonText: 'Demander une proposition',
        buttonUrl: CTA_URL,
        imageAlt: 'Image CTA du blog AS Exim',
      },
      es: {
        title: '¿Quieres convertir ideas en productos lanzados?',
        description:
          'Habla con nuestro equipo sobre alcance, equipo y la forma más rápida de pasar del borrador al lanzamiento.',
        buttonText: 'Solicitar propuesta',
        buttonUrl: CTA_URL,
        imageAlt: 'Imagen CTA del blog de AS Exim',
      },
    },
  },
};

const LOCALES = ['en', 'de', 'fr', 'es'];

const getEntryLocale = entry => entry?.locale || undefined;

async function populateSinglePage(app, config) {
  const documentManager = app.plugin('content-manager').service('document-manager');
  const entries = await documentManager.findMany(
    {
      locale: '*',
      status: 'draft',
    },
    config.uid,
  );

  const summary = {
    uid: config.uid,
    total: entries.length,
    updated: 0,
  };

  for (const entry of entries) {
    const locale = getEntryLocale(entry) || 'en';
    const ctaSection = config.byLocale[locale] || config.byLocale.en;

    await documentManager.update(entry.documentId, config.uid, {
      locale,
      data: {
        ctaSection,
      },
    });

    summary.updated += 1;

    console.log(`[cta] Updated ${config.typeLabel}: ${locale} (${entry.documentId})`);
  }

  return summary;
}

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  try {
    const results = [];

    for (const uid of Object.keys(PAGE_CONTENT)) {
      results.push(await populateSinglePage(app, { uid, ...PAGE_CONTENT[uid] }));
    }

    console.log('\nHome/blog CTA population summary:');
    for (const result of results) {
      console.log(
        `${result.uid}: total=${result.total}, updated=${result.updated}`,
      );
    }
  } finally {
    await app.destroy();
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('[cta] Home/blog population failed:', error);
    process.exit(1);
  });
