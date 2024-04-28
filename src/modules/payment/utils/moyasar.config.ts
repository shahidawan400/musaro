import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class MoyasarConfigService {
  private apiKey: string;
  private moyasarBaseUrl: string;

  constructor() {
    this.apiKey = process.env.MOYASAR_API_KEY;
    this.moyasarBaseUrl = process.env.MOYASAR_BASE_URL;
  }

  get(method: string, path: string, data?: Object) {
    const requestConfig: AxiosRequestConfig = {
      url: `${this.moyasarBaseUrl}/${path}`,
      method,
      auth: {
        username: `${this.apiKey}`,
        password: '',
      },
    };
    if (data) requestConfig.data = data;
    return requestConfig;
  }
}
