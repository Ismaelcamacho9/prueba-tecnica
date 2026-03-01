import { describe, expect, it } from 'vitest'
import { ProductDetailSchema, ProductListItemSchema } from '@/schemas/product'

const baseProduct = {
  id: 'abc123',
  brand: 'TestBrand',
  model: 'TestModel',
  price: '999',
  imgUrl: 'https://example.com/img.jpg',
}

const baseDetail = {
  ...baseProduct,
  networkTechnology: 'GSM',
  networkSpeed: 'LTE',
  gprs: 'Yes',
  edge: 'Yes',
  announced: '2024',
  status: 'Available',
  dimentions: '150x70x8 mm',
  weight: '170',
  sim: 'Nano-SIM',
  displayType: 'OLED',
  displayResolution: '1080x2400',
  displaySize: '6.1 inches',
  os: 'Android 14',
  cpu: 'Octa-core',
  chipset: 'Snapdragon',
  gpu: 'Adreno',
  externalMemory: 'microSD',
  internalMemory: ['128 GB'],
  ram: '8 GB',
  primaryCamera: ['50 MP'],
  secondaryCmera: ['12 MP'],
  speaker: 'Yes',
  audioJack: 'No',
  wlan: ['Wi-Fi 6'],
  bluetooth: ['5.2'],
  gps: 'Yes',
  nfc: 'Yes',
  radio: 'No',
  usb: 'USB-C',
  sensors: ['Gyro'],
  battery: '4500 mAh',
  colors: ['Black'],
  options: {
    colors: [{ code: 0, name: 'Black' }],
    storages: [{ code: 0, name: '128 GB' }],
  },
}

describe('Product schema transforms', () => {
  it('transforma price vacío a "sin precio"', () => {
    const parsed = ProductListItemSchema.parse({ ...baseProduct, price: '' })
    expect(parsed.price).toBe('sin precio')
  })

  it('transforma price con solo espacios a "sin precio"', () => {
    const parsed = ProductListItemSchema.parse({ ...baseProduct, price: '   ' })
    expect(parsed.price).toBe('sin precio')
  })

  it('StringOrArrayToString transforma string vacío a "N/A"', () => {
    const parsed = ProductDetailSchema.parse({ ...baseDetail, networkSpeed: '' })
    expect(parsed.networkSpeed).toBe('N/A')
  })

  it('StringOrArrayToString transforma string con espacios a "N/A"', () => {
    const parsed = ProductDetailSchema.parse({ ...baseDetail, gprs: '   ' })
    expect(parsed.gprs).toBe('N/A')
  })

  it('StringOrArrayToString transforma array a string unido por comas', () => {
    const parsed = ProductDetailSchema.parse({
      ...baseDetail,
      networkSpeed: ['HSPA 42.2 Mbps', 'LTE Cat4 150 Mbps'],
    })
    expect(parsed.networkSpeed).toBe('HSPA 42.2 Mbps, LTE Cat4 150 Mbps')
  })

  it('StringOrArrayToString transforma array vacío a "N/A"', () => {
    const parsed = ProductDetailSchema.parse({
      ...baseDetail,
      edge: [],
    })
    expect(parsed.edge).toBe('N/A')
  })

  it('StringOrArrayToString transforma array con strings vacíos a "N/A"', () => {
    const parsed = ProductDetailSchema.parse({
      ...baseDetail,
      gps: ['', '  '],
    })
    expect(parsed.gps).toBe('N/A')
  })

  it('StringOrArrayToArray transforma string a array de un elemento', () => {
    const parsed = ProductDetailSchema.parse({
      ...baseDetail,
      primaryCamera: '50 MP autofocus',
    })
    expect(parsed.primaryCamera).toEqual(['50 MP autofocus'])
  })

  it('StringOrArrayToArray transforma string vacío a array vacío', () => {
    const parsed = ProductDetailSchema.parse({
      ...baseDetail,
      secondaryCmera: '',
    })
    expect(parsed.secondaryCmera).toEqual([])
  })

  it('StringOrArrayToArray filtra strings vacíos del array', () => {
    const parsed = ProductDetailSchema.parse({
      ...baseDetail,
      wlan: ['Wi-Fi 6', '', '  ', 'hotspot'],
    })
    expect(parsed.wlan).toEqual(['Wi-Fi 6', 'hotspot'])
  })

  it('StringSchema transforma string vacío a "N/A"', () => {
    const parsed = ProductDetailSchema.parse({
      ...baseDetail,
      options: {
        colors: [{ code: 0, name: '' }],
        storages: [{ code: 0, name: '128 GB' }],
      },
    })
    expect(parsed.options.colors[0].name).toBe('N/A')
  })

  it('StringSchema transforma string con espacios a "N/A"', () => {
    const parsed = ProductDetailSchema.parse({
      ...baseDetail,
      options: {
        colors: [{ code: 0, name: '   ' }],
        storages: [{ code: 0, name: '128 GB' }],
      },
    })
    expect(parsed.options.colors[0].name).toBe('N/A')
  })
})
