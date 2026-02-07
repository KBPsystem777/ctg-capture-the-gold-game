export interface GameClaim {
  id: string
  claimant_name: string
  gold_weight_kg: number
  claimed_date: string
  claimed_location: string
  documents: string[] // URLs to document images
  narrative: string
}

export interface ChatMessage {
  role: 'regulator' | 'claimant'
  content: string
  timestamp: Date
}

export interface GameSession {
  id: string
  claim: GameClaim
  chat_history: ChatMessage[]
  decision?: 'approved' | 'rejected'
  decision_reason?: string
  decided_at?: Date
}

// Sample claims for different game scenarios
export const SAMPLE_CLAIMS: GameClaim[] = [
  {
    id: 'CLAIM-001',
    claimant_name: 'Aurelius Gold Trading',
    gold_weight_kg: 250,
    claimed_date: '2024-01-15',
    claimed_location: 'Manila Office',
    documents: ['/documents/invoice-001.jpg', '/documents/shipment-001.jpg'],
    narrative:
      'We sold 250kg of gold bullion to the Central Bank on January 15, 2024. The transaction was completed at our Manila office with full documentation and inspection.',
  },
  {
    id: 'CLAIM-002',
    claimant_name: 'Global Trade Finance Corp',
    gold_weight_kg: 500,
    claimed_date: '2024-04-12',
    claimed_location: 'Dubai Trade Center',
    documents: [
      '/documents/invoice-002.jpg',
      '/documents/certificate-002.jpg',
    ],
    narrative:
      'We arranged a substantial gold transaction in Dubai involving 500kg. Multiple parties were involved and the paperwork is comprehensive.',
  },
  {
    id: 'CLAIM-003',
    claimant_name: 'Pacific Resources Ltd',
    gold_weight_kg: 175,
    claimed_date: '2024-02-20',
    claimed_location: 'Singapore Vault',
    documents: ['/documents/customs-003.jpg', '/documents/assay-003.jpg'],
    narrative:
      'Our company executed a gold sale agreement for 175kg through Singapore Vault facilities on February 20, 2024. All required assays and customs documentation are attached.',
  },
]
