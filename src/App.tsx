import { useState } from 'react'
import { ImageUpload } from './components/ImageUpload'
import { ProductForm } from './components/ProductForm'
import { ResultSection } from './components/ResultSection'
import type { ProductInput, ProductResult } from './types'

const MOCK_RESULT: ProductResult = {
  name: '제주 한라봉 5kg 특상품 · 산지직송',
  sellingPoints: [
    '당도 13브릭스 이상만 선별한 특상품 등급',
    '수확 당일 산지직송, 최상의 신선도 보장',
    '제주 청정지역 재배, 껍질이 얇고 과육이 풍부함'
  ],
  description: `제주도 청정 화산토에서 자란 한라봉입니다. 특상품 등급 기준인 당도 13브릭스 이상을 충족한 과실만 엄선하여 구성했습니다.

수확 후 당일 산지직송 방식으로 출하하여 시중 유통 제품 대비 신선도가 높습니다. 껍질이 얇고 과육이 꽉 찬 한라봉 특유의 식감을 온전히 즐기실 수 있습니다.

냉장 보관 시 2~3주, 실온 보관 시 1주일 이내 섭취를 권장합니다.`,
  tags: ['제주한라봉', '한라봉5kg', '특상품', '산지직송', '신선과일', '선물용']
}

const INITIAL_FORM: ProductInput = {
  grade: '',
  origin: '',
  storage: '',
  delivery: '',
  highlight: ''
}

export default function App() {
  const [preview, setPreview] = useState<string | null>(null)
  const [form, setForm] = useState<ProductInput>(INITIAL_FORM)
  const [result, setResult] = useState<ProductResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 나중에 실제 API 호출로 교체
  const handleGenerate = async () => {
    setIsLoading(true)
    setResult(null)
    await new Promise(r => setTimeout(r, 1500))
    setResult(MOCK_RESULT)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">AI 상품 등록 도우미</h1>
          <p className="text-sm text-gray-500 mt-1">
            상품 사진과 기본 정보를 입력하면 AI가 상품명 · 셀링포인트 · 상세설명 · 태그를 생성합니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">상품 사진</h2>
              <ImageUpload
                preview={preview}
                onChange={(_, previewUrl) => setPreview(previewUrl)}
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">상품 정보</h2>
              <ProductForm value={form} onChange={setForm} />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!preview || isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '생성 중...' : 'AI 카피 생성하기'}
            </button>
          </div>

          <div>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-gray-200">
                <div className="text-center text-gray-400">
                  <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm">AI가 카피를 작성하고 있어요</p>
                </div>
              </div>
            ) : result ? (
              <ResultSection result={result} />
            ) : (
              <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-dashed border-gray-200">
                <div className="text-center text-gray-400">
                  <p className="text-sm">사진을 업로드하고</p>
                  <p className="text-sm">생성 버튼을 누르면 여기에 결과가 표시됩니다</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
