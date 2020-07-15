import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor(private storage: StorageService) {}

  async log(data: object | string) {
    await this.saveToStorage(data, 'log');
  }

  async error(data: object | string) {
    await this.saveToStorage(data, 'error');
  }

  private async saveToStorage(data: object | string, type: string) {
    if (typeof data === 'string') {
      data = {message: data};
    }
    data = Object.assign({}, data, {type});
    const key: string = (new Date()).toISOString();
    await this.storage.storeLog(key, JSON.stringify(data));
  }

  public async deleteLogs() {

  }

  public async getLogs() {
    const {keys} = await this.storage.getLogKeys();
    const entries = [];


    for (const timestamp of keys.reverse()) {
      const {value: log} = await this.storage.getLog(timestamp);
      const {message, file} = JSON.parse(log);
      entries.push({
        timestamp: moment(timestamp).format('DD.MM.YYYY HH:mm:ss'),
        text: (file ? file + ': ' : '') + message
      });
    }

    return entries;
  }
}
