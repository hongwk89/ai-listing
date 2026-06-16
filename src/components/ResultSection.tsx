import { useState, useEffect } from 'react'
import type { ProductResult } from '../types'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={handleCopy} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
      {copied ? '복사됨 ✓' : '복사'}
    </button>
  )
}

interface Props {
  result: ProductResult
}

export function ResultSection({ result }: Props) {
  const [edited, setEdited] = useState(result)

  useEffect(() => {
    setEdited(result)
  }, [result])

  const updateSellingPoint = (index: number, value: string) => {
    const updated = [...edited.sellingPoints]
    updated[index] = value
    setEdited(prev => ({ ...prev, sellingPoints: updated }))
  }

  const inputClass = 'w-full focus:outline-none bg-transparent'

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">상품명</span>
          <CopyButton text={edited.name} />
        </div>
        <input
          type="text"
          value={edited.name}
          onChange={(e) => setEdited(prev => ({ ...prev, name: e.target.value }))}
          className={`${inputClass} text-sm font-semibold text-gray-900`}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">핵심 셀링포인트</span>
          <CopyButton text={edited.sellingPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')} />
        </div>
        <ul className="space-y-2">
          {edited.sellingPoints.map((point, i) => (
            <li key={i} className="flex gap-2 items-start">
              <span className="text-green-500 font-medium text-sm mt-0.5 shrink-0">{i + 1}.</span>
              <input
                type="text"
                value={point}
                onChange={(e) => updateSellingPoint(i, e.target.value)}
                className={`${inputClass} text-sm text-gray-700`}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">상세 설명</span>
          <CopyButton text={edited.description} />
        </div>
        <textarea
          value={edited.description}
          onChange={(e) => setEdited(prev => ({ ...prev, description: e.target.value }))}
          rows={6}
          className={`${inputClass} text-sm text-gray-700 resize-none leading-relaxed`}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">추천 태그</span>
          <CopyButton text={edited.tags.map(t => `#${t}`).join(' ')} />
        </div>
        <div className="flex flex-wrap gap-2">
          {edited.tags.map((tag, i) => (
            <span key={i} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
              #{tag}
              <button
                onClick={() => setEdited(prev => ({ ...prev, tags: prev.tags.filter((_, idx) => idx !== i) }))}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
