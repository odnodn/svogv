﻿import { Injectable, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { validateRange } from './validators/range.validator';
import { validateCompare } from './validators/compare.validator';

/**
 * The form validator service creates a {@link FormGroup} object from a viewmodel. If the viewmodel
 * has been decorated with validation decorators the validators are created accordingly.
 *
 * The simplest way is creating a class with properties and add decorators, such as
 * {@link StringLength}. The service will than create a {@link FormGroup} that contains a}validator
 * of type {@link StringLength} for the property the decorator is written}on.
 *
 * The decorators provide properties for additional information, such as a custom error message.
 *
 */
@Injectable()
export class FormValidatorService {
  private fb: FormBuilder;

  constructor(@Inject(FormBuilder) fb: FormBuilder) {
    this.fb = fb;
  }

  /**
   * Call this method to actually create the FormGroup object. Provide a valid model type.
   *
   * @param target A valid model type.
   * @returns A FormGroup with validators
   */
  public build(target: any): FormGroup {
    const valGroup: any = {};
    const errGroup: any = {};
    let form: FormGroup;
    let targetInstance: any;
    if (target) {
      // the cast is just to suppress TS errors and shows it's intentionally
      try {
        targetInstance = new target();
      } catch (ex) {
        console.error('Invalid viewmodel for FormValidatorService');
      }
    }
    if (targetInstance) {
      // tslint:disable-next-line:forin
      for (const propName in targetInstance) {
        const validators = new Array<any>();
        const errmsgs = new Object();
        const isRequired = `__isRequired__${propName}` in target.prototype;
        if (isRequired) {
          (errmsgs)['required'] = target.prototype[`__errRequired__${propName}`];
          validators.push(Validators.required);
        }
        const hasMaxLength = `__hasMaxLength__${propName}` in target.prototype;
        if (hasMaxLength) {
          (errmsgs)['maxlength'] = target.prototype[`__errMaxLength__${propName}`];
          const maxLength = parseInt(target.prototype[`__hasMaxLength__${propName}`], 10);
          validators.push(Validators.maxLength(maxLength));
        }
        const hasMinLength = `__hasMinLength__${propName}` in target.prototype;
        if (hasMinLength) {
          (errmsgs)['minlength'] = target.prototype[`__errMinLength__${propName}`];
          const minLength = parseInt(target.prototype[`__hasMinLength__${propName}`], 10);
          validators.push(Validators.minLength(minLength));
        }
        const hasPattern = `__hasPattern__${propName}` in target.prototype;
        if (hasPattern) {
          (errmsgs)['pattern'] = target.prototype[`__errPattern__${propName}`];
          const pattern = new RegExp(target.prototype[`__hasPattern__${propName}`]);
          validators.push(Validators.pattern(pattern));
        }
        const hasRangeFrom = `__hasRangeFrom__${propName}` in target.prototype;
        const hasRangeTo = `__hasRangeTo__${propName}` in target.prototype;
        if (hasRangeFrom || hasRangeTo) {
          (errmsgs)['range'] = target.prototype[`__errRange__${propName}`];
          let f: number | Date = Number(target.prototype[`__hasRangeFrom__${propName}`]);
          let t: number | Date = Number(target.prototype[`__hasRangeTo__${propName}`]);
          if (!f && !t) {
            // If NaN assume Date
            f = Date.parse(f.toString());
            t = Date.parse(t.toString());
          }
          validators.push(validateRange(f, t));
        }
        const hasCompare = `__hasCompareProperty__${propName}` in target.prototype;
        if (hasCompare) {
          (errmsgs)['compare'] = target.prototype[`__errCompareProperty__${propName}`];
          const compare = target.prototype[`__withCompare__${propName}`];
          validators.push(validateCompare(compare));
        }
        if (validators.length === 0) {
          // even if there is no validator we need to add the property to the group
          (valGroup)[propName] = [target[propName]];
        }
        if (validators.length === 1) {
          (valGroup)[propName] = [target[propName] || '', validators[0]];
        }
        if (validators.length >= 1) {
          (valGroup)[propName] = [target[propName] || '', Validators.compose(validators)];
        }
        (errGroup)[propName] = errmsgs;
      }
      // create form group
      form = this.fb.group(valGroup);
      // forward the model to the editors for easy access to other decorators
      // the cast is just to suppress TS errors and shows it's intentionally
      (form)['__editorModel__'] = targetInstance;
      // register controls and add messages
      // tslint:disable-next-line:forin
      for (const propName in errGroup) {
        const ctrl = form.controls[propName];
        if (!ctrl) {
          continue; // control might not be in the form
        }
        (form.controls[propName])['messages'] = (errGroup)[propName];
      }
    }
    // return FormGroup for immediate usage
    return form;
  }
}
