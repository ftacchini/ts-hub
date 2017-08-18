import { RouteReader, RouteBuilder, HubContainer } from "../../../core";
import { ControllerMetadataReader, ControllerMetadataKeys } from "../../helper";
import { injectable } from "inversify";
import * as _ from "lodash";
import "reflect-metadata";

@injectable()
export class MetadataRouteReader implements RouteReader {

    private metadataTags: symbol[];

    constructor(private container: HubContainer) {
        this.metadataTags = [ControllerMetadataKeys.ROUTE_BUILDER];
    }

    readRoutes<GenericRouter, RequestHandler>(router: GenericRouter, target: any): RouteBuilder<any, GenericRouter, RequestHandler>[] {
        var properties = Object.getOwnPropertyNames(target.prototype);

        var routeBuilders = _.flatten(properties.map(property => {
            console.log(this.metadataTags);
            return ControllerMetadataReader.instance
                .readMethodLevelMetadata<(container: HubContainer) => RouteBuilder<any, GenericRouter, RequestHandler>>(this.metadataTags, target.prototype, property);
        }));

        return routeBuilders.filter(routeFactory => routeFactory)
                            .map(routeFactory => routeFactory(this.container))
                            .filter(route => route && route.supportsRouter(router));
    }
}