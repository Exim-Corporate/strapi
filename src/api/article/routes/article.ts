/**
 * article router.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::article.article');

// export default {
//   routes: [
//     {
//       method: 'GET',
//       path: '/articles/:slug',
//       handler: 'article.findOne',
//       config: {
//         policies: [],
//       },
//     },
//   ],
// };
