import { Product, Category, Voucher, Review } from './types';

export const CATEGORIES: Category[] = [
  { id: 'fashion-male', name: 'Thời Trang Nam', iconName: 'Shirt', color: 'bg-blue-50 text-blue-500' },
  { id: 'fashion-female', name: 'Thời Trang Nữ', iconName: 'UserRound', color: 'bg-pink-50 text-pink-500' },
  { id: 'mobile-acc', name: 'Điện Thoại & Phụ Kiện', iconName: 'Smartphone', color: 'bg-amber-50 text-amber-500' },
  { id: 'electronics', name: 'Thiết Bị Điện Tử', iconName: 'Laptop', color: 'bg-indigo-50 text-indigo-500' },
  { id: 'home-living', name: 'Nhà Cửa & Đời Sống', iconName: 'Home', color: 'bg-emerald-50 text-emerald-500' },
  { id: 'beauty-cosmetics', name: 'Sức Khỏe & Sắc Đẹp', iconName: 'Sparkles', color: 'bg-rose-50 text-rose-500' },
  { id: 'shoes', name: 'Giày Dép', iconName: 'Footprints', color: 'bg-cyan-50 text-cyan-500' },
  { id: 'sports-travel', name: 'Thể Thao & Du Lịch', iconName: 'Compass', color: 'bg-orange-50 text-orange-500' },
  { id: 'groceries', name: 'Bách Hóa Online', iconName: 'ShoppingBag', color: 'bg-teal-50 text-teal-500' },
  { id: 'mom-baby', name: 'Mẹ & Bé', iconName: 'Baby', color: 'bg-purple-50 text-purple-500' }
];

export const VOUCHERS: Voucher[] = [
  {
    code: 'PKDT50K',
    name: 'Voucher Toàn Cửa Hàng 50K',
    discountType: 'fixed',
    value: 50000,
    minOrderValue: 300000,
    description: 'Giảm ngay 50.000đ cho đơn hàng từ 300.000đ trở lên'
  },
  {
    code: 'FRESESHIP',
    name: 'Miễn Phí Vận Chuyển',
    discountType: 'fixed',
    value: 25000,
    minOrderValue: 99000,
    description: 'Giảm 25.000đ phí vận chuyển cho đơn hàng từ 99.000đ'
  },
  {
    code: 'PKDT10',
    name: 'Giảm 10% Cho Đơn Hàng',
    discountType: 'percentage',
    value: 10,
    minOrderValue: 150000,
    maxDiscount: 40000,
    description: 'Giảm 10% (tối đa 40.000đ) cho đơn hàng từ 150.000đ'
  },
  {
    code: 'HELLOSUMMER',
    name: 'Chào Hè Rực Rỡ Giảm 15%',
    discountType: 'percentage',
    value: 15,
    minOrderValue: 500000,
    maxDiscount: 100000,
    description: 'Giảm 15% (tối đa 100.000đ) cho đơn hàng từ 500.000đ'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Áo Thun Nam Cổ Tròn Cotton Premium thoáng khí, co giãn 4 chiều dáng ôm nhẹ thanh lịch',
    price: 129000,
    originalPrice: 250000,
    rating: 4.8,
    reviewsCount: 1240,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=80'
    ],
    category: 'fashion-male',
    sold: 4500,
    stock: 120,
    discount: 48,
    isFlashSale: true,
    flashSaleProgress: 82,
    isMall: true,
    location: 'Hà Nội',
    options: ['Trắng - M', 'Trắng - L', 'Trắng - XL', 'Đen - M', 'Đen - L', 'Đen - XL'],
    description: 'Áo thun nam premium được dệt hoàn toàn từ sợi bông tự nhiên cotton 100% siêu thoáng mát. Công nghệ kháng khuẩn Nano tiên tiến giúp ngăn ngừa mùi mồ hôi hiệu quả trong suốt ngày dài năng động.\n\nĐặc điểm nổi bật:\n- Chất vải dày dặn vừa phải, mịn màng, không xù lông.\n- Đường may móc xích kép cực kỳ tỉ mỉ, chắc chắn.\n- Màu sắc cơ bản, dễ dàng phối hợp với quần short, jeans hoặc kaki.',
    specs: {
      'Chất liệu': '100% Cotton tự nhiên',
      'Kiểu dáng': 'Slim-fit ôm nhẹ',
      'Thương hiệu': 'Teelab Việt Nam',
      'Xuất xứ': 'Việt Nam'
    }
  },
  {
    id: 'p2',
    name: 'Tai Nghe Bluetooth Không Dây True Wireless Chống Ồn Chủ Động ANC Bass Cực Căng',
    price: 459000,
    originalPrice: 890000,
    rating: 4.9,
    reviewsCount: 3820,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80'
    ],
    category: 'mobile-acc',
    sold: 9800,
    stock: 45,
    discount: 48,
    isFlashSale: true,
    flashSaleProgress: 95,
    isMall: true,
    location: 'TP. Hồ Chí Minh',
    options: ['Trắng Ngọc Trai', 'Đen Nhám', 'Xanh Than'],
    description: 'Trải nghiệm chất lượng âm thanh studio chân thực nhất với dòng tai nghe không dây thế hệ mới. Hệ thống màng loa sinh học Dynamic Driver 13mm mang đến dải âm bass dày, ấm, kết hợp với công nghệ Chống Ồn Chủ Động (ANC) lọc sạch tạp âm lên tới 35dB.\n\nThông số kỹ thuật:\n- Bluetooth thế hệ 5.3 kết nối nhanh trong bán kính 15m.\n- Thời lượng pin khủng: 6 giờ nghe nhạc liên tục (kèm hộp sạc lên đến 30 giờ).\n- Kháng nước tiêu chuẩn IPX5 thoải mái vận động thể thao ngoài trời.',
    specs: {
      'Phiên bản Bluetooth': 'v5.3 thế hệ mới nhất',
      'Dung lượng pin tai nghe': '40 mAh mỗi tai',
      'Thời gian sạc đầy': '1.5 giờ',
      'Bảo hành': '12 tháng 1 đổi 1'
    }
  },
  {
    id: 'p3',
    name: 'Váy Hoa Nhí Vintage Hàn Quốc Tay Bồng Thắt Eo tôn dáng che khuyết điểm cực xinh',
    price: 189000,
    originalPrice: 320000,
    rating: 4.7,
    reviewsCount: 840,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop&q=80'
    ],
    category: 'fashion-female',
    sold: 1900,
    stock: 80,
    discount: 41,
    isFavorite: true,
    location: 'Đà Nẵng',
    options: ['Vàng Hoa Nhí - S', 'Vàng Hoa Nhí - M', 'Vàng Hoa Nhí - L', 'Xanh Pastel - S', 'Xanh Pastel - M'],
    description: 'Đầm voan tơ dáng dài thướt tha, họa tiết hoa nhí mang phong cách cổ điển, lãng mạn. Thiết kế cổ chữ V thanh thoát kết hợp chun thắt eo nhẹ tôn vòng eo thon gọn, kết hợp ống tay bồng che khuyết điểm bắp tay hiệu quả.\n\nChất liệu voan Hàn hai lớp mềm mại, có lớp lót lụa habutai lót trong cực kỳ kín đáo, an toàn.',
    specs: {
      'Chất liệu': 'Voan Hàn cao cấp mềm mịn',
      'Độ dài váy': '105 cm - Qua gối',
      'Phù hợp': 'Đi chơi, đi tiệc nhẹ, dạo phố, chụp ảnh du lịch'
    }
  },
  {
    id: 'p4',
    name: 'Robot Hút Bụi Lau Nhà Thông Minh Bản Quốc Tế Tự Động Tránh Vật Cản Siêu Thông Minh',
    price: 3450000,
    originalPrice: 5900000,
    rating: 4.9,
    reviewsCount: 420,
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563161402-8b110222be7e?w=500&auto=format&fit=crop&q=80'
    ],
    category: 'electronics',
    sold: 1200,
    stock: 25,
    discount: 41,
    isMall: true,
    location: 'Hà Nội',
    options: ['Trắng Chuẩn S', 'Đen Carbon Pro'],
    description: 'Thế hệ Robot lau quét nhà kết hợp đa năng, giúp bạn thảnh thơi dọn dẹp nhà cửa hoàn toàn tự động. Robot sở hữu cảm biến Laser Lidar quét lập bản đồ nhà 3D chính xác, phân vùng dọn dẹp khoa học tránh đụng tường hay rơi cầu thang.\n\nLực hút siêu khỏe 4000Pa hút sạch mọi cát bụi bám ở khe thảm, cùng khay chứa nước điều khiển điện tử thông minh chống tràn.',
    specs: {
      'Lực hút': '4000 Pa cực mạnh',
      'Dung tích hộp bụi': '450 ml',
      'Thời gian sạc': '3-4 giờ',
      'Điều khiển qua App': 'Ứng dụng tiếng Việt thông minh Mi Home'
    }
  },
  {
    id: 'p5',
    name: 'Son Kem Lì Siêu Mịn Môi Không Khô Nứt, Lên Màu Chuẩn Tông Quý Phái Môi Mọng',
    price: 195000,
    originalPrice: 350000,
    rating: 4.8,
    reviewsCount: 5400,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=500&auto=format&fit=crop&q=80'
    ],
    category: 'beauty-cosmetics',
    sold: 15400,
    stock: 450,
    discount: 44,
    isFavorite: true,
    location: 'Hà Nội',
    options: ['#01 Đỏ Gạch', '#02 Cam Đất', '#03 Hồng Trà Sữa', '#04 Đỏ Rượu Cherry'],
    description: 'Dòng son kem lì làm say đắm hàng triệu tín đồ làm đẹp với chất son mịn lì xốp mượt tựa như bơ. Công thức đột phá chứa hyaluronic acid cấp ẩm sâu giúp đôi môi luôn mềm mại, không lộ vân môi hay gây bết dính suốt cả ngày dài.\n\nBảng màu thời thượng cực kỳ tôn da Châu Á, giúp bạn tỏa sáng thu hút mọi ánh nhìn.',
    specs: {
      'Khối lượng': '4.2 g',
      'Độ bền màu': '6 - 8 tiếng liên tục',
      'Thành phần': 'Chiết xuất dầu Jojoba, Vitamin E dưỡng ẩm sâu'
    }
  },
  {
    id: 'p6',
    name: 'Giày Thể Thao Nam Nữ Sneaker Trắng Đế Cao Su Khâu Full Chỉ Chắc Chắn Hàng Hiệu',
    price: 299000,
    originalPrice: 550000,
    rating: 4.6,
    reviewsCount: 2150,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80'
    ],
    category: 'shoes',
    sold: 5200,
    stock: 95,
    discount: 45,
    isFavorite: true,
    location: 'Hà Nội',
    options: ['Trắng Basic - 38', 'Trắng Basic - 39', 'Trắng Basic - 40', 'Trắng Basic - 41', 'Trắng Basic - 42'],
    description: 'Giày sneaker phong cách tối giản là vật phẩm quốc dân cần có trong tủ giày của bất kỳ ai. Thiết kế phom ôm gọn gàng thời trang đi cực êm chân nhờ lót đệm bọt biển đàn hồi tốt.\n\nThân giày làm bằng da Microfiber cao cấp mềm mượt, dễ dàng lau chùi làm sạch bằng khăn ẩm khi dính bụi bẩn.',
    specs: {
      'Chất liệu ngoài': 'Da tổng hợp bền màu',
      'Đế giày': 'Cao su tự nhiên đúc nguyên khối chống trơn trượt',
      'Chiều cao đế': '3.5 cm tôn dáng'
    }
  },
  {
    id: 'p7',
    name: 'Nồi Chiên Không Dầu Điện Tử Dung Tích Lớn 8L Đa Năng Chiên Nướng Đồ Ăn Không Dầu Mỡ',
    price: 1190000,
    originalPrice: 2400000,
    rating: 4.8,
    reviewsCount: 890,
    image: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=500&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1628113315418-038b4599f9c1?w=500&auto=format&fit=crop&q=80'
    ],
    category: 'home-living',
    sold: 3100,
    stock: 40,
    discount: 50,
    isMall: true,
    location: 'TP. Hồ Chí Minh',
    options: ['Đen Cổ Điển', 'Xanh Ngọc Lục Bảo'],
    description: 'Bí quyết bảo vệ sức khỏe cho cả gia đình bằng việc loại bỏ đến 85% lượng chất béo dư thừa trong thực phẩm nhờ công nghệ khí nóng xoay chiều tuần hoàn Rapid Air.\n\nMàn hình cảm ứng LCD siêu nhạy cài sẵn 8 chế độ nấu tiện lợi bao gồm: khoai tây chiên, nướng gà nguyên con, nướng tôm, nướng bánh ngọt chỉ với 1 nút bấm.',
    specs: {
      'Dung tích': '8.0 Lít (vừa vặn gà 2kg)',
      'Công suất': '1800W mạnh mẽ',
      'Dải nhiệt độ': '80 - 200 độ C',
      'Bảo hành': '18 tháng chính hãng'
    }
  },
  {
    id: 'p8',
    name: 'Bình Giữ Nhiệt Lõi Inox 316 Cao Cấp Giữ Nhiệt Lên Tới 24H Có Ống Hút Tiện Lợi',
    price: 155000,
    originalPrice: 300000,
    rating: 4.7,
    reviewsCount: 3100,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80'
    ],
    category: 'sports-travel',
    sold: 11200,
    stock: 140,
    discount: 48,
    isFlashSale: true,
    flashSaleProgress: 60,
    location: 'Bình Dương',
    options: ['Trắng Cream 710ml', 'Hồng Pastel 710ml', 'Xanh Mint 710ml', 'Xanh Navy 900ml'],
    description: 'Bình nước giữ nhiệt inox 316 - dòng thép không gỉ chuyên dùng trong y tế cực kỳ an toàn, có khả năng chống ăn mòn và axit vượt trội so với inox 304 thông thường.\n\nThiết kế cấu trúc cách nhiệt chân không 5 lớp giúp giữ nóng trên 12 giờ, giữ đá lạnh cực tốt lên tới 24 giờ không bị tụ nước ngoài vỏ.',
    specs: {
      'Ruột bình': 'Inox 316 cao cấp kháng khuẩn',
      'Vỏ bình': 'Sơn tĩnh điện nhám cao cấp chống xước',
      'Phụ kiện': 'Có sẵn ống hút silicon mềm và quai xách tiện dụng'
    }
  },
  {
    id: 'p9',
    name: 'Bộ 4 Hộp Thủy Tinh Đựng Thức Ăn Chia Ngăn Chịu Nhiệt Lò Vi Sóng Nắp Có Gioăng Silicon',
    price: 215000,
    originalPrice: 380000,
    rating: 4.9,
    reviewsCount: 1620,
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500&auto=format&fit=crop&q=80'
    ],
    category: 'home-living',
    sold: 4300,
    stock: 55,
    discount: 43,
    location: 'TP. Hồ Chí Minh',
    options: ['Bộ 4 Hộp Tròn 620ml', 'Bộ 4 Hộp Chữ Nhật 700ml'],
    description: 'Bộ khay hộp thủy tinh cường lực Borosilicate cao cấp, có khả năng chịu cú sốc nhiệt từ -20 đến 400 độ C. Hoàn toàn an toàn khi sử dụng để nướng bánh hoặc hâm nóng đồ ăn trực tiếp trong lò vi sóng, lò nướng.\n\nNắp nhựa PP nguyên sinh kết hợp gioăng cao su silicon bám khít ngăn ngừa tràn nước canh rò rỉ tối đa khi đem cơm trưa văn phòng.',
    specs: {
      'Chất liệu': 'Thủy tinh chịu nhiệt Borosilicate',
      'Độ chịu nhiệt': 'Chịu sốc nhiệt cực đại lên đến 120 độ C',
      'Thương hiệu': 'Lock&Lock chính hãng phân phối'
    }
  },
  {
    id: 'p10',
    name: 'Balo Thời Trang Học Sinh Sinh Viên Đựng Laptop 15.6 Inch Vải Canvas Kháng Nước Cao Cấp',
    price: 245000,
    originalPrice: 420000,
    rating: 4.8,
    reviewsCount: 1750,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&auto=format&fit=crop&q=80'
    ],
    category: 'sports-travel',
    sold: 3800,
    stock: 80,
    discount: 41,
    isMall: true,
    location: 'Cần Thơ',
    options: ['Đen Phối Trắng', 'Xám Ghi', 'Hồng Phấn'],
    description: 'Balo unisex đa ngăn với thiết kế tối giản, thời trang năng động. Chất liệu vải Oxford chống thấm trượt nước vượt trội, bảo vệ sách vở laptop của bạn khi bất chợt gặp trời mưa rào.\n\nBên trong trang bị khoang đệm riêng biệt chống sốc cực dày dặn dành cho laptop và iPad, cùng nhiều túi nhỏ phụ sắp xếp đồ dùng khoa học gọn gàng.',
    specs: {
      'Chất liệu vải': 'Polyester Oxford 900D chống thấm nước',
      'Kích thước': '42 x 30 x 14 cm',
      'Khối lượng': '650 g siêu nhẹ',
      'Ngăn đựng laptop': 'Lên tới 15.6 inch tiện lợi'
    }
  },
  {
    id: 'p11',
    name: 'Kem Chống Nắng Dưỡng Thể Kiềm Dầu Nâng Tông Tự Nhiên Bảo Vệ Da Suốt 8 Tiếng',
    price: 275000,
    originalPrice: 490000,
    rating: 4.9,
    reviewsCount: 7800,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80'
    ],
    category: 'beauty-cosmetics',
    sold: 21000,
    stock: 300,
    discount: 43,
    isMall: true,
    location: 'TP. Hồ Chí Minh',
    options: ['Mọi Loại Da SPF50+ 50ml', 'Da Nhạy Cảm Calming 50ml'],
    description: 'Màng lọc chống nắng vật lý lai hóa học tân tiến thế hệ mới mang tới chỉ số chống nắng bảo vệ phổ rộng cực cao SPF50+ PA++++. Chống lại tia cực tím UVA, UVB gây lão hóa da và sạm nám hiệu quả.\n\nCông nghệ bột mút siêu mịn kiểm soát chất nhờn thừa tức thì, mang lại cảm giác nhẹ tênh, mịn lỳ tệp màu da không bết dính tạo vệt trắng.',
    specs: {
      'Chỉ số bảo vệ': 'SPF 50+ / PA++++ chống nắng phổ rộng',
      'Loại da phù hợp': 'Mọi loại da, đặc biệt là da dầu và hỗn hợp thiên dầu',
      'Hạn sử dụng': '3 năm kể từ ngày sản xuất'
    }
  },
  {
    id: 'p12',
    name: 'Sữa Tắm Cho Bé Sơ Sinh Chiết Xuất Hoa Cúc Dịu Nhẹ Không Cay Mắt Đạt Chuẩn Hữu Cơ',
    price: 165000,
    originalPrice: 280000,
    rating: 4.9,
    reviewsCount: 950,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80'
    ],
    category: 'mom-baby',
    sold: 2400,
    stock: 75,
    discount: 41,
    location: 'Đồng Nai',
    options: ['Hương Hoa Cúc 250ml', 'Hương Lavender Thư Giãn 250ml'],
    description: 'Sữa tắm gội 2 trong 1 dành riêng cho bé yêu từ những ngày đầu đời. Chiết xuất hoa cúc Calendula hữu cơ đạt chuẩn EcoCert châu Âu giúp làm dịu mẩn ngứa, dưỡng ẩm da mỏng manh của trẻ luôn mềm mại, mịn màng.\n\nCông thức 100% không chứa xà phòng, paraben, cồn, độ pH trung tính hoàn hảo nâng niu làn da bé không gây cay mắt.',
    specs: {
      'Độ tuổi phù hợp': 'Dùng được cho trẻ sơ sinh từ 0 tháng tuổi',
      'Xuất xứ thương hiệu': 'Đức',
      'Chứng chỉ an toàn': 'Đã qua kiểm nghiệm da liễu nhi khoa gắt gao'
    }
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    username: 'nguyenvana_99',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2026-06-15 14:32',
    comment: 'Sản phẩm giao cực kỳ nhanh, đóng gói rất cẩn thận bọc xốp bóng khí dày dặn. Chất lượng tuyệt vời đúng như quảng cáo, mình sẽ tiếp tục ủng hộ shop lâu dài!',
    optionSelected: 'Đen Nhám',
    likes: 24,
    images: [
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=300&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'r2',
    username: 'thanhhang_kute',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2026-06-20 09:15',
    comment: 'Váy xinh lắm mọi người ơi, chất vải voan cực mềm có lót lụa habutai mát mẻ. Phom thắt eo bồng mặc tôn dáng cực kỳ. Đi du lịch mặc chụp ảnh sống ảo là bao phê!',
    optionSelected: 'Vàng Hoa Nhí - M',
    likes: 45,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'r3',
    username: 'tranquocbao',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    rating: 4,
    date: '2026-06-18 21:05',
    comment: 'Áo thun mặc khá thoải mái, cotton mát mẻ thấm mồ hôi. Điểm trừ duy nhất là giao hàng hơi chậm hơn dự kiến 1 ngày nhưng bù lại chất lượng rất ổn áp với mức giá này.',
    optionSelected: 'Trắng - L',
    likes: 8
  },
  {
    id: 'r4',
    username: 'minh_thu_pham',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2026-06-25 18:40',
    comment: 'Son kem lì đẹp dã man luôn các nàng ơi! Mình mua màu #01 đỏ gạch đánh lên da sáng bừng luôn. Chất son xốp mịn, giữ màu siêu tốt mà không hề bị khô môi tí nào. Yêu ghê!',
    optionSelected: '#01 Đỏ Gạch',
    likes: 56,
    images: [
      'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=300&auto=format&fit=crop&q=80'
    ]
  }
];
