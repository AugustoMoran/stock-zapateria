export interface LoginDto {
  username: string;
  password: string;
}

export interface UserResponseDto {
  _id: string;
  username: string;
  accessToken: string;
}

export interface AdminVerifyDto {
  password: string;
}

export interface ChangeAdminPasswordDto {
  currentPassword: string;
  newPassword: string;
}