export const flatListToHierarchical = (
    data: any[] = [],
    { idKey = 'id', parentKey = 'parentId', childrenKey = 'children' } = {}
) => {
    const tree: any[] = [];
    const childrenOf: { [key: string]: any[] } = {};

    data.forEach((item) => {
        const newItem = { ...item };
        const { [idKey]: id, [parentKey]: parentId = null } = newItem;

        childrenOf[id] = childrenOf[id] || [];
        newItem[childrenKey] = childrenOf[id];

        if (parentId !== null) {
            childrenOf[parentId] = childrenOf[parentId] || [];
            childrenOf[parentId].push(newItem);
        } else {
            tree.push(newItem);
        }
    });

    return tree;
};


