import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Settings } from '../types/settings';
import { LaserState } from '../types/common';
import {Observable} from 'rxjs';

const { Device } = Plugins;

const opentype = require('opentype.js');

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  settings = new Settings();
  scope: paper.PaperScope;

  public count = 0;

  modalStackCount = 0;

  dbTables: any = {};

  canvas = {
    height: 0,
    width: 0,
  };

  preview = {
    height: 0,
    width: 0,
  };

  fonts = [];
  fontsToLoadCSS = [];
  cssLoadedFonts = [];

  isPreview = false;

  jobRunning = false;
  autoUpdate = false;
  laserState: LaserState;



  projectOpcodesProgress = 0;

  get jobProgress(): number {
    if (this.laserState === undefined) {
      return 0;
    }
    return 1 - (this.laserState.remainingSize / this.laserState.jobSize);
  }

  defaultFonts = [
    {
      fontFamily: 'Arial Black',
      fontSubfamily: 'Regular',
      fontFamilyMerged: 'Arial Black Regular',
      default: true,
      path: '/assets/fonts/ariblk.ttf',
    },
    { fontFamily: 'Arial', fontSubfamily: 'Regular', fontFamilyMerged: 'Arial Regular', default: true, path: '/assets/fonts/arial.ttf' },
    { fontFamily: 'Arial', fontSubfamily: 'Bold', fontFamilyMerged: 'Arial Bold', default: true, path: '/assets/fonts/arialbd.ttf' },
    {
      fontFamily: 'Arial',
      fontSubfamily: 'Bold Italic',
      fontFamilyMerged: 'Arial Bold Italic',
      default: true,
      path: '/assets/fonts/arialbi.ttf',
    },
    { fontFamily: 'Arial', fontSubfamily: 'Italic', fontFamilyMerged: 'Arial Italic', default: true, path: '/assets/fonts/ariali.ttf' },
    {
      fontFamily: 'Candara',
      fontSubfamily: 'Regular',
      fontFamilyMerged: 'Candara Regular',
      default: true,
      path: '/assets/fonts/Candara.ttf',
    },
    {
      fontFamily: 'Candara',
      fontSubfamily: 'Italic',
      fontFamilyMerged: 'Candara Italic',
      default: true,
      path: '/assets/fonts/Candarai.ttf',
    },
    { fontFamily: 'Candara', fontSubfamily: 'Bold', fontFamilyMerged: 'Candara Bold', default: true, path: '/assets/fonts/Candarab.ttf' },
    {
      fontFamily: 'Candara',
      fontSubfamily: 'Bold Italic',
      fontFamilyMerged: 'Candara Bold Italic',
      default: true,
      path: '/assets/fonts/Candaraz.ttf',
    },
    {
      fontFamily: 'Comic Sans MS',
      fontSubfamily: 'Regular',
      fontFamilyMerged: 'Comic Sans MS Regular',
      default: true,
      path: '/assets/fonts/comic.ttf',
    },
    {
      fontFamily: 'Comic Sans MS',
      fontSubfamily: 'Bold',
      fontFamilyMerged: 'Comic Sans MS Bold',
      default: true,
      path: '/assets/fonts/comicbd.ttf',
    },
    {
      fontFamily: 'Comic Sans MS',
      fontSubfamily: 'Italic',
      fontFamilyMerged: 'Comic Sans MS Italic',
      default: true,
      path: '/assets/fonts/comici.ttf',
    },
    {
      fontFamily: 'Comic Sans MS',
      fontSubfamily: 'Bold Italic',
      fontFamilyMerged: 'Comic Sans MS Bold Italic',
      default: true,
      path: '/assets/fonts/comicz.ttf',
    },
  ];

  constructor() {}

  loadFontCSS(fontData) {
    const headEL = document.getElementsByTagName('head')[0];
    if (!this.cssLoadedFonts.includes(fontData.fontFamilyMerged)) {
      const fontFace = document.createElement('style');
      fontFace.innerText = '@font-face { font-family: "' + fontData.fontFamilyMerged + '"; src: url("' + fontData.value + '") }';
      this.cssLoadedFonts.push(fontData.fontFamilyMerged);
      headEL.appendChild(fontFace);
    } else {
    }
  }

  async deleteFontFromDb(fontData) {
    for (const [i, font] of this.fonts.entries()) {
      if (font.fontFamilyMerged === fontData.fontFamilyMerged) {
        this.fonts.splice(i, 1);
        break;
      }
    }
    this.fonts = [...this.fonts];
  }

  async getFontsFromDb(fontData?) {
    if (fontData) {
      this.fonts = [...this.fonts, fontData];
      this.loadFontCSS(fontData);
    } else {
      const fonts = [];
      this.fontsToLoadCSS = [];
      for await (const font of this.dbTables['fonts']) {
        await this.getFontName(font).then((res) => {
          if (
            this.defaultFonts.filter((defaultFonts) => defaultFonts.fontFamilyMerged === JSON.parse(font.key).fontFamilyMerged).length > 0
          ) {
            const fontObj = {
              fontFamily: JSON.parse(font.key).fontFamily,
              fontSubfamily: JSON.parse(font.key).fontSubfamily,
              fontFamilyMerged: JSON.parse(font.key).fontFamilyMerged,
              value: font.value,
              origKey: font.key,
              default: true,
            };
            fonts.push(fontObj);
            this.fontsToLoadCSS.push(fontObj);
            this.loadFontCSS(fontObj);
          } else {
            const fontObj = {
              fontFamily: JSON.parse(font.key).fontFamily,
              fontSubfamily: JSON.parse(font.key).fontSubfamily,
              fontFamilyMerged: JSON.parse(font.key).fontFamilyMerged,
              value: font.value,
              origKey: font.key,
              default: false,
            };
            fonts.push(fontObj);
            this.fontsToLoadCSS.push(fontObj);
            this.loadFontCSS(fontObj);
          }
        });
      }
      return fonts;
    }
  }

  async getFontName(font) {
    return await this.getFont(font.value).then((res) => {
      return res['names'].fontFamily.en;
    });
  }

  getFontFamily(font) {
    return font + ' ' + 'Regular';
  }

  async getFont(uri) {
    return await new Promise((resolve, reject) => opentype.load(uri, (err, font) => (err ? reject(err) : resolve(font))));
  }

  isJsonString(data: string) {
    try {
      JSON.parse(data);
    } catch (e) {
      return false;
    }
    return true;
  }

  async getFileReader() {
    let reader: any = new FileReader();
    const info = await Device.getInfo();
    if (info.platform === 'ios' || info.platform === 'android') {
      reader = reader._realReader;
    }
    return reader;
  }

  increaseCount() {
    this.count++;
  }

  resetCount() {
    this.count = 0;
  }

  getCount() {
    return this.count;
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  increaseModelStackCounter() {
    this.modalStackCount++;
  }

  decreaseModelStackCounter() {
    if (this.modalStackCount > 0) {
      this.modalStackCount--;
    }
  }

  onSubmit(id: string) {
    event.preventDefault();
    document.getElementById(id).blur();
  }
}
