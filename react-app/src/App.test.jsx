import { describe, expect, it } from 'vitest'

import { getMonthlyStatusMeta } from './App'

describe('getMonthlyStatusMeta', () => {
  it('returns a green present indicator for attended students', () => {
    expect(getMonthlyStatusMeta('Keldi')).toMatchObject({
      tone: 'green',
      color: '#22c55e',
      tooltip: 'Keldi — o\'quvchi bu kuni maktabga keldi.',
    })
  })

  it('includes the absence reason for excused statuses', () => {
    expect(getMonthlyStatusMeta('Sababli', 'Kasallik')).toMatchObject({
      tone: 'yellow',
      tooltip: 'Sababli — sabab: Kasallik',
    })
  })
})