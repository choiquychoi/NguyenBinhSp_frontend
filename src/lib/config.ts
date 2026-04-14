// Cấu hình URL gốc cho Server Backend
// Nếu sau này bạn thay đổi PORT hoặc Deploy lên mạng, chỉ cần sửa ở đây duy nhất 1 lần.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

export const CONFIG = {
  API_URL: API_BASE_URL,
  ADMIN_API_URL: `${API_BASE_URL}/admin`,
};

export default CONFIG;
