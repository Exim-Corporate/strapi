import type { Schema, Struct } from '@strapi/strapi';

export interface NavigationHeaderIndustriesDropdown
  extends Struct.ComponentSchema {
  collectionName: 'components_navigation_header_industries_dropdowns';
  info: {
    description: 'Industries dropdown configuration for the header';
    displayName: 'Header Industries Dropdown';
  };
  attributes: {
    extraGroupTitle: Schema.Attribute.String;
    extraLinks: Schema.Attribute.Relation<
      'oneToMany',
      'api::industry-page.industry-page'
    >;
    image: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    links: Schema.Attribute.Relation<
      'oneToMany',
      'api::industry-page.industry-page'
    >;
    primaryGroupTitle: Schema.Attribute.String;
  };
}

export interface NavigationHeaderServicesDropdown
  extends Struct.ComponentSchema {
  collectionName: 'components_navigation_header_services_dropdowns';
  info: {
    description: 'Services dropdown configuration for the header';
    displayName: 'Header Services Dropdown';
  };
  attributes: {
    extraGroupTitle: Schema.Attribute.String;
    extraLinks: Schema.Attribute.Relation<
      'oneToMany',
      'api::service-page.service-page'
    >;
    image: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    links: Schema.Attribute.Relation<
      'oneToMany',
      'api::service-page.service-page'
    >;
    primaryGroupTitle: Schema.Attribute.String;
  };
}

export interface SharedAccordion extends Struct.ComponentSchema {
  collectionName: 'components_shared_accordions';
  info: {
    description: 'Shared accordion item with title, description and card';
    displayName: 'Accordion';
  };
  attributes: {
    card: Schema.Attribute.Component<'shared.card', false> &
      Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_cards';
  info: {
    description: 'Shared content card with image, title and description';
    displayName: 'Card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    displayType: Schema.Attribute.Enumeration<
      ['static', 'withBackground', 'withPicture']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'withPicture'>;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedIndustryDescription extends Struct.ComponentSchema {
  collectionName: 'components_shared_industry_descriptions';
  info: {
    description: 'Section below hero with heading and accordion content';
    displayName: 'Industry Description';
  };
  attributes: {
    accordions: Schema.Attribute.Component<'shared.accordion', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    description: Schema.Attribute.Text;
    eyebrowCurrent: Schema.Attribute.String;
    eyebrowPrefix: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Expertise'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedIndustryHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_industry_heroes';
  info: {
    description: 'Hero section for industry expertise pages';
    displayName: 'Industry Hero';
    name: 'IndustryHero';
  };
  attributes: {
    categories: Schema.Attribute.Relation<
      'oneToMany',
      'api::industry-category.industry-category'
    >;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedIndustryStats extends Struct.ComponentSchema {
  collectionName: 'components_shared_industry_stats';
  info: {
    description: 'Benefits and metrics block for industry pages';
    displayName: 'Industry Stats';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedReferralHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_referral_heroes';
  info: {
    description: 'Hero section for referrals page';
    displayName: 'Referral Hero';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    categories: Schema.Attribute.Relation<
      'oneToMany',
      'api::referral-category.referral-category'
    >;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedReferralProgramCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_referral_program_cards';
  info: {
    description: 'Card content for referral program section';
    displayName: 'Referral Program Card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    exampleLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'EXAMPLE'>;
    exampleText: Schema.Attribute.Text;
    points: Schema.Attribute.Component<'shared.referral-program-point', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    styleVariant: Schema.Attribute.Enumeration<['pattern', 'plain']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'plain'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedReferralProgramPoint extends Struct.ComponentSchema {
  collectionName: 'components_shared_referral_program_points';
  info: {
    description: 'Single bullet point for referral program card';
    displayName: 'Referral Program Point';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedReferralProgramSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_referral_program_sections';
  info: {
    description: 'Referral program cards section';
    displayName: 'Referral Program Section';
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.referral-program-card', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedServiceAboutItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_service_about_items';
  info: {
    description: 'Technology card item with icon source mode';
    displayName: 'Service About Item';
  };
  attributes: {
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    iconType: Schema.Attribute.Enumeration<['withSvg', 'static']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'withSvg'>;
    technologyName: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedServiceAboutSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_service_about_sections';
  info: {
    description: 'About section for service pages';
    displayName: 'Service About Section';
  };
  attributes: {
    accordions: Schema.Attribute.Component<'shared.service-about-item', true> &
      Schema.Attribute.Required;
    buttonText: Schema.Attribute.String;
    description: Schema.Attribute.RichText;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedServiceBenefitItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_service_benefit_items';
  info: {
    description: 'Single benefit item with style variant';
    displayName: 'Service Benefit Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    headline: Schema.Attribute.String & Schema.Attribute.Required;
    itemType: Schema.Attribute.Enumeration<['metric', 'statement']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'statement'>;
  };
}

export interface SharedServiceBenefitsBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_service_benefits_blocks';
  info: {
    description: 'Benefits section block for service pages';
    displayName: 'Service Benefits Block';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.service-benefit-item', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedServiceCardsSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_service_cards_sections';
  info: {
    description: 'Capabilities cards section for service pages';
    displayName: 'Service Cards Section';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    cards: Schema.Attribute.Component<'shared.card', true> &
      Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedServiceHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_service_heroes';
  info: {
    description: 'Hero section for service pages';
    displayName: 'Service Hero';
  };
  attributes: {
    categories: Schema.Attribute.Relation<
      'oneToMany',
      'api::service-category.service-category'
    >;
    description: Schema.Attribute.Text;
    imagePrimary: Schema.Attribute.Media<'images'>;
    imageSecondary: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'navigation.header-industries-dropdown': NavigationHeaderIndustriesDropdown;
      'navigation.header-services-dropdown': NavigationHeaderServicesDropdown;
      'shared.accordion': SharedAccordion;
      'shared.card': SharedCard;
      'shared.industry-description': SharedIndustryDescription;
      'shared.industry-hero': SharedIndustryHero;
      'shared.industry-stats': SharedIndustryStats;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.referral-hero': SharedReferralHero;
      'shared.referral-program-card': SharedReferralProgramCard;
      'shared.referral-program-point': SharedReferralProgramPoint;
      'shared.referral-program-section': SharedReferralProgramSection;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.service-about-item': SharedServiceAboutItem;
      'shared.service-about-section': SharedServiceAboutSection;
      'shared.service-benefit-item': SharedServiceBenefitItem;
      'shared.service-benefits-block': SharedServiceBenefitsBlock;
      'shared.service-cards-section': SharedServiceCardsSection;
      'shared.service-hero': SharedServiceHero;
      'shared.slider': SharedSlider;
    }
  }
}
