/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @emails oncall+internationalization
 * @flow
 */
/*eslint max-len: ["error", 100]*/

'use strict';

/*::
import type {ParamSet} from '../FbtUtil';
import type {FbtChildNode, AnyFbtNode} from './FbtNode';
import type {IFbtElementNode} from './FbtElementNode';
import type {AnyStringVariationArg, SVArgsList} from './FbtArguments';
import type {FromBabelNodeFunctionArgs} from './FbtNodeUtil';
*/

const {
  convertToStringArrayNodeIfNeeded,
  errorAt,
  setUniqueToken,
} = require('../FbtUtil');
const FbtElementNode = require('./FbtElementNode');
const FbtNode = require('./FbtNode');
const FbtTextNode = require('./FbtTextNode');
const {
  isBinaryExpression,
  isJSXElement,
  isStringLiteral,
  isTemplateLiteral,
} = require('@babel/types');
const nullthrows = require('nullthrows');

/**
 * Represents non-fbt JSX element nested inside an fbt callsite.
 */
class FbtImplicitParamNode
  extends FbtNode /*:: <AnyStringVariationArg, BabelNodeJSXElement, FbtChildNode>
  implements IFbtElementNode */ {

  /*::
  static +type: 'implicitElement';
  +options: {||};
  */

  _tokenSet /*: ParamSet */ = {};

  // Returns the string description which depends on the string variation factor values
  getDescription(_args /*: SVArgsList */) /*: string */ {
    throw errorAt(this.node, 'Not implemented yet');
  }

  _getElementNode() /*: FbtElementNode */ {
    return nullthrows(this.getFirstAncestorOfType(FbtElementNode));
  }

  _getSubjectNode() /*: ?BabelNode */ {
    return this._getElementNode().options.subject;
  }

  getArgsForStringVariationCalc() /*: $ReadOnlyArray<AnyStringVariationArg> */ {
    // The implicit fbt string may depend on a subject, inferred from the top-level FbtElementNode
    const subject = this._getSubjectNode();
    return FbtElementNode.getArgsForStringVariationCalcForFbtElement(this, subject);
  }

  /**
   * Create a new class instance given a BabelNode root node.
   * If that node is incompatible, we'll just return `null`.
   */
  static fromBabelNode({
    moduleName,
    node,
  } /*: FromBabelNodeFunctionArgs */) /*: ?FbtImplicitParamNode */ {
    if (!isJSXElement(node)) {
      return null;
    }
    const implicitElement = new FbtImplicitParamNode({
      moduleName,
      node,
    });

    const fbtChildren /*: Array<?FbtChildNode> */ = [];
    for (const child of node.children) {
      switch (child.type) {
        case 'JSXText':
          fbtChildren.push(
            FbtTextNode.fromBabelNode({moduleName, node: child})
          );
          break;

        case 'JSXExpressionContainer': {
          const {expression} = child;
          if (isBinaryExpression(expression) || isStringLiteral(expression) ||
            isTemplateLiteral(expression)) {
            const elements = convertToStringArrayNodeIfNeeded(moduleName, expression).elements ||
              ([] /*: Array<null> */);

            elements.forEach(elem => {
              if (elem == null) {
                return;
              }
              if (elem.type !== 'StringLiteral') {
                throw errorAt(
                  child,
                  `${moduleName}: only string literals ` +
                  `(or concatenations of string literals) are supported inside JSX expressions, ` +
                  `but we found the node type "${elem.type}" instead.`,
                  {suggestOSSWebsite: true},
                );
              }
              fbtChildren.push(
                FbtElementNode.createChildNode({moduleName, node: elem})
              );
            });
            continue;
          }

          if (expression.type === 'JSXEmptyExpression') {
            // usually, it's a comment inside a JSX expression
            continue;
          }

          fbtChildren.push(
            FbtElementNode.createChildNode({moduleName, node: expression})
          );
          break;
        }

        case 'JSXElement': {
          fbtChildren.push(
            FbtElementNode.createChildNode({moduleName, node: child})
          );
          break;
        }

        default:
          throw errorAt(child, `${moduleName}: unsupported babel node: ${child.type}`,
            {suggestOSSWebsite: true});
      }
    }

    fbtChildren.forEach(implicitElement.appendChild, implicitElement);
    return implicitElement;
  }

  registerToken(name /*: string */, source /*: AnyFbtNode */) /*: void */ {
    setUniqueToken(source.node, this.moduleName, name, this._tokenSet);
  }
}
// $FlowFixMe[cannot-write] Needed because node.js v10 does not support static constants on classes
FbtImplicitParamNode.type = 'implicitElement';

module.exports = FbtImplicitParamNode;
