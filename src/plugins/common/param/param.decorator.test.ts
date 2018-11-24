import {body, httpReply, httpRequest, pathParam, queryParam, ROUTE_PARAMS} from './param.decorator';
import {HttpRequest, Reply} from '../../../Types';
import {ParamOptions} from './ParamOptions';
import * as chai from 'chai';

describe('param', () => {

    class ControllerA {

        post(@body(String) body: String,
             @pathParam('name') name: String,
             @queryParam('limit') limit: number,
             @httpRequest() request: HttpRequest,
             @httpReply() reply: Reply) {
        }
    }

    const controllerA = new ControllerA();

    /**
     * Body decorator
     */
    describe('body', () => {

        it('should define metadata', () => {
            const paramOptions = Reflect.getMetadata(ROUTE_PARAMS, controllerA, 'post')[0] as ParamOptions;
            chai.expect(paramOptions).not.undefined;
            chai.expect(paramOptions.type).equal('body');
            chai.expect(paramOptions.paramType).equal(String);
        });
    });

    /**
     * PathParam decorator
     */
    describe('pathParam', () => {

        it('should define metadata', () => {
            const paramOptions = Reflect.getMetadata(ROUTE_PARAMS, controllerA, 'post')[1] as ParamOptions;
            chai.expect(paramOptions).not.undefined;
            chai.expect(paramOptions.name).equal('name');
            chai.expect(paramOptions.type).equal('path');
            chai.expect(paramOptions.paramType).equal(String);
        });
    });

    /**
     * QueryParam decorator
     */
    describe('queryParam', () => {

        it('should define metadata', () => {
            const paramOptions = Reflect.getMetadata(ROUTE_PARAMS, controllerA, 'post')[2] as ParamOptions;
            chai.expect(paramOptions).not.undefined;
            chai.expect(paramOptions.name).equal('limit');
            chai.expect(paramOptions.type).equal('query');
            chai.expect(paramOptions.paramType).equal(Number);
        });
    });

    /**
     * HttpRequest decorator
     */
    describe('httpRequest', () => {

        it('should define metadata', () => {
            const paramOptions = Reflect.getMetadata(ROUTE_PARAMS, controllerA, 'post')[3] as ParamOptions;
            chai.expect(paramOptions).not.undefined;
            chai.expect(paramOptions.type).equal('httpRequest');
        });
    });

    /**
     * HttpReply decorator
     */
    describe('httpReply', () => {

        it('should define metadata', () => {
            const paramOptions = Reflect.getMetadata(ROUTE_PARAMS, controllerA, 'post')[4] as ParamOptions;
            chai.expect(paramOptions).not.undefined;
            chai.expect(paramOptions.type).equal('httpReply');
        });
    });
});
