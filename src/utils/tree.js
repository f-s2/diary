const filterTreeByFunc = (arr, func) => {
    if (!Array.isArray(arr) || arr.length === 0) {
        return []
    }
    let result = [];
    arr.forEach(item => {
        if (func(item)) {
            const children = filterTreeByFunc(item.children, func);
            const obj = { ...item, children }
            result.push(obj);
        } else {
            if (item.children && item.children.length > 0) {
                const children = filterTreeByFunc(item.children, func);
                const obj = { ...item, children }
                if (children && children.length > 0) {
                    result.push(obj);
                }
            }
        }
    });
    return result;
};

const eachTree = (tree, func, childProp = 'children') => {
    const dfs = (treeData, key, label) => {
        for (const node of treeData) {
            func(node)
            if (node[childProp] && node[childProp].length) {
                dfs(node[childProp], key, childProp)
            }
        }
        return tree
    }
    return dfs(tree, func)
}


export {
    filterTreeByFunc,
    eachTree
};

