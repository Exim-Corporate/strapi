const { compileStrapi, createStrapi } = require('@strapi/core');

const CTA_BUTTON_TEXT = 'Request Proposal';
const CTA_BUTTON_URL = '/#contact-us';

const COLLECTIONS = [
  {
    uid: 'api::industry-page.industry-page',
    typeLabel: 'industry',
    buildContent: title => ({
      title: `Need a technology partner for ${title}?`,
      description:
        `We help companies in ${title.toLowerCase()} plan delivery, assemble the right team, and launch software with clear milestones and long-term support.`,
      buttonText: CTA_BUTTON_TEXT,
      buttonUrl: CTA_BUTTON_URL,
      imageAlt: `${title} CTA image`,
    }),
  },
  {
    uid: 'api::service-page.service-page',
    typeLabel: 'service',
    buildContent: title => ({
      title: `Need help with ${title}?`,
      description:
        `Talk to our team about scope, delivery model, and the fastest way to move your ${title.toLowerCase()} initiative from plan to execution.`,
      buttonText: CTA_BUTTON_TEXT,
      buttonUrl: CTA_BUTTON_URL,
      imageAlt: `${title} CTA image`,
    }),
  },
  {
    uid: 'api::referral-page.referral-page',
    typeLabel: 'referral',
    buildContent: title => ({
      title: `Want to grow through ${title.toLowerCase()}?`,
      description:
        `Talk to our team about launching ${title.toLowerCase()} with a clear incentive model, delivery process, and measurable partner outcomes.`,
      buttonText: CTA_BUTTON_TEXT,
      buttonUrl: CTA_BUTTON_URL,
      imageAlt: `${title} CTA image`,
    }),
  },
];

const shouldSkipEntry = entry => Boolean(entry?.ctaSection?.title);

const getEntryLocale = entry => entry?.locale || undefined;

async function populateCollection(app, config) {
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
    published: 0,
    skipped: 0,
  };

  for (const entry of entries) {
    const locale = getEntryLocale(entry);
    const hasDraftCta = shouldSkipEntry(entry);
    const publishedLocales = await documentManager.findLocales(entry.documentId, config.uid, {
      locale,
      isPublished: true,
      populate: {
        ctaSection: true,
      },
    });
    const hasPublishedVersions = publishedLocales.length > 0;
    const publishedHasCta = publishedLocales.every(version => Boolean(version?.ctaSection?.title));

    if (!hasDraftCta) {
      const ctaSection = config.buildContent(entry.title);

      await documentManager.update(entry.documentId, config.uid, {
        locale,
        data: {
          ctaSection,
        },
      });

      summary.updated += 1;

      console.log(
        `[cta] Updated ${config.typeLabel} page: ${entry.title} (${entry.slug})${locale ? ` [${locale}]` : ''}`,
      );
    }

    if (hasPublishedVersions && (!publishedHasCta || !hasDraftCta)) {
      await documentManager.publish(entry.documentId, config.uid, { locale });
      summary.published += 1;

      console.log(
        `[cta] Published ${config.typeLabel} page: ${entry.title} (${entry.slug})${locale ? ` [${locale}]` : ''}`,
      );
      continue;
    }

    if (hasDraftCta) {
      summary.skipped += 1;
    }
  }

  return summary;
}

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  try {
    const results = [];

    for (const collection of COLLECTIONS) {
      results.push(await populateCollection(app, collection));
    }

    console.log('\nCTA section population summary:');

    for (const result of results) {
      console.log(
        `${result.uid}: total=${result.total}, updated=${result.updated}, published=${result.published}, skipped=${result.skipped}`,
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
    console.error('[cta] Population failed:', error);
    process.exit(1);
  });