import { RateItem, ResolutionItem } from "../types";

export const setAttributes = (attrs: object = {}, dom: HTMLElement) => {
  Object.entries(attrs).forEach(([key, value]: [string, any]) => {
    dom.setAttribute(key, value);
  });
};

export const createDOM = <T = HTMLElement>(tag: string, attrs?: object): T => {
  const dom = document.createElement(tag);
  if (attrs) {
    setAttributes(attrs, dom);
  }
  return dom as T;
};

export const isNode = (node: string | HTMLElement): boolean => {
  return node instanceof HTMLElement && node.nodeType === 1;
};

export const newGuid = () => {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
};


export const setRateList = () => {
  let index = 1, result:RateItem[] = [];
  const maxCount = 16;
  while(index <= maxCount) {
      if (index === 1) {
          result.push({ label: index + 'x', value: index, aliasName: '倍速'});
      } else {
          result.push({ label: index + 'x', value: index });
          result.push({ label: -index + 'x', value: 1 / index});
      }
      index *= 2;
  }
  result.sort((a, b) => a.value - b.value);
  return result;
}
export const rateList = setRateList();

const setResolution = (): ResolutionItem[] => {
  return [
      { label: '自动', value: '', realValue: '', aliasName: '' },
      { label: '1080P', value: '36', realValue: '1920*1080', aliasName: '高清' },
      { label: '720P', value: '24', realValue: '1280*720', aliasName: '标清' },
      { label: '480P', value: '12', realValue: '720*480', aliasName: '清晰' },
      { label: '360P', value: '6', realValue: '480*360', aliasName: '流畅' },
  ];
}
export const resolutionList = setResolution();


export const formatSignalData = (dateStr:string) => {
  if (!dateStr) return '';
  const [date, time] = dateStr.split(' ');
  return `${date}T${time}`;
}

export const applyMixins = (derivedCtor: any, constructors: any[]) => {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}
