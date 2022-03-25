/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @generated SignedSource<<3099a6193d8d47e654b50e5df205e7eb>>
 *
 * Generated by LanguageCLDRGenScript
 * @codegen-command: flib/intern/scripts/intl/cldr/gencode_all_plurals.sh
 *
 * @flow strict
 */

'use strict';

const IntlVariations = require('IntlVariations');

const IntlCLDRNumberType21 = {
  getVariation(n: number): $Values<typeof IntlVariations> {
    if ((n === 1 || n === 11)) {
      return IntlVariations.NUMBER_ONE;
    } else if ((n === 2 || n === 12)) {
      return IntlVariations.NUMBER_TWO;
    } else if ((n >= 3 && n <= 10 || n >= 13 && n <= 19)) {
      return IntlVariations.NUMBER_FEW;
    } else {
      return IntlVariations.NUMBER_OTHER;
    }
  }
};

module.exports = IntlCLDRNumberType21;
