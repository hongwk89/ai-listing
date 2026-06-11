import type { ProductInput } from '../types'

interface Props {
  value: ProductInput
  onChange: (value: ProductInput) => void
}

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

export function ProductForm({ value, onChange }: Props) {
  const set = (key: keyof ProductInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onChange({ ...value, [key]: e.target.value })

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>등급</label>
        <select value={value.grade} onChange={set('grade')} className={inputClass}>
          <option value="">선택</option>
          {['특상', '상', '중', '하'].map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>원산지</label>
        <input
          type="text"
          value={value.origin}
          onChange={set('origin')}
          placeholder="예: 제주도, 전남 나주"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>보관 방법</label>
        <input
          type="text"
          value={value.storage}
          onChange={set('storage')}
          placeholder="예: 냉장 보관, 서늘한 곳"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>배송 방식</label>
        <input
          type="text"
          value={value.delivery}
          onChange={set('delivery')}
          placeholder="예: 산지직송, 냉장 배송"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          강조할 점
          <span className="text-gray-400 font-normal ml-1">(선택)</span>
        </label>
        <textarea
          value={value.highlight}
          onChange={set('highlight')}
          placeholder="예: 당도 13브릭스 이상 선별, 수확 후 당일 출하"
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>
    </div>
  )
}
