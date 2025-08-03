/**
 *  article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async findOne(ctx) {
    const { slug } = ctx.params; // Получаем слаг из параметров
    const { query } = ctx; // Получаем query из запроса

    // Ищем статью по слагу
    const entity = await strapi.entityService.findMany('api::article.article', {
      filters: { slug },
      ...query, // Применяем дополнительные параметры из query
    });

    if (!entity || entity.length === 0) {
      return ctx.notFound('Article not found');
    }

    // Возвращаем первую найденную статью
    return this.transformResponse(entity[0]);
  },
}));
