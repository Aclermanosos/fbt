/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @generated SignedSource<<24030b5f635bd9a946f42bf5ac952598>>
 *
 * Generated by LanguageCLDRGenScript
 * @codegen-command: flib/intern/scripts/intl/cldr/gencode_all_plurals.sh
 *
 * @flow strict
 */

'use strict';

const IntlVariations = require('IntlVariations');

const IntlCLDRNumberType11 = {
  getVariation(n: number): $Values<typeof IntlVariations> {
    if (n % 10 === 1 && n % 100 !== 11) {
      return IntlVariations.NUMBER_ONE;
    } else {
      return IntlVariations.NUMBER_OTHER;
    }
  }
};

module.exports = IntlCLDRNumberType11;
