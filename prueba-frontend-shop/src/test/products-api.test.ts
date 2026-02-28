import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchProductById, fetchProducts } from '@/api/products'

const mockProducts = [
  {
    id: 'ZmGrkLRPXOTpxsU4jjAcv',
    brand: 'Acer',
    model: 'Iconia Talk S',
    price: '170',
    imgUrl: 'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
  },
]

const mockProductDetail = {
  ...mockProducts[0],
  networkTechnology: 'GSM / HSPA / LTE',
  networkSpeed: 'HSPA 42.2/11.5 Mbps LTE Cat4 150/50 Mbps',
  gprs: 'Yes',
  edge: 'Yes',
  announced: '2016 August',
  status: 'Available. Released 2016 October',
  dimentions: '191.7 x 101 x 9.4 mm',
  weight: '260',
  sim: 'Dual SIM (Micro-SIM/Nano-SIM)',
  displayType: 'IPS LCD capacitive touchscreen',
  displayResolution: '7.0 inches (~69.8% screen-to-body ratio)',
  displaySize: '720 x 1280 pixels (~210 ppi pixel density)',
  os: 'Android 6.0 (Marshmallow)',
  cpu: 'Quad-core 1.3 GHz Cortex-A53',
  chipset: 'Mediatek MT8735',
  gpu: 'Mali-T720MP2',
  externalMemory: 'microSD up to 128 GB (dedicated slot)',
  internalMemory: ['16 GB', '32 GB'],
  ram: '2 GB RAM',
  primaryCamera: ['13 MP', 'autofocus'],
  secondaryCmera: ['2 MP', '720p'],
  speaker: 'Yes',
  audioJack: 'Yes',
  wlan: ['Wi-Fi 802.11 a/b/g/n', 'Wi-Fi Direct', 'hotspot'],
  bluetooth: ['4.0', 'A2DP'],
  gps: 'Yes with A-GPS GLONASS',
  nfc: 'N/A',
  radio: 'FM radio',
  usb: 'microUSB 2.0',
  sensors: ['Accelerometer', 'proximity'],
  battery: 'Non-removable Li-Ion 3400 mAh battery',
  colors: ['Black'],
  options: {
    colors: [{ code: 1000, name: 'Black' }],
    storages: [
      { code: 2000, name: '16 GB' },
      { code: 2001, name: '32 GB' },
    ],
  },
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchProducts', () => {
  it('hace fetch al endpoint y devuelve productos validados', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: async () => mockProducts,
      } as Response)

    const result = await fetchProducts()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL}/api/product`,
      undefined,
    )
    expect(result).toEqual(mockProducts)
  })
})

describe('fetchProductById', () => {
  it('hace fetch al endpoint detalle y devuelve producto validado', async () => {
    const id = 'ZmGrkLRPXOTpxsU4jjAcv'
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProductDetail,
    } as Response)

    const result = await fetchProductById(id)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL}/api/product/${id}`,
      undefined,
    )
    expect(result).toEqual(mockProductDetail)
  })
})
