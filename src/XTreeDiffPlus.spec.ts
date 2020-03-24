/* --------------------------------------------------------------------------*
 * Description:                                                              *
 *                                                                           *
 * File Created: Thursday, 26th December 2019 9:05 pm                        *
 * Author: yidafu(dov-yih) (me@yidafu.dev)                                   *
 *                                                                           *
 * Last Modified: Thursday, 26th December 2019 9:05 pm                       *
 * Modified By: yidafu(dov-yih) (me@yidafu.dev>)                             *
 *                                                                           *
 * Copyright 2019 - 2019 Mozilla Public License 2.0                          *
 *-------------------------------------------------------------------------- */

import { XTreeDiffPlus } from './XTreeDiffPlus';
import { EditOption } from './EditOption';
import { createTree1, createTree2, createTree3, createTree5, createTree4, createTree6, createTree7} from '../test/three-nodes';
import { createOldTree, createNewTree } from '../test/tune-existing-matches'
// import createTree1 from '../test/tree1';
// import createTree2 from '../test/tree2';
// import createTree3 from '../test/tree3';
import { XTree } from './XTree';
import { createTree11, createTree12 } from '../test/duplicate';

class DefaultXTreeDiff extends XTreeDiffPlus<XTree, XTree> {
  public buildXTree(tree: XTree) {
    return tree;
  }
  
  public dumpXTree(oldTree: XTree, newTree: XTree): { oldTree: XTree, newTree: XTree} {
    return { oldTree, newTree };
  }
}

describe('three nodes', () => {
  test('modify the second children node compared with tree1', () => {
    const oldTree = createTree1();
    const newTree = createTree2();
    const xTreeDiff = new DefaultXTreeDiff(oldTree, newTree);
    xTreeDiff.diff();
    expect(oldTree.Op).toBe(EditOption.NOP);
    expect(oldTree.getChild(0)?.Op).toBe(EditOption.NOP);
    expect(oldTree.getChild(1)?.Op).toBe(EditOption.UPD);
    expect(newTree.Op).toBe(EditOption.NOP);
    expect(newTree.getChild(0)?.Op).toBe(EditOption.NOP);
    expect(newTree.getChild(1)?.Op).toBe(EditOption.UPD);
  });

  test('tree5 modify the second children node compared with tree4', () => {
    const oldTree = createTree4();
    const newTree = createTree5();
    const xTreeDiff = new DefaultXTreeDiff(oldTree, newTree);
    xTreeDiff.diff();
    expect(oldTree.Op).toBe(EditOption.NOP);
    expect(oldTree?.getChild(0)?.Op).toBe(EditOption.NOP);
    expect(oldTree?.getChild(1)?.Op).toBe(EditOption.UPD);
    expect(newTree.Op).toBe(EditOption.NOP);
    expect(newTree?.getChild(0)?.Op).toBe(EditOption.NOP);
    expect(newTree?.getChild(1)?.Op).toBe(EditOption.UPD);
  });

  test('swap the order of children compared with tree2', () => {
    const oldTree = createTree2();
    const newTree = createTree3();
    const xTreeDiff = new DefaultXTreeDiff(oldTree, newTree);
    xTreeDiff.diff();
    expect(oldTree.Op).toBe(EditOption.NOP);
    expect(oldTree.getChild(0)?.Op).toBe(EditOption.MOV);
    expect(oldTree.getChild(1)?.Op).toBe(EditOption.MOV);
    expect(newTree.Op).toBe(EditOption.NOP);
    expect(newTree.getChild(0)?.Op).toBe(EditOption.MOV);
    expect(newTree.getChild(1)?.Op).toBe(EditOption.MOV);
  });

  test('tree 6 has a extra child node compared with tree5', () => {
    const oldTree = createTree5();
    const newTree = createTree6();
    const xTreeDiff = new DefaultXTreeDiff(oldTree, newTree);
    xTreeDiff.diff();
    expect(oldTree.Op).toBe(EditOption.NOP);
    expect(oldTree.getChild(0)?.Op).toBe(EditOption.NOP);
    expect(oldTree.getChild(1)?.Op).toBe(EditOption.NOP);
    expect(newTree.Op).toBe(EditOption.NOP);
    expect(newTree.getChild(0)?.Op).toBe(EditOption.NOP);
    expect(newTree.getChild(2)?.Op).toBe(EditOption.INS);
  });

  test('tree 7 missing the second child node compared with tree6', () => {
    const oldTree = createTree6();
    const newTree = createTree7();
    const xTreeDiff = new DefaultXTreeDiff(oldTree, newTree);
    xTreeDiff.diff();
    expect(oldTree.Op).toBe(EditOption.NOP);
    expect(oldTree.getChild(0)?.Op).toBe(EditOption.NOP);
    expect(oldTree.getChild(1)?.Op).toBe(EditOption.DEL);
    expect(oldTree.getChild(2)?.Op).toBe(EditOption.NOP);
    expect(newTree.Op).toBe(EditOption.NOP);
    expect(newTree.getChild(0)?.Op).toBe(EditOption.NOP);
    expect(newTree.getChild(1)?.Op).toBe(EditOption.NOP);
  });
});


describe('standard case', () => {
  test('tune existing matches',() => {
    const oldTree = createOldTree();
    const newTree = createNewTree();
    const xTreeDiff = new DefaultXTreeDiff(oldTree, newTree);
    xTreeDiff.diff();
    expect(oldTree.Op).toBe(EditOption.NOP);
    expect(newTree.Op).toBe(EditOption.NOP);
    expect(newTree?.getChild(0)?.nPtr).toBe(oldTree?.getChild(1));
    expect(newTree?.getChild(1)?.nPtr).toBe(oldTree?.getChild(0));
  });
});


describe('duplicate node', () => {
  test('twe tree are the same', () => {
    const oldTree = createTree11();
    const newTree = createTree11();
    const xTreeDiff = new DefaultXTreeDiff(oldTree, newTree);
    xTreeDiff.diff();

    expect(oldTree.Op).toBe(EditOption.NOP);
    expect(newTree.Op).toBe(EditOption.NOP);

    expect(newTree.getChild(0)!.getChild(0)!.Op).toBe(EditOption.NOP);
    expect(newTree.getChild(1)!.getChild(1)!.Op).toBe(EditOption.NOP);
  });

  test('the second child of these trees are not the same', () => {
    const oldTree = createTree11();
    const newTree = createTree12();
    const xTreeDiff = new DefaultXTreeDiff(oldTree, newTree);
    xTreeDiff.diff();

    expect(oldTree.Op).toBe(EditOption.NOP);
    expect(newTree.Op).toBe(EditOption.NOP);

    expect(newTree.getChild(0)!.Op).toBe(EditOption.NOP);
    expect(newTree.getChild(1)!.Op).toBe(EditOption.UPD);
  });

});