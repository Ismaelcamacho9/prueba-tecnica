import { describe, expect, it } from 'vitest'
import {
  ProductDetailSchema,
  ProductListItemSchema,
} from '../schemas/product'
import {
  AddToCartBodySchema,
  AddToCartResponseSchema,
} from '../schemas/cart'

const validProductListItem = {
  id: 'ZmGrkLRPXOTpxsU4jjAcv',
  brand: 'Acer',
  model: 'Iconia Talk S',
  price: '170',
  imgUrl: 'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
}

const validProductDetail = {
  ...validProductListItem,
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
  nfc: '',
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

describe('Product schemas', () => {
  it('valida ProductListItem con datos correctos', () => {
    const parsed = ProductListItemSchema.parse(validProductListItem)
    expect(parsed).toEqual(validProductListItem)
  })

  it('lanza error en ProductListItem con datos incorrectos', () => {
    const invalid = { ...validProductListItem, id: '' }
    expect(() => ProductListItemSchema.parse(invalid)).toThrow()
  })

  it('valida ProductDetail con datos correctos', () => {
    const parsed = ProductDetailSchema.parse(validProductDetail)
    expect(parsed).toEqual(validProductDetail)
  })

  it('lanza error en ProductDetail con datos incorrectos', () => {
    const invalid = { ...validProductDetail, unknown: 'invalid-field' }
    expect(() => ProductDetailSchema.parse(invalid)).toThrow()
  })
})

describe('Cart schemas', () => {
  it('valida AddToCartBody con datos correctos', () => {
    const parsed = AddToCartBodySchema.parse({
      id: 'ZmGrkLRPXOTpxsU4jjAcv',
      colorCode: 1000,
      storageCode: 2000,
    })

    expect(parsed).toEqual({
      id: 'ZmGrkLRPXOTpxsU4jjAcv',
      colorCode: 1000,
      storageCode: 2000,
    })
  })

  it('lanza error en AddToCartBody con datos incorrectos', () => {
    expect(() =>
      AddToCartBodySchema.parse({
        id: 'ZmGrkLRPXOTpxsU4jjAcv',
        colorCode: -1,
        storageCode: 2000,
      }),
    ).toThrow()
  })

  it('valida AddToCartResponse con datos correctos', () => {
    const parsed = AddToCartResponseSchema.parse({ count: 1 })
    expect(parsed).toEqual({ count: 1 })
  })

  it('lanza error en AddToCartResponse con datos incorrectos', () => {
    expect(() => AddToCartResponseSchema.parse({ count: 1.5 })).toThrow()
  })
})
