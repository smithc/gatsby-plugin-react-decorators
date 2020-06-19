
export const errorDecoratorFactory = (targets) => {
    if (!Array.isArray(targets)) {
        throw new Error(`Expected array of targets, but got type '${typeof targets}'`);
    }

    const components = targets;
    const importedComponents = components.map(target => {
        const [ component, path ] = [...target];
        try {
            const module = require(`__webpack-decorators__Components__${path}__${component}`);

            return module[component] || module.default;
        } catch (ex) {
            console.log(`[ErrorDecoratorFactory]: Unable to load module '${component}'`, ex);
        }
    }).filter(component => typeof component !== 'undefined');

    targets = new Set(importedComponents);

    return {
        createElement: function (originalFunc, ...args){
            console.log('[ErrorDecorator]: in decorator');

            const [type] = [...args];

            switch (typeof type) {
                case 'function':
                    if (targets.has(type)) {
                        console.log(`[ErrorDecorator]: DECORATED TYPE '${type}'`);
                    }
                    break;
            }

            return originalFunc(...args);
        }
    };
};