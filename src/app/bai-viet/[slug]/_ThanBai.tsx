'use client';

import { useEffect, useRef, useState } from 'react';
import { MucLucMuc } from '@/lib/content/muc-luc';

interface Props {
  noiDungHtml: string;
  mucLuc: MucLucMuc[];
}

export function ThanBaiViet({ noiDungHtml, mucLuc }: Props) {
  const coMucLuc = mucLuc.length >= 2;
  const [mucDangDoc, setMucDangDoc] = useState<string>(mucLuc[0]?.id ?? '');
  const [moNganKeoMobile, setMoNganKeoMobile] = useState(false);
  const khoaCuonClickDenLucRef = useRef<number>(0);

  useEffect(() => {
    if (!coMucLuc) return;

    function capNhatMucDangDoc() {
      if (Date.now() < khoaCuonClickDenLucRef.current) return;

      const cacPhanTu = mucLuc
        .map((m) => document.getElementById(m.id))
        .filter((el): el is HTMLElement => Boolean(el));
      if (cacPhanTu.length === 0) return;

      const chieuCaoManHinh = window.innerHeight;
      const baiVietEl = document.querySelector('.noi-dung-bai-viet');

      // Khi người đọc cuộn tới phần cuối bài viết, luôn kích hoạt mục cuối cùng trong mục lục
      if (baiVietEl) {
        const rectBai = baiVietEl.getBoundingClientRect();
        if (rectBai.bottom <= chieuCaoManHinh * 0.85) {
          setMucDangDoc(cacPhanTu[cacPhanTu.length - 1].id);
          return;
        }
      }

      // Ngưỡng theo dõi vị trí đọc: 45% chiều cao màn hình từ đỉnh
      const nguongDoc = Math.max(220, chieuCaoManHinh * 0.45);
      let idChon = cacPhanTu[0].id;

      for (const el of cacPhanTu) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= nguongDoc) {
          idChon = el.id;
        } else {
          break;
        }
      }

      setMucDangDoc(idChon);
    }

    capNhatMucDangDoc();
    window.addEventListener('scroll', capNhatMucDangDoc, { passive: true });
    window.addEventListener('resize', capNhatMucDangDoc, { passive: true });
    return () => {
      window.removeEventListener('scroll', capNhatMucDangDoc);
      window.removeEventListener('resize', capNhatMucDangDoc);
    };
  }, [coMucLuc, mucLuc]);

  function nhayToiMuc(id: string) {
    khoaCuonClickDenLucRef.current = Date.now() + 700;
    setMucDangDoc(id);
    setMoNganKeoMobile(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
    }
  }

  return (
    <>
      <div className={`bv-reader-grid ${!coMucLuc ? 'no-toc' : ''}`}>
        {coMucLuc && (
          <aside className="bv-toc-aside" aria-label="Mục lục bài viết" data-testid="desktop-toc">
            <div className="bv-toc-heading">Mục lục bài viết</div>
            <ul className="bv-toc-list">
              {mucLuc.map((m) => (
                <li key={m.id}>
                  <a
                    href={`#${m.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      nhayToiMuc(m.id);
                    }}
                    className={`bv-toc-link ${m.bac === 3 ? 'is-h3' : ''} ${
                      mucDangDoc === m.id ? 'is-active' : ''
                    }`}
                  >
                    {m.chu}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <article
          className="noi-dung-bai-viet"
          data-testid="article-body-content"
          dangerouslySetInnerHTML={{ __html: noiDungHtml }}
        />
      </div>

      {/* Nút Mục lục nổi trên màn hình nhỏ */}
      {coMucLuc && (
        <>
          <button
            type="button"
            className="bv-mobile-toc-fab"
            onClick={() => setMoNganKeoMobile(true)}
            aria-label="Mở mục lục bài viết"
            data-testid="mobile-toc-fab"
          >
            ☰ Mục lục ({mucLuc.length})
          </button>

          {moNganKeoMobile && (
            <div
              className="bv-mobile-toc-backdrop"
              onClick={() => setMoNganKeoMobile(false)}
            >
              <div
                className="bv-mobile-toc-sheet"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Mục lục bài viết"
                data-testid="mobile-toc-sheet"
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    paddingBottom: '0.6rem',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <strong
                    style={{
                      fontSize: '0.78rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--terra)',
                    }}
                  >
                    Mục lục bài viết
                  </strong>
                  <button
                    type="button"
                    onClick={() => setMoNganKeoMobile(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.1rem',
                      color: 'var(--ink)',
                    }}
                  >
                    ✕
                  </button>
                </div>

                <ul className="bv-toc-list">
                  {mucLuc.map((m) => (
                    <li key={m.id}>
                      <a
                        href={`#${m.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          nhayToiMuc(m.id);
                        }}
                        className={`bv-toc-link ${m.bac === 3 ? 'is-h3' : ''} ${
                          mucDangDoc === m.id ? 'is-active' : ''
                        }`}
                      >
                        {m.chu}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
