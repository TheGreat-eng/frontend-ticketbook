export interface LoginRequest {
  email: string;
  password?: string; // Dấu ? để linh hoạt nếu cần
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
}

export interface UserToken {
  sub: string;      // Email thường nằm ở trường sub
  roles: string[];  // Danh sách quyền từ Token RSA
  iat: number;
  exp: number;
}


export interface DecodedToken {
  sub: string;      // Thường là Email hoặc Username
  roles: string[];  // Danh sách quyền (Admin, User...)
  iat: number;      // Thời điểm tạo
  exp: number;      // Thời điểm hết hạn
  iss: string;      // Người phát hành (Issuer)
}



