interface TreeNode {
  [key: string]: string | TreeNode
}

const getTreeDepth = (tree: TreeNode): number => {
  if (Object.values(tree).length === 0) {
    return 0;
  }

  const depths = Object.values(tree).map(node => typeof node === "object" ? getTreeDepth(node) : 0);

  return Math.max(...depths) + 1;
};

describe("getTreeDepth", () => {
  it("returns 0 when passing an empty tree", () => {
    expect(getTreeDepth({})).toEqual(0);
  });

  it("returns 1 when passing a tree with 1 node", () => {
    expect(getTreeDepth({ test: "test" })).toEqual(1);
  });

  it("returns 1 when passing a tree with 2 nodes", () => {
    expect(getTreeDepth({ a: "a", b: "b" })).toEqual(1);
  });

  it("returns 2 when passing a tree inside a tree", () => {
    expect(getTreeDepth({ a: { b: "b" } })).toEqual(2);
  });

  it("returns 1 when passing an empty tree inside of a tree", () => {
    expect(getTreeDepth({ a: {} })).toEqual(1);
  });

  it("returns 10 when passing a deep tree", () => {
    const tree = { a: { b: { c: { d: { e: { f: { g: { h: { i: { j: {} } } } } } } } } } };

    expect(getTreeDepth(tree)).toEqual(10);
  });

  it("returns 10 when passing a tree with multiple nested trees", () => {
    const tree = { a: { b: { c: { d: { e: { f: { g: { h: { i: { j: {} } } } }, k: { l: { m: {} } } } } } } } };

    expect(getTreeDepth(tree)).toEqual(10);
  });
})
;
