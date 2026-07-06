export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  id:     string;
  slug:   string;
  label:  string;
  name:   string;
  type:   string;
  area:   string;
  style:  string;
  year:   string;
  desc:   string;
  images: ProjectImage[];
};

export const PROJECTS: Project[] = [
  /* ── DỰ ÁN MỚI NHẤT — hiển thị đầu tiên ── */
  {
    id:    'p4',
    slug:  'can-ho-luxury-2pn',
    label: 'Dự Án 04',
    name:  'Căn Hộ Luxury 2PN — Beige & Gold',
    type:  'Căn hộ cao cấp',
    area:  '75m²',
    style: 'Contemporary Luxury',
    year:  '2026',
    desc:  'Căn hộ 2 phòng ngủ phong cách Contemporary Luxury — bảng màu beige kem kết hợp chi tiết vàng đồng tinh tế. Sàn xương cá, vách ốp lanh tô sang trọng, phòng ngủ master có view thành phố và khu thay đồ mở. Phòng trẻ em được thiết kế riêng theo chủ đề mây & sao dễ thương.',
    images: [
      { src: '/images/p4/image_2.jpg',          alt: 'Phòng ngủ master — view thành phố, đèn thả vàng, sàn xương cá' },
      { src: '/images/p4/image_5.jpg',          alt: 'Phòng ngủ master — khu thay đồ mở, gương đứng, chi tiết vàng đồng' },
      { src: '/images/p4/image_3.jpg',          alt: 'Phòng ngủ — tủ trưng bày vàng, tivi tường, logo Nếp Hiên' },
      { src: '/images/p4/image_6.jpg',          alt: 'Phòng trẻ em — chủ đề mây & sao, bàn học xanh mint, tủ navy' },
      { src: '/images/p4/image_10.jpg',         alt: 'Bếp & bàn ăn — tủ bếp trắng/gỗ, bàn tròn marble, đèn thả' },
      { src: '/images/p4/image_1.jpg',          alt: 'Phòng vệ sinh — cổng vòm gỗ, lavabo marble, gương đèn LED' },
      { src: '/images/p4/image_4.jpg',          alt: 'Căn hộ luxury 2PN — góc nhìn không gian' },
      { src: '/images/p4/image_7.jpg',          alt: 'Căn hộ luxury 2PN — chi tiết nội thất' },
      { src: '/images/p4/image_8.jpg',          alt: 'Căn hộ luxury 2PN — phòng ngủ phụ' },
      { src: '/images/p4/image_9.jpg',          alt: 'Căn hộ luxury 2PN — không gian sống' },
      { src: '/images/p4/image_11.jpg',         alt: 'Căn hộ luxury 2PN — chi tiết hoàn thiện' },
      { src: '/images/p4/image_12.jpg',         alt: 'Căn hộ luxury 2PN — phòng khách' },
      { src: '/images/p4/image_13.jpg',         alt: 'Căn hộ luxury 2PN — góc thư giãn' },
      { src: '/images/p4/image_14.jpg',         alt: 'Căn hộ luxury 2PN — toàn cảnh nội thất' },
      { src: '/images/p4/can14-overview.jpg',   alt: 'Căn hộ luxury 2PN — tổng quan không gian' },
    ],
  },
  {
    id:    'p5',
    slug:  'concept-3d-can-a1',
    label: 'Dự Án 05',
    name:  'Thiết Kế 3D — Căn A1',
    type:  'Căn hộ',
    area:  '65m²',
    style: 'New Classic',
    year:  '2026',
    desc:  'Bản thiết kế 3D concept căn A1 theo phong cách New Classic — tone màu kem & hồng đào nhẹ nhàng, điểm nhấn vàng đồng ấm áp. Phòng ăn với đèn thả vàng và vòm cung cổ điển, phòng ngủ master view thành phố, bếp mở thông thoáng. Kèm bản vẽ mặt bằng Topview trực quan.',
    images: [
      { src: '/images/p5/a1_14.jpg',      alt: 'Phòng ăn — đèn thả vàng, vòm cung cổ điển, tủ cao sang trọng' },
      { src: '/images/p5/a1_05.jpg',      alt: 'Phòng ngủ master — beige hồng, đèn thả đen, tủ gương, view thành phố' },
      { src: '/images/p5/a1_09.jpg',      alt: 'Phòng khách — tường TV kết hợp kệ vàng, sofa trắng, bàn cafe đen' },
      { src: '/images/p5/a1_12.jpg',      alt: 'Không gian sống mở — phòng khách + bếp, đồng hồ vàng, sofa kem' },
      { src: '/images/p5/a1_03.jpg',      alt: 'Phòng ngủ phụ — view thành phố, tivi tường, tối giản sáng sủa' },
      { src: '/images/p5/topview.jpg',    alt: 'Mặt bằng Topview — bố cục 2PN, phòng khách, bếp, 2 phòng vệ sinh' },
      { src: '/images/p5/a1_01.jpg',      alt: 'Căn A1 — không gian phòng ngủ concept 3D' },
      { src: '/images/p5/a1_02.jpg',      alt: 'Căn A1 — chi tiết nội thất 3D render' },
      { src: '/images/p5/a1_04.jpg',      alt: 'Căn A1 — góc nhìn phòng sinh hoạt' },
      { src: '/images/p5/a1_06.jpg',      alt: 'Căn A1 — phòng ngủ master góc 2' },
      { src: '/images/p5/a1_07.jpg',      alt: 'Căn A1 — không gian bếp & ăn' },
      { src: '/images/p5/a1_08.jpg',      alt: 'Căn A1 — góc phòng khách chi tiết' },
      { src: '/images/p5/a1_10.jpg',      alt: 'Căn A1 — phòng ngủ phụ chi tiết' },
      { src: '/images/p5/a1_11.jpg',      alt: 'Căn A1 — hành lang & lối vào' },
      { src: '/images/p5/a1_13.jpg',      alt: 'Căn A1 — phòng ăn góc 2' },
      { src: '/images/p5/a1_15.jpg',      alt: 'Căn A1 — chi tiết hoàn thiện' },
      { src: '/images/p5/a1_16.jpg',      alt: 'Căn A1 — phòng vệ sinh' },
      { src: '/images/p5/a1_17.jpg',      alt: 'Căn A1 — không gian thư giãn' },
      { src: '/images/p5/a1_18.jpg',      alt: 'Căn A1 — góc trang trí' },
      { src: '/images/p5/a1_19.jpg',      alt: 'Căn A1 — tổng quan căn hộ' },
      { src: '/images/p5/a1_20.jpg',      alt: 'Căn A1 — toàn cảnh không gian sống' },
    ],
  },
  {
    id:    'p1',
    slug:  'can-ho-hien-dai',
    label: 'Dự Án 01',
    name:  'Căn Hộ Hiện Đại',
    type:  'Căn hộ cao cấp',
    area:  '120m²',
    style: 'Modern Minimalist',
    year:  '2024',
    desc:  'Không gian căn hộ được thiết kế theo phong cách tối giản hiện đại, tận dụng tối đa ánh sáng tự nhiên. Bảng màu trung tính ấm kết hợp với chi tiết vàng đồng tạo nên sự sang trọng tinh tế.',
    images: [
      { src: '/images/p1/z7935782332341_4939d3f8181de417e6ebd0baa6016085.jpg', alt: 'Căn hộ hiện đại – phòng khách' },
      { src: '/images/p1/z7935782332344_8e8cf0dee2431dd94b0b146b9b958826.jpg', alt: 'Căn hộ hiện đại – phòng ngủ' },
      { src: '/images/p1/z7935782332345_8fde56fc340a2a01846ef506a8606b5a.jpg', alt: 'Căn hộ hiện đại – không gian bếp' },
      { src: '/images/p1/z7935782332346_a370d670240463615915b68c8039809e.jpg', alt: 'Căn hộ hiện đại – phòng ngủ master' },
      { src: '/images/p1/z7935782332361_a97cb3ed308cf599bd29acd403d45750.jpg', alt: 'Căn hộ hiện đại – lối vào' },
      { src: '/images/p1/z7935782332362_3d40cf7b8a6cc665fac522e55cacf54d.jpg', alt: 'Căn hộ hiện đại – phòng tắm' },
      { src: '/images/p1/z7935782332363_9f60fd90a97117c4e224288ff73dc5e7.jpg', alt: 'Căn hộ hiện đại – phòng làm việc' },
      { src: '/images/p1/z7935782332364_af28e04316fd884aa6bb4ffffb937f88.jpg', alt: 'Căn hộ hiện đại – ban công' },
      { src: '/images/p1/z7935782332365_690119f449db3541540489627d0f9e68.jpg', alt: 'Căn hộ hiện đại – chi tiết nội thất' },
      { src: '/images/p1/z7935782332366_cf902726476f4ffa358c5e5875e8631d.jpg', alt: 'Căn hộ hiện đại – phòng ăn' },
      { src: '/images/p1/z7935782332367_f92578a276ff07ddb8f4d3089a247255.jpg', alt: 'Căn hộ hiện đại – góc trưng bày' },
      { src: '/images/p1/z7935782332379_1ce056247e5669f61a4d81802108a04a.jpg', alt: 'Căn hộ hiện đại – tủ âm tường' },
      { src: '/images/p1/z7935782332380_3df01d1dc7ee8b4234b9217dbd8e4086.jpg', alt: 'Căn hộ hiện đại – không gian mở' },
      { src: '/images/p1/z7935782332381_17ac6f4fbbdd53b1cf2768a8a96aa0fa.jpg', alt: 'Căn hộ hiện đại – tổng quan' },
    ],
  },
  {
    id:    'p2',
    slug:  'chung-cu-indochine',
    label: 'Dự Án 02',
    name:  'Chung Cư Indochine',
    type:  'Chung cư cao cấp',
    area:  '320m²',
    style: 'Indochine Hiện Đại',
    year:  '2024',
    desc:  'Căn hộ chung cư cao cấp mang ngôn ngữ kiến trúc Đông Dương cổ điển kết hợp nội thất hiện đại. Các vật liệu tự nhiên như gỗ óc chó, đá marble trắng và chi tiết đồng mạ vàng tạo nên không gian sang trọng và ấm cúng.',
    images: [
      { src: '/images/p2/z7896373239436_a6453c1ea75694dd3551590316c11802.jpg', alt: 'Chung cư Indochine – phòng khách chính' },
      { src: '/images/p2/z7896373239437_87dcda87aa7cc2381f3c680b9c727958.jpg', alt: 'Chung cư Indochine – không gian ăn' },
      { src: '/images/p2/z7896373239443_4006c298acf9452090583f551ee66e75.jpg', alt: 'Chung cư Indochine – phòng ngủ master' },
      { src: '/images/p2/z7896373239485_1ee4c015747f500330f87d6d0f326030.jpg', alt: 'Chung cư Indochine – phòng tắm' },
      { src: '/images/p2/z7896373267515_ff8395c4446f1ad973986fd11b752a18.jpg', alt: 'Chung cư Indochine – sảnh đón' },
      { src: '/images/p2/z7896373267544_ed2630062783a45832ab728d974da275.jpg', alt: 'Chung cư Indochine – cầu thang' },
      { src: '/images/p2/z7896373298317_63191dd3aea3a377aedd8038464e62b1.jpg', alt: 'Chung cư Indochine – phòng ngủ' },
      { src: '/images/p2/z7896373298376_f5653dd39b59eb0e8f22ab2e7898ac4d.jpg', alt: 'Chung cư Indochine – bếp' },
      { src: '/images/p2/z7896373313767_dee9aa9f6940138d80d2e7b8e73be948.jpg', alt: 'Chung cư Indochine – không gian thư viện' },
      { src: '/images/p2/z7896373331299_c70e206452ba66f53246a078b9f75cb5.jpg', alt: 'Chung cư Indochine – ban công' },
      { src: '/images/p2/z7896373348135_0de645fd3e40778e255463fc2eab6752.jpg', alt: 'Chung cư Indochine – phòng giải trí' },
      { src: '/images/p2/z7896373348183_e6e5aab1b42e8d708bf1ac2f42fc930e.jpg', alt: 'Chung cư Indochine – chi tiết trang trí' },
      { src: '/images/p2/z7896373348227_40260b839a48009ecc19ef2361548e4b.jpg', alt: 'Chung cư Indochine – góc nhìn tổng thể' },
      { src: '/images/p2/z7896373362819_7cbc02e87da77ba1e47d2ae74d9cd197.jpg', alt: 'Chung cư Indochine – phòng khách góc rộng' },
    ],
  },
  {
    id:    'p3',
    slug:  'van-phong-wabi-sabi',
    label: 'Dự Án 03',
    name:  'Văn Phòng Wabi-Sabi',
    type:  'Văn phòng',
    area:  '180m²',
    style: 'Wabi-Sabi Minimalist',
    year:  '2023',
    desc:  'Không gian văn phòng theo triết lý Wabi-Sabi Nhật Bản — đề cao vẻ đẹp không hoàn hảo, tự nhiên và giản dị. Gỗ thô, tông màu đất, ánh sáng khuếch tán tạo môi trường làm việc thư thái và sáng tạo.',
    images: [
      { src: '/images/p3/z7896845415116_9ff5dc2a63b2833e46db7a1720c7f52b.jpg', alt: 'Văn phòng – không gian chung' },
      { src: '/images/p3/z7896845415133_bd11d68290115ba7f8570cf220884221.jpg', alt: 'Văn phòng – khu làm việc' },
      { src: '/images/p3/z7896845447691_8238c9ba0a5fb85774760214262ef8f2.jpg', alt: 'Văn phòng – phòng họp' },
      { src: '/images/p3/z7896845510945_f4fd5f2417e865f3384fc93c951d042a.jpg', alt: 'Văn phòng – góc tiếp khách' },
      { src: '/images/p3/z7896845533158_7fae4a5fa5bb45a0de03b4a65c192eab.jpg', alt: 'Văn phòng – phòng giám đốc' },
      { src: '/images/p3/z7896845584778_605008689ab727d0e0a3a29e9c749a65.jpg', alt: 'Văn phòng – khu pantry' },
      { src: '/images/p3/z7896845660337_62c1de780d473b0be371d894524727ee.jpg', alt: 'Văn phòng – lối đi' },
      { src: '/images/p3/z7896845712220_1978b20ce40afe706020b8c9bdfe415c.jpg', alt: 'Văn phòng – chi tiết nội thất' },
      { src: '/images/p3/z7896845766027_690965b1628f77a0de8a3a956ff6220c.jpg', alt: 'Văn phòng – góc nghỉ ngơi' },
      { src: '/images/p3/z7896845807657_c7b9edc951636204438d50be3de11572.jpg', alt: 'Văn phòng – toàn cảnh' },
    ],
  },
];

export const ALL_IMAGES = PROJECTS.flatMap(p =>
  p.images.map(img => ({ ...img, projectName: p.name, projectId: p.id, projectSlug: p.slug }))
);
