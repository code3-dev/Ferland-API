import { defineEventHandler, getQuery, EventHandlerResponse } from 'h3';
import Meme from '~/models/Meme';

interface QueryParams {
  fromDate?: string;
  page?: string;
  limit?: string;
}

export default defineEventHandler(async (event): Promise<EventHandlerResponse> => {
  try {
    const query: QueryParams = getQuery(event);
    const { fromDate, page = '1', limit = '10' } = query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    let filter: any = {};

    if (fromDate) {
      filter.date = { $gte: new Date(fromDate) };
    }

    const totalMemes = await Meme.countDocuments(filter);
    const totalPages = Math.ceil(totalMemes / limitNumber);

    const memes = await Meme.find(filter)
      .sort({ date: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .exec();

    return {
      statusCode: 200,
      totalPages,
      currentPage: pageNumber,
      body: {
        memes,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { error: 'Failed to fetch memes' },
    };
  }
});