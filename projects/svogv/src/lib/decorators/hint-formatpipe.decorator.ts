﻿import { Pipe } from '@angular/core';

/**
 * The Format decorator. Provide the name of a Pipe that's being used by the
 * dynamic pipe formatter. Hence, the form does not need to apply forms manually.
 * The reason is that you may create forms automatically and hence can't write
 * actual Pipes somewhere. This applies especially if you create a table and loop
 * through properties.
 *
 * @param readonly      Optional, default is true.
 * @param description   A tooltip that can be used optionally.
 */
export function FormatPipe(pipe: Pipe, pipeParams: any[] = null) {
    // the original decorator
    function formatInternal(target: Object, property: string | symbol): void {
        formatInternalSetup(target, property.toString(), pipe, pipeParams);
    }

    // return the decorator
    return formatInternal;
}

export function formatInternalSetup(target: any, key: string, pipe: Pipe, pipeParams: any[] = null) {

    // create a helper property to transport a meta data value
    Object.defineProperty(target, `__uiPipe__${key}`, {
        value: pipe,
        enumerable: false,
        configurable: false
    });
    if (pipeParams && pipeParams.length) {
        Object.defineProperty(target, `__pipeParams__${key}`, {
            value: pipeParams,
            enumerable: false,
            configurable: false
        });
    }
}