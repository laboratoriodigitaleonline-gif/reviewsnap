import Anthropic from '@anthropic-ai/sdk';
import type { ScrapedData } from './scraper';
import type { Locale } from './translations';

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

const AFFILIATE = {
  en: { domain: 'amazon.com', tag: 'reviewsnap06-20' },
  it: { domain: 'amazon.it',  tag: 'labodigionlii-21' },
};

export async function analyzeReviews(data: ScrapedData, locale: Locale = 'en'): Promise<AnalysisResult> {
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
${locale === 'it' ? '\nIMPORTANT: Write every text value in the JSON in Italian. All strings (verdict, pros, cons, problem names, goodFor, notGoodFor) must be in Italian.\n' : ''}
REVIEWS:
${reviewsText}

Return ONLY valid JSON — no markdown, no code fences, no extra text — matching this exact schema:
{
  "verdict": "${locale === 'it' ? 'Valutazione complessiva di 3-4 frasi su qualità, valore e a chi si adatta meglio' : '3-4 sentence overall assessment covering quality, value, and who it suits best'}",
  "pros": ["specific pro 1", "specific pro 2", "specific pro 3", "specific pro 4", "specific pro 5"],
  "cons": ["specific con 1", "specific con 2", "specific con 3", "specific con 4", "specific con 5"],
  "problems": [
    {"name": "${locale === 'it' ? 'Etichetta problema (3-5 parole)' : 'Short problem label (3-5 words)'}", "percentage": 32},
    {"name": "${locale === 'it' ? 'Etichetta problema' : 'Short problem label'}", "percentage": 24},
    {"name": "${locale === 'it' ? 'Etichetta problema' : 'Short problem label'}", "percentage": 18},
    {"name": "${locale === 'it' ? 'Etichetta problema' : 'Short problem label'}", "percentage": 11},
    {"name": "${locale === 'it' ? 'Etichetta problema' : 'Short problem label'}", "percentage": 7}
  ],
  "goodFor": ["${locale === 'it' ? 'tipo di acquirente o caso d\'uso' : 'buyer type or use case'}", "...", "...", "..."],
  "notGoodFor": ["${locale === 'it' ? 'tipo di acquirente o caso d\'uso' : 'buyer type or use case'}", "...", "..."]
}

Rules:
- Percentages represent how frequently that issue appears across reviews (they need not sum to 100)
- Keep pros/cons specific and actionable, not generic
- goodFor / notGoodFor should be concise labels (2-4 words each)${locale === 'it' ? '\n- All text values must be in Italian' : ''}`,
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
    affiliateUrl: `https://www.${AFFILIATE[locale].domain}/dp/${data.asin}?tag=${AFFILIATE[locale].tag}`,
  };
}
