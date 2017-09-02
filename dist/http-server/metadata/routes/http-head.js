"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_core_1 = require("../../../metadata-core");
const routed_controller_1 = require("../../routed-controller");
const HttpMetadataKeys = require("../http-metadata-keys");
exports.HttpHead = metadata_core_1.ControllerMetadataBuilder.instance.buildMethodLevelMetadata(routed_controller_1.HttpHeadBuilder, [metadata_core_1.ControllerMetadataKeys.ROUTE_BUILDER, HttpMetadataKeys.HTTP_ROUTE_BUILDER]);
//# sourceMappingURL=http-head.js.map