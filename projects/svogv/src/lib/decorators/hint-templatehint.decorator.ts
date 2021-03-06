﻿/**
 * The TemplateHint decorator.
 *
 * One can define the way a property gets rendered.
 * Currently supported:
 *  - TextArea
 *  - Calendar
 *  - Range
 *  - Number
 *  - Text
 *
 * The Calendar creates Date-field. However, in casde of a datatype Date the date field will be created anyway.
 *
 * @param template        The Name that appears in form fields as a watermark.
 * @param params          Depending of template some additional values as a dictionary.
 */
export function TemplateHint(template: string, params?: Array<{ key: string; value: any }>) {

  function templateHintInternalSetup(target: any, key: string) {
    // create a helper property to transport a meta data value
    Object.defineProperty(target, `__templatehint__${key}`, {
      value: template,
      enumerable: false,
      configurable: false
    });
    if (params) {
      Object.defineProperty(target, `__templatehintParams__${key}`, {
        value: params,
        enumerable: false,
        configurable: false
      });
    }
    Object.defineProperty(target, `__hasTemplateHint__${key}`, {
      value: true,
      enumerable: false,
      configurable: false
    });
  }
  // the original decorator
  function templateHintInternal(target: object, name: string): void {
    templateHintInternalSetup(target, name);
  }

  // return the decorator
  return templateHintInternal;
}
