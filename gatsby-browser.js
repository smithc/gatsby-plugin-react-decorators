import { errorDecoratorFactory } from './src/decorators/errorDecorator';
import { registerDecorator } from 'webpack-decorators';

export const onClientEntry = (_, pluginOptions) => {
    const boundaryTargets = (pluginOptions.react && pluginOptions.react.boundaryTargets) || [];

    const errorDecorator = errorDecoratorFactory(boundaryTargets);

    // this is a no-op if react-decorators haven't been enabled
    registerDecorator('react', errorDecorator, 'createElement');
};