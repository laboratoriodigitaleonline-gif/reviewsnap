import Anthropic from '@anthropic-ai/sdk';
import type { ScrapedData } from './scraper';

export interface Problem {
  name: string;
  percentage: number;
}

export interface AnalysisResult {
  productName: string;
  rating: number;
  reviewCount: number;
  asin: string;
  imageUrl: string;
  price: string;
  verdict: string;
  pros: string[];
  cons: string[];
  problems: Problem[];
  goodFor: string[];
  notGoodFor: string[];
  affiliateUrl: string;
}

const client = new Anthropic();

export async function analyzeReviews(data: ScrapedData): Promise<AnalysisResult> {
  const reviewsText = data.reviews
    .map((r, i) => `Review ${i + 1}: ${r}`)
    .join('\n\n');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are a product research assistant. Analyze the following Amazon customer reviews for the product "${data.productName}" and return a structured JSON analysis.

REVIEWS:
${reviewsText}

Return ONLY valid JSON — no markdown, no code fences, no extra text — matching this exact schema:
{
  "verdict": "3-4 sentence overall assessment covering quality, value, and who it suits best",
  "pros": ["specific pro 1", "specific pro 2", "specific pro 3", "specific pro 4", "specific pro 5"],
  "cons": ["specific con 1", "specific con 2", "specific con 3", "specific con 4", "specific con 5"],
  "problems": [
    {"name": "Short problem label (3-5 words)", "percentage": 32},
    {"name": "Short problem label", "percentage": 24},
    {"name": "Short problem label", "percentage": 18},
    {"name": "Short problem label", "percentage": 11},
    {"name": "Short problem label", "percentage": 7}
  ],
  "goodFor": ["buyer type or use case", "buyer type or use case", "buyer type or use case", "buyer type or use case"],
  "notGoodFor": ["buyer type or use case", "buyer type or use case", "buyer type or use case"]
}

Rules:
- Percentages represent how frequently that issue appears across reviews (they need not sum to 100)
- Keep pros/cons specific and actionable, not generic
- goodFor / notGoodFor should be concise labels (2-4 words each)`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected Claude response type.');

  let parsed: Omit<AnalysisResult, 'productName' | 'rating' | 'reviewCount' | 'asin' | 'affiliateUrl'>;
  try {
    // Strip any accidental markdown fences
    const clean = content.text.replace(/^```(?:json)?\n?/m, '').replace(/```$/m, '').trim();
    parsed = JSON.parse(clean);
  } catch {
    throw new Error('Failed to parse analysis from Claude. Please try again.');
  }

  return {
    productName: data.productName,
    rating: data.rating,
    reviewCount: data.reviewCount,
    asin: data.asin,
    imageUrl: data.imageUrl,
    price: data.price,
    verdict: parsed.verdict,
    pros: parsed.pros,
    cons: parsed.cons,
    problems: parsed.problems,
    goodFor: parsed.goodFor,
    notGoodFor: parsed.notGoodFor,
    affiliateUrl: `https://www.amazon.com/dp/${data.asin}?tag=reviewsnap06-20`,
  };
}
