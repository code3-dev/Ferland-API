import Meme from '~/models/Meme';
import { defineEventHandler, readBody } from 'h3';
import adminConfig from '~/models/Admin';

const REQUIRED_PASSWORD = adminConfig.apiToken;

export default defineEventHandler(async (event) => {
  const password = event.req.headers['x-password'];
  if (!password || password !== REQUIRED_PASSWORD) {
    return {
      status: 401,
      body: { error: 'Unauthorized' },
    };
  }

  const body = await readBody(event);

  if (!body.type || !body.title || !body.height || !body.padding || 
      (body.type === 'image' && !body.image) ||
      (body.type === 'video' && !body.video)) {
    return {
      status: 400,
      body: { error: 'Invalid input' },
    };
  }

  const newMeme = new Meme({
    type: body.type,
    title: body.title,
    description: body.description || "",
    image: body.image || "",
    video: body.video || "",
    height: body.height,
    padding: body.padding,
  });

  try {
    const savedMeme = await newMeme.save();
    return {
      status: 201,
      body: savedMeme,
    };
  } catch (error) {
    return {
      status: 500,
      body: { error: 'Failed to save meme' },
    };
  }
});