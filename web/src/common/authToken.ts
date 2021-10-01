import Cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';

export const TOKEN_STORAGE_KEY = 'authToken';

export type DecodedToken = {
  readonly email: string;
  readonly roleId: number;
  readonly exp: number;
};

export class AuthToken {
  readonly decodedToken: DecodedToken;

  constructor(readonly token?: string) {
    this.decodedToken = { email: '', roleId: -1, exp: 0 };

    try {
      if (token) this.decodedToken = jwtDecode(token);
    } catch (e) {}
  }

  get authorizationString() {
    return `Bearer ${this.token}`;
  }

  get expiresAt(): Date {
    return new Date(this.decodedToken.exp * 1000);
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  get isValid(): boolean {
    return !this.isExpired;
  }

  get email(): string {
    return this.decodedToken.email;
  }

  get roleId(): number {
    return this.decodedToken.roleId;
  }

  static async getToken() {
    return Cookie.get(TOKEN_STORAGE_KEY);
  }

  static async storeToken(token: string) {
    Cookie.set(TOKEN_STORAGE_KEY, token);
  }

  static logout() {
    Cookie.remove(TOKEN_STORAGE_KEY);
  }
}
