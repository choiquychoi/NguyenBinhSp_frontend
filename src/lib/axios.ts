import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5005/api',
  timeout: 60000, // Tăng lên 60 giây để đợi AI viết bài
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Gửi Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Bắt lỗi toàn cục
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TRƯỜNG HỢP 1: Lỗi Mạng (Không có phản hồi từ Server)
    if (!error.response) {
      console.error('LỖI MẠNG:', error.message);
      alert('❌ LỖI KẾT NỐI (dữ liệu chưa bật)');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // TRƯỜNG HỢP 2: Xử lý theo mã lỗi HTTP
    switch (status) {
      case 401: // Hết hạn Token
        console.warn('401: Token expired');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        alert('⚠️ PHIÊN HẾT HẠN: Vui lòng đăng nhập lại để tiếp tục.');
        window.location.href = '/admin/login';
        break;

      case 403: // Không có quyền
        alert('🚫 TỪ CHỐI TRUY CẬP: Bạn không có quyền thực hiện hành động này!');
        break;

      case 404: // Không tìm thấy dữ liệu
        console.error('404: Not Found');
        alert('Sản phẩm hoặc trang này không tồn tại!');
        break;

      case 500: // Lỗi hệ thống Backend
        alert('🔥 LỖI SERVER: Backend đang gặp sự cố. Hãy báo cáo cho đội kỹ thuật');
        break;

      default:
        // Các lỗi 400 (Validation lỗi) sẽ được trả về để Component tự xử lý
        console.error(`Lỗi ${status}:`, data.message || 'Lỗi không xác định');
    }

    return Promise.reject(error);
  }
);

export default api;
