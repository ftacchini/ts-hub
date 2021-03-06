import { injectable, unmanaged } from 'inversify';

import { TsHubLogger } from '../../..';
import { NotSpecifiedParamException } from '../../../exception/not-specified-param-exception';
import { ControllerActivator } from '../../activator/controller-activator';
import { Middleware } from '../../middleware';
import { MiddlewareReader } from '../../reader';
import { Route } from '../../route';
import { RouteBuilder } from './route-builder';

@injectable()
export abstract class DefaultRouteBuilder<Information, GenericRouter, RequestHandler> implements RouteBuilder<Information, GenericRouter, RequestHandler> {

    protected information: Information;
    protected target: any;
    protected propertyKey: string;

    public constructor(
        @unmanaged() protected middlewareReader: MiddlewareReader,
        @unmanaged() protected activator: ControllerActivator<GenericRouter, RequestHandler>,
        @unmanaged() protected tsHubLogger: TsHubLogger) {
            if(!middlewareReader) { throw new NotSpecifiedParamException("middlewareReader", DefaultRouteBuilder.name) }
            if(!activator) { throw new NotSpecifiedParamException("activator", DefaultRouteBuilder.name) }
            if(!tsHubLogger) { throw new NotSpecifiedParamException("tsHubLogger", DefaultRouteBuilder.name) }

    }

    public abstract supportsRouter(router: GenericRouter): boolean;
    protected abstract createRouteInstance(): Route<Information, GenericRouter, RequestHandler>;
    
    public buildRoute(router: GenericRouter): Route<Information, GenericRouter, RequestHandler> {
        this.tsHubLogger.debug(`Route "${this.propertyKey}" being built.`);

        var route = this.createRouteInstance();
        route.middleware = this.buildRouteMiddleware(router);
        route.information = this.information;

        return route;
    }

    protected buildRouteMiddleware(router: GenericRouter): Middleware<any, RequestHandler>[] {

        var builders = this.middlewareReader.readRouteMiddleware<GenericRouter, RequestHandler>(router, this.target, this.propertyKey);
        var middleware = builders.map((builder) => builder.buildMiddleware(router));

        var activatorMiddleware = this.activator.buildControllerActivationMiddleware(this.target, this.propertyKey, router);

        middleware.push(activatorMiddleware);

        return middleware.sort((m0, m1) => m1.priority - m0.priority);
    }

    public withInformation(information: Information) : this {
        this.information = information;
        return this;
    }

    public withTarget(target: any) : this {
        this.target = target;
        return this;
    }

    public withPropertyKey(propertyKey: string) : this {
        this.propertyKey = propertyKey;
        return this;
    }
}