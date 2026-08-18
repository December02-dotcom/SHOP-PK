import { WarehouseConfig, ShippingAddress, BankAccount } from '../types';

export interface SupportedBank {
  code: string;
  name: string;
  shortName: string;
  bin: string;
}

export const SUPPORTED_BANKS: SupportedBank[] = [
  { code: 'MB', shortName: 'MB Bank', name: 'Ngân hàng TMCP Quân Đội', bin: '970422' },
  { code: 'VCB', shortName: 'Vietcombank', name: 'Ngân hàng TMCP Ngoại Thương Việt Nam', bin: '970436' },
  { code: 'TCB', shortName: 'Techcombank', name: 'Ngân hàng TMCP Kỹ Thương Việt Nam', bin: '970407' },
  { code: 'BIDV', shortName: 'BIDV', name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', bin: '970418' },
  { code: 'ICB', shortName: 'VietinBank', name: 'Ngân hàng TMCP Công Thương Việt Nam', bin: '970415' },
  { code: 'VPB', shortName: 'VPBank', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng', bin: '970432' },
  { code: 'ACB', shortName: 'ACB', name: 'Ngân hàng TMCP Á Châu', bin: '970416' },
  { code: 'TPB', shortName: 'TPBank', name: 'Ngân hàng TMCP Tiên Phong', bin: '970423' },
  { code: 'VBA', shortName: 'Agribank', name: 'Ngân hàng Nông nghiệp & PT Nông thôn', bin: '970405' },
  { code: 'STB', shortName: 'Sacombank', name: 'Ngân hàng TMCP Sài Gòn Thương Tín', bin: '970403' },
  { code: 'HDB', shortName: 'HDBank', name: 'Ngân hàng TMCP Phát triển TP.HCM', bin: '970437' },
  { code: 'MSB', shortName: 'MSB', name: 'Ngân hàng TMCP Hàng Hải Việt Nam', bin: '970426' }
];

export const DEFAULT_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank-1',
    bankName: 'MB Bank (Quân Đội)',
    bankCode: 'MB',
    accountNumber: '12345678910',
    accountHolder: 'LE HOAI NAM',
    branch: 'Chi nhánh Cầu Giấy - Hà Nội',
    qrImageUrl: 'https://img.vietqr.io/image/MB-12345678910-compact2.png?accountName=LE%20HOAI%20NAM',
    isDefault: true
  },
  {
    id: 'bank-2',
    bankName: 'Vietcombank',
    bankCode: 'VCB',
    accountNumber: '001100456789',
    accountHolder: 'LE HOAI NAM',
    branch: 'Sở Giao Dịch Hà Nội',
    qrImageUrl: 'https://img.vietqr.io/image/VCB-001100456789-compact2.png?accountName=LE%20HOAI%20NAM',
    isDefault: false
  },
  {
    id: 'bank-3',
    bankName: 'Techcombank',
    bankCode: 'TCB',
    accountNumber: '19034567890012',
    accountHolder: 'LE HOAI NAM',
    branch: 'Chi nhánh Thăng Long',
    qrImageUrl: 'https://img.vietqr.io/image/TCB-19034567890012-compact2.png?accountName=LE%20HOAI%20NAM',
    isDefault: false
  }
];

export function getVietQRUrl(
  bankCode: string, 
  accountNumber: string, 
  accountHolder: string, 
  amount: number = 0, 
  memo: string = ''
): string {
  const cleanBank = (bankCode || 'MB').trim();
  const cleanAcc = (accountNumber || '').trim();
  const cleanHolder = encodeURIComponent((accountHolder || '').trim().toUpperCase());
  const cleanMemo = encodeURIComponent((memo || '').trim());
  let url = `https://img.vietqr.io/image/${cleanBank}-${cleanAcc}-compact2.png`;
  const params: string[] = [];
  if (amount > 0) params.push(`amount=${amount}`);
  if (cleanMemo) params.push(`addInfo=${cleanMemo}`);
  if (cleanHolder) params.push(`accountName=${cleanHolder}`);
  if (params.length > 0) {
    url += '?' + params.join('&');
  }
  return url;
}

export interface ProvinceLocation {
  name: string;
  aliases: string[];
  region: 'North' | 'Central' | 'South';
  lat: number;
  lng: number;
}

// 63 Provinces and major cities in Vietnam with coordinates and regional grouping
export const VN_PROVINCES: ProvinceLocation[] = [
  // MIỀN BẮC (North)
  { name: 'Hà Nội', aliases: ['ha noi', 'hà nội', 'hn', 'tp hà nội', 'thanh pho ha noi', 'thành phố hà nội'], region: 'North', lat: 21.0285, lng: 105.8542 },
  { name: 'Hải Phòng', aliases: ['hai phong', 'hải phòng', 'hp'], region: 'North', lat: 20.8449, lng: 106.6881 },
  { name: 'Quảng Ninh', aliases: ['quang ninh', 'quảng ninh', 'hạ long', 'ha long'], region: 'North', lat: 20.9505, lng: 107.0734 },
  { name: 'Bắc Ninh', aliases: ['bac ninh', 'bắc ninh'], region: 'North', lat: 21.1861, lng: 106.0763 },
  { name: 'Hải Dương', aliases: ['hai duong', 'hải dương'], region: 'North', lat: 20.9388, lng: 106.3338 },
  { name: 'Hưng Yên', aliases: ['hung yen', 'hưng yên'], region: 'North', lat: 20.6464, lng: 106.0511 },
  { name: 'Thái Nguyên', aliases: ['thai nguyen', 'thái nguyên'], region: 'North', lat: 21.5928, lng: 105.8442 },
  { name: 'Vĩnh Phúc', aliases: ['vinh phuc', 'vĩnh phúc'], region: 'North', lat: 21.3089, lng: 105.6049 },
  { name: 'Bắc Giang', aliases: ['bac giang', 'bắc giang'], region: 'North', lat: 21.2731, lng: 106.1946 },
  { name: 'Phú Thọ', aliases: ['phu tho', 'phú thọ', 'việt trì'], region: 'North', lat: 21.3228, lng: 105.2280 },
  { name: 'Nam Định', aliases: ['nam dinh', 'nam định'], region: 'North', lat: 20.4344, lng: 106.1773 },
  { name: 'Thái Bình', aliases: ['thai binh', 'thái bình'], region: 'North', lat: 20.4463, lng: 106.3365 },
  { name: 'Ninh Bình', aliases: ['ninh binh', 'ninh bình'], region: 'North', lat: 20.2506, lng: 105.9745 },
  { name: 'Hà Nam', aliases: ['ha nam', 'hà nam', 'phủ lý'], region: 'North', lat: 20.5413, lng: 105.9229 },
  { name: 'Lạng Sơn', aliases: ['lang son', 'lạng sơn'], region: 'North', lat: 21.8537, lng: 106.7620 },
  { name: 'Cao Bằng', aliases: ['cao bang', 'cao bằng'], region: 'North', lat: 22.6666, lng: 106.2575 },
  { name: 'Bắc Kạn', aliases: ['bac kan', 'bắc kạn'], region: 'North', lat: 22.1470, lng: 105.8348 },
  { name: 'Tuyên Quang', aliases: ['tuyen quang', 'tuyên quang'], region: 'North', lat: 21.8235, lng: 105.2180 },
  { name: 'Hà Giang', aliases: ['ha giang', 'hà giang'], region: 'North', lat: 22.8233, lng: 104.9839 },
  { name: 'Lào Cai', aliases: ['lao cai', 'lào cai', 'sa pa', 'sapa'], region: 'North', lat: 22.4856, lng: 103.9707 },
  { name: 'Yên Bái', aliases: ['yen bai', 'yên bái'], region: 'North', lat: 21.7168, lng: 104.8986 },
  { name: 'Sơn La', aliases: ['son la', 'sơn la', 'mộc châu'], region: 'North', lat: 21.3283, lng: 103.9148 },
  { name: 'Điện Biên', aliases: ['dien bien', 'điện biên'], region: 'North', lat: 21.3869, lng: 103.0230 },
  { name: 'Lai Châu', aliases: ['lai chau', 'lai châu'], region: 'North', lat: 22.3963, lng: 103.4684 },
  { name: 'Hòa Bình', aliases: ['hoa binh', 'hòa bình'], region: 'North', lat: 20.8172, lng: 105.3376 },

  // MIỀN TRUNG & TÂY NGUYÊN (Central)
  { name: 'Đà Nẵng', aliases: ['da nang', 'đà nẵng', 'dn', 'tp đà nẵng', 'thành phố đà nẵng'], region: 'Central', lat: 16.0544, lng: 108.2022 },
  { name: 'Thừa Thiên Huế', aliases: ['thua thien hue', 'thừa thiên huế', 'huế', 'hue'], region: 'Central', lat: 16.4637, lng: 107.5909 },
  { name: 'Quảng Nam', aliases: ['quang nam', 'quảng nam', 'hội an', 'tam kỳ'], region: 'Central', lat: 15.5394, lng: 108.0191 },
  { name: 'Quảng Ngãi', aliases: ['quang ngai', 'quảng ngãi'], region: 'Central', lat: 15.1205, lng: 108.7923 },
  { name: 'Bình Định', aliases: ['binh dinh', 'bình định', 'quy nhơn', 'quy nhon'], region: 'Central', lat: 13.7820, lng: 109.2197 },
  { name: 'Phú Yên', aliases: ['phu yen', 'phú yên', 'tuy hòa'], region: 'Central', lat: 13.0882, lng: 109.3080 },
  { name: 'Khánh Hòa', aliases: ['khanh hoa', 'khánh hòa', 'nha trang'], region: 'Central', lat: 12.2388, lng: 109.1967 },
  { name: 'Ninh Thuận', aliases: ['ninh thuan', 'ninh thuận', 'phan rang'], region: 'Central', lat: 11.5658, lng: 108.9882 },
  { name: 'Bình Thuận', aliases: ['binh thuan', 'bình thuận', 'phan thiết'], region: 'Central', lat: 10.9289, lng: 108.1021 },
  { name: 'Thanh Hóa', aliases: ['thanh hoa', 'thanh hóa'], region: 'Central', lat: 19.8067, lng: 105.7852 },
  { name: 'Nghệ An', aliases: ['nghe an', 'nghệ an', 'vinh'], region: 'Central', lat: 18.6796, lng: 105.6813 },
  { name: 'Hà Tĩnh', aliases: ['ha tinh', 'hà tĩnh'], region: 'Central', lat: 18.3429, lng: 105.9059 },
  { name: 'Quảng Bình', aliases: ['quang binh', 'quảng bình', 'đồng hới'], region: 'Central', lat: 17.4690, lng: 106.6225 },
  { name: 'Quảng Trị', aliases: ['quang tri', 'quảng trị', 'đông hà'], region: 'Central', lat: 16.8164, lng: 107.1004 },
  { name: 'Kon Tum', aliases: ['kon tum', 'kontum'], region: 'Central', lat: 14.3545, lng: 108.0076 },
  { name: 'Gia Lai', aliases: ['gia lai', 'pleiku'], region: 'Central', lat: 13.9833, lng: 108.0000 },
  { name: 'Đắk Lắk', aliases: ['dak lak', 'đắk lắk', 'đắc lắc', 'buôn ma thuột', 'bmt'], region: 'Central', lat: 12.6667, lng: 108.0500 },
  { name: 'Đắk Nông', aliases: ['dak nong', 'đắk nông', 'gia nghĩa'], region: 'Central', lat: 12.0000, lng: 107.6833 },
  { name: 'Lâm Đồng', aliases: ['lam dong', 'lâm đồng', 'đà lạt', 'da lat', 'bảo lộc'], region: 'Central', lat: 11.9404, lng: 108.4583 },

  // MIỀN NAM (South)
  { name: 'TP. Hồ Chí Minh', aliases: ['tp ho chi minh', 'hồ chí minh', 'ho chi minh', 'tphcm', 'tp.hcm', 'sài gòn', 'sai gon', 'thành phố hồ chí minh'], region: 'South', lat: 10.8231, lng: 106.6297 },
  { name: 'Bình Dương', aliases: ['binh duong', 'bình dương', 'thủ dầu một', 'dĩ an', 'thuận an'], region: 'South', lat: 11.1606, lng: 106.6521 },
  { name: 'Đồng Nai', aliases: ['dong nai', 'đồng nai', 'biên hòa', 'long thành'], region: 'South', lat: 10.9574, lng: 106.8427 },
  { name: 'Bà Rịa - Vũng Tàu', aliases: ['ba ria - vung tau', 'bà rịa - vũng tàu', 'vũng tàu', 'vung tau'], region: 'South', lat: 10.4114, lng: 107.1362 },
  { name: 'Tây Ninh', aliases: ['tay ninh', 'tây ninh'], region: 'South', lat: 11.3351, lng: 106.1099 },
  { name: 'Bình Phước', aliases: ['binh phuoc', 'bình phước', 'đồng xoài'], region: 'South', lat: 11.7511, lng: 106.9048 },
  { name: 'Long An', aliases: ['long an', 'tân an'], region: 'South', lat: 10.5361, lng: 106.4114 },
  { name: 'Tiền Giang', aliases: ['tien giang', 'tiền giang', 'mỹ tho'], region: 'South', lat: 10.3543, lng: 106.3653 },
  { name: 'Bến Tre', aliases: ['ben tre', 'bến tre'], region: 'South', lat: 10.2415, lng: 106.3758 },
  { name: 'Trà Vinh', aliases: ['tra vinh', 'trà vinh'], region: 'South', lat: 9.9347, lng: 106.3455 },
  { name: 'Vĩnh Long', aliases: ['vinh long', 'vĩnh long'], region: 'South', lat: 10.2537, lng: 105.9722 },
  { name: 'Đồng Tháp', aliases: ['dong thap', 'đồng tháp', 'cao lãnh', 'sa đéc'], region: 'South', lat: 10.4578, lng: 105.6331 },
  { name: 'An Giang', aliases: ['an giang', 'long xuyên', 'châu đốc'], region: 'South', lat: 10.3892, lng: 105.4357 },
  { name: 'Kiên Giang', aliases: ['kien giang', 'kiên giang', 'rạch giá', 'phú quốc'], region: 'South', lat: 10.0125, lng: 105.0809 },
  { name: 'Cần Thơ', aliases: ['can tho', 'cần thơ', 'tp cần thơ', 'ninh kiều'], region: 'South', lat: 10.0452, lng: 105.7469 },
  { name: 'Hậu Giang', aliases: ['hau giang', 'hậu giang', 'vị thanh'], region: 'South', lat: 9.7844, lng: 105.4701 },
  { name: 'Sóc Trăng', aliases: ['soc trang', 'sóc trăng'], region: 'South', lat: 9.6033, lng: 105.9800 },
  { name: 'Bạc Liêu', aliases: ['bac lieu', 'bạc liêu'], region: 'South', lat: 9.2941, lng: 105.7278 },
  { name: 'Cà Mau', aliases: ['ca mau', 'cà mau'], region: 'South', lat: 9.1769, lng: 105.1524 }
];

export const PRESET_WAREHOUSES: { id: string; label: string; config: WarehouseConfig }[] = [
  {
    id: 'wh-hn-caugiay',
    label: 'Kho Tổng Hà Nội (Cầu Giấy)',
    config: {
      name: 'Kho Tổng Hà Nội - Cầu Giấy (Hub Miền Bắc)',
      phone: '0988.123.456',
      street: 'Số 144 đường Xuân Thủy',
      ward: 'Phường Dịch Vọng Hậu',
      district: 'Quận Cầu Giấy',
      city: 'Hà Nội',
      latitude: 21.0368,
      longitude: 105.7829,
      baseFeeInnerCity: 20000,
      baseFeeInterProvince: 30000,
      baseFeeInterRegion: 40000,
      expressAvailable: true,
      expressMaxDistanceKm: 35,
      expressBaseFee: 45000,
      saverBaseFee: 15000,
      freeShipThreshold: 500000,
      salesPolicyUrl: 'https://docs.google.com/document/d/19pM4EwB2gQ8xR_XqgZ1T9C3v0yN4p7E9L5_EXAMPLE/preview',
      shippingPolicyUrl: 'https://docs.google.com/document/d/18rT3VwA1kP7xQ_ZpfaY2T8B4xM5q6E8K4_EXAMPLE/preview',
      warrantyPolicyUrl: 'https://docs.google.com/document/d/17sQ2UwZ9jO6wP_YoeaX1S7A3wL4p5D7J3_EXAMPLE/preview',
      bankAccounts: DEFAULT_BANK_ACCOUNTS
    }
  },
  {
    id: 'wh-hcm-tanbinh',
    label: 'Kho Tổng TP.HCM (Tân Bình)',
    config: {
      name: 'Kho Tổng TP. Hồ Chí Minh - Tân Bình (Hub Miền Nam)',
      phone: '0977.654.321',
      street: 'Số 384 đường Cộng Hòa',
      ward: 'Phường 13',
      district: 'Quận Tân Bình',
      city: 'TP. Hồ Chí Minh',
      latitude: 10.8015,
      longitude: 106.6436,
      baseFeeInnerCity: 18000,
      baseFeeInterProvince: 28000,
      baseFeeInterRegion: 40000,
      expressAvailable: true,
      expressMaxDistanceKm: 35,
      expressBaseFee: 42000,
      saverBaseFee: 15000,
      freeShipThreshold: 500000,
      salesPolicyUrl: 'https://docs.google.com/document/d/19pM4EwB2gQ8xR_XqgZ1T9C3v0yN4p7E9L5_EXAMPLE/preview',
      shippingPolicyUrl: 'https://docs.google.com/document/d/18rT3VwA1kP7xQ_ZpfaY2T8B4xM5q6E8K4_EXAMPLE/preview',
      warrantyPolicyUrl: 'https://docs.google.com/document/d/17sQ2UwZ9jO6wP_YoeaX1S7A3wL4p5D7J3_EXAMPLE/preview',
      bankAccounts: DEFAULT_BANK_ACCOUNTS
    }
  },
  {
    id: 'wh-danang-haichau',
    label: 'Kho Trung Chuyển Đà Nẵng (Hải Châu)',
    config: {
      name: 'Kho Trung Chuyển Đà Nẵng - Hải Châu (Hub Miền Trung)',
      phone: '0966.888.999',
      street: 'Số 120 đường Nguyễn Văn Linh',
      ward: 'Phường Nam Dương',
      district: 'Quận Hải Châu',
      city: 'Đà Nẵng',
      latitude: 16.0612,
      longitude: 108.2155,
      baseFeeInnerCity: 18000,
      baseFeeInterProvince: 28000,
      baseFeeInterRegion: 38000,
      expressAvailable: true,
      expressMaxDistanceKm: 30,
      expressBaseFee: 40000,
      saverBaseFee: 15000,
      freeShipThreshold: 500000,
      salesPolicyUrl: 'https://docs.google.com/document/d/19pM4EwB2gQ8xR_XqgZ1T9C3v0yN4p7E9L5_EXAMPLE/preview',
      shippingPolicyUrl: 'https://docs.google.com/document/d/18rT3VwA1kP7xQ_ZpfaY2T8B4xM5q6E8K4_EXAMPLE/preview',
      warrantyPolicyUrl: 'https://docs.google.com/document/d/17sQ2UwZ9jO6wP_YoeaX1S7A3wL4p5D7J3_EXAMPLE/preview',
      bankAccounts: DEFAULT_BANK_ACCOUNTS
    }
  }
];

export const DEFAULT_WAREHOUSE_CONFIG: WarehouseConfig = PRESET_WAREHOUSES[0].config;

// Normalize string for fuzzy province search
export function normalizeText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/^(tinh|thanh pho|tp\.|tp|quan|huyen|thi xa|tx)\s+/i, '')
    .trim();
}

// Find matching province from raw text
export function findProvince(input: string): ProvinceLocation | null {
  if (!input || !input.trim()) return null;
  const cleaned = normalizeText(input);

  // Exact or alias match
  for (const prov of VN_PROVINCES) {
    const provNorm = normalizeText(prov.name);
    if (cleaned === provNorm || prov.aliases.some((a) => normalizeText(a) === cleaned)) {
      return prov;
    }
  }

  // Substring match
  for (const prov of VN_PROVINCES) {
    const provNorm = normalizeText(prov.name);
    if (cleaned.includes(provNorm) || provNorm.includes(cleaned)) {
      return prov;
    }
    for (const alias of prov.aliases) {
      const aNorm = normalizeText(alias);
      if (cleaned.includes(aNorm) || aNorm.includes(cleaned)) {
        return prov;
      }
    }
  }

  return null;
}

// Haversine formula to compute great-circle distance in kilometers
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 decimal place
}

export interface ShippingEstimateResult {
  warehouseName: string;
  warehouseCity: string;
  destinationCity: string;
  distanceKm: number;
  isSameCity: boolean;
  isSameRegion: boolean;
  regionType: 'inner_city' | 'same_region' | 'inter_region';
  regionLabel: string;
  rates: {
    standard: number;
    express: number | null;
    saver: number;
  };
  estimatedDeliveryTimes: {
    standard: string;
    express: string | null;
    saver: string;
  };
  selectedFee: number;
  selectedEstimatedTime: string;
  expressAllowed: boolean;
  expressReason?: string;
  isFreeShip: boolean;
  freeShipSavings: number;
  originalFee: number;
}

export function calculateShippingEstimate(
  warehouse: WarehouseConfig,
  customerAddress: ShippingAddress,
  cartSubtotal: number,
  shippingMethod: 'standard' | 'express' | 'saver' = 'standard'
): ShippingEstimateResult {
  const originProv = findProvince(warehouse.city) || VN_PROVINCES[0]; // default HN
  const destProv = findProvince(customerAddress.city) || originProv;

  const lat1 = warehouse.latitude || originProv.lat;
  const lon1 = warehouse.longitude || originProv.lng;
  const lat2 = destProv.lat;
  const lon2 = destProv.lng;

  const isSameCity = originProv.name === destProv.name;
  const isSameRegion = originProv.region === destProv.region;

  let distanceKm = calculateHaversineDistance(lat1, lon1, lat2, lon2);
  // If in the same city, distance is localized inner city estimation (e.g. 5 - 25km)
  if (isSameCity) {
    distanceKm = Math.min(25, Math.max(5, distanceKm > 0 ? Math.round(distanceKm) : 12));
  }

  let regionType: 'inner_city' | 'same_region' | 'inter_region' = 'same_region';
  let regionLabel = 'Liên Tỉnh Cùng Miền';

  if (isSameCity) {
    regionType = 'inner_city';
    regionLabel = 'Nội Thành / Cùng Tỉnh';
  } else if (!isSameRegion) {
    regionType = 'inter_region';
    regionLabel = 'Vận Chuyển Liên Miền';
  }

  // 1. Calculate Standard Shipping Rate
  let standardRate = warehouse.baseFeeInnerCity || 20000;
  if (regionType === 'same_region') {
    standardRate = warehouse.baseFeeInterProvince || 30000;
    // Slight distance adjustment for long routes
    if (distanceKm > 200) {
      standardRate += Math.min(10000, Math.floor((distanceKm - 200) / 100) * 2000);
    }
  } else if (regionType === 'inter_region') {
    standardRate = warehouse.baseFeeInterRegion || 40000;
    if (distanceKm > 800) {
      standardRate += 5000; // e.g. North <-> South ~1200km
    }
  }

  // 2. Calculate Saver Shipping Rate
  let saverRate = warehouse.saverBaseFee || 15000;
  if (regionType === 'same_region') {
    saverRate = Math.round(standardRate * 0.75 / 1000) * 1000;
  } else if (regionType === 'inter_region') {
    saverRate = Math.round(standardRate * 0.7 / 1000) * 1000;
  }
  saverRate = Math.max(12000, saverRate);

  // 3. Calculate Express (Hỏa tốc) Shipping Rate
  const maxExpressKm = warehouse.expressMaxDistanceKm || 35;
  const expressAllowed = warehouse.expressAvailable && distanceKm <= maxExpressKm;
  let expressRate: number | null = null;
  let expressReason: string | undefined = undefined;

  if (warehouse.expressAvailable) {
    if (distanceKm <= maxExpressKm) {
      // Dynamic distance surcharge for express (e.g. 40k base + 2k/km over 10km)
      let baseExpress = warehouse.expressBaseFee || 45000;
      if (distanceKm > 10) {
        baseExpress += Math.round((distanceKm - 10) * 1500);
      }
      expressRate = Math.min(95000, Math.max(35000, Math.round(baseExpress / 1000) * 1000));
    } else {
      expressReason = `Khoảng cách vượt quá ${maxExpressKm}km (ước tính ~${Math.round(distanceKm)}km). Chỉ hỗ trợ hỏa tốc trong nội thành.`;
    }
  } else {
    expressReason = 'Kho chưa kích hoạt dịch vụ giao hỏa tốc.';
  }

  // 4. Estimated Delivery Time
  const estimatedDeliveryTimes = {
    standard: isSameCity ? '1 - 2 ngày (Nhanh)' : isSameRegion ? '2 - 3 ngày' : '3 - 4 ngày',
    express: expressAllowed ? 'Giao trong 2 - 4 giờ' : null,
    saver: isSameCity ? '2 - 3 ngày' : isSameRegion ? '3 - 5 ngày' : '4 - 6 ngày'
  };

  // Determine selected method fee and time
  let selectedFee = standardRate;
  let selectedEstimatedTime = estimatedDeliveryTimes.standard;

  if (shippingMethod === 'express' && expressRate !== null) {
    selectedFee = expressRate;
    selectedEstimatedTime = estimatedDeliveryTimes.express || '2 - 4 giờ';
  } else if (shippingMethod === 'saver') {
    selectedFee = saverRate;
    selectedEstimatedTime = estimatedDeliveryTimes.saver;
  }

  const originalFee = selectedFee;
  let isFreeShip = false;
  let freeShipSavings = 0;

  // Free shipping policy if order exceeds threshold
  const freeThreshold = warehouse.freeShipThreshold || 500000;
  if (freeThreshold > 0 && cartSubtotal >= freeThreshold) {
    isFreeShip = true;
    freeShipSavings = Math.min(selectedFee, 35000); // cover up to 35k
    selectedFee = Math.max(0, selectedFee - freeShipSavings);
  }

  return {
    warehouseName: warehouse.name,
    warehouseCity: warehouse.city,
    destinationCity: destProv.name,
    distanceKm,
    isSameCity,
    isSameRegion,
    regionType,
    regionLabel,
    rates: {
      standard: standardRate,
      express: expressRate,
      saver: saverRate
    },
    estimatedDeliveryTimes,
    selectedFee,
    selectedEstimatedTime,
    expressAllowed,
    expressReason,
    isFreeShip,
    freeShipSavings,
    originalFee
  };
}
