import { Product, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'ເບຍລາວ ລາເກີ້ ຂວດໃຫຍ່ (Beerlao Lager 640ml)',
    nameEn: 'Beerlao Lager Bottle 640ml',
    category: 'ເຄື່ອງດື່ມ (Beverages)',
    price: 18000,
    originalPrice: 20000,
    stock: 48,
    unit: 'ຂວດ',
    barcode: '8850029010012',
    image: 'https://images.unsplash.com/photo-1608270199175-1e3518635ce6?auto=format&fit=crop&w=800&q=80',
    description: 'ເບຍລາວ ຕົ້ນຕຳລັບລົດຊາດແທ້ ຜະລິດຈາກເຂົ້າໄກ່ນ້ອຍຊັ້ນດີ ຫອມນຸ່ມ ຊື່ນໃຈ ຂະໜາດ 640 ມລ'
  },
  {
    id: 'prod-2',
    name: 'ກາເຟດາວ ເອັສເພຣສໂຊ (Dao Coffee Gold Roast)',
    nameEn: 'Dao Coffee Premium Espresso 200g',
    category: 'ເຄື່ອງດື່ມ (Beverages)',
    price: 45000,
    originalPrice: 50000,
    stock: 30,
    unit: 'ຖົງ',
    barcode: '8850029010029',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    description: 'ກາເຟອາຣາບິກ້າ 100% ຈາກພູພຽງບໍລະເວນ ແຂວງຈຳປາສັກ ຫອມເຂັ້ມ ເໝາະສຳລັບຄໍກາເຟແທ້'
  },
  {
    id: 'prod-3',
    name: 'ນ້ຳດື່ມຫົວເສືອ 600ml ແພັກ 12 ຂວດ',
    nameEn: 'Tigerhead Pure Drinking Water Pack 12x600ml',
    category: 'ເຄື່ອງດື່ມ (Beverages)',
    price: 32000,
    stock: 55,
    unit: 'ແພັກ',
    barcode: '8850029010036',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    description: 'ນ້ຳດື່ມບໍລິສຸດ ມາດຕະຖານສາກົນ ສະອາດ ປອດໄພ ດັບກະຫາຍໄດ້ດີ'
  },
  {
    id: 'prod-4',
    name: 'ເຂົ້າໄກ່ນ້ອຍ ຊຽງຂວາງ ແທ້ 100% (5 ກິໂລ)',
    nameEn: 'Xiengkhouang Premium Sticky Rice 5kg',
    category: 'ອາຫານ & ຂອງກິນ (Food & Groceries)',
    price: 95000,
    originalPrice: 110000,
    stock: 22,
    unit: 'ຖົງ (5kg)',
    barcode: '8850029010043',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    description: 'ເຂົ້າໜຽວໄກ່ນ້ອຍ ປູກເທິງພູສູງແຂວງຊຽງຂວາງ ໜຽວນຸ່ມ ຫອມລະມຸນ ເມັດງາມ'
  },
  {
    id: 'prod-5',
    name: 'ໝີ່ໄວໄວ ລົດຕົ້ມຍຳກຸ້ງ (ກ່ອງ 30 ຊອງ)',
    nameEn: 'Instant Noodles Tom Yum Kung (Box of 30)',
    category: 'ອາຫານ & ຂອງກິນ (Food & Groceries)',
    price: 85000,
    stock: 40,
    unit: 'ກ່ອງ',
    barcode: '8850029010050',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80',
    description: 'ເສັ້ນໜຽວນຸ່ມ ນ້ຳຊຸບຕົ້ມຍຳເຂັ້ມຂຸ້ນ ເຜັດສົ້ມກົມກ່ອມ ພ້ອມເຄື່ອງປຸງຄົບຊຸດ'
  },
  {
    id: 'prod-6',
    name: 'ນ້ຳຫວານ ນົມຂົ້ນຫວານ (Mali Condensed Milk)',
    nameEn: 'Mali Sweet Sweetened Condensed Milk 380g',
    category: 'ອາຫານ & ຂອງກິນ (Food & Groceries)',
    price: 15000,
    stock: 60,
    unit: 'ກະປ໋ອງ',
    barcode: '8850029010067',
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80',
    description: 'ນົມຂົ້ນຫວານຍອດນິຍົມ ໃສ່ກາເຟ ຊາ ຫຼື ເຮັດຂອງຫວານ ແຊບຫວານມັນ'
  },
  {
    id: 'prod-7',
    name: 'ຫູຟັງ Bluetooth Wireless 5.3 Pro',
    nameEn: 'Wireless Bluetooth Earbuds Pro High Bass',
    category: 'ເຄື່ອງໄຟຟ້າ & Gadget',
    price: 165000,
    originalPrice: 220000,
    stock: 15,
    unit: 'ກ່ອງ',
    barcode: '8850029010074',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    description: 'ຫູຟັງໄຮ້ສາຍສຽງດີ ເບສແໜ້ນ ຕັດສຽງລົບກວນ ແບັດເຕີຣີໃຊ້ໄດ້ດົນ 24 ຊົ່ວໂມງ'
  },
  {
    id: 'prod-8',
    name: 'ສາຍສາກ Fast Charging 65W Type-C to Type-C',
    nameEn: '65W Fast Charge Braided Cable Type-C',
    category: 'ເຄື່ອງໄຟຟ້າ & Gadget',
    price: 45000,
    stock: 25,
    unit: 'ເສັ້ນ',
    barcode: '8850029010081',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    description: 'ສາຍຖັກໄນລອນທົນທານສູງ ຮອງຮັບການສາກໄວ PD 65W ສົ່ງຂໍ້ມູນໄດ້ໄວ'
  },
  {
    id: 'prod-9',
    name: 'ພັດລົມຕັ້ງໂຕະແບບສາກໄຟ USB Mini Fan',
    nameEn: 'Portable USB Rechargeable Desk Fan',
    category: 'ເຄື່ອງໃຊ້ໃນເຮືອນ (Home & Living)',
    price: 89000,
    originalPrice: 115000,
    stock: 18,
    unit: 'ເຄື່ອງ',
    barcode: '8850029010098',
    image: 'https://images.unsplash.com/photo-1618944847828-82e943c33304?auto=format&fit=crop&w=800&q=80',
    description: 'ພັດລົມພົກພາ ລົມແຮງ ສຽງມິດ ປັບໄດ້ 3 ລະດັບ ແບັດເຕີຣີ 4000mAh'
  },
  {
    id: 'prod-10',
    name: 'ສະບູ Protex ຂ້າເຊື້ອແບັກທີເຣຍ ແພັກ 4 ກ້ອນ',
    nameEn: 'Protex Antibacterial Soap 4-Pack',
    category: 'ເຄື່ອງໃຊ້ໃນເຮືອນ (Home & Living)',
    price: 36000,
    stock: 35,
    unit: 'ແພັກ',
    barcode: '8850029010104',
    image: 'https://images.unsplash.com/photo-1607006310476-8805f88421b8?auto=format&fit=crop&w=800&q=80',
    description: 'ປົກປ້ອງຜິວຈາກແບັກທີເຣຍ 99.9% ຫອມສະອາດ ໝັ້ນໃຈຕະຫຼອດມື້'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'LAO-2026-8801',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    customerName: 'ທ່ານ ສົມພອນ ໄຊຍະວົງ',
    phone: '020 5566 7788',
    address: 'ບ້ານ ໂພນໄຊ, ເມືອງ ໄຊເສດຖາ, ນະຄອນຫຼວງວຽງຈັນ (ໃກ້ກະຊວງການເງິນ)',
    location: {
      lat: 17.9682,
      lng: 102.6324,
      addressText: 'Phonsay, Saysettha, Vientiane Capital'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'ເບຍລາວ ລາເກີ້ ຂວດໃຫຍ່ (Beerlao Lager 640ml)',
        price: 18000,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1608270199175-1e3518635ce6?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: 'prod-4',
        productName: 'ເຂົ້າໄກ່ນ້ອຍ ຊຽງຂວາງ ແທ້ 100% (5 ກິໂລ)',
        price: 95000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalAmount: 149000,
    paymentMethod: 'QR',
    paymentSlipUrl: 'https://images.unsplash.com/photo-1554415707-9e49016a3e5c?auto=format&fit=crop&w=500&q=80',
    status: 'PREPARING',
    notes: 'ໂທຫາກ່ອນມາສົ່ງ 10 ນາທີ'
  },
  {
    id: 'LAO-2026-8802',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    customerName: 'ນາງ ມະນີວັນ ວົງວິໄລ',
    phone: '020 9988 1122',
    address: 'ບ້ານ ສີຫອມ, ເມືອງ ຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ',
    location: {
      lat: 17.9644,
      lng: 102.6085,
      addressText: 'Sihom, Chanthabouly, Vientiane'
    },
    items: [
      {
        productId: 'prod-2',
        productName: 'ກາເຟດາວ ເອັສເພຣສໂຊ (Dao Coffee Gold Roast)',
        price: 45000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: 'prod-6',
        productName: 'ນ້ຳຫວານ ນົມຂົ້ນຫວານ (Mali Condensed Milk)',
        price: 15000,
        quantity: 4,
        image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalAmount: 150000,
    paymentMethod: 'COD',
    status: 'DELIVERING',
    notes: 'ຈ່າຍເງິນສົດປາຍທາງ ພ້ອມເງິນທອນ 50,000 ກີບ'
  },
  {
    id: 'LAO-2026-8799',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    customerName: 'ທ່ານ ບຸນມີ ພົມມະຈັນ',
    phone: '020 7711 2233',
    address: 'ບ້ານ ດົງໂດກ, ເມືອງ ໄຊທານີ, ມະຫາວິທະຍາໄລແຫ່ງຊາດ',
    location: {
      lat: 18.0384,
      lng: 102.6318,
      addressText: 'Dongdok Campus, Xaythany, Vientiane'
    },
    items: [
      {
        productId: 'prod-7',
        productName: 'ຫູຟັງ Bluetooth Wireless 5.3 Pro',
        price: 165000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalAmount: 165000,
    paymentMethod: 'QR',
    paymentSlipUrl: 'https://images.unsplash.com/photo-1554415707-9e49016a3e5c?auto=format&fit=crop&w=500&q=80',
    status: 'COMPLETED',
    notes: 'ສົ່ງຮອດຫໍພັກນັກສຶກສາແລ້ວ'
  }
];

export const STORE_BANK_INFO = {
  bankName: 'ທະນາຄານການຄ້າຕ່າງປະເທດລາວ (BCEL One)',
  accountName: 'ຮ້ານ POS LAO ONLINE STORE',
  accountNumber: '010-12-00-01987654-001',
  currency: 'LAK (ກີບ)',
  qrSampleUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=BCELONE-MERCHANT-POS-LAO-ONLINE-ACCOUNT-010120001987654'
};
