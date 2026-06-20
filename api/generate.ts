import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

function buildPrompt(data: {
  grade: string
  origin: string
  storage: string
  delivery: string
  highlight: string
}) {
  const fields = [
    data.grade && `등급: ${data.grade}`,
    data.origin && `원산지: ${data.origin}`,
    data.storage && `보관 방법: ${data.storage}`,
    data.delivery && `배송 방식: ${data.delivery}`,
    data.highlight && `강조할 점: ${data.highlight}`,
  ].filter(Boolean).join('\n')

  return `당신은 이커머스 상품 카피라이터입니다.

반드시 지켜야 할 규칙:
- 판매자가 입력한 정보와 사진에서 실제로 보이는 것만 사용하세요.
- 입력되지 않은 정보는 절대 추측하거나 단언하지 마세요.
- 과장·허위 표현을 사용하지 마세요.

판매자 입력 정보:
${fields || '(입력된 정보 없음)'}

위 정보와 첨부 사진을 바탕으로 아래 JSON 형식으로만 응답하세요:
{
  "name": "상품명 (원산지·등급·용량 등 핵심 정보 포함, 30자 이내)",
  "sellingPoints": ["셀링포인트1", "셀링포인트2", "셀링포인트3"],
  "description": "상세 설명 (3~4문단, 줄바꿈 포함)",
  "tags": ["태그1", "태그2", "태그3", "태그4", "태그5", "태그6"]
}

입력되지 않은 항목은 절대 언급하지 마세요.
반드시 순수 JSON만 응답하세요. 마크다운, 코드블록, 설명 텍스트 없이 { 로 시작해서 } 로 끝나야 합니다.`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { image, mimeType, grade, origin, storage, delivery, highlight } = req.body

  if (!image) {
    return res.status(400).json({ error: '이미지가 필요합니다.' })
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: (mimeType ?? 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
                data: image
              }
            },
            {
              type: 'text',
              text: buildPrompt({ grade, origin, storage, delivery, highlight })
            }
          ]
        }
      ]
    })

    const content = response.content[0]
    if (content.type !== 'text') throw new Error('빈 응답')

    return res.status(200).json(JSON.parse(content.text))
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'AI 생성 중 오류가 발생했습니다.' })
  }
}
