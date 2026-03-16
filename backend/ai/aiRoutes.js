import express from 'express';
import { rewriteBullet, generateSummary, suggestSkills } from './aiService.js';

const router = express.Router();

function handleError(res, error) {
  // eslint-disable-next-line no-console
  console.error('[AI Route Error]', error);
  const status = error.statusCode || 500;
  return res.status(status).json({
    message: error.message || 'AI request failed',
  });
}

router.post('/rewrite-bullet', async (req, res) => {
  try {
    const { bullet, targetRole } = req.body || {};

    if (!bullet || !targetRole) {
      return res.status(400).json({
        message: 'bullet and targetRole are required',
      });
    }

    const result = await rewriteBullet({ bullet, targetRole });
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
});

router.post('/generate-summary', async (req, res) => {
  try {
    const { experiences, skills, targetRole } = req.body || {};

    if (!experiences || !skills || !targetRole) {
      return res.status(400).json({
        message: 'experiences, skills and targetRole are required',
      });
    }

    const result = await generateSummary({ experiences, skills, targetRole });
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
});

router.post('/suggest-skills', async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body || {};

    if (!resumeText || !targetRole) {
      return res.status(400).json({
        message: 'resumeText and targetRole are required',
      });
    }

    const result = await suggestSkills({ resumeText, targetRole });
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
});

export default router;

