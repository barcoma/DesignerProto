// Core
import {Injectable} from '@angular/core';
import {Plugins} from '@capacitor/core';
import {SharedService} from './shared.service';
import {AlertController} from '@ionic/angular';

const {Device, Share} = Plugins;

const LOGGING_TABLE = 'log';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    storage: any;
    fileToUpload: File = null;

    constructor(public sharedService: SharedService, public alertCtrl: AlertController) {
    }

    /**
     *
     * File Upload
     *
     */
    async cacheFile(event, tableName) {
        return await new Promise(async (resolve) => {
            const callback = async () => {
                await this.getKeysValuesByTable(tableName);
                resolve();
            };
            const FileList: any = event.target.files;
            for (const File of FileList) {
                this.checkUniqueName(File, tableName, callback);
            }
        });
    }

    async uploadFile(file: File, tableName, callback) {
        const reader: any = await this.sharedService.getFileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async (e) => {
            if (tableName === 'fonts') {
                const font = await this.sharedService.getFont(reader.result);
                const fontData = {
                    fontFamily: font['names'].fontFamily.en,
                    fontSubfamily: font['names'].fontSubfamily.en,
                    fontFamilyMerged: font['names'].fontFamily.en + ' ' + font['names'].fontSubfamily.en,
                    origKey: JSON.stringify({
                        fontFamily: font['names'].fontFamily.en,
                        fontSubfamily: font['names'].fontSubfamily.en,
                        fontFamilyMerged: font['names'].fontFamily.en + ' ' + font['names'].fontSubfamily.en,
                        default: false
                    }),
                    value: reader.result,
                    default: false
                };
                await this.storage.setTable({table: tableName});
                await this.storeFile(reader.result, fontData, tableName);
                await this.getKeysValuesByTable(tableName);
                await this.sharedService.getFontsFromDb(fontData);
            } else {
                await this.storage.setTable({table: tableName});
                await this.storeFile(reader.result, file, tableName);
                await this.getKeysValuesByTable(tableName);
            }
            callback();
        };
    }

    async checkUniqueName(file: File, tableName: string, callback) {
        let newFlag = true;
        if (this.sharedService.dbTables[tableName].length === 0) {
            await this.uploadFile(file, tableName, callback);
        }
        for (const image of this.sharedService.dbTables[tableName]) {

            if (image.key === file.name) {
                newFlag = false;
                this.presentOverwriteAlert('Overwrite ' + file.name + ' ?', file, tableName, callback);
            }
        }
        if (newFlag) {
            await this.uploadFile(file, tableName, callback);
        }
    }



    async saveProject(data: string, name: string, image: string) {
        await this.storage.setTable({table: 'project'});
        const nameInDB = await this.storage.get({key: name});
        const projectExists = (nameInDB.value ? true : false);
        if (projectExists) {
            this.presentProjectOverwriteAlert('Overwrite "' + name + '"?', data, name, image);
            return;
        }
        this.storeProject(data, name, image);
    }

    async presentProjectOverwriteAlert(message: string, data: string, projectName: string, image: string) {
        const alert = await this.alertCtrl.create({
            header: 'Warning!',
            message,
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        this.storeProject(data, projectName, image);
                    }
                },
                {
                    text: 'No',
                    handler: () => {
                        return;
                    }
                }]
        });
        await alert.present();
    }

    async presentOverwriteAlert(message: string, file: File, tableName: string, callback) {
        const alert = await this.alertCtrl.create({
            header: 'Warning!',
            message,
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        this.uploadFile(file, tableName, callback);
                    }
                },
                {
                    text: 'No',
                    handler: () => {
                        callback();
                    }
                }]
        });
        await alert.present();

    }

    async importProjectFonts(fonts) {
        for (const font of fonts[0]) {
            await this.storage.setTable({table: 'fonts'});
            const keyIsPresent = await this.storage.iskey({key: font.key});
            if (!keyIsPresent.result) {
                await this.storage.set({key: font.key, value: font.value});
                await this.getKeysValuesByTable('fonts');
                this.sharedService.fonts = await this.sharedService.getFontsFromDb();
            }
        }
    }

    async uploadDefaultFont(font, lastElement) {
        return await new Promise((resolve, reject) => {
            // Upload default fonts from assets/fonts to database
            const xhr = new XMLHttpRequest();
            xhr.open('GET', font.path, true);
            xhr.responseType = 'blob';
            xhr.onloadend = async (e: any) => {
                const reader: any = await this.sharedService.getFileReader();
                reader.readAsDataURL(e.target.response);
                reader.onloadend = async () => {
                    const fontObj = await this.sharedService.getFont(reader.result);
                    const fontData = {
                        fontFamily: fontObj['names'].fontFamily.en,
                        fontSubfamily: fontObj['names'].fontSubfamily.en,
                        fontFamilyMerged: font.fontFamilyMerged,
                        default: font.default
                    };
                    await this.storage.setTable({table: 'fonts'});
                    await this.storeFile(reader.result, fontData, 'fonts');
                    await this.getKeysValuesByTable('fonts');
                    resolve(lastElement);
                };
            };
            xhr.send();
        });
    }

    async getKeysValuesByTable(tableName) {
        await this.storage.setTable({table: tableName});
        await this.storage.keysvalues().then((res) => {
            this.sharedService.dbTables[tableName] = res.keysvalues;
        });
    }

    /**
     *
     * Storage Functions
     *
     */

    async storeFile(data, file, tableName) {
        let ret: any;
        await this.storage.setTable({table: tableName});
        if (file.fontFamily) {
            ret = await this.storage.set({key: JSON.stringify(file), value: data});
            ret = await this.storage.get({key: JSON.stringify(file)});
        } else {
            ret = await this.storage.set({key: file.name, value: data});
            ret = await this.storage.get({key: file.name});
        }
    }

    async storeProject(data: string, name: string, image: string) {
        let ret: any;
        await this.storage.setTable({table: 'project'});
        ret = await this.storage.set({key: name, value: data});
        ret = await this.storage.get({key: name});

        if (image !== '') {
            await this.storage.setTable({table: 'projectImg'});
            await this.storage.set({key: name, value: image});
        }
        return ret;
    }

    async getProjectImg(name: string) {
        await this.storage.setTable({table: 'projectImg'});
        const res = await this.storage.get({key: name});
        return res.value;
    }

    async deleteProject(name: string) {
        let ret: any;
        await this.storage.setTable({table: 'project'});
        ret = await this.storage.remove({key: name});

    }

    async getAllProjects(): Promise<any[]> {
        await this.storage.setTable({table: 'project'});
        const res = await this.storage.keysvalues();
        return res.keysvalues;
    }

    async storeLog(date: string, value: string) {
        if (date && value) {
            await this.storage.setTable({table: LOGGING_TABLE});
            await this.storage.set({key: date, value});
        }
    }

    async getLog(key) {
        await this.storage.setTable({table: LOGGING_TABLE});
        return await this.storage.get({key});
    }

    async getLogKeys() {
        await this.storage.setTable({table: LOGGING_TABLE});
        return await this.storage.keys();
    }

    async deleteLogs() {
        await this.storage.setTable({table: LOGGING_TABLE});
        this.storage.keys().then(keys => {
            const realKeys = keys.keys;
            realKeys.forEach(key => {
                this.storage.remove({key});
            });
        });
    }

    async deleteFont(font) {
        return await new Promise(async (resolve) => {
            await this.storage.setTable({table: 'fonts'});
            await this.storage.remove({key: font});
            await this.storage.get({key: font}).then((res) => {
                // console.log('DB: ', res);
            });
            await this.getKeysValuesByTable('fonts');

            font = JSON.parse(font);

            await this.sharedService.deleteFontFromDb(font);
            resolve();
        });
    }

}
