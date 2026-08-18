// Helper utilities for Google Drive document embedding & policy links

export interface PolicyConfig {
  salesPolicyUrl: string;
  shippingPolicyUrl: string;
  warrantyPolicyUrl: string;
}

export const DEFAULT_POLICY_URLS: PolicyConfig = {
  salesPolicyUrl: 'https://docs.google.com/document/d/19pM4EwB2gQ8xR_XqgZ1T9C3v0yN4p7E9L5_EXAMPLE/preview',
  shippingPolicyUrl: 'https://docs.google.com/document/d/18rT3VwA1kP7xQ_ZpfaY2T8B4xM5q6E8K4_EXAMPLE/preview',
  warrantyPolicyUrl: 'https://docs.google.com/document/d/17sQ2UwZ9jO6wP_YoeaX1S7A3wL4p5D7J3_EXAMPLE/preview'
};

/**
 * Transforms standard Google Drive, Google Docs, Sheets, Slides, or PDF links into embeddable /preview URLs.
 */
export function getEmbeddableGoogleDriveUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  try {
    // 1. Google Docs (document)
    if (trimmed.includes('docs.google.com/document/d/')) {
      const match = trimmed.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://docs.google.com/document/d/${match[1]}/preview`;
      }
    }

    // 2. Google Spreadsheets
    if (trimmed.includes('docs.google.com/spreadsheets/d/')) {
      const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://docs.google.com/spreadsheets/d/${match[1]}/preview`;
      }
    }

    // 3. Google Presentations (Slides)
    if (trimmed.includes('docs.google.com/presentation/d/')) {
      const match = trimmed.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://docs.google.com/presentation/d/${match[1]}/preview`;
      }
    }

    // 4. Google Drive file URL (/file/d/...)
    if (trimmed.includes('drive.google.com/file/d/')) {
      const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    // 5. Google Drive open URL (open?id=...)
    if (trimmed.includes('drive.google.com/open?id=')) {
      const match = trimmed.match(/open\?id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    // 6. Google Drive uc URL (uc?id=...)
    if (trimmed.includes('drive.google.com/uc?id=')) {
      const match = trimmed.match(/uc\?id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    // If already ending with /preview
    if (trimmed.endsWith('/preview')) {
      return trimmed;
    }

    // If already an embed/preview-ready link or other web link
    return trimmed;
  } catch (err) {
    return trimmed;
  }
}

/**
 * Formats a clean public view/download link for external opening
 */
export function getExternalGoogleDriveUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  
  if (trimmed.endsWith('/preview')) {
    return trimmed.replace('/preview', '/view');
  }
  return trimmed;
}

// Fallback formatted text content in case the link is blank or offline
export const POLICY_DEFAULT_FALLBACKS = {
  sales: {
    title: 'Chính Sách Bán Hàng & Cam Kết Chất Lượng',
    subtitle: 'Quy định mua bán, đặt hàng và cam kết hàng chính hãng tại PK ĐIỆN TỬ - CAMERA',
    sections: [
      {
        heading: '1. Cam kết sản phẩm chính hãng',
        content: 'Toàn bộ thiết bị điện tử, camera giám sát và phụ kiện do PK ĐIỆN TỬ - CAMERA phân phối đều là hàng chính hãng 100%, có nguồn gốc xuất xứ rõ ràng và được kiểm tra chất lượng kỹ càng trước khi giao đến tay khách hàng.'
      },
      {
        heading: '2. Quy trình đặt hàng & thanh toán',
        content: 'Khách hàng có thể đặt hàng trực tuyến trên hệ thống website 24/7. Hỗ trợ đa dạng phương thức thanh toán: Thanh toán khi nhận hàng (COD) hoặc Chuyển khoản ngân hàng 24/7 qua mã VietQR tự động cập nhật số tiền.'
      },
      {
        heading: '3. Bảo mật thông tin khách hàng',
        content: 'Mọi thông tin cá nhân bao gồm họ tên, số điện thoại và địa chỉ giao hàng của quý khách đều được cam kết bảo mật tuyệt đối, chỉ sử dụng cho mục đích xác nhận và giao nhận đơn hàng.'
      },
      {
        heading: '4. Hỗ trợ kỹ thuật & hướng dẫn cài đặt',
        content: 'Đội ngũ kỹ thuật viên sẵn sàng hỗ trợ trực tuyến qua Zalo/Hotline để hướng dẫn khách hàng kết nối, cài đặt ứng dụng điều khiển camera và thiết bị thông minh miễn phí.'
      }
    ]
  },
  shipping: {
    title: 'Chính Sách Vận Chuyển & Giao Nhận Toàn Quốc',
    subtitle: 'Biểu phí giao hàng linh hoạt theo khoảng cách địa lý và thời gian cam kết',
    sections: [
      {
        heading: '1. Phạm vi & Đơn vị vận chuyển',
        content: 'Giao hàng trên toàn bộ 63 tỉnh thành Việt Nam thông qua các đơn vị chuyển phát nhanh hàng đầu (Giao Hàng Nhanh, Viettel Post, Giao Hàng Tiết Kiệm, Grab Express).'
      },
      {
        heading: '2. Thời gian giao hàng dự kiến',
        content: '• Nội thành & Cùng tỉnh: Giao trong 1 - 2 ngày làm việc.\n• Giao Hỏa Tốc (2H): Áp dụng cự ly ≤ 35km từ kho xuất hàng.\n• Liên tỉnh cùng miền: Giao trong 2 - 3 ngày làm việc.\n• Liên miền (Bắc - Trung - Nam): Giao trong 3 - 4 ngày làm việc.'
      },
      {
        heading: '3. Chính sách Miễn Phí Vận Chuyển (Freeship)',
        content: 'Tự động miễn phí cước vận chuyển đối với mọi đơn hàng đạt giá trị tối thiểu từ 500.000 VNĐ (hoặc áp dụng các mã Voucher Freeship hiện hành của cửa hàng).'
      },
      {
        heading: '4. Quyền kiểm tra hàng khi nhận (Đồng kiểm)',
        content: 'Khách hàng được quyền mở hộp kiểm tra đúng mẫu mã, số lượng và nguyên vẹn tem mác trước khi thanh toán tiền cho nhân viên giao hàng.'
      }
    ]
  },
  warranty: {
    title: 'Chính Sách Bảo Hành & Đổi Trả Thiết Bị',
    subtitle: 'Chế độ bảo hành chính hãng lỗi 1 đổi 1 và hỗ trợ kỹ thuật trọn đời',
    sections: [
      {
        heading: '1. Thời hạn bảo hành sản phẩm',
        content: '• Camera giám sát thông minh: Bảo hành 24 tháng chính hãng.\n• Đầu ghi, ổ cứng, thẻ nhớ chuyên dụng: Bảo hành 12 - 24 tháng.\n• Phụ kiện sạc, cáp, nguồn, phụ kiện mạng: Bảo hành 6 - 12 tháng.'
      },
      {
        heading: '2. Chính sách Đổi Mới (1 đổi 1 trong 7 ngày)',
        content: 'Trong vòng 7 ngày đầu kể từ ngày nhận hàng, nếu sản phẩm phát sinh lỗi kỹ thuật từ nhà sản xuất, cửa hàng sẽ tiến hành đổi ngay sản phẩm mới 100% hoàn toàn miễn phí cho khách hàng.'
      },
      {
        heading: '3. Điều kiện tiếp nhận bảo hành',
        content: 'Sản phẩm còn nguyên vẹn tem bảo hành của shop hoặc số Serial Number (SN) trên thiết bị. Không bị vỡ nứt, cháy nổ do nguồn điện không đúng chuẩn hoặc ngập nước (đối với thiết bị không chống nước).'
      },
      {
        heading: '4. Quy trình gửi bảo hành',
        content: 'Khách hàng liên hệ hotline 1900 6789 hoặc Chat trực tiếp để nhân viên tiếp nhận và hướng dẫn gửi thiết bị về địa chỉ kho bảo hành gần nhất.'
      }
    ]
  }
};
