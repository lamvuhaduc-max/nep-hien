'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ThongTinPhienAdmin } from '@/lib/auth-admin';
import {
  ChiTietBaiVietDto,
  DanhMucBaiVietDto,
  TrangThaiBaiViet,
} from '@/lib/content/bai-viet-service';
import { rutMucLuc, taoSlug } from '@/lib/content/muc-luc';
import {
  BanNhapBaiVietCucBo,
  docNhapCucBo,
  ghiNhapCucBo,
  khoaNhapCucBo,
  xoaNhapCucBo,
} from './_nhap-cuc-bo';
import { SoiSeo } from './_SoiSeo';
import { AdminSidebar } from './_AdminSidebar';

interface Props {
  cheDo: 'moi' | 'sua';
  baiVietId?: number;
}

const ANH_MAU_NEP_HIEN = [
  { nhan: 'Căn hộ Luxury 2PN — Phòng ngủ Master', url: '/images/p4/image_2.jpg' },
  { nhan: 'Căn hộ Luxury 2PN — Bếp & Bàn ăn', url: '/images/p4/image_10.jpg' },
  { nhan: 'Concept 3D Căn A1 — Phòng ăn', url: '/images/p5/a1_14.jpg' },
  { nhan: 'Concept 3D Căn A1 — Không gian mở', url: '/images/p5/a1_12.jpg' },
  { nhan: 'Căn hộ Hiện đại — Phòng khách', url: '/images/p1/z7935782332341_4939d3f8181de417e6ebd0baa6016085.jpg' },
  { nhan: 'Chung cư Indochine — Phòng khách chính', url: '/images/p2/z7896373239436_a6453c1ea75694dd3551590316c11802.jpg' },
  { nhan: 'Căn hộ Wabi-Sabi — Không gian thiền', url: '/images/p3/z7896845766027_690965b1628f77a0de8a3a956ff6220c.jpg' },
];

const NOI_DUNG_MAC_DINH =
  '<h2>1. Mở đầu về triết lý không gian</h2><p>Nhập nội dung bài viết tại đây...</p><h2>2. Giải pháp vật liệu và ánh sáng</h2><p>Chia sẻ chi tiết về vật liệu tự nhiên và bố cục nội thất.</p>';

export function SoanThaoBaiViet({ cheDo, baiVietId }: Props) {
  const router = useRouter();
  const khoaNhap = useMemo(() => khoaNhapCucBo(cheDo, baiVietId), [cheDo, baiVietId]);

  const [nguoiDungHienTai, setNguoiDungHienTai] = useState<ThongTinPhienAdmin | null>(null);
  const [danhMuc, setDanhMuc] = useState<DanhMucBaiVietDto[]>([]);
  const [dangTaiBanDau, setDangTaiBanDau] = useState(true);
  const [dangLuu, setDangLuu] = useState(false);
  const [dangTaiAnhBia, setDangTaiAnhBia] = useState(false);
  const [dangTaiAnhBai, setDangTaiAnhBai] = useState(false);

  const [tieuDe, setTieuDe] = useState('');
  const [slug, setSlug] = useState('');
  const [slugGocKhiTai, setSlugGocKhiTai] = useState('');
  const [slugTuSua, setSlugTuSua] = useState(false);
  const [danhMucId, setDanhMucId] = useState<number | ''>('');
  const [moTaNgan, setMoTaNgan] = useState('');
  const [anhBia, setAnhBia] = useState('/images/p4/image_2.jpg');
  const [noiDungHtml, setNoiDungHtml] = useState(NOI_DUNG_MAC_DINH);
  const [trangThai, setTrangThai] = useState<TrangThaiBaiViet>('nhap');
  const [ngayDang, setNgayDang] = useState<string | null>(null);
  const [xoaLuc, setXoaLuc] = useState<string | null>(null);
  const [tacGia, setTacGia] = useState('Ban Biên Tập Nếp Hiên');
  const [noiBat, setNoiBat] = useState(false);

  const [cheDoTrinhSoan, setCheDoTrinhSoan] = useState<'truc_quan' | 'html' | 'xem_truoc'>(
    'truc_quan',
  );
  const [toanManHinh, setToanManHinh] = useState(false);
  const [chieuCaoHeader, setChieuCaoHeader] = useState(118);
  const [nhapCucBoTonTai, setNhapCucBoTonTai] = useState<BanNhapBaiVietCucBo | null>(null);
  const [thongBao, setThongBao] = useState<{ loai: 'ok' | 'loi' | 'canh_bao'; chu: string } | null>(
    null,
  );

  const headerTrangRef = useRef<HTMLElement | null>(null);
  const khungBaoSoanRef = useRef<HTMLDivElement | null>(null);
  const vungSoanRef = useRef<HTMLDivElement | null>(null);
  const bangDangChonRef = useRef<HTMLTableElement | null>(null);
  const oDangChonRef = useRef<HTMLTableCellElement | null>(null);
  const inputAnhBiaRef = useRef<HTMLInputElement | null>(null);
  const inputAnhBaiRef = useRef<HTMLInputElement | null>(null);
  const daLuuChinhThucRef = useRef(false);
  const duLieuGocRef = useRef<{
    tieuDe: string;
    moTaNgan: string;
    noiDungHtml: string;
  } | null>(null);
  const duLieuHienTaiRef = useRef({
    tieuDe: '',
    slug: '',
    slugTuSua: false,
    danhMucId: '' as number | '',
    moTaNgan: '',
    anhBia: '/images/p4/image_2.jpg',
    noiDungHtml: NOI_DUNG_MAC_DINH,
    tacGia: 'Ban Biên Tập Nếp Hiên',
    noiBat: false,
  });

  const danhSachDangChonRef = useRef<HTMLUListElement | HTMLOListElement | null>(null);
  const mucDanhSachDangChonRef = useRef<HTMLLIElement | null>(null);
  const lienKetDangChonRef = useRef<HTMLAnchorElement | null>(null);

  const [thongTinDanhSach, setThongTinDanhSach] = useState<{
    loai: 'ul' | 'ol';
    soMuc: number;
  } | null>(null);

  const [thongTinLienKet, setThongTinLienKet] = useState<{
    chu: string;
    href: string;
  } | null>(null);

  const [toaDoBang, setToaDoBang] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    soHang: number;
    soCot: number;
  } | null>(null);

  const capNhatKhungBang = useCallback(
    (bangMucTieu?: HTMLTableElement | null, oMucTieu?: HTMLTableCellElement | null) => {
      if (bangMucTieu !== undefined) {
        bangDangChonRef.current = bangMucTieu;
      }
      if (oMucTieu !== undefined) {
        oDangChonRef.current = oMucTieu;
      }
      const bang = bangDangChonRef.current;
      if (
        !bang ||
        !bang.isConnected ||
        !khungBaoSoanRef.current ||
        !vungSoanRef.current ||
        !vungSoanRef.current.contains(bang)
      ) {
        bangDangChonRef.current = null;
        oDangChonRef.current = null;
        setToaDoBang(null);
        return;
      }

      const rectKhung = khungBaoSoanRef.current.getBoundingClientRect();
      const rectBang = bang.getBoundingClientRect();
      const soHang = bang.querySelectorAll('tr').length;
      const soCot = bang.querySelector('tr')?.children.length || 0;

      setToaDoBang({
        top: rectBang.top - rectKhung.top,
        left: rectBang.left - rectKhung.left,
        width: rectBang.width,
        height: rectBang.height,
        soHang,
        soCot,
      });
    },
    [],
  );

  // Khoá cuộn trang ngoài và lắng nghe phím Esc khi bật chế độ mở rộng toàn màn hình
  useEffect(() => {
    if (!toanManHinh) {
      document.body.style.overflow = '';
      requestAnimationFrame(() => capNhatKhungBang());
      return;
    }
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => capNhatKhungBang());

    const xuLyPhimEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setToanManHinh(false);
      }
    };
    window.addEventListener('keydown', xuLyPhimEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', xuLyPhimEsc);
    };
  }, [toanManHinh, capNhatKhungBang]);

  // Đồng bộ nội dung vào vùng contentEditable khi chuyển sang chế độ trực quan hoặc vừa tải xong
  useEffect(() => {
    if (dangTaiBanDau) return;
    if (cheDoTrinhSoan === 'truc_quan' && vungSoanRef.current) {
      if (vungSoanRef.current.innerHTML !== noiDungHtml) {
        vungSoanRef.current.innerHTML = noiDungHtml;
      }
      // Tự động tách các khối bị lồng sai (table/ul/ol trong blockquote/li, blockquote trong li/blockquote)
      let daSuaCauTruc = false;
      const khoiLongSai = vungSoanRef.current.querySelectorAll(
        'blockquote table, li table, li blockquote, blockquote blockquote, blockquote ul, blockquote ol',
      );
      if (khoiLongSai.length > 0) {
        khoiLongSai.forEach((phanTu) => {
          let chaCapMot: HTMLElement | null = phanTu.parentElement;
          while (
            chaCapMot &&
            chaCapMot.parentElement &&
            chaCapMot.parentElement !== vungSoanRef.current
          ) {
            chaCapMot = chaCapMot.parentElement;
          }
          if (chaCapMot && chaCapMot !== phanTu) {
            chaCapMot.after(phanTu);
            daSuaCauTruc = true;
          }
        });
      }
      // Gỡ bỏ inline style rác do trình duyệt tự gắn vào thẻ <a>
      vungSoanRef.current.querySelectorAll('a[style]').forEach((theA) => {
        theA.removeAttribute('style');
        daSuaCauTruc = true;
      });
      if (daSuaCauTruc) {
        setNoiDungHtml(vungSoanRef.current.innerHTML);
      }

      if (!bangDangChonRef.current || !bangDangChonRef.current.isConnected) {
        const bangDauTien = vungSoanRef.current.querySelector('table') as HTMLTableElement | null;
        if (bangDauTien) {
          requestAnimationFrame(() =>
            capNhatKhungBang(
              bangDauTien,
              bangDauTien.querySelector('tbody td, td, th') as HTMLTableCellElement | null,
            ),
          );
        } else {
          capNhatKhungBang(null, null);
        }
      } else {
        requestAnimationFrame(() => capNhatKhungBang());
      }
    } else {
      setToaDoBang(null);
    }
  }, [dangTaiBanDau, cheDoTrinhSoan, noiDungHtml, capNhatKhungBang]);

  useEffect(() => {
    const capNhatHeader = () => {
      if (headerTrangRef.current) {
        const h = Math.round(headerTrangRef.current.getBoundingClientRect().height);
        if (h > 40) setChieuCaoHeader(h);
      }
      capNhatKhungBang();
    };
    capNhatHeader();
    window.addEventListener('resize', capNhatHeader);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && headerTrangRef.current) {
      ro = new ResizeObserver(capNhatHeader);
      ro.observe(headerTrangRef.current);
    }
    return () => {
      window.removeEventListener('resize', capNhatHeader);
      ro?.disconnect();
    };
  }, [capNhatKhungBang, dangTaiBanDau, tieuDe]);

  const kiemTraDaCoThayDoi = useCallback(
    (d: { tieuDe: string; moTaNgan: string; noiDungHtml: string }) => {
      if (cheDo === 'moi') {
        return Boolean(
          d.tieuDe.trim() ||
            d.moTaNgan.trim() ||
            (d.noiDungHtml.trim() && d.noiDungHtml.trim() !== NOI_DUNG_MAC_DINH),
        );
      }
      if (!duLieuGocRef.current) return false;
      return (
        d.tieuDe !== duLieuGocRef.current.tieuDe ||
        d.moTaNgan !== duLieuGocRef.current.moTaNgan ||
        d.noiDungHtml !== duLieuGocRef.current.noiDungHtml
      );
    },
    [cheDo],
  );

  const taiDuLieu = useCallback(async () => {
    setDangTaiBanDau(true);
    try {
      if (typeof window !== 'undefined' && window.location.search.includes('tuDongLuu=1')) {
        setThongBao({
          loai: 'ok',
          chu: 'Đã tự động lưu bài viết đang viết dở vào mục Bản nháp!',
        });
        window.history.replaceState(null, '', window.location.pathname);
      }

      fetch('/api/v1/admin/auth/me', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((u) => {
          if (u) setNguoiDungHienTai(u);
        })
        .catch(() => {});

      const resDm = await fetch('/api/v1/admin/article-categories', { cache: 'no-store' });
      const dsDm: DanhMucBaiVietDto[] = resDm.ok ? await resDm.json() : [];
      setDanhMuc(dsDm);

      let bvHienTai: ChiTietBaiVietDto | null = null;
      if (cheDo === 'sua' && baiVietId) {
        const resBv = await fetch(`/api/v1/admin/articles/${baiVietId}`, {
          cache: 'no-store',
        });
        if (!resBv.ok) {
          setThongBao({ loai: 'loi', chu: 'Không tìm thấy bài viết cần chỉnh sửa.' });
          return;
        }
        const bv: ChiTietBaiVietDto = await resBv.json();
        bvHienTai = bv;
        duLieuGocRef.current = {
          tieuDe: bv.tieuDe,
          moTaNgan: bv.moTaNgan ?? '',
          noiDungHtml: bv.noiDungHtml,
        };
        setTieuDe(bv.tieuDe);
        setSlug(bv.slug);
        setSlugGocKhiTai(bv.slug);
        setSlugTuSua(true);
        setDanhMucId(bv.danhMucId);
        setMoTaNgan(bv.moTaNgan ?? '');
        setAnhBia(bv.anhBia ?? '');
        setNoiDungHtml(bv.noiDungHtml);
        setTrangThai(bv.trangThai);
        setNgayDang(bv.ngayDang);
        setXoaLuc(bv.xoaLuc);
        setTacGia(bv.tacGia);
        setNoiBat(bv.noiBat);
      } else if (dsDm.length > 0) {
        setDanhMucId(dsDm[0].id);
      }

      // Nếu đang viết mà tải lại trang (F5) -> Tự động khôi phục và lưu thẳng vào Bản nháp trên CSDL
      const banNhapCu = docNhapCucBo(khoaNhap);
      if (banNhapCu && kiemTraDaCoThayDoi(banNhapCu)) {
        xoaNhapCucBo(khoaNhap);
        setTieuDe(banNhapCu.tieuDe);
        setSlug(banNhapCu.slug);
        setSlugTuSua(banNhapCu.slugTuSua);
        const dmChon = Number(banNhapCu.danhMucId) || dsDm[0]?.id || 1;
        setDanhMucId(dmChon);
        setMoTaNgan(banNhapCu.moTaNgan);
        setAnhBia(banNhapCu.anhBia);
        setNoiDungHtml(banNhapCu.noiDungHtml);
        setTacGia(banNhapCu.tacGia);
        setNoiBat(banNhapCu.noiBat);

        if (cheDo === 'moi') {
          const tieuDeTuDong =
            banNhapCu.tieuDe.trim() ||
            `Bản nháp bài viết (${new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })} ${new Date().toLocaleDateString('vi-VN')})`;
          const resTaoNhap = await fetch('/api/v1/admin/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tieuDe: tieuDeTuDong,
              slug: banNhapCu.slugTuSua && banNhapCu.slug.trim() ? banNhapCu.slug.trim() : undefined,
              danhMucId: dmChon,
              moTaNgan: banNhapCu.moTaNgan.trim() || null,
              anhBia: banNhapCu.anhBia.trim() || null,
              noiDungHtml: banNhapCu.noiDungHtml,
              trangThai: 'nhap',
              tacGia: banNhapCu.tacGia.trim() || 'Ban Biên Tập Nếp Hiên',
              noiBat: banNhapCu.noiBat,
            }),
          });
          if (resTaoNhap.ok) {
            const dataNhap = await resTaoNhap.json();
            const bvMoi: ChiTietBaiVietDto = dataNhap.baiViet;
            daLuuChinhThucRef.current = true;
            router.replace(`/admin/articles/${bvMoi.id}?tuDongLuu=1`);
            return;
          }
        } else if (cheDo === 'sua' && baiVietId && bvHienTai) {
          const resCapNhatNhap = await fetch(`/api/v1/admin/articles/${baiVietId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tieuDe: banNhapCu.tieuDe.trim() || bvHienTai.tieuDe,
              slug: banNhapCu.slug.trim() || bvHienTai.slug,
              danhMucId: dmChon,
              moTaNgan: banNhapCu.moTaNgan.trim() || null,
              anhBia: banNhapCu.anhBia.trim() || null,
              noiDungHtml: banNhapCu.noiDungHtml,
              trangThai: 'nhap',
              tacGia: banNhapCu.tacGia.trim() || bvHienTai.tacGia,
              noiBat: banNhapCu.noiBat,
            }),
          });
          if (resCapNhatNhap.ok) {
            const dataCapNhat = await resCapNhatNhap.json();
            const bvCapNhat: ChiTietBaiVietDto = dataCapNhat.baiViet;
            duLieuGocRef.current = {
              tieuDe: bvCapNhat.tieuDe,
              moTaNgan: bvCapNhat.moTaNgan ?? '',
              noiDungHtml: bvCapNhat.noiDungHtml,
            };
            setTrangThai('nhap');
            setThongBao({
              loai: 'ok',
              chu: 'Đã tự động lưu nội dung vừa viết vào mục Bản nháp!',
            });
          }
        }
      }
    } finally {
      setDangTaiBanDau(false);
    }
  }, [cheDo, baiVietId, khoaNhap, kiemTraDaCoThayDoi, router]);

  useEffect(() => {
    taiDuLieu();
  }, [taiDuLieu]);

  // Đồng bộ tức thời vào bộ nhớ tạm để khi nhấn F5 / tải lại trang sẽ tự động lưu vào Bản nháp
  useEffect(() => {
    duLieuHienTaiRef.current = {
      tieuDe,
      slug,
      slugTuSua,
      danhMucId,
      moTaNgan,
      anhBia,
      noiDungHtml,
      tacGia,
      noiBat,
    };
    if (dangTaiBanDau || daLuuChinhThucRef.current) return;
    if (kiemTraDaCoThayDoi({ tieuDe, moTaNgan, noiDungHtml })) {
      ghiNhapCucBo(khoaNhap, duLieuHienTaiRef.current);
    } else {
      xoaNhapCucBo(khoaNhap);
    }
  }, [
    dangTaiBanDau,
    khoaNhap,
    tieuDe,
    slug,
    slugTuSua,
    danhMucId,
    moTaNgan,
    anhBia,
    noiDungHtml,
    tacGia,
    noiBat,
    kiemTraDaCoThayDoi,
  ]);

  // Bắt sự kiện trước khi tải lại trang (F5 / Ctrl+R) để chốt nội dung mới nhất trong trình soạn thảo
  useEffect(() => {
    const xuLyTruocKhiTaiLai = () => {
      if (dangTaiBanDau || daLuuChinhThucRef.current) return;
      const htmlMoiNhat = vungSoanRef.current
        ? vungSoanRef.current.innerHTML
        : duLieuHienTaiRef.current.noiDungHtml;
      const banNhapMoiNhat = {
        ...duLieuHienTaiRef.current,
        noiDungHtml: htmlMoiNhat,
      };
      if (kiemTraDaCoThayDoi(banNhapMoiNhat)) {
        ghiNhapCucBo(khoaNhap, banNhapMoiNhat);
      }
    };
    window.addEventListener('beforeunload', xuLyTruocKhiTaiLai);
    return () => window.removeEventListener('beforeunload', xuLyTruocKhiTaiLai);
  }, [dangTaiBanDau, khoaNhap, kiemTraDaCoThayDoi]);

  function khoiPhucBanNhapCucBo() {
    if (!nhapCucBoTonTai) return;
    setTieuDe(nhapCucBoTonTai.tieuDe);
    setSlug(nhapCucBoTonTai.slug);
    setSlugTuSua(nhapCucBoTonTai.slugTuSua);
    if (nhapCucBoTonTai.danhMucId) setDanhMucId(nhapCucBoTonTai.danhMucId);
    setMoTaNgan(nhapCucBoTonTai.moTaNgan);
    setAnhBia(nhapCucBoTonTai.anhBia);
    setNoiDungHtml(nhapCucBoTonTai.noiDungHtml);
    setTacGia(nhapCucBoTonTai.tacGia);
    setNoiBat(nhapCucBoTonTai.noiBat);
    setNhapCucBoTonTai(null);
    setThongBao({ loai: 'ok', chu: 'Đã khôi phục bản nháp lưu tự động trên trình duyệt.' });
  }

  function boQuaBanNhapCucBo() {
    xoaNhapCucBo(khoaNhap);
    setNhapCucBoTonTai(null);
  }

  function thucThiLenhDinhDang(command: string, value?: string) {
    if (cheDoTrinhSoan !== 'truc_quan' || !vungSoanRef.current) return;
    vungSoanRef.current.focus();
    document.execCommand(command, false, value);
    setNoiDungHtml(vungSoanRef.current.innerHTML);
    requestAnimationFrame(() => capNhatKhungBang());
  }

  function timKhoiCapMotTrongSoanThao(): HTMLElement | null {
    if (!vungSoanRef.current) return null;
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode || !vungSoanRef.current.contains(sel.anchorNode)) {
      return null;
    }
    let nut: HTMLElement | null =
      sel.anchorNode instanceof HTMLElement ? sel.anchorNode : sel.anchorNode.parentElement;
    while (nut && nut.parentElement && nut.parentElement !== vungSoanRef.current) {
      nut = nut.parentElement;
    }
    return nut && nut !== vungSoanRef.current ? nut : null;
  }

  function chonNoiDungPhanTu(el: HTMLElement | null, datConTroCuoi = false) {
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    if (datConTroCuoi) {
      range.collapse(false);
    }
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  function chenDoanHtml(htmlSnippet: string) {
    if (cheDoTrinhSoan === 'truc_quan' && vungSoanRef.current) {
      const laKhoiLon = /^<(blockquote|table|figure|ul|ol)/i.test(htmlSnippet.trim());
      const khoiHienTai = timKhoiCapMotTrongSoanThao();
      if (laKhoiLon) {
        const tam = document.createElement('div');
        tam.innerHTML = htmlSnippet;
        let phanTuCuoi: Element | null = khoiHienTai;
        Array.from(tam.children).forEach((con) => {
          if (phanTuCuoi) {
            phanTuCuoi.after(con);
          } else {
            vungSoanRef.current?.appendChild(con);
          }
          phanTuCuoi = con;
        });
        if (phanTuCuoi && !phanTuCuoi.nextElementSibling) {
          const doanMoi = document.createElement('p');
          doanMoi.innerHTML = '<br />';
          phanTuCuoi.after(doanMoi);
        }
        setNoiDungHtml(vungSoanRef.current.innerHTML);
        requestAnimationFrame(() => capNhatKhungBang());
        return;
      }

      vungSoanRef.current.focus();
      document.execCommand('insertHTML', false, htmlSnippet);
      setNoiDungHtml(vungSoanRef.current.innerHTML);
      requestAnimationFrame(() => capNhatKhungBang());
    } else {
      setNoiDungHtml((cu) => `${cu}\n${htmlSnippet}`);
    }
  }

  function chenDanhSach(loai: 'ul' | 'ol') {
    const mauHtml =
      loai === 'ul'
        ? '<ul><li>Giải pháp bố cục không gian mở, đón sáng tự nhiên</li><li>Vật liệu gỗ tự nhiên kết hợp đá mài thủ công</li></ul>'
        : '<ol><li>Bước 1: Khảo sát hiện trạng và luồng ánh sáng tự nhiên</li><li>Bước 2: Lên phương án bố trí mặt bằng công năng</li></ol>';

    if (cheDoTrinhSoan !== 'truc_quan' || !vungSoanRef.current) {
      setNoiDungHtml((cu) => `${cu}\n${mauHtml}`);
      return;
    }

    const khoiHienTai = timKhoiCapMotTrongSoanThao();
    if (khoiHienTai && khoiHienTai.tagName.toLowerCase() === loai) {
      // Đang ở trong danh sách cùng loại -> thêm 1 dòng mục mới
      const liMoi = document.createElement('li');
      liMoi.textContent =
        loai === 'ul'
          ? 'Điểm nhấn thiết kế tiếp theo...'
          : `Bước ${khoiHienTai.querySelectorAll('li').length + 1}: Nội dung tiếp theo...`;
      khoiHienTai.appendChild(liMoi);
      danhSachDangChonRef.current = khoiHienTai as HTMLUListElement | HTMLOListElement;
      mucDanhSachDangChonRef.current = liMoi;
      setThongTinDanhSach({
        loai,
        soMuc: khoiHienTai.querySelectorAll('li').length,
      });
      setNoiDungHtml(vungSoanRef.current.innerHTML);
      chonNoiDungPhanTu(liMoi, true);
      return;
    }

    const tam = document.createElement('div');
    tam.innerHTML = mauHtml;
    const dsMoi = tam.querySelector(loai) as HTMLUListElement | HTMLOListElement;
    const doanTiepTheo = document.createElement('p');
    doanTiepTheo.innerHTML = '<br />';

    if (khoiHienTai) {
      khoiHienTai.after(dsMoi);
      if (!dsMoi.nextElementSibling) {
        dsMoi.after(doanTiepTheo);
      }
    } else {
      vungSoanRef.current.appendChild(dsMoi);
      vungSoanRef.current.appendChild(doanTiepTheo);
    }

    const liDau = dsMoi.querySelector('li') as HTMLLIElement | null;
    danhSachDangChonRef.current = dsMoi;
    mucDanhSachDangChonRef.current = liDau;
    setThongTinDanhSach({ loai, soMuc: dsMoi.querySelectorAll('li').length });
    setThongTinLienKet(null);
    capNhatKhungBang(null, null);
    setNoiDungHtml(vungSoanRef.current.innerHTML);
    chonNoiDungPhanTu(liDau, true);
  }

  function themMucDanhSach() {
    const ds = danhSachDangChonRef.current;
    if (!ds || !ds.isConnected || !vungSoanRef.current) return;
    const loai = ds.tagName.toLowerCase() === 'ol' ? 'ol' : 'ul';
    const soHienTai = ds.querySelectorAll('li').length;
    const liMoi = document.createElement('li');
    liMoi.textContent =
      loai === 'ol'
        ? `Bước ${soHienTai + 1}: Nội dung mục tiếp theo...`
        : 'Nội dung mục danh sách mới...';

    if (mucDanhSachDangChonRef.current && ds.contains(mucDanhSachDangChonRef.current)) {
      mucDanhSachDangChonRef.current.after(liMoi);
    } else {
      ds.appendChild(liMoi);
    }
    mucDanhSachDangChonRef.current = liMoi;
    setThongTinDanhSach({ loai, soMuc: ds.querySelectorAll('li').length });
    setNoiDungHtml(vungSoanRef.current.innerHTML);
    chonNoiDungPhanTu(liMoi, false);
  }

  function doiKieuDanhSach() {
    const ds = danhSachDangChonRef.current;
    if (!ds || !ds.isConnected || !vungSoanRef.current) return;
    const loaiMoi: 'ul' | 'ol' = ds.tagName.toLowerCase() === 'ul' ? 'ol' : 'ul';
    const dsMoi = document.createElement(loaiMoi);
    dsMoi.innerHTML = ds.innerHTML;
    ds.replaceWith(dsMoi);
    danhSachDangChonRef.current = dsMoi;
    mucDanhSachDangChonRef.current = dsMoi.querySelector('li');
    setThongTinDanhSach({ loai: loaiMoi, soMuc: dsMoi.querySelectorAll('li').length });
    setNoiDungHtml(vungSoanRef.current.innerHTML);
  }

  function xoaMucDanhSach() {
    const ds = danhSachDangChonRef.current;
    if (!ds || !ds.isConnected || !vungSoanRef.current) return;
    const tatCaLi = ds.querySelectorAll('li');
    if (tatCaLi.length <= 1) {
      xoaDanhSach();
      return;
    }
    const liXoa =
      (mucDanhSachDangChonRef.current && ds.contains(mucDanhSachDangChonRef.current)
        ? mucDanhSachDangChonRef.current
        : null) || tatCaLi[tatCaLi.length - 1];
    liXoa.remove();
    mucDanhSachDangChonRef.current = ds.querySelector('li');
    setThongTinDanhSach({
      loai: ds.tagName.toLowerCase() === 'ol' ? 'ol' : 'ul',
      soMuc: ds.querySelectorAll('li').length,
    });
    setNoiDungHtml(vungSoanRef.current.innerHTML);
  }

  function xoaDanhSach() {
    const ds = danhSachDangChonRef.current;
    if (!ds || !vungSoanRef.current) return;
    ds.remove();
    danhSachDangChonRef.current = null;
    mucDanhSachDangChonRef.current = null;
    setThongTinDanhSach(null);
    setNoiDungHtml(vungSoanRef.current.innerHTML);
  }

  function chenTrichDanMoi() {
    const trichDanMacDinh =
      '"Một không gian nội thất có chiều sâu luôn bắt đầu từ sự lắng nghe ánh sáng và vật liệu tự nhiên."';
    if (cheDoTrinhSoan !== 'truc_quan' || !vungSoanRef.current) {
      setNoiDungHtml((cu) => `${cu}\n<blockquote>${trichDanMacDinh}</blockquote>`);
      return;
    }

    const sel = window.getSelection();
    const chuDangChon =
      sel && sel.anchorNode && vungSoanRef.current.contains(sel.anchorNode)
        ? sel.toString().trim()
        : '';

    const bq = document.createElement('blockquote');
    bq.textContent = chuDangChon || trichDanMacDinh;
    const doanTiepTheo = document.createElement('p');
    doanTiepTheo.innerHTML = '<br />';

    const khoiHienTai = timKhoiCapMotTrongSoanThao();
    if (khoiHienTai) {
      khoiHienTai.after(bq);
      if (!bq.nextElementSibling) {
        bq.after(doanTiepTheo);
      }
    } else {
      vungSoanRef.current.appendChild(bq);
      vungSoanRef.current.appendChild(doanTiepTheo);
    }

    setThongTinDanhSach(null);
    setThongTinLienKet(null);
    capNhatKhungBang(null, null);
    setNoiDungHtml(vungSoanRef.current.innerHTML);
    chonNoiDungPhanTu(bq, true);
  }

  function chenLienKetNoiBo(chuMacDinh = 'Khám phá các dự án của Nếp Hiên', urlMacDinh = '/du-an') {
    if (cheDoTrinhSoan !== 'truc_quan' || !vungSoanRef.current) {
      setNoiDungHtml((cu) => `${cu}\n<p><a href="${urlMacDinh}">${chuMacDinh}</a></p>`);
      return;
    }

    const sel = window.getSelection();
    const coVungChonTrongSoan =
      sel && sel.rangeCount > 0 && sel.anchorNode && vungSoanRef.current.contains(sel.anchorNode);
    const chuDangChon = coVungChonTrongSoan ? sel.toString().trim() : '';

    const theA = document.createElement('a');
    theA.setAttribute('href', urlMacDinh);
    theA.textContent = chuDangChon || chuMacDinh;

    const khoiHienTai = timKhoiCapMotTrongSoanThao();
    if (
      coVungChonTrongSoan &&
      khoiHienTai &&
      (khoiHienTai.tagName === 'P' || khoiHienTai.tagName === 'LI')
    ) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const khoangTrang = document.createTextNode(' ');
      range.insertNode(khoangTrang);
      range.insertNode(theA);
    } else {
      const doanChuaLink = document.createElement('p');
      doanChuaLink.appendChild(document.createTextNode('👉 Xem thêm: '));
      doanChuaLink.appendChild(theA);
      if (khoiHienTai) {
        khoiHienTai.after(doanChuaLink);
      } else {
        vungSoanRef.current.appendChild(doanChuaLink);
      }
    }

    lienKetDangChonRef.current = theA;
    setThongTinLienKet({
      chu: theA.textContent || chuMacDinh,
      href: theA.getAttribute('href') || urlMacDinh,
    });
    setThongTinDanhSach(null);
    capNhatKhungBang(null, null);
    setNoiDungHtml(vungSoanRef.current.innerHTML);
    chonNoiDungPhanTu(theA, true);
  }

  function capNhatLienKetDangChon(chuMoi: string, hrefMoi: string) {
    setThongTinLienKet({ chu: chuMoi, href: hrefMoi });
    const theA = lienKetDangChonRef.current;
    if (!theA || !theA.isConnected || !vungSoanRef.current) return;
    theA.textContent = chuMoi || 'Liên kết Nếp Hiên';
    theA.setAttribute('href', hrefMoi || '/du-an');
    setNoiDungHtml(vungSoanRef.current.innerHTML);
  }

  function xoaLienKetDangChon() {
    const theA = lienKetDangChonRef.current;
    if (!theA || !vungSoanRef.current) return;
    const cha = theA.parentElement;
    theA.remove();
    if (cha && cha.tagName === 'P' && cha.textContent?.trim() === '👉 Xem thêm:') {
      cha.remove();
    }
    lienKetDangChonRef.current = null;
    setThongTinLienKet(null);
    setNoiDungHtml(vungSoanRef.current.innerHTML);
  }

  function chenBangMoi() {
    const mauBangHtml =
      '<table><thead><tr><th>Hạng mục</th><th>Vật liệu chủ đạo</th><th>Ghi chú</th></tr></thead><tbody><tr><td>Phòng khách</td><td>Gỗ sồi tự nhiên &amp; Đá mài</td><td>Hoàn thiện dầu lau mờ</td></tr><tr><td>Phòng bếp &amp; Bàn ăn</td><td>Đá thạch anh &amp; Gỗ tần bì</td><td>Chống thấm, dễ vệ sinh</td></tr></tbody></table>';

    if (cheDoTrinhSoan !== 'truc_quan' || !vungSoanRef.current) {
      setNoiDungHtml((cu) => `${cu}\n${mauBangHtml}`);
      return;
    }

    const tam = document.createElement('div');
    tam.innerHTML = mauBangHtml;
    const bangMoi = tam.querySelector('table') as HTMLTableElement;
    const doanTiepTheo = document.createElement('p');
    doanTiepTheo.innerHTML = '<br />';

    const khoiHienTai = timKhoiCapMotTrongSoanThao();
    if (khoiHienTai) {
      khoiHienTai.after(bangMoi);
      bangMoi.after(doanTiepTheo);
    } else {
      vungSoanRef.current.appendChild(bangMoi);
      vungSoanRef.current.appendChild(doanTiepTheo);
    }

    const oDauTien = bangMoi.querySelector('tbody td') as HTMLTableCellElement | null;
    if (oDauTien) {
      const range = document.createRange();
      range.selectNodeContents(oDauTien);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }

    setThongTinDanhSach(null);
    setThongTinLienKet(null);
    setNoiDungHtml(vungSoanRef.current.innerHTML);
    requestAnimationFrame(() => {
      capNhatKhungBang(bangMoi, oDauTien);
    });
  }

  function themHangBang(viTri: 'duoi' | 'tren' | 'cuoi' = 'cuoi') {
    const bang = bangDangChonRef.current;
    if (!bang || !vungSoanRef.current) return;

    const hangMau = bang.querySelector('tr');
    const soCot = hangMau ? Math.max(1, hangMau.children.length) : 3;
    const trMoi = document.createElement('tr');
    for (let i = 0; i < soCot; i += 1) {
      const td = document.createElement('td');
      td.textContent = `Nội dung cột ${i + 1}`;
      trMoi.appendChild(td);
    }

    let tbody = bang.querySelector('tbody');
    if (!tbody) {
      tbody = document.createElement('tbody');
      bang.appendChild(tbody);
    }

    const hangDangChon =
      oDangChonRef.current && bang.contains(oDangChonRef.current)
        ? oDangChonRef.current.closest('tr')
        : null;

    if (viTri === 'tren' && hangDangChon && hangDangChon.parentElement === tbody) {
      tbody.insertBefore(trMoi, hangDangChon);
    } else if (viTri === 'duoi' && hangDangChon && hangDangChon.parentElement === tbody) {
      hangDangChon.after(trMoi);
    } else if (viTri === 'duoi' && hangDangChon && hangDangChon.parentElement?.tagName === 'THEAD' && tbody.firstChild) {
      tbody.insertBefore(trMoi, tbody.firstChild);
    } else {
      tbody.appendChild(trMoi);
    }

    const oMoiDau = trMoi.querySelector('td') as HTMLTableCellElement | null;
    setNoiDungHtml(vungSoanRef.current.innerHTML);
    requestAnimationFrame(() => {
      capNhatKhungBang(bang, oMoiDau);
    });
  }

  function themCotBang(viTri: 'phai' | 'trai' | 'cuoi' = 'cuoi') {
    const bang = bangDangChonRef.current;
    if (!bang || !vungSoanRef.current) return;

    let chiSoCot = -1;
    if (oDangChonRef.current && bang.contains(oDangChonRef.current)) {
      const hangCha = oDangChonRef.current.parentElement;
      if (hangCha) {
        chiSoCot = Array.from(hangCha.children).indexOf(oDangChonRef.current);
      }
    }

    const danhSachHang = bang.querySelectorAll('tr');
    danhSachHang.forEach((tr) => {
      const laHangTieuDe =
        tr.parentElement?.tagName === 'THEAD' || tr.querySelector('th') !== null;
      const oMoi = document.createElement(laHangTieuDe ? 'th' : 'td');
      oMoi.textContent = laHangTieuDe
        ? `Tiêu đề cột ${tr.children.length + 1}`
        : 'Nội dung mới';

      if (viTri === 'trai' && chiSoCot >= 0 && tr.children[chiSoCot]) {
        tr.insertBefore(oMoi, tr.children[chiSoCot]);
      } else if (viTri === 'phai' && chiSoCot >= 0 && tr.children[chiSoCot]) {
        tr.children[chiSoCot].after(oMoi);
      } else {
        tr.appendChild(oMoi);
      }
    });

    setNoiDungHtml(vungSoanRef.current.innerHTML);
    requestAnimationFrame(() => {
      capNhatKhungBang(bang, oDangChonRef.current);
    });
  }

  function xoaHangBang() {
    const bang = bangDangChonRef.current;
    if (!bang || !vungSoanRef.current) return;

    const tatCaHang = bang.querySelectorAll('tr');
    if (tatCaHang.length <= 1) {
      xoaBang();
      return;
    }

    const hangMucTieu =
      (oDangChonRef.current && bang.contains(oDangChonRef.current)
        ? oDangChonRef.current.closest('tr')
        : null) ||
      bang.querySelector('tbody tr:last-child') ||
      bang.querySelector('tr:last-child');

    if (hangMucTieu) {
      hangMucTieu.remove();
    }

    const oConLai = bang.querySelector('tbody td, td, th') as HTMLTableCellElement | null;
    setNoiDungHtml(vungSoanRef.current.innerHTML);
    requestAnimationFrame(() => {
      capNhatKhungBang(bang, oConLai);
    });
  }

  function xoaCotBang() {
    const bang = bangDangChonRef.current;
    if (!bang || !vungSoanRef.current) return;

    const hangDau = bang.querySelector('tr');
    const soCot = hangDau ? hangDau.children.length : 0;
    if (soCot <= 1) {
      xoaBang();
      return;
    }

    let chiSoCot = soCot - 1;
    if (oDangChonRef.current && bang.contains(oDangChonRef.current)) {
      const hangCha = oDangChonRef.current.parentElement;
      if (hangCha) {
        const idx = Array.from(hangCha.children).indexOf(oDangChonRef.current);
        if (idx >= 0) chiSoCot = idx;
      }
    }

    bang.querySelectorAll('tr').forEach((tr) => {
      if (tr.children[chiSoCot]) {
        tr.children[chiSoCot].remove();
      }
    });

    const oConLai = bang.querySelector('tbody td, td, th') as HTMLTableCellElement | null;
    setNoiDungHtml(vungSoanRef.current.innerHTML);
    requestAnimationFrame(() => {
      capNhatKhungBang(bang, oConLai);
    });
  }

  function xoaBang() {
    const bang = bangDangChonRef.current;
    if (!bang || !vungSoanRef.current) return;
    bang.remove();
    setNoiDungHtml(vungSoanRef.current.innerHTML);
    capNhatKhungBang(null, null);
  }

  async function xuLyTaiAnhBia(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setDangTaiAnhBia(true);
    setThongBao(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/v1/admin/articles/images', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setThongBao({ loai: 'loi', chu: data.message || 'Không thể tải ảnh bìa.' });
      } else {
        setAnhBia(data.url);
        setThongBao({ loai: 'ok', chu: 'Đã tải ảnh bìa lên Neon PostgreSQL thành công.' });
      }
    } catch {
      setThongBao({ loai: 'loi', chu: 'Lỗi kết nối khi tải ảnh bìa.' });
    } finally {
      setDangTaiAnhBia(false);
      e.target.value = '';
    }
  }

  async function xuLyTaiAnhTrongBai(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setDangTaiAnhBai(true);
    setThongBao(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/v1/admin/articles/images', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setThongBao({ loai: 'loi', chu: data.message || 'Không thể tải ảnh minh họa.' });
      } else {
        const altMacDinh = tieuDe.trim() || 'Không gian nội thất Nếp Hiên';
        chenDoanHtml(
          `<figure><img src="${data.url}" alt="${altMacDinh.replace(/"/g, '&quot;')}" /><figcaption>${altMacDinh}</figcaption></figure>`,
        );
        setThongBao({ loai: 'ok', chu: 'Đã chèn ảnh minh họa vào bài viết.' });
      }
    } catch {
      setThongBao({ loai: 'loi', chu: 'Lỗi kết nối khi tải ảnh minh họa.' });
    } finally {
      setDangTaiAnhBai(false);
      e.target.value = '';
    }
  }

  async function luuBaiViet(trangThaiMucTieu?: TrangThaiBaiViet) {
    if (!tieuDe.trim()) {
      setThongBao({ loai: 'loi', chu: 'Vui lòng nhập tiêu đề bài viết.' });
      return;
    }
    if (!danhMucId) {
      setThongBao({ loai: 'loi', chu: 'Vui lòng chọn danh mục cho bài viết.' });
      return;
    }

    setDangLuu(true);
    setThongBao(null);

    const tt = trangThaiMucTieu ?? trangThai;
    const payload = {
      tieuDe: tieuDe.trim(),
      slug: slug.trim() || taoSlug(tieuDe),
      danhMucId: Number(danhMucId),
      moTaNgan: moTaNgan.trim() || null,
      anhBia: anhBia.trim() || null,
      noiDungHtml,
      trangThai: tt,
      tacGia: tacGia.trim() || 'Ban Biên Tập Nếp Hiên',
      noiBat,
    };

    try {
      const url =
        cheDo === 'moi' ? '/api/v1/admin/articles' : `/api/v1/admin/articles/${baiVietId}`;
      const method = cheDo === 'moi' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setThongBao({ loai: 'loi', chu: data.message || 'Không thể lưu bài viết.' });
        return;
      }

      xoaNhapCucBo(khoaNhap);
      setNhapCucBoTonTai(null);

      const bv: ChiTietBaiVietDto = data.baiViet;
      const cb = data.canhBao as { theBiLoai: number; thuocTinhBiLoai: number } | undefined;

      if (cheDo === 'moi') {
        daLuuChinhThucRef.current = true;
        router.push(`/admin/articles/${bv.id}`);
        return;
      }

      duLieuGocRef.current = {
        tieuDe: bv.tieuDe,
        moTaNgan: bv.moTaNgan ?? '',
        noiDungHtml: bv.noiDungHtml,
      };
      setTieuDe(bv.tieuDe);
      setSlug(bv.slug);
      setSlugGocKhiTai(bv.slug);
      setNoiDungHtml(bv.noiDungHtml);
      setTrangThai(bv.trangThai);
      setNgayDang(bv.ngayDang);
      setXoaLuc(bv.xoaLuc);

      if (cb && (cb.theBiLoai > 0 || cb.thuocTinhBiLoai > 0)) {
        setThongBao({
          loai: 'canh_bao',
          chu: `Đã lưu bài viết! Hệ thống bảo mật đã tự động lọc bỏ ${cb.theBiLoai} thẻ HTML và ${cb.thuocTinhBiLoai} thuộc tính không an toàn.`,
        });
      } else {
        setThongBao({
          loai: 'ok',
          chu:
            tt === 'dang'
              ? 'Đã xuất bản bài viết công khai lên nephien.com!'
              : 'Đã lưu cập nhật bài viết thành công.',
        });
      }
    } catch {
      setThongBao({ loai: 'loi', chu: 'Lỗi kết nối máy chủ khi lưu bài viết.' });
    } finally {
      setDangLuu(false);
    }
  }

  async function xuLyXoaMem() {
    if (!baiVietId) return;
    setDangLuu(true);
    try {
      const res = await fetch(`/api/v1/admin/articles/${baiVietId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/articles');
      } else {
        const data = await res.json().catch(() => ({}));
        setThongBao({ loai: 'loi', chu: data.message || 'Không thể xóa bài viết.' });
      }
    } finally {
      setDangLuu(false);
    }
  }

  async function xuLyKhoiPhuc() {
    if (!baiVietId) return;
    setDangLuu(true);
    try {
      const res = await fetch(`/api/v1/admin/articles/${baiVietId}/khoi-phuc`, {
        method: 'POST',
      });
      if (res.ok) {
        const bv: ChiTietBaiVietDto = await res.json();
        setXoaLuc(bv.xoaLuc);
        setTrangThai(bv.trangThai);
        setThongBao({ loai: 'ok', chu: 'Đã khôi phục bài viết về trạng thái Bản nháp.' });
      }
    } finally {
      setDangLuu(false);
    }
  }

  const xemTruocMucLuc = useMemo(() => rutMucLuc(noiDungHtml), [noiDungHtml]);
  const canhBaoDoiSlugBaiDaDang =
    cheDo === 'sua' && Boolean(ngayDang) && slugGocKhiTai && slug.trim() !== slugGocKhiTai;

  if (dangTaiBanDau) {
    return (
      <div className="nh-admin-shell">
        <AdminSidebar
          mucDangChon="soan_thao"
          nguoiDung={nguoiDungHienTai}
          soDanhMuc={danhMuc.length}
        />
        <div className="nh-admin-main">
          <div className="nh-admin-container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
            Đang tải trình soạn thảo bài viết Nếp Hiên...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nh-admin-shell">
      <AdminSidebar
        mucDangChon="soan_thao"
        nguoiDung={nguoiDungHienTai}
        soDanhMuc={danhMuc.length}
      />

      <div
        className="nh-admin-main"
        style={{ '--nh-sticky-header-h': `${chieuCaoHeader}px` } as React.CSSProperties}
      >
        <header ref={headerTrangRef} className="nh-admin-page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <Link
                href="/admin/articles"
                style={{ fontSize: '0.78rem', fontWeight: 600, color: '#c0562c' }}
              >
                ← Quay lại danh sách
              </Link>
              <span style={{ color: '#c4b8a8' }}>•</span>
              <span style={{ fontSize: '0.76rem', color: '#6b5e52' }}>
                {cheDo === 'moi' ? 'Tạo bài viết mới' : `Chỉnh sửa bài viết #${baiVietId}`}
              </span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.4rem, 2vw, 1.85rem)',
                fontWeight: 500,
                margin: 0,
              }}
            >
              {cheDo === 'moi' ? 'Biên tập bài viết mới' : tieuDe || `Bài viết #${baiVietId}`}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {cheDo === 'sua' && trangThai === 'dang' && !xoaLuc && (
              <Link
                href={`/bai-viet/${slug}`}
                target="_blank"
                className="nh-btn"
              >
                Xem bài trên web ↗
              </Link>
            )}
            <button
              type="button"
              disabled={dangLuu || Boolean(xoaLuc)}
              onClick={() => luuBaiViet('nhap')}
              className="nh-btn"
            >
              Lưu bản nháp
            </button>
            <button
              type="button"
              disabled={dangLuu || Boolean(xoaLuc)}
              onClick={() => luuBaiViet('dang')}
              className="nh-btn nh-btn-primary"
            >
              {dangLuu
                ? 'Đang lưu...'
                : trangThai === 'dang'
                  ? 'Cập nhật bài đã đăng'
                  : 'Đăng bài công khai'}
            </button>
          </div>
        </header>

        <main className="nh-admin-container">
        {/* Cảnh báo bài trong thùng rác */}
        {xoaLuc && (
          <div
            style={{
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem',
              background: '#fce8e6',
              border: '1px solid #f6aea9',
              color: '#c5221f',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              <strong>Bài viết này đang nằm trong thùng rác.</strong> Hãy khôi phục về bản nháp để
              tiếp tục chỉnh sửa hoặc xuất bản.
            </span>
            <button type="button" onClick={xuLyKhoiPhuc} className="nh-btn nh-btn-primary">
              Khôi phục ngay
            </button>
          </div>
        )}

        {/* Thanh khôi phục bản nháp cục bộ */}
        {nhapCucBoTonTai && (
          <div
            style={{
              padding: '0.85rem 1.15rem',
              marginBottom: '1.25rem',
              background: '#fef7e0',
              border: '1px solid #fde293',
              color: '#8f4d00',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.84rem',
            }}
          >
            <span>
              Phát hiện bản nháp tự động lưu lúc{' '}
              <strong>{new Date(nhapCucBoTonTai.luuLuc).toLocaleTimeString('vi-VN')}</strong> trên
              trình duyệt này.
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={khoiPhucBanNhapCucBo}
                className="nh-btn nh-btn-primary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.76rem' }}
              >
                Khôi phục bản nháp
              </button>
              <button
                type="button"
                onClick={boQuaBanNhapCucBo}
                className="nh-btn"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.76rem' }}
              >
                Bỏ qua
              </button>
            </div>
          </div>
        )}

        {/* Thông báo phản hồi */}
        {thongBao && (
          <div
            role="status"
            style={{
              padding: '0.85rem 1.15rem',
              marginBottom: '1.25rem',
              fontSize: '0.86rem',
              fontWeight: 500,
              background:
                thongBao.loai === 'ok'
                  ? '#e6f4ea'
                  : thongBao.loai === 'canh_bao'
                    ? '#fef7e0'
                    : '#fce8e6',
              color:
                thongBao.loai === 'ok'
                  ? '#137333'
                  : thongBao.loai === 'canh_bao'
                    ? '#b06000'
                    : '#c5221f',
              border: `1px solid ${
                thongBao.loai === 'ok'
                  ? '#b7e1cd'
                  : thongBao.loai === 'canh_bao'
                    ? '#fde293'
                    : '#f6aea9'
              }`,
            }}
          >
            {thongBao.chu}
          </div>
        )}

        <div className="nh-editor-grid">
          {/* CỘT TRÁI: FORM BIÊN TẬP CHÍNH */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="nh-card" style={{ padding: '1.5rem' }}>
              {/* Tiêu đề */}
              <div style={{ marginBottom: '1.1rem' }}>
                <label
                  htmlFor="bv-tieude"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}
                >
                  Tiêu đề bài viết (Thẻ H1) *
                </label>
                <input
                  id="bv-tieude"
                  type="text"
                  className="nh-input"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    padding: '0.75rem 0.95rem',
                  }}
                  placeholder="Nhập tiêu đề bài viết chuẩn phong cách Nếp Hiên..."
                  value={tieuDe}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTieuDe(val);
                    if (!slugTuSua) {
                      setSlug(taoSlug(val));
                    }
                  }}
                />
              </div>

              {/* Đường dẫn tĩnh (slug) */}
              <div style={{ marginBottom: '1.1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <label htmlFor="bv-slug" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                    Đường dẫn tĩnh (URL Slug) *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSlug(taoSlug(tieuDe));
                      setSlugTuSua(true);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#c0562c',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      textDecoration: 'underline',
                    }}
                  >
                    Tạo lại từ tiêu đề
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      padding: '0.6rem 0.75rem',
                      background: '#f1ece1',
                      border: '1px solid rgba(28,22,18,0.2)',
                      borderRight: 'none',
                      fontSize: '0.82rem',
                      color: '#6b5e52',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    nephien.com/bai-viet/
                  </span>
                  <input
                    id="bv-slug"
                    type="text"
                    className="nh-input"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                      setSlugTuSua(true);
                    }}
                  />
                </div>
                {canhBaoDoiSlugBaiDaDang && (
                  <div
                    data-testid="slug-change-warning"
                    style={{
                      marginTop: 8,
                      padding: '0.6rem 0.85rem',
                      background: '#fef7e0',
                      border: '1px solid #fde293',
                      color: '#8f4d00',
                      fontSize: '0.78rem',
                    }}
                  >
                    ⚠️ <strong>Cảnh báo SEO:</strong> Bài viết này đã từng xuất bản. Việc đổi đường
                    dẫn từ <code>/bai-viet/{slugGocKhiTai}</code> sang{' '}
                    <code>/bai-viet/{slug}</code> có thể làm gãy các liên kết đã chia sẻ trước đó.
                  </div>
                )}
              </div>

              {/* Hàng Danh mục + Tác giả + Nổi bật */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto',
                  gap: '1rem',
                  alignItems: 'end',
                  marginBottom: '1.1rem',
                }}
              >
                <div>
                  <label
                    htmlFor="bv-danhmuc"
                    style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}
                  >
                    Chuyên mục bài viết *
                  </label>
                  <select
                    id="bv-danhmuc"
                    className="nh-select"
                    value={danhMucId}
                    onChange={(e) => setDanhMucId(Number(e.target.value))}
                  >
                    {danhMuc.map((dm) => (
                      <option key={dm.id} value={dm.id}>
                        {dm.ten} {!dm.hien ? '(Đang ẩn)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="bv-tacgia"
                    style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}
                  >
                    Tác giả / Người biên tập
                  </label>
                  <input
                    id="bv-tacgia"
                    type="text"
                    className="nh-input"
                    value={tacGia}
                    onChange={(e) => setTacGia(e.target.value)}
                  />
                </div>

                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '0.62rem 0.9rem',
                    background: '#f4efe4',
                    border: '1px solid rgba(28,22,18,0.16)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={noiBat}
                    onChange={(e) => setNoiBat(e.target.checked)}
                  />
                  Ghim bài nổi bật
                </label>
              </div>

              {/* Mô tả ngắn */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <label htmlFor="bv-mota" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                    Mô tả ngắn (Meta Description & Lời dẫn)
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#6b5e52' }}>
                    {moTaNgan.length} / 400 ký tự (Chuẩn SEO: 120–160)
                  </span>
                </div>
                <textarea
                  id="bv-mota"
                  rows={3}
                  maxLength={400}
                  className="nh-textarea"
                  placeholder="Tóm tắt ngắn gọn nội dung cốt lõi của bài viết trong 2–3 câu..."
                  value={moTaNgan}
                  onChange={(e) => setMoTaNgan(e.target.value)}
                />
              </div>
            </div>

            {/* KHỐI TRÌNH SOẠN THẢO NỘI DUNG */}
            <div
              className={`nh-card nh-editor-card ${toanManHinh ? 'is-fullscreen' : ''}`}
              data-testid="editor-content-card"
              onScroll={() => capNhatKhungBang()}
              style={{
                padding: '1.5rem',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {!toanManHinh && (
                <div style={{ marginBottom: '0.85rem' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                    Nội dung bài viết
                  </h2>
                  <p style={{ fontSize: '0.76rem', color: '#6b5e52', margin: '0.15rem 0 0' }}>
                    Các tiêu đề <strong>H2</strong> và <strong>H3</strong> sẽ tự động được gắn ID và
                    trích xuất thành thanh Mục lục ở trang đọc bài.
                  </p>
                </div>
              )}

              {/* KHUNG GHIM CỐ ĐỊNH (STICKY DOCK): Chế độ xem + Toàn màn hình + Thanh công cụ định dạng */}
              <div className="nh-editor-sticky-dock" data-testid="editor-sticky-dock">
                <div className="nh-wysiwyg-modebar">
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => setCheDoTrinhSoan('truc_quan')}
                      className={`nh-wysiwyg-btn ${
                        cheDoTrinhSoan === 'truc_quan' ? 'is-active' : ''
                      }`}
                    >
                      Soạn thảo trực quan
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheDoTrinhSoan('html')}
                      className={`nh-wysiwyg-btn ${cheDoTrinhSoan === 'html' ? 'is-active' : ''}`}
                    >
                      Mã HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheDoTrinhSoan('xem_truoc')}
                      className={`nh-wysiwyg-btn ${
                        cheDoTrinhSoan === 'xem_truoc' ? 'is-active' : ''
                      }`}
                    >
                      Xem trước ({xemTruocMucLuc.mucLuc.length} mục lục)
                    </button>
                  </div>

                  <button
                    type="button"
                    data-testid="btn-fullscreen-editor"
                    onClick={() => setToanManHinh((cu) => !cu)}
                    className={`nh-fullscreen-toggle-btn ${toanManHinh ? 'is-active' : ''}`}
                    title={
                      toanManHinh
                        ? 'Thu nhỏ về giao diện 2 cột (Phím tắt: Esc)'
                        : 'Mở rộng khung Nội dung bài viết toàn màn hình'
                    }
                  >
                    {toanManHinh ? '✕ Thu nhỏ toàn màn hình (Esc)' : '⛶ Mở rộng toàn màn hình'}
                  </button>
                </div>

                {/* Thanh công cụ định dạng được ghim cố định khi cuộn */}
                {cheDoTrinhSoan !== 'xem_truoc' && (
                  <div className="nh-wysiwyg-toolbar" data-testid="wysiwyg-toolbar">
                    <button
                      type="button"
                      className="nh-wysiwyg-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => thucThiLenhDinhDang('formatBlock', 'H2')}
                      title="Tiêu đề mục lớn H2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      className="nh-wysiwyg-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => thucThiLenhDinhDang('formatBlock', 'H3')}
                      title="Tiêu đề mục con H3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      className="nh-wysiwyg-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => thucThiLenhDinhDang('formatBlock', 'H4')}
                      title="Tiêu đề phụ H4"
                    >
                      H4
                    </button>
                    <button
                      type="button"
                      className="nh-wysiwyg-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => thucThiLenhDinhDang('formatBlock', 'P')}
                      title="Đoạn văn thường"
                    >
                      Đoạn văn
                    </button>
                    <button
                      type="button"
                      className="nh-wysiwyg-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => thucThiLenhDinhDang('bold')}
                      title="In đậm"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      className="nh-wysiwyg-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => thucThiLenhDinhDang('italic')}
                      title="In nghiêng"
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      className="nh-wysiwyg-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => thucThiLenhDinhDang('underline')}
                      title="Gạch chân"
                    >
                      <u>U</u>
                    </button>
                    <button
                      type="button"
                      className="nh-wysiwyg-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => chenDanhSach('ul')}
                      title="Chèn danh sách dấu chấm (•)"
                    >
                      • Danh sách
                    </button>
                    <button
                      type="button"
                      className="nh-wysiwyg-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => chenDanhSach('ol')}
                      title="Chèn danh sách đánh số (1, 2, 3...)"
                    >
                      1. Danh sách số
                    </button>
                    <button
                      type="button"
                      className="nh-wysiwyg-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => chenTrichDanMoi()}
                      title="Chèn khối trích dẫn nổi bật"
                    >
                      ❝ Trích dẫn
                    </button>
                    <button
                      type="button"
                      className="nh-wysiwyg-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={chenBangMoi}
                      title="Chèn bảng so sánh / thông số (có nút + thêm hàng & cột)"
                    >
                      ⊞ Bảng
                    </button>
                    <button
                      type="button"
                      className="nh-wysiwyg-btn"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => chenLienKetNoiBo()}
                      title="Chèn và tùy chỉnh liên kết nội bộ"
                    >
                      🔗 Liên kết nội bộ
                    </button>

                    <input
                      ref={inputAnhBaiRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      style={{ display: 'none' }}
                      onChange={xuLyTaiAnhTrongBai}
                    />
                    <button
                      type="button"
                      className="nh-wysiwyg-btn"
                      disabled={dangTaiAnhBai}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => inputAnhBaiRef.current?.click()}
                    >
                      {dangTaiAnhBai ? 'Đang tải ảnh...' : '🖼 Tải ảnh vào bài'}
                    </button>
                  </div>
                )}

                {/* Thanh điều khiển Danh sách (• Danh sách / 1. Danh sách số) */}
                {cheDoTrinhSoan === 'truc_quan' && thongTinDanhSach && (
                  <div className="nh-table-context-bar" data-testid="list-context-bar">
                    <span style={{ fontWeight: 700, color: '#c9a96e' }}>
                      {thongTinDanhSach.loai === 'ul'
                        ? `• Danh sách dấu chấm (${thongTinDanhSach.soMuc} mục)`
                        : `1. Danh sách đánh số (${thongTinDanhSach.soMuc} mục)`}
                    </span>
                    <div className="nh-table-context-actions">
                      <button
                        type="button"
                        className="nh-table-context-btn"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={themMucDanhSach}
                      >
                        + Thêm 1 dòng mục mới
                      </button>
                      <button
                        type="button"
                        className="nh-table-context-btn"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={doiKieuDanhSach}
                      >
                        ⇄ Đổi sang{' '}
                        {thongTinDanhSach.loai === 'ul'
                          ? 'Danh sách số (1.)'
                          : 'Danh sách chấm (•)'}
                      </button>
                      <button
                        type="button"
                        className="nh-table-context-btn is-danger"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={xoaMucDanhSach}
                      >
                        − Xóa dòng mục
                      </button>
                      <button
                        type="button"
                        className="nh-table-context-btn is-danger"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={xoaDanhSach}
                      >
                        🗑 Xóa danh sách
                      </button>
                    </div>
                  </div>
                )}

                {/* Thanh điều khiển & tùy chỉnh Liên kết nội bộ (🔗 Liên kết nội bộ) */}
                {cheDoTrinhSoan === 'truc_quan' && thongTinLienKet && (
                  <div
                    className="nh-table-context-bar"
                    data-testid="link-context-bar"
                    style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.55rem' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                      }}
                    >
                      <span style={{ fontWeight: 700, color: '#c9a96e' }}>
                        🔗 Tùy chỉnh Liên kết nội bộ đang chọn
                      </span>
                      <div className="nh-table-context-actions">
                        {[
                          {
                            nhan: 'Dự án (/du-an)',
                            chu: 'Khám phá các dự án của Nếp Hiên',
                            href: '/du-an',
                          },
                          {
                            nhan: 'Báo giá (/bao-gia)',
                            chu: 'Tham khảo bảng báo giá thiết kế & thi công',
                            href: '/bao-gia',
                          },
                          {
                            nhan: 'Phong cách (/phong-cach)',
                            chu: 'Tìm hiểu các phong cách nội thất Nếp Hiên',
                            href: '/phong-cach',
                          },
                          {
                            nhan: 'Giới thiệu (/gioi-thieu)',
                            chu: 'Tìm hiểu triết lý thiết kế Nếp Hiên',
                            href: '/gioi-thieu',
                          },
                          {
                            nhan: 'Bài viết (/bai-viet)',
                            chu: 'Xem thêm cẩm nang kiến trúc & nội thất',
                            href: '/bai-viet',
                          },
                        ].map((mau) => (
                          <button
                            key={mau.href}
                            type="button"
                            className="nh-table-context-btn"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => capNhatLienKetDangChon(mau.chu, mau.href)}
                          >
                            {mau.nhan}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="nh-table-context-btn is-danger"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={xoaLienKetDangChon}
                        >
                          ✕ Xóa liên kết
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.5rem',
                      }}
                    >
                      <input
                        type="text"
                        className="nh-input"
                        style={{ padding: '0.36rem 0.65rem', fontSize: '0.8rem' }}
                        placeholder="Văn bản hiển thị của liên kết..."
                        value={thongTinLienKet.chu}
                        onChange={(e) =>
                          capNhatLienKetDangChon(e.target.value, thongTinLienKet.href)
                        }
                      />
                      <input
                        type="text"
                        className="nh-input"
                        style={{
                          padding: '0.36rem 0.65rem',
                          fontSize: '0.8rem',
                          fontFamily: 'monospace',
                        }}
                        placeholder="Đường dẫn đích (VD: /du-an hoặc /bai-viet/...)"
                        value={thongTinLienKet.href}
                        onChange={(e) =>
                          capNhatLienKetDangChon(thongTinLienKet.chu, e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Thanh điều khiển Bảng ngữ cảnh khi đang chọn hoặc trỏ vào Bảng */}
                {cheDoTrinhSoan === 'truc_quan' && toaDoBang && (
                  <div className="nh-table-context-bar" data-testid="table-context-bar">
                    <span style={{ fontWeight: 700, color: '#c9a96e' }}>
                      ⊞ Bảng đang chọn ({toaDoBang.soHang} hàng × {toaDoBang.soCot} cột)
                    </span>
                    <div className="nh-table-context-actions">
                      <button
                        type="button"
                        className="nh-table-context-btn"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => themHangBang('duoi')}
                        title="Chèn thêm 1 hàng ngay bên dưới ô đang chọn"
                      >
                        + Hàng dưới
                      </button>
                      <button
                        type="button"
                        className="nh-table-context-btn"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => themHangBang('tren')}
                        title="Chèn thêm 1 hàng ngay phía trên ô đang chọn"
                      >
                        + Hàng trên
                      </button>
                      <button
                        type="button"
                        className="nh-table-context-btn"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => themCotBang('phai')}
                        title="Chèn thêm 1 cột bên phải ô đang chọn"
                      >
                        + Cột phải
                      </button>
                      <button
                        type="button"
                        className="nh-table-context-btn"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => themCotBang('trai')}
                        title="Chèn thêm 1 cột bên trái ô đang chọn"
                      >
                        + Cột trái
                      </button>
                      <button
                        type="button"
                        className="nh-table-context-btn is-danger"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={xoaHangBang}
                        title="Xóa hàng hiện tại"
                      >
                        − Xóa hàng
                      </button>
                      <button
                        type="button"
                        className="nh-table-context-btn is-danger"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={xoaCotBang}
                        title="Xóa cột hiện tại"
                      >
                        − Xóa cột
                      </button>
                      <button
                        type="button"
                        className="nh-table-context-btn is-danger"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={xoaBang}
                        title="Xóa toàn bộ bảng này"
                      >
                        🗑 Xóa bảng
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Vùng biên tập theo chế độ */}
              {cheDoTrinhSoan === 'truc_quan' && (
                <div ref={khungBaoSoanRef} className="nh-wysiwyg-wrapper">
                  <div
                    ref={vungSoanRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="nh-wysiwyg-surface noi-dung-bai-viet"
                    data-testid="wysiwyg-surface"
                    onInput={(e) => {
                      setNoiDungHtml((e.target as HTMLDivElement).innerHTML);
                      requestAnimationFrame(() => capNhatKhungBang());
                    }}
                    onScroll={() => capNhatKhungBang()}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      const theA = target.closest('a') as HTMLAnchorElement | null;
                      if (theA && vungSoanRef.current?.contains(theA)) {
                        lienKetDangChonRef.current = theA;
                        setThongTinLienKet({
                          chu: theA.textContent || '',
                          href: theA.getAttribute('href') || '/du-an',
                        });
                      } else {
                        lienKetDangChonRef.current = null;
                        setThongTinLienKet(null);
                      }

                      const ds = target.closest('ul, ol') as HTMLUListElement | HTMLOListElement | null;
                      if (ds && vungSoanRef.current?.contains(ds)) {
                        danhSachDangChonRef.current = ds;
                        mucDanhSachDangChonRef.current = target.closest('li') as HTMLLIElement | null;
                        setThongTinDanhSach({
                          loai: ds.tagName.toLowerCase() === 'ol' ? 'ol' : 'ul',
                          soMuc: ds.querySelectorAll('li').length,
                        });
                      } else {
                        danhSachDangChonRef.current = null;
                        mucDanhSachDangChonRef.current = null;
                        setThongTinDanhSach(null);
                      }

                      const bang = target.closest('table') as HTMLTableElement | null;
                      if (bang && vungSoanRef.current?.contains(bang)) {
                        const o = (target.closest('td, th') ||
                          bang.querySelector('tbody td, td, th')) as HTMLTableCellElement | null;
                        capNhatKhungBang(bang, o);
                      } else {
                        capNhatKhungBang(null, null);
                      }
                    }}
                    onMouseOver={(e) => {
                      if (thongTinDanhSach || thongTinLienKet) return;
                      const target = e.target as HTMLElement;
                      const bang = target.closest('table') as HTMLTableElement | null;
                      if (bang && vungSoanRef.current?.contains(bang)) {
                        if (bangDangChonRef.current !== bang) {
                          const o = (target.closest('td, th') ||
                            bang.querySelector('tbody td, td, th')) as HTMLTableCellElement | null;
                          capNhatKhungBang(bang, o);
                        }
                      }
                    }}
                    onKeyUp={() => {
                      const sel = window.getSelection();
                      const nut =
                        sel?.anchorNode instanceof HTMLElement
                          ? sel.anchorNode
                          : sel?.anchorNode?.parentElement;
                      const ds = nut?.closest('ul, ol') as HTMLUListElement | HTMLOListElement | null;
                      if (ds && vungSoanRef.current?.contains(ds)) {
                        danhSachDangChonRef.current = ds;
                        mucDanhSachDangChonRef.current = (nut?.closest('li') ||
                          mucDanhSachDangChonRef.current) as HTMLLIElement | null;
                        setThongTinDanhSach({
                          loai: ds.tagName.toLowerCase() === 'ol' ? 'ol' : 'ul',
                          soMuc: ds.querySelectorAll('li').length,
                        });
                      }
                      const bang = nut?.closest('table') as HTMLTableElement | null;
                      if (bang && vungSoanRef.current?.contains(bang)) {
                        const o = (nut?.closest('td, th') ||
                          oDangChonRef.current) as HTMLTableCellElement | null;
                        capNhatKhungBang(bang, o);
                      } else if (bangDangChonRef.current) {
                        capNhatKhungBang();
                      }
                    }}
                  />

                  {/* Nút dấu + trực quan gắn ngay cạnh phải (Thêm cột) và cạnh dưới (Thêm hàng) của Bảng */}
                  {toaDoBang && toaDoBang.top >= 4 && (
                    <>
                      <button
                        type="button"
                        data-testid="btn-them-cot-bang"
                        className="nh-table-edge-btn"
                        title="Nhấn dấu + để thêm 1 cột mới vào bảng"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => themCotBang('cuoi')}
                        style={{
                          top: `${toaDoBang.top}px`,
                          left: `${toaDoBang.left + toaDoBang.width + 6}px`,
                          width: '30px',
                          height: `${Math.max(44, toaDoBang.height)}px`,
                          flexDirection: 'column',
                        }}
                      >
                        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>
                        <span
                          style={{
                            writingMode: 'vertical-rl',
                            fontSize: '0.66rem',
                            letterSpacing: '0.06em',
                          }}
                        >
                          Thêm cột
                        </span>
                      </button>

                      <button
                        type="button"
                        data-testid="btn-them-hang-bang"
                        className="nh-table-edge-btn"
                        title="Nhấn dấu + để thêm 1 hàng mới vào bảng"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => themHangBang('cuoi')}
                        style={{
                          top: `${toaDoBang.top + toaDoBang.height + 6}px`,
                          left: `${toaDoBang.left}px`,
                          width: `${toaDoBang.width}px`,
                          height: '30px',
                        }}
                      >
                        <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
                        <span>Thêm hàng mới ({toaDoBang.soHang} hàng)</span>
                      </button>
                    </>
                  )}
                </div>
              )}

              {cheDoTrinhSoan === 'html' && (
                <textarea
                  aria-label="Mã HTML nội dung bài viết"
                  data-testid="html-editor-textarea"
                  rows={20}
                  className="nh-textarea"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.86rem',
                    lineHeight: 1.6,
                    flex: 1,
                    minHeight: '680px',
                  }}
                  value={noiDungHtml}
                  onChange={(e) => setNoiDungHtml(e.target.value)}
                />
              )}

              {cheDoTrinhSoan === 'xem_truoc' && (
                <div
                  style={{
                    border: '1px solid rgba(28,22,18,0.18)',
                    background: '#f4f0e8',
                    padding: '1.5rem',
                    flex: 1,
                  }}
                >
                  {xemTruocMucLuc.mucLuc.length > 0 && (
                    <div
                      style={{
                        background: '#fcfaf6',
                        border: '1px solid rgba(28,22,18,0.12)',
                        padding: '1rem 1.25rem',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.16em',
                          color: '#c0562c',
                          marginBottom: 8,
                        }}
                      >
                        Mục lục tự động trích xuất ({xemTruocMucLuc.mucLuc.length} mục)
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.84rem' }}>
                        {xemTruocMucLuc.mucLuc.map((m) => (
                          <li
                            key={m.id}
                            style={{
                              marginLeft: m.bac === 3 ? '1rem' : 0,
                              marginBottom: 4,
                            }}
                          >
                            {m.chu} <code style={{ color: '#6b5e52' }}>#{m.id}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div
                    className="noi-dung-bai-viet"
                    dangerouslySetInnerHTML={{ __html: xemTruocMucLuc.html }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: XUẤT BẢN, ẢNH BÌA & SOI SEO 12 TIÊU CHÍ */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Khối Trạng thái & Xuất bản */}
            <section className="nh-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.85rem' }}>
                Trạng thái & Xuất bản
              </h3>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.84rem',
                  marginBottom: '0.65rem',
                }}
              >
                <span style={{ color: '#6b5e52' }}>Trạng thái hiện tại:</span>
                {trangThai === 'dang' ? (
                  <span className="nh-status-badge nh-status-dang">Đã đăng công khai</span>
                ) : trangThai === 'nhap' ? (
                  <span className="nh-status-badge nh-status-nhap">Bản nháp</span>
                ) : (
                  <span className="nh-status-badge nh-status-an">Đang tạm ẩn</span>
                )}
              </div>

              {ngayDang && (
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: '#5a4e43',
                    marginBottom: '0.85rem',
                    padding: '0.5rem 0.65rem',
                    background: '#f4efe4',
                  }}
                >
                  Ngày xuất bản lần đầu:{' '}
                  <strong>{new Date(ngayDang).toLocaleString('vi-VN')}</strong>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  disabled={dangLuu || Boolean(xoaLuc)}
                  onClick={() => luuBaiViet('dang')}
                  className="nh-btn nh-btn-primary"
                  style={{ width: '100%' }}
                >
                  {trangThai === 'dang' ? 'Lưu & Cập nhật bài đăng' : 'Đăng bài công khai ngay'}
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    disabled={dangLuu || Boolean(xoaLuc)}
                    onClick={() => luuBaiViet('nhap')}
                    className="nh-btn"
                  >
                    Lưu thành Nháp
                  </button>
                  <button
                    type="button"
                    disabled={dangLuu || Boolean(xoaLuc)}
                    onClick={() => luuBaiViet('an')}
                    className="nh-btn"
                  >
                    Lưu & Tạm ẩn
                  </button>
                </div>

                {cheDo === 'sua' && !xoaLuc && (
                  <button
                    type="button"
                    disabled={dangLuu}
                    onClick={xuLyXoaMem}
                    className="nh-btn"
                    style={{ color: '#c5221f', marginTop: 4 }}
                  >
                    Chuyển vào thùng rác
                  </button>
                )}
              </div>
            </section>

            {/* Khối Ảnh bìa bài viết */}
            <section className="nh-card" style={{ padding: '1.25rem', marginTop: '1.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.75rem' }}>
                Ảnh bìa đại diện (OpenGraph)
              </h3>

              {anhBia ? (
                <div style={{ marginBottom: '0.75rem' }}>
                  <img
                    src={anhBia}
                    alt="Ảnh bìa bài viết"
                    style={{
                      width: '100%',
                      height: 170,
                      objectFit: 'cover',
                      border: '1px solid rgba(28,22,18,0.16)',
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    height: 130,
                    background: '#ede6d8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    color: '#6b5e52',
                    marginBottom: '0.75rem',
                  }}
                >
                  Chưa chọn ảnh bìa
                </div>
              )}

              <div style={{ display: 'flex', gap: 6, marginBottom: '0.65rem' }}>
                <input
                  ref={inputAnhBiaRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  style={{ display: 'none' }}
                  onChange={xuLyTaiAnhBia}
                />
                <button
                  type="button"
                  disabled={dangTaiAnhBia}
                  onClick={() => inputAnhBiaRef.current?.click()}
                  className="nh-btn"
                  style={{ flex: 1 }}
                >
                  {dangTaiAnhBia ? 'Đang tải lên...' : 'Tải ảnh mới lên'}
                </button>
                {anhBia && (
                  <button
                    type="button"
                    onClick={() => setAnhBia('')}
                    className="nh-btn"
                    style={{ color: '#c5221f' }}
                  >
                    Gỡ
                  </button>
                )}
              </div>

              <div>
                <label
                  htmlFor="chon-anh-mau"
                  style={{
                    display: 'block',
                    fontSize: '0.74rem',
                    color: '#6b5e52',
                    marginBottom: 4,
                  }}
                >
                  Hoặc chọn nhanh từ bộ ảnh dự án Nếp Hiên:
                </label>
                <select
                  id="chon-anh-mau"
                  className="nh-select"
                  value={anhBia}
                  onChange={(e) => setAnhBia(e.target.value)}
                >
                  <option value="">— Chọn ảnh bìa —</option>
                  {ANH_MAU_NEP_HIEN.map((a) => (
                    <option key={a.url} value={a.url}>
                      {a.nhan}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* Khối Soi chuẩn SEO 12 tiêu chí */}
            <SoiSeo
              tieuDe={tieuDe}
              slug={slug}
              moTaNgan={moTaNgan}
              anhBia={anhBia}
              noiDungHtml={noiDungHtml}
            />
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
