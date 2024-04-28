import { INestApplication } from '@nestjs/common';
import {
  OpenAPIObject,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
// import { writeFileSync } from 'fs';//
import { CUSTOM_CSS, CUSTOM_JS } from './constant';
import { toSentenceCase } from '../naming-case.function';

const HttpStatus = {
  GET: 200,
  POST: 201,
  PUT: 202,
  PATCH: 202,
  DELETE: 200,
};

export class SwaggerService {
  static _messages: { [k: string]: string } = {};
  static _document: OpenAPIObject;
  static _currentPermissionId: string;
  static _currentPermissionDependencies = new Set<string>();

  constructor(
    private app: INestApplication,
    private config: Omit<OpenAPIObject, 'paths'>,
  ) {}

  public init() {
    const document = SwaggerModule.createDocument(this.app, this.config, {
      operationIdFactory: (controllerKey, methodKey) => {
        return `${controllerKey.replace('Controller', '')}.${
          methodKey.charAt(0).toUpperCase() + methodKey.slice(1)
        }`;
      },
    });
    if (!SwaggerService._document) {
      SwaggerService._document = document;
    }
    let Schemas = Object.fromEntries(
      Object.entries(SwaggerService._document.components.schemas ?? {}).concat(
        Object.entries(document.components.schemas),
      ),
    );
    SwaggerService._document = {
      ...SwaggerService._document,
      paths: Object.fromEntries(
        Object.entries(SwaggerService._document.paths ?? {})
          .concat(Object.entries(document.paths))
          .map(([path, pathObject]) => {
            let updatedPathObject = Object.fromEntries(
              Object.entries(pathObject).map(([method, methodObject]) => {
                const { operationId, ...options } = methodObject;
                SwaggerService._messages[operationId] = '';
                let possibleResponses = Object.entries(options?.responses);
                if (
                  HttpStatus[method.toUpperCase()] !==
                  options[possibleResponses?.[0]?.[0]]
                ) {
                  delete options.responses[possibleResponses?.[0]?.[0]];
                  options.responses[HttpStatus[method.toUpperCase()]] =
                    possibleResponses?.[0]?.[1];
                }
                Object.values(
                  options.responses[HttpStatus[method.toUpperCase()]],
                ).forEach((statusObject: any) => {
                  const contentType = statusObject['application/json'];
                  if (contentType) {
                    let dto = (<any>contentType).schema?.['$ref']?.split(
                      '/',
                    )?.[3];
                    if (dto && (<any>Schemas[dto])?.properties?.message) {
                      const { example, default: _default } = (<any>Schemas[dto])
                        .properties.message;
                      SwaggerService._messages[operationId] =
                        _default || example;
                    }
                  }
                });
                return [method, { ...methodObject, ...options }];
              }),
            );
            return [path, updatedPathObject];
          }),
      ),
      components: {
        ...SwaggerService._document.components,
        schemas: Schemas,
      },
    };

    document.paths = Object.fromEntries(
      Object.entries(document.paths).sort(
        ([a, _a], [b, _b]) => a.charCodeAt(1) - b.charCodeAt(1),
      ),
    );
    SwaggerModule.setup('/api', this.app, document, {
      customCss: CUSTOM_CSS,
      customJsStr: this.getCustomJS(),
      // customSiteTitle: !this.companyName
      //   ? 'API Gateway'
      //   : `(${this.companyName}) API Gateway`,
      swaggerOptions: {
        // requestInterceptor: (req) => {
        //   let developerName = window.localStorage.getItem('developerName');
        //   req.headers['developer-name'] = developerName;
        //   return req;
        // },
        defaultModelsExpandDepth: -1,
        docExpansion: 'none',
        persistAuthorization: true,
        tagsSorter: 'alpha',
      },
    });
  }

  static getMessage(controllerKey, methodKey) {
    return SwaggerService._messages[
      `${controllerKey.replace('Controller', '')}.${
        methodKey.charAt(0).toUpperCase() + methodKey.slice(1)
      }`
    ];
  }

  static setCurrentApiUrl(controllerKey, methodKey) {
    this._currentPermissionId = `${controllerKey.replace('Controller', '')}.${
      methodKey.charAt(0).toUpperCase() + methodKey.slice(1)
    }`;
  }

  static setCurrentApiDependencies(dependency) {
    this._currentPermissionDependencies.add(dependency);
  }

  static resetApi() {
    this._currentPermissionId = undefined;
    this._currentPermissionDependencies = new Set();
  }

  private getCustomJS() {
    return CUSTOM_JS;
  }
}
