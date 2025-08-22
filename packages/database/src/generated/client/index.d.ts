
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Document
 * 
 */
export type Document = $Result.DefaultSelection<Prisma.$DocumentPayload>
/**
 * Model ActiveSession
 * 
 */
export type ActiveSession = $Result.DefaultSelection<Prisma.$ActiveSessionPayload>
/**
 * Model ExtractedField
 * 
 */
export type ExtractedField = $Result.DefaultSelection<Prisma.$ExtractedFieldPayload>
/**
 * Model FormSession
 * 
 */
export type FormSession = $Result.DefaultSelection<Prisma.$FormSessionPayload>
/**
 * Model QueueConfig
 * 
 */
export type QueueConfig = $Result.DefaultSelection<Prisma.$QueueConfigPayload>
/**
 * Model EventLog
 * 
 */
export type EventLog = $Result.DefaultSelection<Prisma.$EventLogPayload>
/**
 * Model GlobalConfig
 * 
 */
export type GlobalConfig = $Result.DefaultSelection<Prisma.$GlobalConfigPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const DocumentType: {
  PDF_EXTRACTO: 'PDF_EXTRACTO',
  PDF_DILIGENCIA: 'PDF_DILIGENCIA',
  SCREENSHOT_VEHICULO: 'SCREENSHOT_VEHICULO'
};

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType]


export const DocumentStatus: {
  UPLOADED: 'UPLOADED',
  PROCESSING: 'PROCESSING',
  EXTRACTED: 'EXTRACTED',
  SESSION_ACTIVE: 'SESSION_ACTIVE',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR'
};

export type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus]


export const TramiteType: {
  COMPRAVENTA: 'COMPRAVENTA',
  DONACION: 'DONACION',
  CONSTITUCION_SOCIEDAD: 'CONSTITUCION_SOCIEDAD',
  FIDEICOMISO: 'FIDEICOMISO',
  CONSORCIO: 'CONSORCIO',
  VEHICULO: 'VEHICULO',
  DILIGENCIA: 'DILIGENCIA',
  HIPOTECA: 'HIPOTECA',
  PODER: 'PODER',
  TESTAMENTO: 'TESTAMENTO',
  OTRO: 'OTRO'
};

export type TramiteType = (typeof TramiteType)[keyof typeof TramiteType]


export const SessionStatus: {
  WAITING: 'WAITING',
  READY: 'READY',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED'
};

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus]


export const PriorityLevel: {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export type PriorityLevel = (typeof PriorityLevel)[keyof typeof PriorityLevel]


export const FormType: {
  UAFE_PERSONA_NATURAL: 'UAFE_PERSONA_NATURAL'
};

export type FormType = (typeof FormType)[keyof typeof FormType]


export const FormSessionStatus: {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  COMPLETED: 'COMPLETED'
};

export type FormSessionStatus = (typeof FormSessionStatus)[keyof typeof FormSessionStatus]

}

export type DocumentType = $Enums.DocumentType

export const DocumentType: typeof $Enums.DocumentType

export type DocumentStatus = $Enums.DocumentStatus

export const DocumentStatus: typeof $Enums.DocumentStatus

export type TramiteType = $Enums.TramiteType

export const TramiteType: typeof $Enums.TramiteType

export type SessionStatus = $Enums.SessionStatus

export const SessionStatus: typeof $Enums.SessionStatus

export type PriorityLevel = $Enums.PriorityLevel

export const PriorityLevel: typeof $Enums.PriorityLevel

export type FormType = $Enums.FormType

export const FormType: typeof $Enums.FormType

export type FormSessionStatus = $Enums.FormSessionStatus

export const FormSessionStatus: typeof $Enums.FormSessionStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Documents
 * const documents = await prisma.document.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Documents
   * const documents = await prisma.document.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.document`: Exposes CRUD operations for the **Document** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.document.findMany()
    * ```
    */
  get document(): Prisma.DocumentDelegate<ExtArgs>;

  /**
   * `prisma.activeSession`: Exposes CRUD operations for the **ActiveSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ActiveSessions
    * const activeSessions = await prisma.activeSession.findMany()
    * ```
    */
  get activeSession(): Prisma.ActiveSessionDelegate<ExtArgs>;

  /**
   * `prisma.extractedField`: Exposes CRUD operations for the **ExtractedField** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExtractedFields
    * const extractedFields = await prisma.extractedField.findMany()
    * ```
    */
  get extractedField(): Prisma.ExtractedFieldDelegate<ExtArgs>;

  /**
   * `prisma.formSession`: Exposes CRUD operations for the **FormSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FormSessions
    * const formSessions = await prisma.formSession.findMany()
    * ```
    */
  get formSession(): Prisma.FormSessionDelegate<ExtArgs>;

  /**
   * `prisma.queueConfig`: Exposes CRUD operations for the **QueueConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QueueConfigs
    * const queueConfigs = await prisma.queueConfig.findMany()
    * ```
    */
  get queueConfig(): Prisma.QueueConfigDelegate<ExtArgs>;

  /**
   * `prisma.eventLog`: Exposes CRUD operations for the **EventLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventLogs
    * const eventLogs = await prisma.eventLog.findMany()
    * ```
    */
  get eventLog(): Prisma.EventLogDelegate<ExtArgs>;

  /**
   * `prisma.globalConfig`: Exposes CRUD operations for the **GlobalConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GlobalConfigs
    * const globalConfigs = await prisma.globalConfig.findMany()
    * ```
    */
  get globalConfig(): Prisma.GlobalConfigDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Document: 'Document',
    ActiveSession: 'ActiveSession',
    ExtractedField: 'ExtractedField',
    FormSession: 'FormSession',
    QueueConfig: 'QueueConfig',
    EventLog: 'EventLog',
    GlobalConfig: 'GlobalConfig'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "document" | "activeSession" | "extractedField" | "formSession" | "queueConfig" | "eventLog" | "globalConfig"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Document: {
        payload: Prisma.$DocumentPayload<ExtArgs>
        fields: Prisma.DocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findFirst: {
            args: Prisma.DocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findMany: {
            args: Prisma.DocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          create: {
            args: Prisma.DocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          createMany: {
            args: Prisma.DocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          delete: {
            args: Prisma.DocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          update: {
            args: Prisma.DocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          aggregate: {
            args: Prisma.DocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocument>
          }
          groupBy: {
            args: Prisma.DocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentCountAggregateOutputType> | number
          }
        }
      }
      ActiveSession: {
        payload: Prisma.$ActiveSessionPayload<ExtArgs>
        fields: Prisma.ActiveSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActiveSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActiveSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveSessionPayload>
          }
          findFirst: {
            args: Prisma.ActiveSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActiveSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveSessionPayload>
          }
          findMany: {
            args: Prisma.ActiveSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveSessionPayload>[]
          }
          create: {
            args: Prisma.ActiveSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveSessionPayload>
          }
          createMany: {
            args: Prisma.ActiveSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActiveSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveSessionPayload>[]
          }
          delete: {
            args: Prisma.ActiveSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveSessionPayload>
          }
          update: {
            args: Prisma.ActiveSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveSessionPayload>
          }
          deleteMany: {
            args: Prisma.ActiveSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActiveSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ActiveSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActiveSessionPayload>
          }
          aggregate: {
            args: Prisma.ActiveSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActiveSession>
          }
          groupBy: {
            args: Prisma.ActiveSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActiveSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActiveSessionCountArgs<ExtArgs>
            result: $Utils.Optional<ActiveSessionCountAggregateOutputType> | number
          }
        }
      }
      ExtractedField: {
        payload: Prisma.$ExtractedFieldPayload<ExtArgs>
        fields: Prisma.ExtractedFieldFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExtractedFieldFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtractedFieldPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExtractedFieldFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtractedFieldPayload>
          }
          findFirst: {
            args: Prisma.ExtractedFieldFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtractedFieldPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExtractedFieldFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtractedFieldPayload>
          }
          findMany: {
            args: Prisma.ExtractedFieldFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtractedFieldPayload>[]
          }
          create: {
            args: Prisma.ExtractedFieldCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtractedFieldPayload>
          }
          createMany: {
            args: Prisma.ExtractedFieldCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExtractedFieldCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtractedFieldPayload>[]
          }
          delete: {
            args: Prisma.ExtractedFieldDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtractedFieldPayload>
          }
          update: {
            args: Prisma.ExtractedFieldUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtractedFieldPayload>
          }
          deleteMany: {
            args: Prisma.ExtractedFieldDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExtractedFieldUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ExtractedFieldUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtractedFieldPayload>
          }
          aggregate: {
            args: Prisma.ExtractedFieldAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExtractedField>
          }
          groupBy: {
            args: Prisma.ExtractedFieldGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExtractedFieldGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExtractedFieldCountArgs<ExtArgs>
            result: $Utils.Optional<ExtractedFieldCountAggregateOutputType> | number
          }
        }
      }
      FormSession: {
        payload: Prisma.$FormSessionPayload<ExtArgs>
        fields: Prisma.FormSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FormSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FormSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSessionPayload>
          }
          findFirst: {
            args: Prisma.FormSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FormSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSessionPayload>
          }
          findMany: {
            args: Prisma.FormSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSessionPayload>[]
          }
          create: {
            args: Prisma.FormSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSessionPayload>
          }
          createMany: {
            args: Prisma.FormSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FormSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSessionPayload>[]
          }
          delete: {
            args: Prisma.FormSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSessionPayload>
          }
          update: {
            args: Prisma.FormSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSessionPayload>
          }
          deleteMany: {
            args: Prisma.FormSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FormSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FormSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FormSessionPayload>
          }
          aggregate: {
            args: Prisma.FormSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFormSession>
          }
          groupBy: {
            args: Prisma.FormSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<FormSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.FormSessionCountArgs<ExtArgs>
            result: $Utils.Optional<FormSessionCountAggregateOutputType> | number
          }
        }
      }
      QueueConfig: {
        payload: Prisma.$QueueConfigPayload<ExtArgs>
        fields: Prisma.QueueConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QueueConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QueueConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueConfigPayload>
          }
          findFirst: {
            args: Prisma.QueueConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QueueConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueConfigPayload>
          }
          findMany: {
            args: Prisma.QueueConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueConfigPayload>[]
          }
          create: {
            args: Prisma.QueueConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueConfigPayload>
          }
          createMany: {
            args: Prisma.QueueConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QueueConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueConfigPayload>[]
          }
          delete: {
            args: Prisma.QueueConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueConfigPayload>
          }
          update: {
            args: Prisma.QueueConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueConfigPayload>
          }
          deleteMany: {
            args: Prisma.QueueConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QueueConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QueueConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueConfigPayload>
          }
          aggregate: {
            args: Prisma.QueueConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQueueConfig>
          }
          groupBy: {
            args: Prisma.QueueConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<QueueConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.QueueConfigCountArgs<ExtArgs>
            result: $Utils.Optional<QueueConfigCountAggregateOutputType> | number
          }
        }
      }
      EventLog: {
        payload: Prisma.$EventLogPayload<ExtArgs>
        fields: Prisma.EventLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>
          }
          findFirst: {
            args: Prisma.EventLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>
          }
          findMany: {
            args: Prisma.EventLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>[]
          }
          create: {
            args: Prisma.EventLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>
          }
          createMany: {
            args: Prisma.EventLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>[]
          }
          delete: {
            args: Prisma.EventLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>
          }
          update: {
            args: Prisma.EventLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>
          }
          deleteMany: {
            args: Prisma.EventLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EventLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventLogPayload>
          }
          aggregate: {
            args: Prisma.EventLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventLog>
          }
          groupBy: {
            args: Prisma.EventLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventLogCountArgs<ExtArgs>
            result: $Utils.Optional<EventLogCountAggregateOutputType> | number
          }
        }
      }
      GlobalConfig: {
        payload: Prisma.$GlobalConfigPayload<ExtArgs>
        fields: Prisma.GlobalConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GlobalConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GlobalConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalConfigPayload>
          }
          findFirst: {
            args: Prisma.GlobalConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GlobalConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalConfigPayload>
          }
          findMany: {
            args: Prisma.GlobalConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalConfigPayload>[]
          }
          create: {
            args: Prisma.GlobalConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalConfigPayload>
          }
          createMany: {
            args: Prisma.GlobalConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GlobalConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalConfigPayload>[]
          }
          delete: {
            args: Prisma.GlobalConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalConfigPayload>
          }
          update: {
            args: Prisma.GlobalConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalConfigPayload>
          }
          deleteMany: {
            args: Prisma.GlobalConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GlobalConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GlobalConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalConfigPayload>
          }
          aggregate: {
            args: Prisma.GlobalConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGlobalConfig>
          }
          groupBy: {
            args: Prisma.GlobalConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<GlobalConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.GlobalConfigCountArgs<ExtArgs>
            result: $Utils.Optional<GlobalConfigCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type DocumentCountOutputType
   */

  export type DocumentCountOutputType = {
    activeSessions: number
    extractedFields: number
    formSessions: number
  }

  export type DocumentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activeSessions?: boolean | DocumentCountOutputTypeCountActiveSessionsArgs
    extractedFields?: boolean | DocumentCountOutputTypeCountExtractedFieldsArgs
    formSessions?: boolean | DocumentCountOutputTypeCountFormSessionsArgs
  }

  // Custom InputTypes
  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentCountOutputType
     */
    select?: DocumentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeCountActiveSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActiveSessionWhereInput
  }

  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeCountExtractedFieldsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExtractedFieldWhereInput
  }

  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeCountFormSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FormSessionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentAvgAggregateOutputType = {
    size: number | null
  }

  export type DocumentSumAggregateOutputType = {
    size: number | null
  }

  export type DocumentMinAggregateOutputType = {
    id: string | null
    fileName: string | null
    originalName: string | null
    filePath: string | null
    type: $Enums.DocumentType | null
    status: $Enums.DocumentStatus | null
    size: number | null
    notariaId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: string | null
    fileName: string | null
    originalName: string | null
    filePath: string | null
    type: $Enums.DocumentType | null
    status: $Enums.DocumentStatus | null
    size: number | null
    notariaId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    fileName: number
    originalName: number
    filePath: number
    type: number
    status: number
    size: number
    notariaId: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DocumentAvgAggregateInputType = {
    size?: true
  }

  export type DocumentSumAggregateInputType = {
    size?: true
  }

  export type DocumentMinAggregateInputType = {
    id?: true
    fileName?: true
    originalName?: true
    filePath?: true
    type?: true
    status?: true
    size?: true
    notariaId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    fileName?: true
    originalName?: true
    filePath?: true
    type?: true
    status?: true
    size?: true
    notariaId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    fileName?: true
    originalName?: true
    filePath?: true
    type?: true
    status?: true
    size?: true
    notariaId?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType
  }

  export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument[P]>
      : GetScalarType<T[P], AggregateDocument[P]>
  }




  export type DocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithAggregationInput | DocumentOrderByWithAggregationInput[]
    by: DocumentScalarFieldEnum[] | DocumentScalarFieldEnum
    having?: DocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentCountAggregateInputType | true
    _avg?: DocumentAvgAggregateInputType
    _sum?: DocumentSumAggregateInputType
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: string
    fileName: string
    originalName: string
    filePath: string
    type: $Enums.DocumentType
    status: $Enums.DocumentStatus
    size: number
    notariaId: string
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    originalName?: boolean
    filePath?: boolean
    type?: boolean
    status?: boolean
    size?: boolean
    notariaId?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    activeSessions?: boolean | Document$activeSessionsArgs<ExtArgs>
    extractedFields?: boolean | Document$extractedFieldsArgs<ExtArgs>
    formSessions?: boolean | Document$formSessionsArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    originalName?: boolean
    filePath?: boolean
    type?: boolean
    status?: boolean
    size?: boolean
    notariaId?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectScalar = {
    id?: boolean
    fileName?: boolean
    originalName?: boolean
    filePath?: boolean
    type?: boolean
    status?: boolean
    size?: boolean
    notariaId?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activeSessions?: boolean | Document$activeSessionsArgs<ExtArgs>
    extractedFields?: boolean | Document$extractedFieldsArgs<ExtArgs>
    formSessions?: boolean | Document$formSessionsArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {
      activeSessions: Prisma.$ActiveSessionPayload<ExtArgs>[]
      extractedFields: Prisma.$ExtractedFieldPayload<ExtArgs>[]
      formSessions: Prisma.$FormSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileName: string
      originalName: string
      filePath: string
      type: $Enums.DocumentType
      status: $Enums.DocumentStatus
      size: number
      notariaId: string
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["document"]>
    composites: {}
  }

  type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = $Result.GetResult<Prisma.$DocumentPayload, S>

  type DocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DocumentCountAggregateInputType | true
    }

  export interface DocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Document'], meta: { name: 'Document' } }
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFindManyArgs>(args?: SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     * 
     */
    create<T extends DocumentCreateArgs>(args: SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentCreateManyArgs>(args?: SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Documents and returns the data saved in the database.
     * @param {DocumentCreateManyAndReturnArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     * 
     */
    delete<T extends DocumentDeleteArgs>(args: SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentUpdateArgs>(args: SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(
      args?: Subset<T, DocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentAggregateArgs>(args: Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>

    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentGroupByArgs['orderBy'] }
        : { orderBy?: DocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Document model
   */
  readonly fields: DocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Document.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    activeSessions<T extends Document$activeSessionsArgs<ExtArgs> = {}>(args?: Subset<T, Document$activeSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActiveSessionPayload<ExtArgs>, T, "findMany"> | Null>
    extractedFields<T extends Document$extractedFieldsArgs<ExtArgs> = {}>(args?: Subset<T, Document$extractedFieldsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtractedFieldPayload<ExtArgs>, T, "findMany"> | Null>
    formSessions<T extends Document$formSessionsArgs<ExtArgs> = {}>(args?: Subset<T, Document$formSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FormSessionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Document model
   */ 
  interface DocumentFieldRefs {
    readonly id: FieldRef<"Document", 'String'>
    readonly fileName: FieldRef<"Document", 'String'>
    readonly originalName: FieldRef<"Document", 'String'>
    readonly filePath: FieldRef<"Document", 'String'>
    readonly type: FieldRef<"Document", 'DocumentType'>
    readonly status: FieldRef<"Document", 'DocumentStatus'>
    readonly size: FieldRef<"Document", 'Int'>
    readonly notariaId: FieldRef<"Document", 'String'>
    readonly metadata: FieldRef<"Document", 'Json'>
    readonly createdAt: FieldRef<"Document", 'DateTime'>
    readonly updatedAt: FieldRef<"Document", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Document findUnique
   */
  export type DocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findUniqueOrThrow
   */
  export type DocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findFirst
   */
  export type DocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findFirstOrThrow
   */
  export type DocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findMany
   */
  export type DocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Documents to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document create
   */
  export type DocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a Document.
     */
    data: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
  }

  /**
   * Document createMany
   */
  export type DocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document createManyAndReturn
   */
  export type DocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document update
   */
  export type DocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a Document.
     */
    data: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
    /**
     * Choose, which Document to update.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document updateMany
   */
  export type DocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
  }

  /**
   * Document upsert
   */
  export type DocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: DocumentWhereUniqueInput
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
  }

  /**
   * Document delete
   */
  export type DocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter which Document to delete.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document deleteMany
   */
  export type DocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: DocumentWhereInput
  }

  /**
   * Document.activeSessions
   */
  export type Document$activeSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveSession
     */
    select?: ActiveSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveSessionInclude<ExtArgs> | null
    where?: ActiveSessionWhereInput
    orderBy?: ActiveSessionOrderByWithRelationInput | ActiveSessionOrderByWithRelationInput[]
    cursor?: ActiveSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActiveSessionScalarFieldEnum | ActiveSessionScalarFieldEnum[]
  }

  /**
   * Document.extractedFields
   */
  export type Document$extractedFieldsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtractedField
     */
    select?: ExtractedFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtractedFieldInclude<ExtArgs> | null
    where?: ExtractedFieldWhereInput
    orderBy?: ExtractedFieldOrderByWithRelationInput | ExtractedFieldOrderByWithRelationInput[]
    cursor?: ExtractedFieldWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExtractedFieldScalarFieldEnum | ExtractedFieldScalarFieldEnum[]
  }

  /**
   * Document.formSessions
   */
  export type Document$formSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSession
     */
    select?: FormSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSessionInclude<ExtArgs> | null
    where?: FormSessionWhereInput
    orderBy?: FormSessionOrderByWithRelationInput | FormSessionOrderByWithRelationInput[]
    cursor?: FormSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FormSessionScalarFieldEnum | FormSessionScalarFieldEnum[]
  }

  /**
   * Document without action
   */
  export type DocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
  }


  /**
   * Model ActiveSession
   */

  export type AggregateActiveSession = {
    _count: ActiveSessionCountAggregateOutputType | null
    _avg: ActiveSessionAvgAggregateOutputType | null
    _sum: ActiveSessionSumAggregateOutputType | null
    _min: ActiveSessionMinAggregateOutputType | null
    _max: ActiveSessionMaxAggregateOutputType | null
  }

  export type ActiveSessionAvgAggregateOutputType = {
    position: number | null
    estimatedWaitTime: number | null
  }

  export type ActiveSessionSumAggregateOutputType = {
    position: number | null
    estimatedWaitTime: number | null
  }

  export type ActiveSessionMinAggregateOutputType = {
    id: string | null
    documentId: string | null
    notariaId: string | null
    clientName: string | null
    tramiteType: $Enums.TramiteType | null
    status: $Enums.SessionStatus | null
    priority: $Enums.PriorityLevel | null
    position: number | null
    estimatedWaitTime: number | null
    expiresAt: Date | null
    readyAt: Date | null
    calledAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ActiveSessionMaxAggregateOutputType = {
    id: string | null
    documentId: string | null
    notariaId: string | null
    clientName: string | null
    tramiteType: $Enums.TramiteType | null
    status: $Enums.SessionStatus | null
    priority: $Enums.PriorityLevel | null
    position: number | null
    estimatedWaitTime: number | null
    expiresAt: Date | null
    readyAt: Date | null
    calledAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ActiveSessionCountAggregateOutputType = {
    id: number
    documentId: number
    notariaId: number
    clientName: number
    tramiteType: number
    status: number
    priority: number
    position: number
    estimatedWaitTime: number
    expiresAt: number
    readyAt: number
    calledAt: number
    completedAt: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ActiveSessionAvgAggregateInputType = {
    position?: true
    estimatedWaitTime?: true
  }

  export type ActiveSessionSumAggregateInputType = {
    position?: true
    estimatedWaitTime?: true
  }

  export type ActiveSessionMinAggregateInputType = {
    id?: true
    documentId?: true
    notariaId?: true
    clientName?: true
    tramiteType?: true
    status?: true
    priority?: true
    position?: true
    estimatedWaitTime?: true
    expiresAt?: true
    readyAt?: true
    calledAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ActiveSessionMaxAggregateInputType = {
    id?: true
    documentId?: true
    notariaId?: true
    clientName?: true
    tramiteType?: true
    status?: true
    priority?: true
    position?: true
    estimatedWaitTime?: true
    expiresAt?: true
    readyAt?: true
    calledAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ActiveSessionCountAggregateInputType = {
    id?: true
    documentId?: true
    notariaId?: true
    clientName?: true
    tramiteType?: true
    status?: true
    priority?: true
    position?: true
    estimatedWaitTime?: true
    expiresAt?: true
    readyAt?: true
    calledAt?: true
    completedAt?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ActiveSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActiveSession to aggregate.
     */
    where?: ActiveSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActiveSessions to fetch.
     */
    orderBy?: ActiveSessionOrderByWithRelationInput | ActiveSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActiveSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActiveSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActiveSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ActiveSessions
    **/
    _count?: true | ActiveSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ActiveSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ActiveSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActiveSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActiveSessionMaxAggregateInputType
  }

  export type GetActiveSessionAggregateType<T extends ActiveSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateActiveSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActiveSession[P]>
      : GetScalarType<T[P], AggregateActiveSession[P]>
  }




  export type ActiveSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActiveSessionWhereInput
    orderBy?: ActiveSessionOrderByWithAggregationInput | ActiveSessionOrderByWithAggregationInput[]
    by: ActiveSessionScalarFieldEnum[] | ActiveSessionScalarFieldEnum
    having?: ActiveSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActiveSessionCountAggregateInputType | true
    _avg?: ActiveSessionAvgAggregateInputType
    _sum?: ActiveSessionSumAggregateInputType
    _min?: ActiveSessionMinAggregateInputType
    _max?: ActiveSessionMaxAggregateInputType
  }

  export type ActiveSessionGroupByOutputType = {
    id: string
    documentId: string
    notariaId: string
    clientName: string
    tramiteType: $Enums.TramiteType
    status: $Enums.SessionStatus
    priority: $Enums.PriorityLevel
    position: number
    estimatedWaitTime: number
    expiresAt: Date
    readyAt: Date | null
    calledAt: Date | null
    completedAt: Date | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: ActiveSessionCountAggregateOutputType | null
    _avg: ActiveSessionAvgAggregateOutputType | null
    _sum: ActiveSessionSumAggregateOutputType | null
    _min: ActiveSessionMinAggregateOutputType | null
    _max: ActiveSessionMaxAggregateOutputType | null
  }

  type GetActiveSessionGroupByPayload<T extends ActiveSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActiveSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActiveSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActiveSessionGroupByOutputType[P]>
            : GetScalarType<T[P], ActiveSessionGroupByOutputType[P]>
        }
      >
    >


  export type ActiveSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    notariaId?: boolean
    clientName?: boolean
    tramiteType?: boolean
    status?: boolean
    priority?: boolean
    position?: boolean
    estimatedWaitTime?: boolean
    expiresAt?: boolean
    readyAt?: boolean
    calledAt?: boolean
    completedAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["activeSession"]>

  export type ActiveSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    notariaId?: boolean
    clientName?: boolean
    tramiteType?: boolean
    status?: boolean
    priority?: boolean
    position?: boolean
    estimatedWaitTime?: boolean
    expiresAt?: boolean
    readyAt?: boolean
    calledAt?: boolean
    completedAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["activeSession"]>

  export type ActiveSessionSelectScalar = {
    id?: boolean
    documentId?: boolean
    notariaId?: boolean
    clientName?: boolean
    tramiteType?: boolean
    status?: boolean
    priority?: boolean
    position?: boolean
    estimatedWaitTime?: boolean
    expiresAt?: boolean
    readyAt?: boolean
    calledAt?: boolean
    completedAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ActiveSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type ActiveSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }

  export type $ActiveSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ActiveSession"
    objects: {
      document: Prisma.$DocumentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      documentId: string
      notariaId: string
      clientName: string
      tramiteType: $Enums.TramiteType
      status: $Enums.SessionStatus
      priority: $Enums.PriorityLevel
      position: number
      estimatedWaitTime: number
      expiresAt: Date
      readyAt: Date | null
      calledAt: Date | null
      completedAt: Date | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["activeSession"]>
    composites: {}
  }

  type ActiveSessionGetPayload<S extends boolean | null | undefined | ActiveSessionDefaultArgs> = $Result.GetResult<Prisma.$ActiveSessionPayload, S>

  type ActiveSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ActiveSessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ActiveSessionCountAggregateInputType | true
    }

  export interface ActiveSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ActiveSession'], meta: { name: 'ActiveSession' } }
    /**
     * Find zero or one ActiveSession that matches the filter.
     * @param {ActiveSessionFindUniqueArgs} args - Arguments to find a ActiveSession
     * @example
     * // Get one ActiveSession
     * const activeSession = await prisma.activeSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActiveSessionFindUniqueArgs>(args: SelectSubset<T, ActiveSessionFindUniqueArgs<ExtArgs>>): Prisma__ActiveSessionClient<$Result.GetResult<Prisma.$ActiveSessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ActiveSession that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ActiveSessionFindUniqueOrThrowArgs} args - Arguments to find a ActiveSession
     * @example
     * // Get one ActiveSession
     * const activeSession = await prisma.activeSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActiveSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, ActiveSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActiveSessionClient<$Result.GetResult<Prisma.$ActiveSessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ActiveSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActiveSessionFindFirstArgs} args - Arguments to find a ActiveSession
     * @example
     * // Get one ActiveSession
     * const activeSession = await prisma.activeSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActiveSessionFindFirstArgs>(args?: SelectSubset<T, ActiveSessionFindFirstArgs<ExtArgs>>): Prisma__ActiveSessionClient<$Result.GetResult<Prisma.$ActiveSessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ActiveSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActiveSessionFindFirstOrThrowArgs} args - Arguments to find a ActiveSession
     * @example
     * // Get one ActiveSession
     * const activeSession = await prisma.activeSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActiveSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, ActiveSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActiveSessionClient<$Result.GetResult<Prisma.$ActiveSessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ActiveSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActiveSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ActiveSessions
     * const activeSessions = await prisma.activeSession.findMany()
     * 
     * // Get first 10 ActiveSessions
     * const activeSessions = await prisma.activeSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const activeSessionWithIdOnly = await prisma.activeSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActiveSessionFindManyArgs>(args?: SelectSubset<T, ActiveSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActiveSessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ActiveSession.
     * @param {ActiveSessionCreateArgs} args - Arguments to create a ActiveSession.
     * @example
     * // Create one ActiveSession
     * const ActiveSession = await prisma.activeSession.create({
     *   data: {
     *     // ... data to create a ActiveSession
     *   }
     * })
     * 
     */
    create<T extends ActiveSessionCreateArgs>(args: SelectSubset<T, ActiveSessionCreateArgs<ExtArgs>>): Prisma__ActiveSessionClient<$Result.GetResult<Prisma.$ActiveSessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ActiveSessions.
     * @param {ActiveSessionCreateManyArgs} args - Arguments to create many ActiveSessions.
     * @example
     * // Create many ActiveSessions
     * const activeSession = await prisma.activeSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActiveSessionCreateManyArgs>(args?: SelectSubset<T, ActiveSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ActiveSessions and returns the data saved in the database.
     * @param {ActiveSessionCreateManyAndReturnArgs} args - Arguments to create many ActiveSessions.
     * @example
     * // Create many ActiveSessions
     * const activeSession = await prisma.activeSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ActiveSessions and only return the `id`
     * const activeSessionWithIdOnly = await prisma.activeSession.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActiveSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, ActiveSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActiveSessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ActiveSession.
     * @param {ActiveSessionDeleteArgs} args - Arguments to delete one ActiveSession.
     * @example
     * // Delete one ActiveSession
     * const ActiveSession = await prisma.activeSession.delete({
     *   where: {
     *     // ... filter to delete one ActiveSession
     *   }
     * })
     * 
     */
    delete<T extends ActiveSessionDeleteArgs>(args: SelectSubset<T, ActiveSessionDeleteArgs<ExtArgs>>): Prisma__ActiveSessionClient<$Result.GetResult<Prisma.$ActiveSessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ActiveSession.
     * @param {ActiveSessionUpdateArgs} args - Arguments to update one ActiveSession.
     * @example
     * // Update one ActiveSession
     * const activeSession = await prisma.activeSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActiveSessionUpdateArgs>(args: SelectSubset<T, ActiveSessionUpdateArgs<ExtArgs>>): Prisma__ActiveSessionClient<$Result.GetResult<Prisma.$ActiveSessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ActiveSessions.
     * @param {ActiveSessionDeleteManyArgs} args - Arguments to filter ActiveSessions to delete.
     * @example
     * // Delete a few ActiveSessions
     * const { count } = await prisma.activeSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActiveSessionDeleteManyArgs>(args?: SelectSubset<T, ActiveSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActiveSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActiveSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ActiveSessions
     * const activeSession = await prisma.activeSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActiveSessionUpdateManyArgs>(args: SelectSubset<T, ActiveSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ActiveSession.
     * @param {ActiveSessionUpsertArgs} args - Arguments to update or create a ActiveSession.
     * @example
     * // Update or create a ActiveSession
     * const activeSession = await prisma.activeSession.upsert({
     *   create: {
     *     // ... data to create a ActiveSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ActiveSession we want to update
     *   }
     * })
     */
    upsert<T extends ActiveSessionUpsertArgs>(args: SelectSubset<T, ActiveSessionUpsertArgs<ExtArgs>>): Prisma__ActiveSessionClient<$Result.GetResult<Prisma.$ActiveSessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ActiveSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActiveSessionCountArgs} args - Arguments to filter ActiveSessions to count.
     * @example
     * // Count the number of ActiveSessions
     * const count = await prisma.activeSession.count({
     *   where: {
     *     // ... the filter for the ActiveSessions we want to count
     *   }
     * })
    **/
    count<T extends ActiveSessionCountArgs>(
      args?: Subset<T, ActiveSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActiveSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ActiveSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActiveSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ActiveSessionAggregateArgs>(args: Subset<T, ActiveSessionAggregateArgs>): Prisma.PrismaPromise<GetActiveSessionAggregateType<T>>

    /**
     * Group by ActiveSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActiveSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ActiveSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActiveSessionGroupByArgs['orderBy'] }
        : { orderBy?: ActiveSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ActiveSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActiveSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ActiveSession model
   */
  readonly fields: ActiveSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ActiveSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActiveSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    document<T extends DocumentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DocumentDefaultArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ActiveSession model
   */ 
  interface ActiveSessionFieldRefs {
    readonly id: FieldRef<"ActiveSession", 'String'>
    readonly documentId: FieldRef<"ActiveSession", 'String'>
    readonly notariaId: FieldRef<"ActiveSession", 'String'>
    readonly clientName: FieldRef<"ActiveSession", 'String'>
    readonly tramiteType: FieldRef<"ActiveSession", 'TramiteType'>
    readonly status: FieldRef<"ActiveSession", 'SessionStatus'>
    readonly priority: FieldRef<"ActiveSession", 'PriorityLevel'>
    readonly position: FieldRef<"ActiveSession", 'Int'>
    readonly estimatedWaitTime: FieldRef<"ActiveSession", 'Int'>
    readonly expiresAt: FieldRef<"ActiveSession", 'DateTime'>
    readonly readyAt: FieldRef<"ActiveSession", 'DateTime'>
    readonly calledAt: FieldRef<"ActiveSession", 'DateTime'>
    readonly completedAt: FieldRef<"ActiveSession", 'DateTime'>
    readonly metadata: FieldRef<"ActiveSession", 'Json'>
    readonly createdAt: FieldRef<"ActiveSession", 'DateTime'>
    readonly updatedAt: FieldRef<"ActiveSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ActiveSession findUnique
   */
  export type ActiveSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveSession
     */
    select?: ActiveSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveSessionInclude<ExtArgs> | null
    /**
     * Filter, which ActiveSession to fetch.
     */
    where: ActiveSessionWhereUniqueInput
  }

  /**
   * ActiveSession findUniqueOrThrow
   */
  export type ActiveSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveSession
     */
    select?: ActiveSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveSessionInclude<ExtArgs> | null
    /**
     * Filter, which ActiveSession to fetch.
     */
    where: ActiveSessionWhereUniqueInput
  }

  /**
   * ActiveSession findFirst
   */
  export type ActiveSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveSession
     */
    select?: ActiveSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveSessionInclude<ExtArgs> | null
    /**
     * Filter, which ActiveSession to fetch.
     */
    where?: ActiveSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActiveSessions to fetch.
     */
    orderBy?: ActiveSessionOrderByWithRelationInput | ActiveSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActiveSessions.
     */
    cursor?: ActiveSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActiveSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActiveSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActiveSessions.
     */
    distinct?: ActiveSessionScalarFieldEnum | ActiveSessionScalarFieldEnum[]
  }

  /**
   * ActiveSession findFirstOrThrow
   */
  export type ActiveSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveSession
     */
    select?: ActiveSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveSessionInclude<ExtArgs> | null
    /**
     * Filter, which ActiveSession to fetch.
     */
    where?: ActiveSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActiveSessions to fetch.
     */
    orderBy?: ActiveSessionOrderByWithRelationInput | ActiveSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActiveSessions.
     */
    cursor?: ActiveSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActiveSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActiveSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActiveSessions.
     */
    distinct?: ActiveSessionScalarFieldEnum | ActiveSessionScalarFieldEnum[]
  }

  /**
   * ActiveSession findMany
   */
  export type ActiveSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveSession
     */
    select?: ActiveSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveSessionInclude<ExtArgs> | null
    /**
     * Filter, which ActiveSessions to fetch.
     */
    where?: ActiveSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActiveSessions to fetch.
     */
    orderBy?: ActiveSessionOrderByWithRelationInput | ActiveSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ActiveSessions.
     */
    cursor?: ActiveSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActiveSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActiveSessions.
     */
    skip?: number
    distinct?: ActiveSessionScalarFieldEnum | ActiveSessionScalarFieldEnum[]
  }

  /**
   * ActiveSession create
   */
  export type ActiveSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveSession
     */
    select?: ActiveSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a ActiveSession.
     */
    data: XOR<ActiveSessionCreateInput, ActiveSessionUncheckedCreateInput>
  }

  /**
   * ActiveSession createMany
   */
  export type ActiveSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ActiveSessions.
     */
    data: ActiveSessionCreateManyInput | ActiveSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ActiveSession createManyAndReturn
   */
  export type ActiveSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveSession
     */
    select?: ActiveSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ActiveSessions.
     */
    data: ActiveSessionCreateManyInput | ActiveSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ActiveSession update
   */
  export type ActiveSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveSession
     */
    select?: ActiveSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a ActiveSession.
     */
    data: XOR<ActiveSessionUpdateInput, ActiveSessionUncheckedUpdateInput>
    /**
     * Choose, which ActiveSession to update.
     */
    where: ActiveSessionWhereUniqueInput
  }

  /**
   * ActiveSession updateMany
   */
  export type ActiveSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ActiveSessions.
     */
    data: XOR<ActiveSessionUpdateManyMutationInput, ActiveSessionUncheckedUpdateManyInput>
    /**
     * Filter which ActiveSessions to update
     */
    where?: ActiveSessionWhereInput
  }

  /**
   * ActiveSession upsert
   */
  export type ActiveSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveSession
     */
    select?: ActiveSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the ActiveSession to update in case it exists.
     */
    where: ActiveSessionWhereUniqueInput
    /**
     * In case the ActiveSession found by the `where` argument doesn't exist, create a new ActiveSession with this data.
     */
    create: XOR<ActiveSessionCreateInput, ActiveSessionUncheckedCreateInput>
    /**
     * In case the ActiveSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActiveSessionUpdateInput, ActiveSessionUncheckedUpdateInput>
  }

  /**
   * ActiveSession delete
   */
  export type ActiveSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveSession
     */
    select?: ActiveSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveSessionInclude<ExtArgs> | null
    /**
     * Filter which ActiveSession to delete.
     */
    where: ActiveSessionWhereUniqueInput
  }

  /**
   * ActiveSession deleteMany
   */
  export type ActiveSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActiveSessions to delete
     */
    where?: ActiveSessionWhereInput
  }

  /**
   * ActiveSession without action
   */
  export type ActiveSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActiveSession
     */
    select?: ActiveSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActiveSessionInclude<ExtArgs> | null
  }


  /**
   * Model ExtractedField
   */

  export type AggregateExtractedField = {
    _count: ExtractedFieldCountAggregateOutputType | null
    _avg: ExtractedFieldAvgAggregateOutputType | null
    _sum: ExtractedFieldSumAggregateOutputType | null
    _min: ExtractedFieldMinAggregateOutputType | null
    _max: ExtractedFieldMaxAggregateOutputType | null
  }

  export type ExtractedFieldAvgAggregateOutputType = {
    confidence: number | null
  }

  export type ExtractedFieldSumAggregateOutputType = {
    confidence: number | null
  }

  export type ExtractedFieldMinAggregateOutputType = {
    id: string | null
    documentId: string | null
    fieldName: string | null
    value: string | null
    confidence: number | null
    type: string | null
    createdAt: Date | null
  }

  export type ExtractedFieldMaxAggregateOutputType = {
    id: string | null
    documentId: string | null
    fieldName: string | null
    value: string | null
    confidence: number | null
    type: string | null
    createdAt: Date | null
  }

  export type ExtractedFieldCountAggregateOutputType = {
    id: number
    documentId: number
    fieldName: number
    value: number
    confidence: number
    type: number
    createdAt: number
    _all: number
  }


  export type ExtractedFieldAvgAggregateInputType = {
    confidence?: true
  }

  export type ExtractedFieldSumAggregateInputType = {
    confidence?: true
  }

  export type ExtractedFieldMinAggregateInputType = {
    id?: true
    documentId?: true
    fieldName?: true
    value?: true
    confidence?: true
    type?: true
    createdAt?: true
  }

  export type ExtractedFieldMaxAggregateInputType = {
    id?: true
    documentId?: true
    fieldName?: true
    value?: true
    confidence?: true
    type?: true
    createdAt?: true
  }

  export type ExtractedFieldCountAggregateInputType = {
    id?: true
    documentId?: true
    fieldName?: true
    value?: true
    confidence?: true
    type?: true
    createdAt?: true
    _all?: true
  }

  export type ExtractedFieldAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExtractedField to aggregate.
     */
    where?: ExtractedFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtractedFields to fetch.
     */
    orderBy?: ExtractedFieldOrderByWithRelationInput | ExtractedFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExtractedFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtractedFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtractedFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExtractedFields
    **/
    _count?: true | ExtractedFieldCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExtractedFieldAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExtractedFieldSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExtractedFieldMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExtractedFieldMaxAggregateInputType
  }

  export type GetExtractedFieldAggregateType<T extends ExtractedFieldAggregateArgs> = {
        [P in keyof T & keyof AggregateExtractedField]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExtractedField[P]>
      : GetScalarType<T[P], AggregateExtractedField[P]>
  }




  export type ExtractedFieldGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExtractedFieldWhereInput
    orderBy?: ExtractedFieldOrderByWithAggregationInput | ExtractedFieldOrderByWithAggregationInput[]
    by: ExtractedFieldScalarFieldEnum[] | ExtractedFieldScalarFieldEnum
    having?: ExtractedFieldScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExtractedFieldCountAggregateInputType | true
    _avg?: ExtractedFieldAvgAggregateInputType
    _sum?: ExtractedFieldSumAggregateInputType
    _min?: ExtractedFieldMinAggregateInputType
    _max?: ExtractedFieldMaxAggregateInputType
  }

  export type ExtractedFieldGroupByOutputType = {
    id: string
    documentId: string
    fieldName: string
    value: string
    confidence: number
    type: string | null
    createdAt: Date
    _count: ExtractedFieldCountAggregateOutputType | null
    _avg: ExtractedFieldAvgAggregateOutputType | null
    _sum: ExtractedFieldSumAggregateOutputType | null
    _min: ExtractedFieldMinAggregateOutputType | null
    _max: ExtractedFieldMaxAggregateOutputType | null
  }

  type GetExtractedFieldGroupByPayload<T extends ExtractedFieldGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExtractedFieldGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExtractedFieldGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExtractedFieldGroupByOutputType[P]>
            : GetScalarType<T[P], ExtractedFieldGroupByOutputType[P]>
        }
      >
    >


  export type ExtractedFieldSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    fieldName?: boolean
    value?: boolean
    confidence?: boolean
    type?: boolean
    createdAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["extractedField"]>

  export type ExtractedFieldSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    fieldName?: boolean
    value?: boolean
    confidence?: boolean
    type?: boolean
    createdAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["extractedField"]>

  export type ExtractedFieldSelectScalar = {
    id?: boolean
    documentId?: boolean
    fieldName?: boolean
    value?: boolean
    confidence?: boolean
    type?: boolean
    createdAt?: boolean
  }

  export type ExtractedFieldInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type ExtractedFieldIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }

  export type $ExtractedFieldPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExtractedField"
    objects: {
      document: Prisma.$DocumentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      documentId: string
      fieldName: string
      value: string
      confidence: number
      type: string | null
      createdAt: Date
    }, ExtArgs["result"]["extractedField"]>
    composites: {}
  }

  type ExtractedFieldGetPayload<S extends boolean | null | undefined | ExtractedFieldDefaultArgs> = $Result.GetResult<Prisma.$ExtractedFieldPayload, S>

  type ExtractedFieldCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ExtractedFieldFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ExtractedFieldCountAggregateInputType | true
    }

  export interface ExtractedFieldDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExtractedField'], meta: { name: 'ExtractedField' } }
    /**
     * Find zero or one ExtractedField that matches the filter.
     * @param {ExtractedFieldFindUniqueArgs} args - Arguments to find a ExtractedField
     * @example
     * // Get one ExtractedField
     * const extractedField = await prisma.extractedField.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExtractedFieldFindUniqueArgs>(args: SelectSubset<T, ExtractedFieldFindUniqueArgs<ExtArgs>>): Prisma__ExtractedFieldClient<$Result.GetResult<Prisma.$ExtractedFieldPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ExtractedField that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ExtractedFieldFindUniqueOrThrowArgs} args - Arguments to find a ExtractedField
     * @example
     * // Get one ExtractedField
     * const extractedField = await prisma.extractedField.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExtractedFieldFindUniqueOrThrowArgs>(args: SelectSubset<T, ExtractedFieldFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExtractedFieldClient<$Result.GetResult<Prisma.$ExtractedFieldPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ExtractedField that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedFieldFindFirstArgs} args - Arguments to find a ExtractedField
     * @example
     * // Get one ExtractedField
     * const extractedField = await prisma.extractedField.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExtractedFieldFindFirstArgs>(args?: SelectSubset<T, ExtractedFieldFindFirstArgs<ExtArgs>>): Prisma__ExtractedFieldClient<$Result.GetResult<Prisma.$ExtractedFieldPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ExtractedField that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedFieldFindFirstOrThrowArgs} args - Arguments to find a ExtractedField
     * @example
     * // Get one ExtractedField
     * const extractedField = await prisma.extractedField.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExtractedFieldFindFirstOrThrowArgs>(args?: SelectSubset<T, ExtractedFieldFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExtractedFieldClient<$Result.GetResult<Prisma.$ExtractedFieldPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ExtractedFields that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedFieldFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExtractedFields
     * const extractedFields = await prisma.extractedField.findMany()
     * 
     * // Get first 10 ExtractedFields
     * const extractedFields = await prisma.extractedField.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const extractedFieldWithIdOnly = await prisma.extractedField.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExtractedFieldFindManyArgs>(args?: SelectSubset<T, ExtractedFieldFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtractedFieldPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ExtractedField.
     * @param {ExtractedFieldCreateArgs} args - Arguments to create a ExtractedField.
     * @example
     * // Create one ExtractedField
     * const ExtractedField = await prisma.extractedField.create({
     *   data: {
     *     // ... data to create a ExtractedField
     *   }
     * })
     * 
     */
    create<T extends ExtractedFieldCreateArgs>(args: SelectSubset<T, ExtractedFieldCreateArgs<ExtArgs>>): Prisma__ExtractedFieldClient<$Result.GetResult<Prisma.$ExtractedFieldPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ExtractedFields.
     * @param {ExtractedFieldCreateManyArgs} args - Arguments to create many ExtractedFields.
     * @example
     * // Create many ExtractedFields
     * const extractedField = await prisma.extractedField.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExtractedFieldCreateManyArgs>(args?: SelectSubset<T, ExtractedFieldCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExtractedFields and returns the data saved in the database.
     * @param {ExtractedFieldCreateManyAndReturnArgs} args - Arguments to create many ExtractedFields.
     * @example
     * // Create many ExtractedFields
     * const extractedField = await prisma.extractedField.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExtractedFields and only return the `id`
     * const extractedFieldWithIdOnly = await prisma.extractedField.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExtractedFieldCreateManyAndReturnArgs>(args?: SelectSubset<T, ExtractedFieldCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtractedFieldPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ExtractedField.
     * @param {ExtractedFieldDeleteArgs} args - Arguments to delete one ExtractedField.
     * @example
     * // Delete one ExtractedField
     * const ExtractedField = await prisma.extractedField.delete({
     *   where: {
     *     // ... filter to delete one ExtractedField
     *   }
     * })
     * 
     */
    delete<T extends ExtractedFieldDeleteArgs>(args: SelectSubset<T, ExtractedFieldDeleteArgs<ExtArgs>>): Prisma__ExtractedFieldClient<$Result.GetResult<Prisma.$ExtractedFieldPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ExtractedField.
     * @param {ExtractedFieldUpdateArgs} args - Arguments to update one ExtractedField.
     * @example
     * // Update one ExtractedField
     * const extractedField = await prisma.extractedField.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExtractedFieldUpdateArgs>(args: SelectSubset<T, ExtractedFieldUpdateArgs<ExtArgs>>): Prisma__ExtractedFieldClient<$Result.GetResult<Prisma.$ExtractedFieldPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ExtractedFields.
     * @param {ExtractedFieldDeleteManyArgs} args - Arguments to filter ExtractedFields to delete.
     * @example
     * // Delete a few ExtractedFields
     * const { count } = await prisma.extractedField.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExtractedFieldDeleteManyArgs>(args?: SelectSubset<T, ExtractedFieldDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExtractedFields.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedFieldUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExtractedFields
     * const extractedField = await prisma.extractedField.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExtractedFieldUpdateManyArgs>(args: SelectSubset<T, ExtractedFieldUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ExtractedField.
     * @param {ExtractedFieldUpsertArgs} args - Arguments to update or create a ExtractedField.
     * @example
     * // Update or create a ExtractedField
     * const extractedField = await prisma.extractedField.upsert({
     *   create: {
     *     // ... data to create a ExtractedField
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExtractedField we want to update
     *   }
     * })
     */
    upsert<T extends ExtractedFieldUpsertArgs>(args: SelectSubset<T, ExtractedFieldUpsertArgs<ExtArgs>>): Prisma__ExtractedFieldClient<$Result.GetResult<Prisma.$ExtractedFieldPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ExtractedFields.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedFieldCountArgs} args - Arguments to filter ExtractedFields to count.
     * @example
     * // Count the number of ExtractedFields
     * const count = await prisma.extractedField.count({
     *   where: {
     *     // ... the filter for the ExtractedFields we want to count
     *   }
     * })
    **/
    count<T extends ExtractedFieldCountArgs>(
      args?: Subset<T, ExtractedFieldCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExtractedFieldCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExtractedField.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedFieldAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExtractedFieldAggregateArgs>(args: Subset<T, ExtractedFieldAggregateArgs>): Prisma.PrismaPromise<GetExtractedFieldAggregateType<T>>

    /**
     * Group by ExtractedField.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtractedFieldGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExtractedFieldGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExtractedFieldGroupByArgs['orderBy'] }
        : { orderBy?: ExtractedFieldGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExtractedFieldGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExtractedFieldGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExtractedField model
   */
  readonly fields: ExtractedFieldFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExtractedField.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExtractedFieldClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    document<T extends DocumentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DocumentDefaultArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExtractedField model
   */ 
  interface ExtractedFieldFieldRefs {
    readonly id: FieldRef<"ExtractedField", 'String'>
    readonly documentId: FieldRef<"ExtractedField", 'String'>
    readonly fieldName: FieldRef<"ExtractedField", 'String'>
    readonly value: FieldRef<"ExtractedField", 'String'>
    readonly confidence: FieldRef<"ExtractedField", 'Float'>
    readonly type: FieldRef<"ExtractedField", 'String'>
    readonly createdAt: FieldRef<"ExtractedField", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExtractedField findUnique
   */
  export type ExtractedFieldFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtractedField
     */
    select?: ExtractedFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtractedFieldInclude<ExtArgs> | null
    /**
     * Filter, which ExtractedField to fetch.
     */
    where: ExtractedFieldWhereUniqueInput
  }

  /**
   * ExtractedField findUniqueOrThrow
   */
  export type ExtractedFieldFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtractedField
     */
    select?: ExtractedFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtractedFieldInclude<ExtArgs> | null
    /**
     * Filter, which ExtractedField to fetch.
     */
    where: ExtractedFieldWhereUniqueInput
  }

  /**
   * ExtractedField findFirst
   */
  export type ExtractedFieldFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtractedField
     */
    select?: ExtractedFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtractedFieldInclude<ExtArgs> | null
    /**
     * Filter, which ExtractedField to fetch.
     */
    where?: ExtractedFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtractedFields to fetch.
     */
    orderBy?: ExtractedFieldOrderByWithRelationInput | ExtractedFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExtractedFields.
     */
    cursor?: ExtractedFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtractedFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtractedFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExtractedFields.
     */
    distinct?: ExtractedFieldScalarFieldEnum | ExtractedFieldScalarFieldEnum[]
  }

  /**
   * ExtractedField findFirstOrThrow
   */
  export type ExtractedFieldFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtractedField
     */
    select?: ExtractedFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtractedFieldInclude<ExtArgs> | null
    /**
     * Filter, which ExtractedField to fetch.
     */
    where?: ExtractedFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtractedFields to fetch.
     */
    orderBy?: ExtractedFieldOrderByWithRelationInput | ExtractedFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExtractedFields.
     */
    cursor?: ExtractedFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtractedFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtractedFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExtractedFields.
     */
    distinct?: ExtractedFieldScalarFieldEnum | ExtractedFieldScalarFieldEnum[]
  }

  /**
   * ExtractedField findMany
   */
  export type ExtractedFieldFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtractedField
     */
    select?: ExtractedFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtractedFieldInclude<ExtArgs> | null
    /**
     * Filter, which ExtractedFields to fetch.
     */
    where?: ExtractedFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtractedFields to fetch.
     */
    orderBy?: ExtractedFieldOrderByWithRelationInput | ExtractedFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExtractedFields.
     */
    cursor?: ExtractedFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtractedFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtractedFields.
     */
    skip?: number
    distinct?: ExtractedFieldScalarFieldEnum | ExtractedFieldScalarFieldEnum[]
  }

  /**
   * ExtractedField create
   */
  export type ExtractedFieldCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtractedField
     */
    select?: ExtractedFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtractedFieldInclude<ExtArgs> | null
    /**
     * The data needed to create a ExtractedField.
     */
    data: XOR<ExtractedFieldCreateInput, ExtractedFieldUncheckedCreateInput>
  }

  /**
   * ExtractedField createMany
   */
  export type ExtractedFieldCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExtractedFields.
     */
    data: ExtractedFieldCreateManyInput | ExtractedFieldCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExtractedField createManyAndReturn
   */
  export type ExtractedFieldCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtractedField
     */
    select?: ExtractedFieldSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ExtractedFields.
     */
    data: ExtractedFieldCreateManyInput | ExtractedFieldCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtractedFieldIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExtractedField update
   */
  export type ExtractedFieldUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtractedField
     */
    select?: ExtractedFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtractedFieldInclude<ExtArgs> | null
    /**
     * The data needed to update a ExtractedField.
     */
    data: XOR<ExtractedFieldUpdateInput, ExtractedFieldUncheckedUpdateInput>
    /**
     * Choose, which ExtractedField to update.
     */
    where: ExtractedFieldWhereUniqueInput
  }

  /**
   * ExtractedField updateMany
   */
  export type ExtractedFieldUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExtractedFields.
     */
    data: XOR<ExtractedFieldUpdateManyMutationInput, ExtractedFieldUncheckedUpdateManyInput>
    /**
     * Filter which ExtractedFields to update
     */
    where?: ExtractedFieldWhereInput
  }

  /**
   * ExtractedField upsert
   */
  export type ExtractedFieldUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtractedField
     */
    select?: ExtractedFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtractedFieldInclude<ExtArgs> | null
    /**
     * The filter to search for the ExtractedField to update in case it exists.
     */
    where: ExtractedFieldWhereUniqueInput
    /**
     * In case the ExtractedField found by the `where` argument doesn't exist, create a new ExtractedField with this data.
     */
    create: XOR<ExtractedFieldCreateInput, ExtractedFieldUncheckedCreateInput>
    /**
     * In case the ExtractedField was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExtractedFieldUpdateInput, ExtractedFieldUncheckedUpdateInput>
  }

  /**
   * ExtractedField delete
   */
  export type ExtractedFieldDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtractedField
     */
    select?: ExtractedFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtractedFieldInclude<ExtArgs> | null
    /**
     * Filter which ExtractedField to delete.
     */
    where: ExtractedFieldWhereUniqueInput
  }

  /**
   * ExtractedField deleteMany
   */
  export type ExtractedFieldDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExtractedFields to delete
     */
    where?: ExtractedFieldWhereInput
  }

  /**
   * ExtractedField without action
   */
  export type ExtractedFieldDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtractedField
     */
    select?: ExtractedFieldSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtractedFieldInclude<ExtArgs> | null
  }


  /**
   * Model FormSession
   */

  export type AggregateFormSession = {
    _count: FormSessionCountAggregateOutputType | null
    _min: FormSessionMinAggregateOutputType | null
    _max: FormSessionMaxAggregateOutputType | null
  }

  export type FormSessionMinAggregateOutputType = {
    id: string | null
    accessId: string | null
    documentId: string | null
    formType: $Enums.FormType | null
    ownerName: string | null
    ownerCedula: string | null
    status: $Enums.FormSessionStatus | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FormSessionMaxAggregateOutputType = {
    id: string | null
    accessId: string | null
    documentId: string | null
    formType: $Enums.FormType | null
    ownerName: string | null
    ownerCedula: string | null
    status: $Enums.FormSessionStatus | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FormSessionCountAggregateOutputType = {
    id: number
    accessId: number
    documentId: number
    formType: number
    ownerName: number
    ownerCedula: number
    status: number
    data: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FormSessionMinAggregateInputType = {
    id?: true
    accessId?: true
    documentId?: true
    formType?: true
    ownerName?: true
    ownerCedula?: true
    status?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FormSessionMaxAggregateInputType = {
    id?: true
    accessId?: true
    documentId?: true
    formType?: true
    ownerName?: true
    ownerCedula?: true
    status?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FormSessionCountAggregateInputType = {
    id?: true
    accessId?: true
    documentId?: true
    formType?: true
    ownerName?: true
    ownerCedula?: true
    status?: true
    data?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FormSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FormSession to aggregate.
     */
    where?: FormSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FormSessions to fetch.
     */
    orderBy?: FormSessionOrderByWithRelationInput | FormSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FormSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FormSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FormSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FormSessions
    **/
    _count?: true | FormSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FormSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FormSessionMaxAggregateInputType
  }

  export type GetFormSessionAggregateType<T extends FormSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateFormSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFormSession[P]>
      : GetScalarType<T[P], AggregateFormSession[P]>
  }




  export type FormSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FormSessionWhereInput
    orderBy?: FormSessionOrderByWithAggregationInput | FormSessionOrderByWithAggregationInput[]
    by: FormSessionScalarFieldEnum[] | FormSessionScalarFieldEnum
    having?: FormSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FormSessionCountAggregateInputType | true
    _min?: FormSessionMinAggregateInputType
    _max?: FormSessionMaxAggregateInputType
  }

  export type FormSessionGroupByOutputType = {
    id: string
    accessId: string
    documentId: string
    formType: $Enums.FormType
    ownerName: string | null
    ownerCedula: string | null
    status: $Enums.FormSessionStatus
    data: JsonValue | null
    expiresAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: FormSessionCountAggregateOutputType | null
    _min: FormSessionMinAggregateOutputType | null
    _max: FormSessionMaxAggregateOutputType | null
  }

  type GetFormSessionGroupByPayload<T extends FormSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FormSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FormSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FormSessionGroupByOutputType[P]>
            : GetScalarType<T[P], FormSessionGroupByOutputType[P]>
        }
      >
    >


  export type FormSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accessId?: boolean
    documentId?: boolean
    formType?: boolean
    ownerName?: boolean
    ownerCedula?: boolean
    status?: boolean
    data?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["formSession"]>

  export type FormSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accessId?: boolean
    documentId?: boolean
    formType?: boolean
    ownerName?: boolean
    ownerCedula?: boolean
    status?: boolean
    data?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["formSession"]>

  export type FormSessionSelectScalar = {
    id?: boolean
    accessId?: boolean
    documentId?: boolean
    formType?: boolean
    ownerName?: boolean
    ownerCedula?: boolean
    status?: boolean
    data?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FormSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type FormSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }

  export type $FormSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FormSession"
    objects: {
      document: Prisma.$DocumentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accessId: string
      documentId: string
      formType: $Enums.FormType
      ownerName: string | null
      ownerCedula: string | null
      status: $Enums.FormSessionStatus
      data: Prisma.JsonValue | null
      expiresAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["formSession"]>
    composites: {}
  }

  type FormSessionGetPayload<S extends boolean | null | undefined | FormSessionDefaultArgs> = $Result.GetResult<Prisma.$FormSessionPayload, S>

  type FormSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FormSessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FormSessionCountAggregateInputType | true
    }

  export interface FormSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FormSession'], meta: { name: 'FormSession' } }
    /**
     * Find zero or one FormSession that matches the filter.
     * @param {FormSessionFindUniqueArgs} args - Arguments to find a FormSession
     * @example
     * // Get one FormSession
     * const formSession = await prisma.formSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FormSessionFindUniqueArgs>(args: SelectSubset<T, FormSessionFindUniqueArgs<ExtArgs>>): Prisma__FormSessionClient<$Result.GetResult<Prisma.$FormSessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FormSession that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FormSessionFindUniqueOrThrowArgs} args - Arguments to find a FormSession
     * @example
     * // Get one FormSession
     * const formSession = await prisma.formSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FormSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, FormSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FormSessionClient<$Result.GetResult<Prisma.$FormSessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FormSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormSessionFindFirstArgs} args - Arguments to find a FormSession
     * @example
     * // Get one FormSession
     * const formSession = await prisma.formSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FormSessionFindFirstArgs>(args?: SelectSubset<T, FormSessionFindFirstArgs<ExtArgs>>): Prisma__FormSessionClient<$Result.GetResult<Prisma.$FormSessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FormSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormSessionFindFirstOrThrowArgs} args - Arguments to find a FormSession
     * @example
     * // Get one FormSession
     * const formSession = await prisma.formSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FormSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, FormSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__FormSessionClient<$Result.GetResult<Prisma.$FormSessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FormSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FormSessions
     * const formSessions = await prisma.formSession.findMany()
     * 
     * // Get first 10 FormSessions
     * const formSessions = await prisma.formSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const formSessionWithIdOnly = await prisma.formSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FormSessionFindManyArgs>(args?: SelectSubset<T, FormSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FormSessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FormSession.
     * @param {FormSessionCreateArgs} args - Arguments to create a FormSession.
     * @example
     * // Create one FormSession
     * const FormSession = await prisma.formSession.create({
     *   data: {
     *     // ... data to create a FormSession
     *   }
     * })
     * 
     */
    create<T extends FormSessionCreateArgs>(args: SelectSubset<T, FormSessionCreateArgs<ExtArgs>>): Prisma__FormSessionClient<$Result.GetResult<Prisma.$FormSessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FormSessions.
     * @param {FormSessionCreateManyArgs} args - Arguments to create many FormSessions.
     * @example
     * // Create many FormSessions
     * const formSession = await prisma.formSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FormSessionCreateManyArgs>(args?: SelectSubset<T, FormSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FormSessions and returns the data saved in the database.
     * @param {FormSessionCreateManyAndReturnArgs} args - Arguments to create many FormSessions.
     * @example
     * // Create many FormSessions
     * const formSession = await prisma.formSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FormSessions and only return the `id`
     * const formSessionWithIdOnly = await prisma.formSession.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FormSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, FormSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FormSessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FormSession.
     * @param {FormSessionDeleteArgs} args - Arguments to delete one FormSession.
     * @example
     * // Delete one FormSession
     * const FormSession = await prisma.formSession.delete({
     *   where: {
     *     // ... filter to delete one FormSession
     *   }
     * })
     * 
     */
    delete<T extends FormSessionDeleteArgs>(args: SelectSubset<T, FormSessionDeleteArgs<ExtArgs>>): Prisma__FormSessionClient<$Result.GetResult<Prisma.$FormSessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FormSession.
     * @param {FormSessionUpdateArgs} args - Arguments to update one FormSession.
     * @example
     * // Update one FormSession
     * const formSession = await prisma.formSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FormSessionUpdateArgs>(args: SelectSubset<T, FormSessionUpdateArgs<ExtArgs>>): Prisma__FormSessionClient<$Result.GetResult<Prisma.$FormSessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FormSessions.
     * @param {FormSessionDeleteManyArgs} args - Arguments to filter FormSessions to delete.
     * @example
     * // Delete a few FormSessions
     * const { count } = await prisma.formSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FormSessionDeleteManyArgs>(args?: SelectSubset<T, FormSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FormSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FormSessions
     * const formSession = await prisma.formSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FormSessionUpdateManyArgs>(args: SelectSubset<T, FormSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FormSession.
     * @param {FormSessionUpsertArgs} args - Arguments to update or create a FormSession.
     * @example
     * // Update or create a FormSession
     * const formSession = await prisma.formSession.upsert({
     *   create: {
     *     // ... data to create a FormSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FormSession we want to update
     *   }
     * })
     */
    upsert<T extends FormSessionUpsertArgs>(args: SelectSubset<T, FormSessionUpsertArgs<ExtArgs>>): Prisma__FormSessionClient<$Result.GetResult<Prisma.$FormSessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FormSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormSessionCountArgs} args - Arguments to filter FormSessions to count.
     * @example
     * // Count the number of FormSessions
     * const count = await prisma.formSession.count({
     *   where: {
     *     // ... the filter for the FormSessions we want to count
     *   }
     * })
    **/
    count<T extends FormSessionCountArgs>(
      args?: Subset<T, FormSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FormSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FormSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FormSessionAggregateArgs>(args: Subset<T, FormSessionAggregateArgs>): Prisma.PrismaPromise<GetFormSessionAggregateType<T>>

    /**
     * Group by FormSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FormSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FormSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FormSessionGroupByArgs['orderBy'] }
        : { orderBy?: FormSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FormSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFormSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FormSession model
   */
  readonly fields: FormSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FormSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FormSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    document<T extends DocumentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DocumentDefaultArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FormSession model
   */ 
  interface FormSessionFieldRefs {
    readonly id: FieldRef<"FormSession", 'String'>
    readonly accessId: FieldRef<"FormSession", 'String'>
    readonly documentId: FieldRef<"FormSession", 'String'>
    readonly formType: FieldRef<"FormSession", 'FormType'>
    readonly ownerName: FieldRef<"FormSession", 'String'>
    readonly ownerCedula: FieldRef<"FormSession", 'String'>
    readonly status: FieldRef<"FormSession", 'FormSessionStatus'>
    readonly data: FieldRef<"FormSession", 'Json'>
    readonly expiresAt: FieldRef<"FormSession", 'DateTime'>
    readonly createdAt: FieldRef<"FormSession", 'DateTime'>
    readonly updatedAt: FieldRef<"FormSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FormSession findUnique
   */
  export type FormSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSession
     */
    select?: FormSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSessionInclude<ExtArgs> | null
    /**
     * Filter, which FormSession to fetch.
     */
    where: FormSessionWhereUniqueInput
  }

  /**
   * FormSession findUniqueOrThrow
   */
  export type FormSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSession
     */
    select?: FormSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSessionInclude<ExtArgs> | null
    /**
     * Filter, which FormSession to fetch.
     */
    where: FormSessionWhereUniqueInput
  }

  /**
   * FormSession findFirst
   */
  export type FormSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSession
     */
    select?: FormSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSessionInclude<ExtArgs> | null
    /**
     * Filter, which FormSession to fetch.
     */
    where?: FormSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FormSessions to fetch.
     */
    orderBy?: FormSessionOrderByWithRelationInput | FormSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FormSessions.
     */
    cursor?: FormSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FormSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FormSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FormSessions.
     */
    distinct?: FormSessionScalarFieldEnum | FormSessionScalarFieldEnum[]
  }

  /**
   * FormSession findFirstOrThrow
   */
  export type FormSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSession
     */
    select?: FormSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSessionInclude<ExtArgs> | null
    /**
     * Filter, which FormSession to fetch.
     */
    where?: FormSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FormSessions to fetch.
     */
    orderBy?: FormSessionOrderByWithRelationInput | FormSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FormSessions.
     */
    cursor?: FormSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FormSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FormSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FormSessions.
     */
    distinct?: FormSessionScalarFieldEnum | FormSessionScalarFieldEnum[]
  }

  /**
   * FormSession findMany
   */
  export type FormSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSession
     */
    select?: FormSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSessionInclude<ExtArgs> | null
    /**
     * Filter, which FormSessions to fetch.
     */
    where?: FormSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FormSessions to fetch.
     */
    orderBy?: FormSessionOrderByWithRelationInput | FormSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FormSessions.
     */
    cursor?: FormSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FormSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FormSessions.
     */
    skip?: number
    distinct?: FormSessionScalarFieldEnum | FormSessionScalarFieldEnum[]
  }

  /**
   * FormSession create
   */
  export type FormSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSession
     */
    select?: FormSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a FormSession.
     */
    data: XOR<FormSessionCreateInput, FormSessionUncheckedCreateInput>
  }

  /**
   * FormSession createMany
   */
  export type FormSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FormSessions.
     */
    data: FormSessionCreateManyInput | FormSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FormSession createManyAndReturn
   */
  export type FormSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSession
     */
    select?: FormSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FormSessions.
     */
    data: FormSessionCreateManyInput | FormSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FormSession update
   */
  export type FormSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSession
     */
    select?: FormSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a FormSession.
     */
    data: XOR<FormSessionUpdateInput, FormSessionUncheckedUpdateInput>
    /**
     * Choose, which FormSession to update.
     */
    where: FormSessionWhereUniqueInput
  }

  /**
   * FormSession updateMany
   */
  export type FormSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FormSessions.
     */
    data: XOR<FormSessionUpdateManyMutationInput, FormSessionUncheckedUpdateManyInput>
    /**
     * Filter which FormSessions to update
     */
    where?: FormSessionWhereInput
  }

  /**
   * FormSession upsert
   */
  export type FormSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSession
     */
    select?: FormSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the FormSession to update in case it exists.
     */
    where: FormSessionWhereUniqueInput
    /**
     * In case the FormSession found by the `where` argument doesn't exist, create a new FormSession with this data.
     */
    create: XOR<FormSessionCreateInput, FormSessionUncheckedCreateInput>
    /**
     * In case the FormSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FormSessionUpdateInput, FormSessionUncheckedUpdateInput>
  }

  /**
   * FormSession delete
   */
  export type FormSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSession
     */
    select?: FormSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSessionInclude<ExtArgs> | null
    /**
     * Filter which FormSession to delete.
     */
    where: FormSessionWhereUniqueInput
  }

  /**
   * FormSession deleteMany
   */
  export type FormSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FormSessions to delete
     */
    where?: FormSessionWhereInput
  }

  /**
   * FormSession without action
   */
  export type FormSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FormSession
     */
    select?: FormSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FormSessionInclude<ExtArgs> | null
  }


  /**
   * Model QueueConfig
   */

  export type AggregateQueueConfig = {
    _count: QueueConfigCountAggregateOutputType | null
    _avg: QueueConfigAvgAggregateOutputType | null
    _sum: QueueConfigSumAggregateOutputType | null
    _min: QueueConfigMinAggregateOutputType | null
    _max: QueueConfigMaxAggregateOutputType | null
  }

  export type QueueConfigAvgAggregateOutputType = {
    maxConcurrentSessions: number | null
    sessionTimeoutMinutes: number | null
    readyTimeoutMinutes: number | null
    estimatedTimePerTramite: number | null
  }

  export type QueueConfigSumAggregateOutputType = {
    maxConcurrentSessions: number | null
    sessionTimeoutMinutes: number | null
    readyTimeoutMinutes: number | null
    estimatedTimePerTramite: number | null
  }

  export type QueueConfigMinAggregateOutputType = {
    notariaId: string | null
    maxConcurrentSessions: number | null
    sessionTimeoutMinutes: number | null
    readyTimeoutMinutes: number | null
    estimatedTimePerTramite: number | null
    enablePriorities: boolean | null
    autoExpireInactive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QueueConfigMaxAggregateOutputType = {
    notariaId: string | null
    maxConcurrentSessions: number | null
    sessionTimeoutMinutes: number | null
    readyTimeoutMinutes: number | null
    estimatedTimePerTramite: number | null
    enablePriorities: boolean | null
    autoExpireInactive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QueueConfigCountAggregateOutputType = {
    notariaId: number
    maxConcurrentSessions: number
    sessionTimeoutMinutes: number
    readyTimeoutMinutes: number
    estimatedTimePerTramite: number
    enablePriorities: number
    autoExpireInactive: number
    notificationSettings: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type QueueConfigAvgAggregateInputType = {
    maxConcurrentSessions?: true
    sessionTimeoutMinutes?: true
    readyTimeoutMinutes?: true
    estimatedTimePerTramite?: true
  }

  export type QueueConfigSumAggregateInputType = {
    maxConcurrentSessions?: true
    sessionTimeoutMinutes?: true
    readyTimeoutMinutes?: true
    estimatedTimePerTramite?: true
  }

  export type QueueConfigMinAggregateInputType = {
    notariaId?: true
    maxConcurrentSessions?: true
    sessionTimeoutMinutes?: true
    readyTimeoutMinutes?: true
    estimatedTimePerTramite?: true
    enablePriorities?: true
    autoExpireInactive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QueueConfigMaxAggregateInputType = {
    notariaId?: true
    maxConcurrentSessions?: true
    sessionTimeoutMinutes?: true
    readyTimeoutMinutes?: true
    estimatedTimePerTramite?: true
    enablePriorities?: true
    autoExpireInactive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QueueConfigCountAggregateInputType = {
    notariaId?: true
    maxConcurrentSessions?: true
    sessionTimeoutMinutes?: true
    readyTimeoutMinutes?: true
    estimatedTimePerTramite?: true
    enablePriorities?: true
    autoExpireInactive?: true
    notificationSettings?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type QueueConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QueueConfig to aggregate.
     */
    where?: QueueConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QueueConfigs to fetch.
     */
    orderBy?: QueueConfigOrderByWithRelationInput | QueueConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QueueConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QueueConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QueueConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QueueConfigs
    **/
    _count?: true | QueueConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QueueConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QueueConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QueueConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QueueConfigMaxAggregateInputType
  }

  export type GetQueueConfigAggregateType<T extends QueueConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateQueueConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQueueConfig[P]>
      : GetScalarType<T[P], AggregateQueueConfig[P]>
  }




  export type QueueConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QueueConfigWhereInput
    orderBy?: QueueConfigOrderByWithAggregationInput | QueueConfigOrderByWithAggregationInput[]
    by: QueueConfigScalarFieldEnum[] | QueueConfigScalarFieldEnum
    having?: QueueConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QueueConfigCountAggregateInputType | true
    _avg?: QueueConfigAvgAggregateInputType
    _sum?: QueueConfigSumAggregateInputType
    _min?: QueueConfigMinAggregateInputType
    _max?: QueueConfigMaxAggregateInputType
  }

  export type QueueConfigGroupByOutputType = {
    notariaId: string
    maxConcurrentSessions: number
    sessionTimeoutMinutes: number
    readyTimeoutMinutes: number
    estimatedTimePerTramite: number
    enablePriorities: boolean
    autoExpireInactive: boolean
    notificationSettings: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: QueueConfigCountAggregateOutputType | null
    _avg: QueueConfigAvgAggregateOutputType | null
    _sum: QueueConfigSumAggregateOutputType | null
    _min: QueueConfigMinAggregateOutputType | null
    _max: QueueConfigMaxAggregateOutputType | null
  }

  type GetQueueConfigGroupByPayload<T extends QueueConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QueueConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QueueConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QueueConfigGroupByOutputType[P]>
            : GetScalarType<T[P], QueueConfigGroupByOutputType[P]>
        }
      >
    >


  export type QueueConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    notariaId?: boolean
    maxConcurrentSessions?: boolean
    sessionTimeoutMinutes?: boolean
    readyTimeoutMinutes?: boolean
    estimatedTimePerTramite?: boolean
    enablePriorities?: boolean
    autoExpireInactive?: boolean
    notificationSettings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["queueConfig"]>

  export type QueueConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    notariaId?: boolean
    maxConcurrentSessions?: boolean
    sessionTimeoutMinutes?: boolean
    readyTimeoutMinutes?: boolean
    estimatedTimePerTramite?: boolean
    enablePriorities?: boolean
    autoExpireInactive?: boolean
    notificationSettings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["queueConfig"]>

  export type QueueConfigSelectScalar = {
    notariaId?: boolean
    maxConcurrentSessions?: boolean
    sessionTimeoutMinutes?: boolean
    readyTimeoutMinutes?: boolean
    estimatedTimePerTramite?: boolean
    enablePriorities?: boolean
    autoExpireInactive?: boolean
    notificationSettings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $QueueConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QueueConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      notariaId: string
      maxConcurrentSessions: number
      sessionTimeoutMinutes: number
      readyTimeoutMinutes: number
      estimatedTimePerTramite: number
      enablePriorities: boolean
      autoExpireInactive: boolean
      notificationSettings: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["queueConfig"]>
    composites: {}
  }

  type QueueConfigGetPayload<S extends boolean | null | undefined | QueueConfigDefaultArgs> = $Result.GetResult<Prisma.$QueueConfigPayload, S>

  type QueueConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<QueueConfigFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: QueueConfigCountAggregateInputType | true
    }

  export interface QueueConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QueueConfig'], meta: { name: 'QueueConfig' } }
    /**
     * Find zero or one QueueConfig that matches the filter.
     * @param {QueueConfigFindUniqueArgs} args - Arguments to find a QueueConfig
     * @example
     * // Get one QueueConfig
     * const queueConfig = await prisma.queueConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QueueConfigFindUniqueArgs>(args: SelectSubset<T, QueueConfigFindUniqueArgs<ExtArgs>>): Prisma__QueueConfigClient<$Result.GetResult<Prisma.$QueueConfigPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one QueueConfig that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {QueueConfigFindUniqueOrThrowArgs} args - Arguments to find a QueueConfig
     * @example
     * // Get one QueueConfig
     * const queueConfig = await prisma.queueConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QueueConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, QueueConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QueueConfigClient<$Result.GetResult<Prisma.$QueueConfigPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first QueueConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueConfigFindFirstArgs} args - Arguments to find a QueueConfig
     * @example
     * // Get one QueueConfig
     * const queueConfig = await prisma.queueConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QueueConfigFindFirstArgs>(args?: SelectSubset<T, QueueConfigFindFirstArgs<ExtArgs>>): Prisma__QueueConfigClient<$Result.GetResult<Prisma.$QueueConfigPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first QueueConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueConfigFindFirstOrThrowArgs} args - Arguments to find a QueueConfig
     * @example
     * // Get one QueueConfig
     * const queueConfig = await prisma.queueConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QueueConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, QueueConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__QueueConfigClient<$Result.GetResult<Prisma.$QueueConfigPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more QueueConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QueueConfigs
     * const queueConfigs = await prisma.queueConfig.findMany()
     * 
     * // Get first 10 QueueConfigs
     * const queueConfigs = await prisma.queueConfig.findMany({ take: 10 })
     * 
     * // Only select the `notariaId`
     * const queueConfigWithNotariaIdOnly = await prisma.queueConfig.findMany({ select: { notariaId: true } })
     * 
     */
    findMany<T extends QueueConfigFindManyArgs>(args?: SelectSubset<T, QueueConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QueueConfigPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a QueueConfig.
     * @param {QueueConfigCreateArgs} args - Arguments to create a QueueConfig.
     * @example
     * // Create one QueueConfig
     * const QueueConfig = await prisma.queueConfig.create({
     *   data: {
     *     // ... data to create a QueueConfig
     *   }
     * })
     * 
     */
    create<T extends QueueConfigCreateArgs>(args: SelectSubset<T, QueueConfigCreateArgs<ExtArgs>>): Prisma__QueueConfigClient<$Result.GetResult<Prisma.$QueueConfigPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many QueueConfigs.
     * @param {QueueConfigCreateManyArgs} args - Arguments to create many QueueConfigs.
     * @example
     * // Create many QueueConfigs
     * const queueConfig = await prisma.queueConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QueueConfigCreateManyArgs>(args?: SelectSubset<T, QueueConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QueueConfigs and returns the data saved in the database.
     * @param {QueueConfigCreateManyAndReturnArgs} args - Arguments to create many QueueConfigs.
     * @example
     * // Create many QueueConfigs
     * const queueConfig = await prisma.queueConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QueueConfigs and only return the `notariaId`
     * const queueConfigWithNotariaIdOnly = await prisma.queueConfig.createManyAndReturn({ 
     *   select: { notariaId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QueueConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, QueueConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QueueConfigPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a QueueConfig.
     * @param {QueueConfigDeleteArgs} args - Arguments to delete one QueueConfig.
     * @example
     * // Delete one QueueConfig
     * const QueueConfig = await prisma.queueConfig.delete({
     *   where: {
     *     // ... filter to delete one QueueConfig
     *   }
     * })
     * 
     */
    delete<T extends QueueConfigDeleteArgs>(args: SelectSubset<T, QueueConfigDeleteArgs<ExtArgs>>): Prisma__QueueConfigClient<$Result.GetResult<Prisma.$QueueConfigPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one QueueConfig.
     * @param {QueueConfigUpdateArgs} args - Arguments to update one QueueConfig.
     * @example
     * // Update one QueueConfig
     * const queueConfig = await prisma.queueConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QueueConfigUpdateArgs>(args: SelectSubset<T, QueueConfigUpdateArgs<ExtArgs>>): Prisma__QueueConfigClient<$Result.GetResult<Prisma.$QueueConfigPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more QueueConfigs.
     * @param {QueueConfigDeleteManyArgs} args - Arguments to filter QueueConfigs to delete.
     * @example
     * // Delete a few QueueConfigs
     * const { count } = await prisma.queueConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QueueConfigDeleteManyArgs>(args?: SelectSubset<T, QueueConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QueueConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QueueConfigs
     * const queueConfig = await prisma.queueConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QueueConfigUpdateManyArgs>(args: SelectSubset<T, QueueConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one QueueConfig.
     * @param {QueueConfigUpsertArgs} args - Arguments to update or create a QueueConfig.
     * @example
     * // Update or create a QueueConfig
     * const queueConfig = await prisma.queueConfig.upsert({
     *   create: {
     *     // ... data to create a QueueConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QueueConfig we want to update
     *   }
     * })
     */
    upsert<T extends QueueConfigUpsertArgs>(args: SelectSubset<T, QueueConfigUpsertArgs<ExtArgs>>): Prisma__QueueConfigClient<$Result.GetResult<Prisma.$QueueConfigPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of QueueConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueConfigCountArgs} args - Arguments to filter QueueConfigs to count.
     * @example
     * // Count the number of QueueConfigs
     * const count = await prisma.queueConfig.count({
     *   where: {
     *     // ... the filter for the QueueConfigs we want to count
     *   }
     * })
    **/
    count<T extends QueueConfigCountArgs>(
      args?: Subset<T, QueueConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QueueConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QueueConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QueueConfigAggregateArgs>(args: Subset<T, QueueConfigAggregateArgs>): Prisma.PrismaPromise<GetQueueConfigAggregateType<T>>

    /**
     * Group by QueueConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QueueConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QueueConfigGroupByArgs['orderBy'] }
        : { orderBy?: QueueConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QueueConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQueueConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QueueConfig model
   */
  readonly fields: QueueConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QueueConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QueueConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the QueueConfig model
   */ 
  interface QueueConfigFieldRefs {
    readonly notariaId: FieldRef<"QueueConfig", 'String'>
    readonly maxConcurrentSessions: FieldRef<"QueueConfig", 'Int'>
    readonly sessionTimeoutMinutes: FieldRef<"QueueConfig", 'Int'>
    readonly readyTimeoutMinutes: FieldRef<"QueueConfig", 'Int'>
    readonly estimatedTimePerTramite: FieldRef<"QueueConfig", 'Int'>
    readonly enablePriorities: FieldRef<"QueueConfig", 'Boolean'>
    readonly autoExpireInactive: FieldRef<"QueueConfig", 'Boolean'>
    readonly notificationSettings: FieldRef<"QueueConfig", 'Json'>
    readonly createdAt: FieldRef<"QueueConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"QueueConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QueueConfig findUnique
   */
  export type QueueConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueConfig
     */
    select?: QueueConfigSelect<ExtArgs> | null
    /**
     * Filter, which QueueConfig to fetch.
     */
    where: QueueConfigWhereUniqueInput
  }

  /**
   * QueueConfig findUniqueOrThrow
   */
  export type QueueConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueConfig
     */
    select?: QueueConfigSelect<ExtArgs> | null
    /**
     * Filter, which QueueConfig to fetch.
     */
    where: QueueConfigWhereUniqueInput
  }

  /**
   * QueueConfig findFirst
   */
  export type QueueConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueConfig
     */
    select?: QueueConfigSelect<ExtArgs> | null
    /**
     * Filter, which QueueConfig to fetch.
     */
    where?: QueueConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QueueConfigs to fetch.
     */
    orderBy?: QueueConfigOrderByWithRelationInput | QueueConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QueueConfigs.
     */
    cursor?: QueueConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QueueConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QueueConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QueueConfigs.
     */
    distinct?: QueueConfigScalarFieldEnum | QueueConfigScalarFieldEnum[]
  }

  /**
   * QueueConfig findFirstOrThrow
   */
  export type QueueConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueConfig
     */
    select?: QueueConfigSelect<ExtArgs> | null
    /**
     * Filter, which QueueConfig to fetch.
     */
    where?: QueueConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QueueConfigs to fetch.
     */
    orderBy?: QueueConfigOrderByWithRelationInput | QueueConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QueueConfigs.
     */
    cursor?: QueueConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QueueConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QueueConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QueueConfigs.
     */
    distinct?: QueueConfigScalarFieldEnum | QueueConfigScalarFieldEnum[]
  }

  /**
   * QueueConfig findMany
   */
  export type QueueConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueConfig
     */
    select?: QueueConfigSelect<ExtArgs> | null
    /**
     * Filter, which QueueConfigs to fetch.
     */
    where?: QueueConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QueueConfigs to fetch.
     */
    orderBy?: QueueConfigOrderByWithRelationInput | QueueConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QueueConfigs.
     */
    cursor?: QueueConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QueueConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QueueConfigs.
     */
    skip?: number
    distinct?: QueueConfigScalarFieldEnum | QueueConfigScalarFieldEnum[]
  }

  /**
   * QueueConfig create
   */
  export type QueueConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueConfig
     */
    select?: QueueConfigSelect<ExtArgs> | null
    /**
     * The data needed to create a QueueConfig.
     */
    data: XOR<QueueConfigCreateInput, QueueConfigUncheckedCreateInput>
  }

  /**
   * QueueConfig createMany
   */
  export type QueueConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QueueConfigs.
     */
    data: QueueConfigCreateManyInput | QueueConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QueueConfig createManyAndReturn
   */
  export type QueueConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueConfig
     */
    select?: QueueConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many QueueConfigs.
     */
    data: QueueConfigCreateManyInput | QueueConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QueueConfig update
   */
  export type QueueConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueConfig
     */
    select?: QueueConfigSelect<ExtArgs> | null
    /**
     * The data needed to update a QueueConfig.
     */
    data: XOR<QueueConfigUpdateInput, QueueConfigUncheckedUpdateInput>
    /**
     * Choose, which QueueConfig to update.
     */
    where: QueueConfigWhereUniqueInput
  }

  /**
   * QueueConfig updateMany
   */
  export type QueueConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QueueConfigs.
     */
    data: XOR<QueueConfigUpdateManyMutationInput, QueueConfigUncheckedUpdateManyInput>
    /**
     * Filter which QueueConfigs to update
     */
    where?: QueueConfigWhereInput
  }

  /**
   * QueueConfig upsert
   */
  export type QueueConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueConfig
     */
    select?: QueueConfigSelect<ExtArgs> | null
    /**
     * The filter to search for the QueueConfig to update in case it exists.
     */
    where: QueueConfigWhereUniqueInput
    /**
     * In case the QueueConfig found by the `where` argument doesn't exist, create a new QueueConfig with this data.
     */
    create: XOR<QueueConfigCreateInput, QueueConfigUncheckedCreateInput>
    /**
     * In case the QueueConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QueueConfigUpdateInput, QueueConfigUncheckedUpdateInput>
  }

  /**
   * QueueConfig delete
   */
  export type QueueConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueConfig
     */
    select?: QueueConfigSelect<ExtArgs> | null
    /**
     * Filter which QueueConfig to delete.
     */
    where: QueueConfigWhereUniqueInput
  }

  /**
   * QueueConfig deleteMany
   */
  export type QueueConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QueueConfigs to delete
     */
    where?: QueueConfigWhereInput
  }

  /**
   * QueueConfig without action
   */
  export type QueueConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueConfig
     */
    select?: QueueConfigSelect<ExtArgs> | null
  }


  /**
   * Model EventLog
   */

  export type AggregateEventLog = {
    _count: EventLogCountAggregateOutputType | null
    _min: EventLogMinAggregateOutputType | null
    _max: EventLogMaxAggregateOutputType | null
  }

  export type EventLogMinAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    event: string | null
    notariaId: string | null
    sessionId: string | null
    socketId: string | null
    userId: string | null
  }

  export type EventLogMaxAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    event: string | null
    notariaId: string | null
    sessionId: string | null
    socketId: string | null
    userId: string | null
  }

  export type EventLogCountAggregateOutputType = {
    id: number
    timestamp: number
    event: number
    notariaId: number
    sessionId: number
    socketId: number
    userId: number
    data: number
    metadata: number
    _all: number
  }


  export type EventLogMinAggregateInputType = {
    id?: true
    timestamp?: true
    event?: true
    notariaId?: true
    sessionId?: true
    socketId?: true
    userId?: true
  }

  export type EventLogMaxAggregateInputType = {
    id?: true
    timestamp?: true
    event?: true
    notariaId?: true
    sessionId?: true
    socketId?: true
    userId?: true
  }

  export type EventLogCountAggregateInputType = {
    id?: true
    timestamp?: true
    event?: true
    notariaId?: true
    sessionId?: true
    socketId?: true
    userId?: true
    data?: true
    metadata?: true
    _all?: true
  }

  export type EventLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventLog to aggregate.
     */
    where?: EventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLogs to fetch.
     */
    orderBy?: EventLogOrderByWithRelationInput | EventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventLogs
    **/
    _count?: true | EventLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventLogMaxAggregateInputType
  }

  export type GetEventLogAggregateType<T extends EventLogAggregateArgs> = {
        [P in keyof T & keyof AggregateEventLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventLog[P]>
      : GetScalarType<T[P], AggregateEventLog[P]>
  }




  export type EventLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventLogWhereInput
    orderBy?: EventLogOrderByWithAggregationInput | EventLogOrderByWithAggregationInput[]
    by: EventLogScalarFieldEnum[] | EventLogScalarFieldEnum
    having?: EventLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventLogCountAggregateInputType | true
    _min?: EventLogMinAggregateInputType
    _max?: EventLogMaxAggregateInputType
  }

  export type EventLogGroupByOutputType = {
    id: string
    timestamp: Date
    event: string
    notariaId: string
    sessionId: string | null
    socketId: string | null
    userId: string | null
    data: JsonValue | null
    metadata: JsonValue | null
    _count: EventLogCountAggregateOutputType | null
    _min: EventLogMinAggregateOutputType | null
    _max: EventLogMaxAggregateOutputType | null
  }

  type GetEventLogGroupByPayload<T extends EventLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventLogGroupByOutputType[P]>
            : GetScalarType<T[P], EventLogGroupByOutputType[P]>
        }
      >
    >


  export type EventLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    event?: boolean
    notariaId?: boolean
    sessionId?: boolean
    socketId?: boolean
    userId?: boolean
    data?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["eventLog"]>

  export type EventLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    event?: boolean
    notariaId?: boolean
    sessionId?: boolean
    socketId?: boolean
    userId?: boolean
    data?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["eventLog"]>

  export type EventLogSelectScalar = {
    id?: boolean
    timestamp?: boolean
    event?: boolean
    notariaId?: boolean
    sessionId?: boolean
    socketId?: boolean
    userId?: boolean
    data?: boolean
    metadata?: boolean
  }


  export type $EventLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EventLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timestamp: Date
      event: string
      notariaId: string
      sessionId: string | null
      socketId: string | null
      userId: string | null
      data: Prisma.JsonValue | null
      metadata: Prisma.JsonValue | null
    }, ExtArgs["result"]["eventLog"]>
    composites: {}
  }

  type EventLogGetPayload<S extends boolean | null | undefined | EventLogDefaultArgs> = $Result.GetResult<Prisma.$EventLogPayload, S>

  type EventLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EventLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EventLogCountAggregateInputType | true
    }

  export interface EventLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventLog'], meta: { name: 'EventLog' } }
    /**
     * Find zero or one EventLog that matches the filter.
     * @param {EventLogFindUniqueArgs} args - Arguments to find a EventLog
     * @example
     * // Get one EventLog
     * const eventLog = await prisma.eventLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventLogFindUniqueArgs>(args: SelectSubset<T, EventLogFindUniqueArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EventLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EventLogFindUniqueOrThrowArgs} args - Arguments to find a EventLog
     * @example
     * // Get one EventLog
     * const eventLog = await prisma.eventLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventLogFindUniqueOrThrowArgs>(args: SelectSubset<T, EventLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EventLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogFindFirstArgs} args - Arguments to find a EventLog
     * @example
     * // Get one EventLog
     * const eventLog = await prisma.eventLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventLogFindFirstArgs>(args?: SelectSubset<T, EventLogFindFirstArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EventLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogFindFirstOrThrowArgs} args - Arguments to find a EventLog
     * @example
     * // Get one EventLog
     * const eventLog = await prisma.eventLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventLogFindFirstOrThrowArgs>(args?: SelectSubset<T, EventLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EventLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventLogs
     * const eventLogs = await prisma.eventLog.findMany()
     * 
     * // Get first 10 EventLogs
     * const eventLogs = await prisma.eventLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventLogWithIdOnly = await prisma.eventLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventLogFindManyArgs>(args?: SelectSubset<T, EventLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EventLog.
     * @param {EventLogCreateArgs} args - Arguments to create a EventLog.
     * @example
     * // Create one EventLog
     * const EventLog = await prisma.eventLog.create({
     *   data: {
     *     // ... data to create a EventLog
     *   }
     * })
     * 
     */
    create<T extends EventLogCreateArgs>(args: SelectSubset<T, EventLogCreateArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EventLogs.
     * @param {EventLogCreateManyArgs} args - Arguments to create many EventLogs.
     * @example
     * // Create many EventLogs
     * const eventLog = await prisma.eventLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventLogCreateManyArgs>(args?: SelectSubset<T, EventLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventLogs and returns the data saved in the database.
     * @param {EventLogCreateManyAndReturnArgs} args - Arguments to create many EventLogs.
     * @example
     * // Create many EventLogs
     * const eventLog = await prisma.eventLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventLogs and only return the `id`
     * const eventLogWithIdOnly = await prisma.eventLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventLogCreateManyAndReturnArgs>(args?: SelectSubset<T, EventLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EventLog.
     * @param {EventLogDeleteArgs} args - Arguments to delete one EventLog.
     * @example
     * // Delete one EventLog
     * const EventLog = await prisma.eventLog.delete({
     *   where: {
     *     // ... filter to delete one EventLog
     *   }
     * })
     * 
     */
    delete<T extends EventLogDeleteArgs>(args: SelectSubset<T, EventLogDeleteArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EventLog.
     * @param {EventLogUpdateArgs} args - Arguments to update one EventLog.
     * @example
     * // Update one EventLog
     * const eventLog = await prisma.eventLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventLogUpdateArgs>(args: SelectSubset<T, EventLogUpdateArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EventLogs.
     * @param {EventLogDeleteManyArgs} args - Arguments to filter EventLogs to delete.
     * @example
     * // Delete a few EventLogs
     * const { count } = await prisma.eventLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventLogDeleteManyArgs>(args?: SelectSubset<T, EventLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventLogs
     * const eventLog = await prisma.eventLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventLogUpdateManyArgs>(args: SelectSubset<T, EventLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EventLog.
     * @param {EventLogUpsertArgs} args - Arguments to update or create a EventLog.
     * @example
     * // Update or create a EventLog
     * const eventLog = await prisma.eventLog.upsert({
     *   create: {
     *     // ... data to create a EventLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventLog we want to update
     *   }
     * })
     */
    upsert<T extends EventLogUpsertArgs>(args: SelectSubset<T, EventLogUpsertArgs<ExtArgs>>): Prisma__EventLogClient<$Result.GetResult<Prisma.$EventLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EventLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogCountArgs} args - Arguments to filter EventLogs to count.
     * @example
     * // Count the number of EventLogs
     * const count = await prisma.eventLog.count({
     *   where: {
     *     // ... the filter for the EventLogs we want to count
     *   }
     * })
    **/
    count<T extends EventLogCountArgs>(
      args?: Subset<T, EventLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventLogAggregateArgs>(args: Subset<T, EventLogAggregateArgs>): Prisma.PrismaPromise<GetEventLogAggregateType<T>>

    /**
     * Group by EventLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventLogGroupByArgs['orderBy'] }
        : { orderBy?: EventLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EventLog model
   */
  readonly fields: EventLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EventLog model
   */ 
  interface EventLogFieldRefs {
    readonly id: FieldRef<"EventLog", 'String'>
    readonly timestamp: FieldRef<"EventLog", 'DateTime'>
    readonly event: FieldRef<"EventLog", 'String'>
    readonly notariaId: FieldRef<"EventLog", 'String'>
    readonly sessionId: FieldRef<"EventLog", 'String'>
    readonly socketId: FieldRef<"EventLog", 'String'>
    readonly userId: FieldRef<"EventLog", 'String'>
    readonly data: FieldRef<"EventLog", 'Json'>
    readonly metadata: FieldRef<"EventLog", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * EventLog findUnique
   */
  export type EventLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Filter, which EventLog to fetch.
     */
    where: EventLogWhereUniqueInput
  }

  /**
   * EventLog findUniqueOrThrow
   */
  export type EventLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Filter, which EventLog to fetch.
     */
    where: EventLogWhereUniqueInput
  }

  /**
   * EventLog findFirst
   */
  export type EventLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Filter, which EventLog to fetch.
     */
    where?: EventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLogs to fetch.
     */
    orderBy?: EventLogOrderByWithRelationInput | EventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventLogs.
     */
    cursor?: EventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventLogs.
     */
    distinct?: EventLogScalarFieldEnum | EventLogScalarFieldEnum[]
  }

  /**
   * EventLog findFirstOrThrow
   */
  export type EventLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Filter, which EventLog to fetch.
     */
    where?: EventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLogs to fetch.
     */
    orderBy?: EventLogOrderByWithRelationInput | EventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventLogs.
     */
    cursor?: EventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventLogs.
     */
    distinct?: EventLogScalarFieldEnum | EventLogScalarFieldEnum[]
  }

  /**
   * EventLog findMany
   */
  export type EventLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Filter, which EventLogs to fetch.
     */
    where?: EventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventLogs to fetch.
     */
    orderBy?: EventLogOrderByWithRelationInput | EventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventLogs.
     */
    cursor?: EventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventLogs.
     */
    skip?: number
    distinct?: EventLogScalarFieldEnum | EventLogScalarFieldEnum[]
  }

  /**
   * EventLog create
   */
  export type EventLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * The data needed to create a EventLog.
     */
    data: XOR<EventLogCreateInput, EventLogUncheckedCreateInput>
  }

  /**
   * EventLog createMany
   */
  export type EventLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventLogs.
     */
    data: EventLogCreateManyInput | EventLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventLog createManyAndReturn
   */
  export type EventLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EventLogs.
     */
    data: EventLogCreateManyInput | EventLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventLog update
   */
  export type EventLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * The data needed to update a EventLog.
     */
    data: XOR<EventLogUpdateInput, EventLogUncheckedUpdateInput>
    /**
     * Choose, which EventLog to update.
     */
    where: EventLogWhereUniqueInput
  }

  /**
   * EventLog updateMany
   */
  export type EventLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventLogs.
     */
    data: XOR<EventLogUpdateManyMutationInput, EventLogUncheckedUpdateManyInput>
    /**
     * Filter which EventLogs to update
     */
    where?: EventLogWhereInput
  }

  /**
   * EventLog upsert
   */
  export type EventLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * The filter to search for the EventLog to update in case it exists.
     */
    where: EventLogWhereUniqueInput
    /**
     * In case the EventLog found by the `where` argument doesn't exist, create a new EventLog with this data.
     */
    create: XOR<EventLogCreateInput, EventLogUncheckedCreateInput>
    /**
     * In case the EventLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventLogUpdateInput, EventLogUncheckedUpdateInput>
  }

  /**
   * EventLog delete
   */
  export type EventLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
    /**
     * Filter which EventLog to delete.
     */
    where: EventLogWhereUniqueInput
  }

  /**
   * EventLog deleteMany
   */
  export type EventLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventLogs to delete
     */
    where?: EventLogWhereInput
  }

  /**
   * EventLog without action
   */
  export type EventLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventLog
     */
    select?: EventLogSelect<ExtArgs> | null
  }


  /**
   * Model GlobalConfig
   */

  export type AggregateGlobalConfig = {
    _count: GlobalConfigCountAggregateOutputType | null
    _min: GlobalConfigMinAggregateOutputType | null
    _max: GlobalConfigMaxAggregateOutputType | null
  }

  export type GlobalConfigMinAggregateOutputType = {
    id: string | null
    updatedAt: Date | null
  }

  export type GlobalConfigMaxAggregateOutputType = {
    id: string | null
    updatedAt: Date | null
  }

  export type GlobalConfigCountAggregateOutputType = {
    id: number
    config: number
    updatedAt: number
    _all: number
  }


  export type GlobalConfigMinAggregateInputType = {
    id?: true
    updatedAt?: true
  }

  export type GlobalConfigMaxAggregateInputType = {
    id?: true
    updatedAt?: true
  }

  export type GlobalConfigCountAggregateInputType = {
    id?: true
    config?: true
    updatedAt?: true
    _all?: true
  }

  export type GlobalConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GlobalConfig to aggregate.
     */
    where?: GlobalConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalConfigs to fetch.
     */
    orderBy?: GlobalConfigOrderByWithRelationInput | GlobalConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GlobalConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GlobalConfigs
    **/
    _count?: true | GlobalConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GlobalConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GlobalConfigMaxAggregateInputType
  }

  export type GetGlobalConfigAggregateType<T extends GlobalConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateGlobalConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGlobalConfig[P]>
      : GetScalarType<T[P], AggregateGlobalConfig[P]>
  }




  export type GlobalConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GlobalConfigWhereInput
    orderBy?: GlobalConfigOrderByWithAggregationInput | GlobalConfigOrderByWithAggregationInput[]
    by: GlobalConfigScalarFieldEnum[] | GlobalConfigScalarFieldEnum
    having?: GlobalConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GlobalConfigCountAggregateInputType | true
    _min?: GlobalConfigMinAggregateInputType
    _max?: GlobalConfigMaxAggregateInputType
  }

  export type GlobalConfigGroupByOutputType = {
    id: string
    config: JsonValue
    updatedAt: Date
    _count: GlobalConfigCountAggregateOutputType | null
    _min: GlobalConfigMinAggregateOutputType | null
    _max: GlobalConfigMaxAggregateOutputType | null
  }

  type GetGlobalConfigGroupByPayload<T extends GlobalConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GlobalConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GlobalConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GlobalConfigGroupByOutputType[P]>
            : GetScalarType<T[P], GlobalConfigGroupByOutputType[P]>
        }
      >
    >


  export type GlobalConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    config?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["globalConfig"]>

  export type GlobalConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    config?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["globalConfig"]>

  export type GlobalConfigSelectScalar = {
    id?: boolean
    config?: boolean
    updatedAt?: boolean
  }


  export type $GlobalConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GlobalConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      config: Prisma.JsonValue
      updatedAt: Date
    }, ExtArgs["result"]["globalConfig"]>
    composites: {}
  }

  type GlobalConfigGetPayload<S extends boolean | null | undefined | GlobalConfigDefaultArgs> = $Result.GetResult<Prisma.$GlobalConfigPayload, S>

  type GlobalConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GlobalConfigFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GlobalConfigCountAggregateInputType | true
    }

  export interface GlobalConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GlobalConfig'], meta: { name: 'GlobalConfig' } }
    /**
     * Find zero or one GlobalConfig that matches the filter.
     * @param {GlobalConfigFindUniqueArgs} args - Arguments to find a GlobalConfig
     * @example
     * // Get one GlobalConfig
     * const globalConfig = await prisma.globalConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GlobalConfigFindUniqueArgs>(args: SelectSubset<T, GlobalConfigFindUniqueArgs<ExtArgs>>): Prisma__GlobalConfigClient<$Result.GetResult<Prisma.$GlobalConfigPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GlobalConfig that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GlobalConfigFindUniqueOrThrowArgs} args - Arguments to find a GlobalConfig
     * @example
     * // Get one GlobalConfig
     * const globalConfig = await prisma.globalConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GlobalConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, GlobalConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GlobalConfigClient<$Result.GetResult<Prisma.$GlobalConfigPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GlobalConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalConfigFindFirstArgs} args - Arguments to find a GlobalConfig
     * @example
     * // Get one GlobalConfig
     * const globalConfig = await prisma.globalConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GlobalConfigFindFirstArgs>(args?: SelectSubset<T, GlobalConfigFindFirstArgs<ExtArgs>>): Prisma__GlobalConfigClient<$Result.GetResult<Prisma.$GlobalConfigPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GlobalConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalConfigFindFirstOrThrowArgs} args - Arguments to find a GlobalConfig
     * @example
     * // Get one GlobalConfig
     * const globalConfig = await prisma.globalConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GlobalConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, GlobalConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__GlobalConfigClient<$Result.GetResult<Prisma.$GlobalConfigPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GlobalConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GlobalConfigs
     * const globalConfigs = await prisma.globalConfig.findMany()
     * 
     * // Get first 10 GlobalConfigs
     * const globalConfigs = await prisma.globalConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const globalConfigWithIdOnly = await prisma.globalConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GlobalConfigFindManyArgs>(args?: SelectSubset<T, GlobalConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GlobalConfigPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GlobalConfig.
     * @param {GlobalConfigCreateArgs} args - Arguments to create a GlobalConfig.
     * @example
     * // Create one GlobalConfig
     * const GlobalConfig = await prisma.globalConfig.create({
     *   data: {
     *     // ... data to create a GlobalConfig
     *   }
     * })
     * 
     */
    create<T extends GlobalConfigCreateArgs>(args: SelectSubset<T, GlobalConfigCreateArgs<ExtArgs>>): Prisma__GlobalConfigClient<$Result.GetResult<Prisma.$GlobalConfigPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GlobalConfigs.
     * @param {GlobalConfigCreateManyArgs} args - Arguments to create many GlobalConfigs.
     * @example
     * // Create many GlobalConfigs
     * const globalConfig = await prisma.globalConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GlobalConfigCreateManyArgs>(args?: SelectSubset<T, GlobalConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GlobalConfigs and returns the data saved in the database.
     * @param {GlobalConfigCreateManyAndReturnArgs} args - Arguments to create many GlobalConfigs.
     * @example
     * // Create many GlobalConfigs
     * const globalConfig = await prisma.globalConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GlobalConfigs and only return the `id`
     * const globalConfigWithIdOnly = await prisma.globalConfig.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GlobalConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, GlobalConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GlobalConfigPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GlobalConfig.
     * @param {GlobalConfigDeleteArgs} args - Arguments to delete one GlobalConfig.
     * @example
     * // Delete one GlobalConfig
     * const GlobalConfig = await prisma.globalConfig.delete({
     *   where: {
     *     // ... filter to delete one GlobalConfig
     *   }
     * })
     * 
     */
    delete<T extends GlobalConfigDeleteArgs>(args: SelectSubset<T, GlobalConfigDeleteArgs<ExtArgs>>): Prisma__GlobalConfigClient<$Result.GetResult<Prisma.$GlobalConfigPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GlobalConfig.
     * @param {GlobalConfigUpdateArgs} args - Arguments to update one GlobalConfig.
     * @example
     * // Update one GlobalConfig
     * const globalConfig = await prisma.globalConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GlobalConfigUpdateArgs>(args: SelectSubset<T, GlobalConfigUpdateArgs<ExtArgs>>): Prisma__GlobalConfigClient<$Result.GetResult<Prisma.$GlobalConfigPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GlobalConfigs.
     * @param {GlobalConfigDeleteManyArgs} args - Arguments to filter GlobalConfigs to delete.
     * @example
     * // Delete a few GlobalConfigs
     * const { count } = await prisma.globalConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GlobalConfigDeleteManyArgs>(args?: SelectSubset<T, GlobalConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GlobalConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GlobalConfigs
     * const globalConfig = await prisma.globalConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GlobalConfigUpdateManyArgs>(args: SelectSubset<T, GlobalConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GlobalConfig.
     * @param {GlobalConfigUpsertArgs} args - Arguments to update or create a GlobalConfig.
     * @example
     * // Update or create a GlobalConfig
     * const globalConfig = await prisma.globalConfig.upsert({
     *   create: {
     *     // ... data to create a GlobalConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GlobalConfig we want to update
     *   }
     * })
     */
    upsert<T extends GlobalConfigUpsertArgs>(args: SelectSubset<T, GlobalConfigUpsertArgs<ExtArgs>>): Prisma__GlobalConfigClient<$Result.GetResult<Prisma.$GlobalConfigPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GlobalConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalConfigCountArgs} args - Arguments to filter GlobalConfigs to count.
     * @example
     * // Count the number of GlobalConfigs
     * const count = await prisma.globalConfig.count({
     *   where: {
     *     // ... the filter for the GlobalConfigs we want to count
     *   }
     * })
    **/
    count<T extends GlobalConfigCountArgs>(
      args?: Subset<T, GlobalConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GlobalConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GlobalConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GlobalConfigAggregateArgs>(args: Subset<T, GlobalConfigAggregateArgs>): Prisma.PrismaPromise<GetGlobalConfigAggregateType<T>>

    /**
     * Group by GlobalConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GlobalConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GlobalConfigGroupByArgs['orderBy'] }
        : { orderBy?: GlobalConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GlobalConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGlobalConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GlobalConfig model
   */
  readonly fields: GlobalConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GlobalConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GlobalConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GlobalConfig model
   */ 
  interface GlobalConfigFieldRefs {
    readonly id: FieldRef<"GlobalConfig", 'String'>
    readonly config: FieldRef<"GlobalConfig", 'Json'>
    readonly updatedAt: FieldRef<"GlobalConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GlobalConfig findUnique
   */
  export type GlobalConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalConfig
     */
    select?: GlobalConfigSelect<ExtArgs> | null
    /**
     * Filter, which GlobalConfig to fetch.
     */
    where: GlobalConfigWhereUniqueInput
  }

  /**
   * GlobalConfig findUniqueOrThrow
   */
  export type GlobalConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalConfig
     */
    select?: GlobalConfigSelect<ExtArgs> | null
    /**
     * Filter, which GlobalConfig to fetch.
     */
    where: GlobalConfigWhereUniqueInput
  }

  /**
   * GlobalConfig findFirst
   */
  export type GlobalConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalConfig
     */
    select?: GlobalConfigSelect<ExtArgs> | null
    /**
     * Filter, which GlobalConfig to fetch.
     */
    where?: GlobalConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalConfigs to fetch.
     */
    orderBy?: GlobalConfigOrderByWithRelationInput | GlobalConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GlobalConfigs.
     */
    cursor?: GlobalConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GlobalConfigs.
     */
    distinct?: GlobalConfigScalarFieldEnum | GlobalConfigScalarFieldEnum[]
  }

  /**
   * GlobalConfig findFirstOrThrow
   */
  export type GlobalConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalConfig
     */
    select?: GlobalConfigSelect<ExtArgs> | null
    /**
     * Filter, which GlobalConfig to fetch.
     */
    where?: GlobalConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalConfigs to fetch.
     */
    orderBy?: GlobalConfigOrderByWithRelationInput | GlobalConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GlobalConfigs.
     */
    cursor?: GlobalConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GlobalConfigs.
     */
    distinct?: GlobalConfigScalarFieldEnum | GlobalConfigScalarFieldEnum[]
  }

  /**
   * GlobalConfig findMany
   */
  export type GlobalConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalConfig
     */
    select?: GlobalConfigSelect<ExtArgs> | null
    /**
     * Filter, which GlobalConfigs to fetch.
     */
    where?: GlobalConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalConfigs to fetch.
     */
    orderBy?: GlobalConfigOrderByWithRelationInput | GlobalConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GlobalConfigs.
     */
    cursor?: GlobalConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalConfigs.
     */
    skip?: number
    distinct?: GlobalConfigScalarFieldEnum | GlobalConfigScalarFieldEnum[]
  }

  /**
   * GlobalConfig create
   */
  export type GlobalConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalConfig
     */
    select?: GlobalConfigSelect<ExtArgs> | null
    /**
     * The data needed to create a GlobalConfig.
     */
    data: XOR<GlobalConfigCreateInput, GlobalConfigUncheckedCreateInput>
  }

  /**
   * GlobalConfig createMany
   */
  export type GlobalConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GlobalConfigs.
     */
    data: GlobalConfigCreateManyInput | GlobalConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GlobalConfig createManyAndReturn
   */
  export type GlobalConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalConfig
     */
    select?: GlobalConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GlobalConfigs.
     */
    data: GlobalConfigCreateManyInput | GlobalConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GlobalConfig update
   */
  export type GlobalConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalConfig
     */
    select?: GlobalConfigSelect<ExtArgs> | null
    /**
     * The data needed to update a GlobalConfig.
     */
    data: XOR<GlobalConfigUpdateInput, GlobalConfigUncheckedUpdateInput>
    /**
     * Choose, which GlobalConfig to update.
     */
    where: GlobalConfigWhereUniqueInput
  }

  /**
   * GlobalConfig updateMany
   */
  export type GlobalConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GlobalConfigs.
     */
    data: XOR<GlobalConfigUpdateManyMutationInput, GlobalConfigUncheckedUpdateManyInput>
    /**
     * Filter which GlobalConfigs to update
     */
    where?: GlobalConfigWhereInput
  }

  /**
   * GlobalConfig upsert
   */
  export type GlobalConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalConfig
     */
    select?: GlobalConfigSelect<ExtArgs> | null
    /**
     * The filter to search for the GlobalConfig to update in case it exists.
     */
    where: GlobalConfigWhereUniqueInput
    /**
     * In case the GlobalConfig found by the `where` argument doesn't exist, create a new GlobalConfig with this data.
     */
    create: XOR<GlobalConfigCreateInput, GlobalConfigUncheckedCreateInput>
    /**
     * In case the GlobalConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GlobalConfigUpdateInput, GlobalConfigUncheckedUpdateInput>
  }

  /**
   * GlobalConfig delete
   */
  export type GlobalConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalConfig
     */
    select?: GlobalConfigSelect<ExtArgs> | null
    /**
     * Filter which GlobalConfig to delete.
     */
    where: GlobalConfigWhereUniqueInput
  }

  /**
   * GlobalConfig deleteMany
   */
  export type GlobalConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GlobalConfigs to delete
     */
    where?: GlobalConfigWhereInput
  }

  /**
   * GlobalConfig without action
   */
  export type GlobalConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalConfig
     */
    select?: GlobalConfigSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const DocumentScalarFieldEnum: {
    id: 'id',
    fileName: 'fileName',
    originalName: 'originalName',
    filePath: 'filePath',
    type: 'type',
    status: 'status',
    size: 'size',
    notariaId: 'notariaId',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const ActiveSessionScalarFieldEnum: {
    id: 'id',
    documentId: 'documentId',
    notariaId: 'notariaId',
    clientName: 'clientName',
    tramiteType: 'tramiteType',
    status: 'status',
    priority: 'priority',
    position: 'position',
    estimatedWaitTime: 'estimatedWaitTime',
    expiresAt: 'expiresAt',
    readyAt: 'readyAt',
    calledAt: 'calledAt',
    completedAt: 'completedAt',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ActiveSessionScalarFieldEnum = (typeof ActiveSessionScalarFieldEnum)[keyof typeof ActiveSessionScalarFieldEnum]


  export const ExtractedFieldScalarFieldEnum: {
    id: 'id',
    documentId: 'documentId',
    fieldName: 'fieldName',
    value: 'value',
    confidence: 'confidence',
    type: 'type',
    createdAt: 'createdAt'
  };

  export type ExtractedFieldScalarFieldEnum = (typeof ExtractedFieldScalarFieldEnum)[keyof typeof ExtractedFieldScalarFieldEnum]


  export const FormSessionScalarFieldEnum: {
    id: 'id',
    accessId: 'accessId',
    documentId: 'documentId',
    formType: 'formType',
    ownerName: 'ownerName',
    ownerCedula: 'ownerCedula',
    status: 'status',
    data: 'data',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FormSessionScalarFieldEnum = (typeof FormSessionScalarFieldEnum)[keyof typeof FormSessionScalarFieldEnum]


  export const QueueConfigScalarFieldEnum: {
    notariaId: 'notariaId',
    maxConcurrentSessions: 'maxConcurrentSessions',
    sessionTimeoutMinutes: 'sessionTimeoutMinutes',
    readyTimeoutMinutes: 'readyTimeoutMinutes',
    estimatedTimePerTramite: 'estimatedTimePerTramite',
    enablePriorities: 'enablePriorities',
    autoExpireInactive: 'autoExpireInactive',
    notificationSettings: 'notificationSettings',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type QueueConfigScalarFieldEnum = (typeof QueueConfigScalarFieldEnum)[keyof typeof QueueConfigScalarFieldEnum]


  export const EventLogScalarFieldEnum: {
    id: 'id',
    timestamp: 'timestamp',
    event: 'event',
    notariaId: 'notariaId',
    sessionId: 'sessionId',
    socketId: 'socketId',
    userId: 'userId',
    data: 'data',
    metadata: 'metadata'
  };

  export type EventLogScalarFieldEnum = (typeof EventLogScalarFieldEnum)[keyof typeof EventLogScalarFieldEnum]


  export const GlobalConfigScalarFieldEnum: {
    id: 'id',
    config: 'config',
    updatedAt: 'updatedAt'
  };

  export type GlobalConfigScalarFieldEnum = (typeof GlobalConfigScalarFieldEnum)[keyof typeof GlobalConfigScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DocumentType'
   */
  export type EnumDocumentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentType'>
    


  /**
   * Reference to a field of type 'DocumentType[]'
   */
  export type ListEnumDocumentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentType[]'>
    


  /**
   * Reference to a field of type 'DocumentStatus'
   */
  export type EnumDocumentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentStatus'>
    


  /**
   * Reference to a field of type 'DocumentStatus[]'
   */
  export type ListEnumDocumentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'TramiteType'
   */
  export type EnumTramiteTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TramiteType'>
    


  /**
   * Reference to a field of type 'TramiteType[]'
   */
  export type ListEnumTramiteTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TramiteType[]'>
    


  /**
   * Reference to a field of type 'SessionStatus'
   */
  export type EnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus'>
    


  /**
   * Reference to a field of type 'SessionStatus[]'
   */
  export type ListEnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus[]'>
    


  /**
   * Reference to a field of type 'PriorityLevel'
   */
  export type EnumPriorityLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PriorityLevel'>
    


  /**
   * Reference to a field of type 'PriorityLevel[]'
   */
  export type ListEnumPriorityLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PriorityLevel[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'FormType'
   */
  export type EnumFormTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FormType'>
    


  /**
   * Reference to a field of type 'FormType[]'
   */
  export type ListEnumFormTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FormType[]'>
    


  /**
   * Reference to a field of type 'FormSessionStatus'
   */
  export type EnumFormSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FormSessionStatus'>
    


  /**
   * Reference to a field of type 'FormSessionStatus[]'
   */
  export type ListEnumFormSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FormSessionStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: StringFilter<"Document"> | string
    fileName?: StringFilter<"Document"> | string
    originalName?: StringFilter<"Document"> | string
    filePath?: StringFilter<"Document"> | string
    type?: EnumDocumentTypeFilter<"Document"> | $Enums.DocumentType
    status?: EnumDocumentStatusFilter<"Document"> | $Enums.DocumentStatus
    size?: IntFilter<"Document"> | number
    notariaId?: StringFilter<"Document"> | string
    metadata?: JsonNullableFilter<"Document">
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    activeSessions?: ActiveSessionListRelationFilter
    extractedFields?: ExtractedFieldListRelationFilter
    formSessions?: FormSessionListRelationFilter
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    filePath?: SortOrder
    type?: SortOrder
    status?: SortOrder
    size?: SortOrder
    notariaId?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    activeSessions?: ActiveSessionOrderByRelationAggregateInput
    extractedFields?: ExtractedFieldOrderByRelationAggregateInput
    formSessions?: FormSessionOrderByRelationAggregateInput
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    fileName?: StringFilter<"Document"> | string
    originalName?: StringFilter<"Document"> | string
    filePath?: StringFilter<"Document"> | string
    type?: EnumDocumentTypeFilter<"Document"> | $Enums.DocumentType
    status?: EnumDocumentStatusFilter<"Document"> | $Enums.DocumentStatus
    size?: IntFilter<"Document"> | number
    notariaId?: StringFilter<"Document"> | string
    metadata?: JsonNullableFilter<"Document">
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    activeSessions?: ActiveSessionListRelationFilter
    extractedFields?: ExtractedFieldListRelationFilter
    formSessions?: FormSessionListRelationFilter
  }, "id">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    filePath?: SortOrder
    type?: SortOrder
    status?: SortOrder
    size?: SortOrder
    notariaId?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _avg?: DocumentAvgOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
    _sum?: DocumentSumOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Document"> | string
    fileName?: StringWithAggregatesFilter<"Document"> | string
    originalName?: StringWithAggregatesFilter<"Document"> | string
    filePath?: StringWithAggregatesFilter<"Document"> | string
    type?: EnumDocumentTypeWithAggregatesFilter<"Document"> | $Enums.DocumentType
    status?: EnumDocumentStatusWithAggregatesFilter<"Document"> | $Enums.DocumentStatus
    size?: IntWithAggregatesFilter<"Document"> | number
    notariaId?: StringWithAggregatesFilter<"Document"> | string
    metadata?: JsonNullableWithAggregatesFilter<"Document">
    createdAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
  }

  export type ActiveSessionWhereInput = {
    AND?: ActiveSessionWhereInput | ActiveSessionWhereInput[]
    OR?: ActiveSessionWhereInput[]
    NOT?: ActiveSessionWhereInput | ActiveSessionWhereInput[]
    id?: StringFilter<"ActiveSession"> | string
    documentId?: StringFilter<"ActiveSession"> | string
    notariaId?: StringFilter<"ActiveSession"> | string
    clientName?: StringFilter<"ActiveSession"> | string
    tramiteType?: EnumTramiteTypeFilter<"ActiveSession"> | $Enums.TramiteType
    status?: EnumSessionStatusFilter<"ActiveSession"> | $Enums.SessionStatus
    priority?: EnumPriorityLevelFilter<"ActiveSession"> | $Enums.PriorityLevel
    position?: IntFilter<"ActiveSession"> | number
    estimatedWaitTime?: IntFilter<"ActiveSession"> | number
    expiresAt?: DateTimeFilter<"ActiveSession"> | Date | string
    readyAt?: DateTimeNullableFilter<"ActiveSession"> | Date | string | null
    calledAt?: DateTimeNullableFilter<"ActiveSession"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"ActiveSession"> | Date | string | null
    metadata?: JsonNullableFilter<"ActiveSession">
    createdAt?: DateTimeFilter<"ActiveSession"> | Date | string
    updatedAt?: DateTimeFilter<"ActiveSession"> | Date | string
    document?: XOR<DocumentRelationFilter, DocumentWhereInput>
  }

  export type ActiveSessionOrderByWithRelationInput = {
    id?: SortOrder
    documentId?: SortOrder
    notariaId?: SortOrder
    clientName?: SortOrder
    tramiteType?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    position?: SortOrder
    estimatedWaitTime?: SortOrder
    expiresAt?: SortOrder
    readyAt?: SortOrderInput | SortOrder
    calledAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    document?: DocumentOrderByWithRelationInput
  }

  export type ActiveSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ActiveSessionWhereInput | ActiveSessionWhereInput[]
    OR?: ActiveSessionWhereInput[]
    NOT?: ActiveSessionWhereInput | ActiveSessionWhereInput[]
    documentId?: StringFilter<"ActiveSession"> | string
    notariaId?: StringFilter<"ActiveSession"> | string
    clientName?: StringFilter<"ActiveSession"> | string
    tramiteType?: EnumTramiteTypeFilter<"ActiveSession"> | $Enums.TramiteType
    status?: EnumSessionStatusFilter<"ActiveSession"> | $Enums.SessionStatus
    priority?: EnumPriorityLevelFilter<"ActiveSession"> | $Enums.PriorityLevel
    position?: IntFilter<"ActiveSession"> | number
    estimatedWaitTime?: IntFilter<"ActiveSession"> | number
    expiresAt?: DateTimeFilter<"ActiveSession"> | Date | string
    readyAt?: DateTimeNullableFilter<"ActiveSession"> | Date | string | null
    calledAt?: DateTimeNullableFilter<"ActiveSession"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"ActiveSession"> | Date | string | null
    metadata?: JsonNullableFilter<"ActiveSession">
    createdAt?: DateTimeFilter<"ActiveSession"> | Date | string
    updatedAt?: DateTimeFilter<"ActiveSession"> | Date | string
    document?: XOR<DocumentRelationFilter, DocumentWhereInput>
  }, "id">

  export type ActiveSessionOrderByWithAggregationInput = {
    id?: SortOrder
    documentId?: SortOrder
    notariaId?: SortOrder
    clientName?: SortOrder
    tramiteType?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    position?: SortOrder
    estimatedWaitTime?: SortOrder
    expiresAt?: SortOrder
    readyAt?: SortOrderInput | SortOrder
    calledAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ActiveSessionCountOrderByAggregateInput
    _avg?: ActiveSessionAvgOrderByAggregateInput
    _max?: ActiveSessionMaxOrderByAggregateInput
    _min?: ActiveSessionMinOrderByAggregateInput
    _sum?: ActiveSessionSumOrderByAggregateInput
  }

  export type ActiveSessionScalarWhereWithAggregatesInput = {
    AND?: ActiveSessionScalarWhereWithAggregatesInput | ActiveSessionScalarWhereWithAggregatesInput[]
    OR?: ActiveSessionScalarWhereWithAggregatesInput[]
    NOT?: ActiveSessionScalarWhereWithAggregatesInput | ActiveSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ActiveSession"> | string
    documentId?: StringWithAggregatesFilter<"ActiveSession"> | string
    notariaId?: StringWithAggregatesFilter<"ActiveSession"> | string
    clientName?: StringWithAggregatesFilter<"ActiveSession"> | string
    tramiteType?: EnumTramiteTypeWithAggregatesFilter<"ActiveSession"> | $Enums.TramiteType
    status?: EnumSessionStatusWithAggregatesFilter<"ActiveSession"> | $Enums.SessionStatus
    priority?: EnumPriorityLevelWithAggregatesFilter<"ActiveSession"> | $Enums.PriorityLevel
    position?: IntWithAggregatesFilter<"ActiveSession"> | number
    estimatedWaitTime?: IntWithAggregatesFilter<"ActiveSession"> | number
    expiresAt?: DateTimeWithAggregatesFilter<"ActiveSession"> | Date | string
    readyAt?: DateTimeNullableWithAggregatesFilter<"ActiveSession"> | Date | string | null
    calledAt?: DateTimeNullableWithAggregatesFilter<"ActiveSession"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"ActiveSession"> | Date | string | null
    metadata?: JsonNullableWithAggregatesFilter<"ActiveSession">
    createdAt?: DateTimeWithAggregatesFilter<"ActiveSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ActiveSession"> | Date | string
  }

  export type ExtractedFieldWhereInput = {
    AND?: ExtractedFieldWhereInput | ExtractedFieldWhereInput[]
    OR?: ExtractedFieldWhereInput[]
    NOT?: ExtractedFieldWhereInput | ExtractedFieldWhereInput[]
    id?: StringFilter<"ExtractedField"> | string
    documentId?: StringFilter<"ExtractedField"> | string
    fieldName?: StringFilter<"ExtractedField"> | string
    value?: StringFilter<"ExtractedField"> | string
    confidence?: FloatFilter<"ExtractedField"> | number
    type?: StringNullableFilter<"ExtractedField"> | string | null
    createdAt?: DateTimeFilter<"ExtractedField"> | Date | string
    document?: XOR<DocumentRelationFilter, DocumentWhereInput>
  }

  export type ExtractedFieldOrderByWithRelationInput = {
    id?: SortOrder
    documentId?: SortOrder
    fieldName?: SortOrder
    value?: SortOrder
    confidence?: SortOrder
    type?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    document?: DocumentOrderByWithRelationInput
  }

  export type ExtractedFieldWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExtractedFieldWhereInput | ExtractedFieldWhereInput[]
    OR?: ExtractedFieldWhereInput[]
    NOT?: ExtractedFieldWhereInput | ExtractedFieldWhereInput[]
    documentId?: StringFilter<"ExtractedField"> | string
    fieldName?: StringFilter<"ExtractedField"> | string
    value?: StringFilter<"ExtractedField"> | string
    confidence?: FloatFilter<"ExtractedField"> | number
    type?: StringNullableFilter<"ExtractedField"> | string | null
    createdAt?: DateTimeFilter<"ExtractedField"> | Date | string
    document?: XOR<DocumentRelationFilter, DocumentWhereInput>
  }, "id">

  export type ExtractedFieldOrderByWithAggregationInput = {
    id?: SortOrder
    documentId?: SortOrder
    fieldName?: SortOrder
    value?: SortOrder
    confidence?: SortOrder
    type?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ExtractedFieldCountOrderByAggregateInput
    _avg?: ExtractedFieldAvgOrderByAggregateInput
    _max?: ExtractedFieldMaxOrderByAggregateInput
    _min?: ExtractedFieldMinOrderByAggregateInput
    _sum?: ExtractedFieldSumOrderByAggregateInput
  }

  export type ExtractedFieldScalarWhereWithAggregatesInput = {
    AND?: ExtractedFieldScalarWhereWithAggregatesInput | ExtractedFieldScalarWhereWithAggregatesInput[]
    OR?: ExtractedFieldScalarWhereWithAggregatesInput[]
    NOT?: ExtractedFieldScalarWhereWithAggregatesInput | ExtractedFieldScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExtractedField"> | string
    documentId?: StringWithAggregatesFilter<"ExtractedField"> | string
    fieldName?: StringWithAggregatesFilter<"ExtractedField"> | string
    value?: StringWithAggregatesFilter<"ExtractedField"> | string
    confidence?: FloatWithAggregatesFilter<"ExtractedField"> | number
    type?: StringNullableWithAggregatesFilter<"ExtractedField"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ExtractedField"> | Date | string
  }

  export type FormSessionWhereInput = {
    AND?: FormSessionWhereInput | FormSessionWhereInput[]
    OR?: FormSessionWhereInput[]
    NOT?: FormSessionWhereInput | FormSessionWhereInput[]
    id?: StringFilter<"FormSession"> | string
    accessId?: StringFilter<"FormSession"> | string
    documentId?: StringFilter<"FormSession"> | string
    formType?: EnumFormTypeFilter<"FormSession"> | $Enums.FormType
    ownerName?: StringNullableFilter<"FormSession"> | string | null
    ownerCedula?: StringNullableFilter<"FormSession"> | string | null
    status?: EnumFormSessionStatusFilter<"FormSession"> | $Enums.FormSessionStatus
    data?: JsonNullableFilter<"FormSession">
    expiresAt?: DateTimeNullableFilter<"FormSession"> | Date | string | null
    createdAt?: DateTimeFilter<"FormSession"> | Date | string
    updatedAt?: DateTimeFilter<"FormSession"> | Date | string
    document?: XOR<DocumentRelationFilter, DocumentWhereInput>
  }

  export type FormSessionOrderByWithRelationInput = {
    id?: SortOrder
    accessId?: SortOrder
    documentId?: SortOrder
    formType?: SortOrder
    ownerName?: SortOrderInput | SortOrder
    ownerCedula?: SortOrderInput | SortOrder
    status?: SortOrder
    data?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    document?: DocumentOrderByWithRelationInput
  }

  export type FormSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    accessId?: string
    AND?: FormSessionWhereInput | FormSessionWhereInput[]
    OR?: FormSessionWhereInput[]
    NOT?: FormSessionWhereInput | FormSessionWhereInput[]
    documentId?: StringFilter<"FormSession"> | string
    formType?: EnumFormTypeFilter<"FormSession"> | $Enums.FormType
    ownerName?: StringNullableFilter<"FormSession"> | string | null
    ownerCedula?: StringNullableFilter<"FormSession"> | string | null
    status?: EnumFormSessionStatusFilter<"FormSession"> | $Enums.FormSessionStatus
    data?: JsonNullableFilter<"FormSession">
    expiresAt?: DateTimeNullableFilter<"FormSession"> | Date | string | null
    createdAt?: DateTimeFilter<"FormSession"> | Date | string
    updatedAt?: DateTimeFilter<"FormSession"> | Date | string
    document?: XOR<DocumentRelationFilter, DocumentWhereInput>
  }, "id" | "accessId">

  export type FormSessionOrderByWithAggregationInput = {
    id?: SortOrder
    accessId?: SortOrder
    documentId?: SortOrder
    formType?: SortOrder
    ownerName?: SortOrderInput | SortOrder
    ownerCedula?: SortOrderInput | SortOrder
    status?: SortOrder
    data?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FormSessionCountOrderByAggregateInput
    _max?: FormSessionMaxOrderByAggregateInput
    _min?: FormSessionMinOrderByAggregateInput
  }

  export type FormSessionScalarWhereWithAggregatesInput = {
    AND?: FormSessionScalarWhereWithAggregatesInput | FormSessionScalarWhereWithAggregatesInput[]
    OR?: FormSessionScalarWhereWithAggregatesInput[]
    NOT?: FormSessionScalarWhereWithAggregatesInput | FormSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FormSession"> | string
    accessId?: StringWithAggregatesFilter<"FormSession"> | string
    documentId?: StringWithAggregatesFilter<"FormSession"> | string
    formType?: EnumFormTypeWithAggregatesFilter<"FormSession"> | $Enums.FormType
    ownerName?: StringNullableWithAggregatesFilter<"FormSession"> | string | null
    ownerCedula?: StringNullableWithAggregatesFilter<"FormSession"> | string | null
    status?: EnumFormSessionStatusWithAggregatesFilter<"FormSession"> | $Enums.FormSessionStatus
    data?: JsonNullableWithAggregatesFilter<"FormSession">
    expiresAt?: DateTimeNullableWithAggregatesFilter<"FormSession"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"FormSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FormSession"> | Date | string
  }

  export type QueueConfigWhereInput = {
    AND?: QueueConfigWhereInput | QueueConfigWhereInput[]
    OR?: QueueConfigWhereInput[]
    NOT?: QueueConfigWhereInput | QueueConfigWhereInput[]
    notariaId?: StringFilter<"QueueConfig"> | string
    maxConcurrentSessions?: IntFilter<"QueueConfig"> | number
    sessionTimeoutMinutes?: IntFilter<"QueueConfig"> | number
    readyTimeoutMinutes?: IntFilter<"QueueConfig"> | number
    estimatedTimePerTramite?: IntFilter<"QueueConfig"> | number
    enablePriorities?: BoolFilter<"QueueConfig"> | boolean
    autoExpireInactive?: BoolFilter<"QueueConfig"> | boolean
    notificationSettings?: JsonNullableFilter<"QueueConfig">
    createdAt?: DateTimeFilter<"QueueConfig"> | Date | string
    updatedAt?: DateTimeFilter<"QueueConfig"> | Date | string
  }

  export type QueueConfigOrderByWithRelationInput = {
    notariaId?: SortOrder
    maxConcurrentSessions?: SortOrder
    sessionTimeoutMinutes?: SortOrder
    readyTimeoutMinutes?: SortOrder
    estimatedTimePerTramite?: SortOrder
    enablePriorities?: SortOrder
    autoExpireInactive?: SortOrder
    notificationSettings?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QueueConfigWhereUniqueInput = Prisma.AtLeast<{
    notariaId?: string
    AND?: QueueConfigWhereInput | QueueConfigWhereInput[]
    OR?: QueueConfigWhereInput[]
    NOT?: QueueConfigWhereInput | QueueConfigWhereInput[]
    maxConcurrentSessions?: IntFilter<"QueueConfig"> | number
    sessionTimeoutMinutes?: IntFilter<"QueueConfig"> | number
    readyTimeoutMinutes?: IntFilter<"QueueConfig"> | number
    estimatedTimePerTramite?: IntFilter<"QueueConfig"> | number
    enablePriorities?: BoolFilter<"QueueConfig"> | boolean
    autoExpireInactive?: BoolFilter<"QueueConfig"> | boolean
    notificationSettings?: JsonNullableFilter<"QueueConfig">
    createdAt?: DateTimeFilter<"QueueConfig"> | Date | string
    updatedAt?: DateTimeFilter<"QueueConfig"> | Date | string
  }, "notariaId">

  export type QueueConfigOrderByWithAggregationInput = {
    notariaId?: SortOrder
    maxConcurrentSessions?: SortOrder
    sessionTimeoutMinutes?: SortOrder
    readyTimeoutMinutes?: SortOrder
    estimatedTimePerTramite?: SortOrder
    enablePriorities?: SortOrder
    autoExpireInactive?: SortOrder
    notificationSettings?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: QueueConfigCountOrderByAggregateInput
    _avg?: QueueConfigAvgOrderByAggregateInput
    _max?: QueueConfigMaxOrderByAggregateInput
    _min?: QueueConfigMinOrderByAggregateInput
    _sum?: QueueConfigSumOrderByAggregateInput
  }

  export type QueueConfigScalarWhereWithAggregatesInput = {
    AND?: QueueConfigScalarWhereWithAggregatesInput | QueueConfigScalarWhereWithAggregatesInput[]
    OR?: QueueConfigScalarWhereWithAggregatesInput[]
    NOT?: QueueConfigScalarWhereWithAggregatesInput | QueueConfigScalarWhereWithAggregatesInput[]
    notariaId?: StringWithAggregatesFilter<"QueueConfig"> | string
    maxConcurrentSessions?: IntWithAggregatesFilter<"QueueConfig"> | number
    sessionTimeoutMinutes?: IntWithAggregatesFilter<"QueueConfig"> | number
    readyTimeoutMinutes?: IntWithAggregatesFilter<"QueueConfig"> | number
    estimatedTimePerTramite?: IntWithAggregatesFilter<"QueueConfig"> | number
    enablePriorities?: BoolWithAggregatesFilter<"QueueConfig"> | boolean
    autoExpireInactive?: BoolWithAggregatesFilter<"QueueConfig"> | boolean
    notificationSettings?: JsonNullableWithAggregatesFilter<"QueueConfig">
    createdAt?: DateTimeWithAggregatesFilter<"QueueConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"QueueConfig"> | Date | string
  }

  export type EventLogWhereInput = {
    AND?: EventLogWhereInput | EventLogWhereInput[]
    OR?: EventLogWhereInput[]
    NOT?: EventLogWhereInput | EventLogWhereInput[]
    id?: StringFilter<"EventLog"> | string
    timestamp?: DateTimeFilter<"EventLog"> | Date | string
    event?: StringFilter<"EventLog"> | string
    notariaId?: StringFilter<"EventLog"> | string
    sessionId?: StringNullableFilter<"EventLog"> | string | null
    socketId?: StringNullableFilter<"EventLog"> | string | null
    userId?: StringNullableFilter<"EventLog"> | string | null
    data?: JsonNullableFilter<"EventLog">
    metadata?: JsonNullableFilter<"EventLog">
  }

  export type EventLogOrderByWithRelationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    event?: SortOrder
    notariaId?: SortOrder
    sessionId?: SortOrderInput | SortOrder
    socketId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    data?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
  }

  export type EventLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventLogWhereInput | EventLogWhereInput[]
    OR?: EventLogWhereInput[]
    NOT?: EventLogWhereInput | EventLogWhereInput[]
    timestamp?: DateTimeFilter<"EventLog"> | Date | string
    event?: StringFilter<"EventLog"> | string
    notariaId?: StringFilter<"EventLog"> | string
    sessionId?: StringNullableFilter<"EventLog"> | string | null
    socketId?: StringNullableFilter<"EventLog"> | string | null
    userId?: StringNullableFilter<"EventLog"> | string | null
    data?: JsonNullableFilter<"EventLog">
    metadata?: JsonNullableFilter<"EventLog">
  }, "id">

  export type EventLogOrderByWithAggregationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    event?: SortOrder
    notariaId?: SortOrder
    sessionId?: SortOrderInput | SortOrder
    socketId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    data?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: EventLogCountOrderByAggregateInput
    _max?: EventLogMaxOrderByAggregateInput
    _min?: EventLogMinOrderByAggregateInput
  }

  export type EventLogScalarWhereWithAggregatesInput = {
    AND?: EventLogScalarWhereWithAggregatesInput | EventLogScalarWhereWithAggregatesInput[]
    OR?: EventLogScalarWhereWithAggregatesInput[]
    NOT?: EventLogScalarWhereWithAggregatesInput | EventLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EventLog"> | string
    timestamp?: DateTimeWithAggregatesFilter<"EventLog"> | Date | string
    event?: StringWithAggregatesFilter<"EventLog"> | string
    notariaId?: StringWithAggregatesFilter<"EventLog"> | string
    sessionId?: StringNullableWithAggregatesFilter<"EventLog"> | string | null
    socketId?: StringNullableWithAggregatesFilter<"EventLog"> | string | null
    userId?: StringNullableWithAggregatesFilter<"EventLog"> | string | null
    data?: JsonNullableWithAggregatesFilter<"EventLog">
    metadata?: JsonNullableWithAggregatesFilter<"EventLog">
  }

  export type GlobalConfigWhereInput = {
    AND?: GlobalConfigWhereInput | GlobalConfigWhereInput[]
    OR?: GlobalConfigWhereInput[]
    NOT?: GlobalConfigWhereInput | GlobalConfigWhereInput[]
    id?: StringFilter<"GlobalConfig"> | string
    config?: JsonFilter<"GlobalConfig">
    updatedAt?: DateTimeFilter<"GlobalConfig"> | Date | string
  }

  export type GlobalConfigOrderByWithRelationInput = {
    id?: SortOrder
    config?: SortOrder
    updatedAt?: SortOrder
  }

  export type GlobalConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GlobalConfigWhereInput | GlobalConfigWhereInput[]
    OR?: GlobalConfigWhereInput[]
    NOT?: GlobalConfigWhereInput | GlobalConfigWhereInput[]
    config?: JsonFilter<"GlobalConfig">
    updatedAt?: DateTimeFilter<"GlobalConfig"> | Date | string
  }, "id">

  export type GlobalConfigOrderByWithAggregationInput = {
    id?: SortOrder
    config?: SortOrder
    updatedAt?: SortOrder
    _count?: GlobalConfigCountOrderByAggregateInput
    _max?: GlobalConfigMaxOrderByAggregateInput
    _min?: GlobalConfigMinOrderByAggregateInput
  }

  export type GlobalConfigScalarWhereWithAggregatesInput = {
    AND?: GlobalConfigScalarWhereWithAggregatesInput | GlobalConfigScalarWhereWithAggregatesInput[]
    OR?: GlobalConfigScalarWhereWithAggregatesInput[]
    NOT?: GlobalConfigScalarWhereWithAggregatesInput | GlobalConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GlobalConfig"> | string
    config?: JsonWithAggregatesFilter<"GlobalConfig">
    updatedAt?: DateTimeWithAggregatesFilter<"GlobalConfig"> | Date | string
  }

  export type DocumentCreateInput = {
    id?: string
    fileName: string
    originalName: string
    filePath: string
    type?: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    size?: number
    notariaId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activeSessions?: ActiveSessionCreateNestedManyWithoutDocumentInput
    extractedFields?: ExtractedFieldCreateNestedManyWithoutDocumentInput
    formSessions?: FormSessionCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateInput = {
    id?: string
    fileName: string
    originalName: string
    filePath: string
    type?: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    size?: number
    notariaId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activeSessions?: ActiveSessionUncheckedCreateNestedManyWithoutDocumentInput
    extractedFields?: ExtractedFieldUncheckedCreateNestedManyWithoutDocumentInput
    formSessions?: FormSessionUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    size?: IntFieldUpdateOperationsInput | number
    notariaId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSessions?: ActiveSessionUpdateManyWithoutDocumentNestedInput
    extractedFields?: ExtractedFieldUpdateManyWithoutDocumentNestedInput
    formSessions?: FormSessionUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    size?: IntFieldUpdateOperationsInput | number
    notariaId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSessions?: ActiveSessionUncheckedUpdateManyWithoutDocumentNestedInput
    extractedFields?: ExtractedFieldUncheckedUpdateManyWithoutDocumentNestedInput
    formSessions?: FormSessionUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentCreateManyInput = {
    id?: string
    fileName: string
    originalName: string
    filePath: string
    type?: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    size?: number
    notariaId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    size?: IntFieldUpdateOperationsInput | number
    notariaId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    size?: IntFieldUpdateOperationsInput | number
    notariaId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveSessionCreateInput = {
    id?: string
    notariaId: string
    clientName: string
    tramiteType: $Enums.TramiteType
    status?: $Enums.SessionStatus
    priority?: $Enums.PriorityLevel
    position?: number
    estimatedWaitTime?: number
    expiresAt: Date | string
    readyAt?: Date | string | null
    calledAt?: Date | string | null
    completedAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    document: DocumentCreateNestedOneWithoutActiveSessionsInput
  }

  export type ActiveSessionUncheckedCreateInput = {
    id?: string
    documentId: string
    notariaId: string
    clientName: string
    tramiteType: $Enums.TramiteType
    status?: $Enums.SessionStatus
    priority?: $Enums.PriorityLevel
    position?: number
    estimatedWaitTime?: number
    expiresAt: Date | string
    readyAt?: Date | string | null
    calledAt?: Date | string | null
    completedAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    notariaId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    tramiteType?: EnumTramiteTypeFieldUpdateOperationsInput | $Enums.TramiteType
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    priority?: EnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel
    position?: IntFieldUpdateOperationsInput | number
    estimatedWaitTime?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    document?: DocumentUpdateOneRequiredWithoutActiveSessionsNestedInput
  }

  export type ActiveSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    notariaId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    tramiteType?: EnumTramiteTypeFieldUpdateOperationsInput | $Enums.TramiteType
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    priority?: EnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel
    position?: IntFieldUpdateOperationsInput | number
    estimatedWaitTime?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveSessionCreateManyInput = {
    id?: string
    documentId: string
    notariaId: string
    clientName: string
    tramiteType: $Enums.TramiteType
    status?: $Enums.SessionStatus
    priority?: $Enums.PriorityLevel
    position?: number
    estimatedWaitTime?: number
    expiresAt: Date | string
    readyAt?: Date | string | null
    calledAt?: Date | string | null
    completedAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    notariaId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    tramiteType?: EnumTramiteTypeFieldUpdateOperationsInput | $Enums.TramiteType
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    priority?: EnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel
    position?: IntFieldUpdateOperationsInput | number
    estimatedWaitTime?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    notariaId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    tramiteType?: EnumTramiteTypeFieldUpdateOperationsInput | $Enums.TramiteType
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    priority?: EnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel
    position?: IntFieldUpdateOperationsInput | number
    estimatedWaitTime?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtractedFieldCreateInput = {
    id?: string
    fieldName: string
    value: string
    confidence?: number
    type?: string | null
    createdAt?: Date | string
    document: DocumentCreateNestedOneWithoutExtractedFieldsInput
  }

  export type ExtractedFieldUncheckedCreateInput = {
    id?: string
    documentId: string
    fieldName: string
    value: string
    confidence?: number
    type?: string | null
    createdAt?: Date | string
  }

  export type ExtractedFieldUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    type?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    document?: DocumentUpdateOneRequiredWithoutExtractedFieldsNestedInput
  }

  export type ExtractedFieldUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    type?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtractedFieldCreateManyInput = {
    id?: string
    documentId: string
    fieldName: string
    value: string
    confidence?: number
    type?: string | null
    createdAt?: Date | string
  }

  export type ExtractedFieldUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    type?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtractedFieldUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    type?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FormSessionCreateInput = {
    id?: string
    accessId: string
    formType?: $Enums.FormType
    ownerName?: string | null
    ownerCedula?: string | null
    status?: $Enums.FormSessionStatus
    data?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    document: DocumentCreateNestedOneWithoutFormSessionsInput
  }

  export type FormSessionUncheckedCreateInput = {
    id?: string
    accessId: string
    documentId: string
    formType?: $Enums.FormType
    ownerName?: string | null
    ownerCedula?: string | null
    status?: $Enums.FormSessionStatus
    data?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FormSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessId?: StringFieldUpdateOperationsInput | string
    formType?: EnumFormTypeFieldUpdateOperationsInput | $Enums.FormType
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerCedula?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumFormSessionStatusFieldUpdateOperationsInput | $Enums.FormSessionStatus
    data?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    document?: DocumentUpdateOneRequiredWithoutFormSessionsNestedInput
  }

  export type FormSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessId?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    formType?: EnumFormTypeFieldUpdateOperationsInput | $Enums.FormType
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerCedula?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumFormSessionStatusFieldUpdateOperationsInput | $Enums.FormSessionStatus
    data?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FormSessionCreateManyInput = {
    id?: string
    accessId: string
    documentId: string
    formType?: $Enums.FormType
    ownerName?: string | null
    ownerCedula?: string | null
    status?: $Enums.FormSessionStatus
    data?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FormSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessId?: StringFieldUpdateOperationsInput | string
    formType?: EnumFormTypeFieldUpdateOperationsInput | $Enums.FormType
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerCedula?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumFormSessionStatusFieldUpdateOperationsInput | $Enums.FormSessionStatus
    data?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FormSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessId?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    formType?: EnumFormTypeFieldUpdateOperationsInput | $Enums.FormType
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerCedula?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumFormSessionStatusFieldUpdateOperationsInput | $Enums.FormSessionStatus
    data?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QueueConfigCreateInput = {
    notariaId: string
    maxConcurrentSessions?: number
    sessionTimeoutMinutes?: number
    readyTimeoutMinutes?: number
    estimatedTimePerTramite?: number
    enablePriorities?: boolean
    autoExpireInactive?: boolean
    notificationSettings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QueueConfigUncheckedCreateInput = {
    notariaId: string
    maxConcurrentSessions?: number
    sessionTimeoutMinutes?: number
    readyTimeoutMinutes?: number
    estimatedTimePerTramite?: number
    enablePriorities?: boolean
    autoExpireInactive?: boolean
    notificationSettings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QueueConfigUpdateInput = {
    notariaId?: StringFieldUpdateOperationsInput | string
    maxConcurrentSessions?: IntFieldUpdateOperationsInput | number
    sessionTimeoutMinutes?: IntFieldUpdateOperationsInput | number
    readyTimeoutMinutes?: IntFieldUpdateOperationsInput | number
    estimatedTimePerTramite?: IntFieldUpdateOperationsInput | number
    enablePriorities?: BoolFieldUpdateOperationsInput | boolean
    autoExpireInactive?: BoolFieldUpdateOperationsInput | boolean
    notificationSettings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QueueConfigUncheckedUpdateInput = {
    notariaId?: StringFieldUpdateOperationsInput | string
    maxConcurrentSessions?: IntFieldUpdateOperationsInput | number
    sessionTimeoutMinutes?: IntFieldUpdateOperationsInput | number
    readyTimeoutMinutes?: IntFieldUpdateOperationsInput | number
    estimatedTimePerTramite?: IntFieldUpdateOperationsInput | number
    enablePriorities?: BoolFieldUpdateOperationsInput | boolean
    autoExpireInactive?: BoolFieldUpdateOperationsInput | boolean
    notificationSettings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QueueConfigCreateManyInput = {
    notariaId: string
    maxConcurrentSessions?: number
    sessionTimeoutMinutes?: number
    readyTimeoutMinutes?: number
    estimatedTimePerTramite?: number
    enablePriorities?: boolean
    autoExpireInactive?: boolean
    notificationSettings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QueueConfigUpdateManyMutationInput = {
    notariaId?: StringFieldUpdateOperationsInput | string
    maxConcurrentSessions?: IntFieldUpdateOperationsInput | number
    sessionTimeoutMinutes?: IntFieldUpdateOperationsInput | number
    readyTimeoutMinutes?: IntFieldUpdateOperationsInput | number
    estimatedTimePerTramite?: IntFieldUpdateOperationsInput | number
    enablePriorities?: BoolFieldUpdateOperationsInput | boolean
    autoExpireInactive?: BoolFieldUpdateOperationsInput | boolean
    notificationSettings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QueueConfigUncheckedUpdateManyInput = {
    notariaId?: StringFieldUpdateOperationsInput | string
    maxConcurrentSessions?: IntFieldUpdateOperationsInput | number
    sessionTimeoutMinutes?: IntFieldUpdateOperationsInput | number
    readyTimeoutMinutes?: IntFieldUpdateOperationsInput | number
    estimatedTimePerTramite?: IntFieldUpdateOperationsInput | number
    enablePriorities?: BoolFieldUpdateOperationsInput | boolean
    autoExpireInactive?: BoolFieldUpdateOperationsInput | boolean
    notificationSettings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventLogCreateInput = {
    id?: string
    timestamp?: Date | string
    event: string
    notariaId: string
    sessionId?: string | null
    socketId?: string | null
    userId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventLogUncheckedCreateInput = {
    id?: string
    timestamp?: Date | string
    event: string
    notariaId: string
    sessionId?: string | null
    socketId?: string | null
    userId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: StringFieldUpdateOperationsInput | string
    notariaId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    socketId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: StringFieldUpdateOperationsInput | string
    notariaId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    socketId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventLogCreateManyInput = {
    id?: string
    timestamp?: Date | string
    event: string
    notariaId: string
    sessionId?: string | null
    socketId?: string | null
    userId?: string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: StringFieldUpdateOperationsInput | string
    notariaId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    socketId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EventLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: StringFieldUpdateOperationsInput | string
    notariaId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    socketId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    data?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type GlobalConfigCreateInput = {
    id?: string
    config: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type GlobalConfigUncheckedCreateInput = {
    id?: string
    config: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type GlobalConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlobalConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlobalConfigCreateManyInput = {
    id?: string
    config: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type GlobalConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlobalConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumDocumentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeFilter<$PrismaModel> | $Enums.DocumentType
  }

  export type EnumDocumentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusFilter<$PrismaModel> | $Enums.DocumentStatus
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ActiveSessionListRelationFilter = {
    every?: ActiveSessionWhereInput
    some?: ActiveSessionWhereInput
    none?: ActiveSessionWhereInput
  }

  export type ExtractedFieldListRelationFilter = {
    every?: ExtractedFieldWhereInput
    some?: ExtractedFieldWhereInput
    none?: ExtractedFieldWhereInput
  }

  export type FormSessionListRelationFilter = {
    every?: FormSessionWhereInput
    some?: FormSessionWhereInput
    none?: FormSessionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ActiveSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExtractedFieldOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FormSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    filePath?: SortOrder
    type?: SortOrder
    status?: SortOrder
    size?: SortOrder
    notariaId?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentAvgOrderByAggregateInput = {
    size?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    filePath?: SortOrder
    type?: SortOrder
    status?: SortOrder
    size?: SortOrder
    notariaId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    filePath?: SortOrder
    type?: SortOrder
    status?: SortOrder
    size?: SortOrder
    notariaId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentSumOrderByAggregateInput = {
    size?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumDocumentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocumentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentTypeFilter<$PrismaModel>
    _max?: NestedEnumDocumentTypeFilter<$PrismaModel>
  }

  export type EnumDocumentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel> | $Enums.DocumentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentStatusFilter<$PrismaModel>
    _max?: NestedEnumDocumentStatusFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumTramiteTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TramiteType | EnumTramiteTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TramiteType[] | ListEnumTramiteTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TramiteType[] | ListEnumTramiteTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTramiteTypeFilter<$PrismaModel> | $Enums.TramiteType
  }

  export type EnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
  }

  export type EnumPriorityLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorityLevel | EnumPriorityLevelFieldRefInput<$PrismaModel>
    in?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityLevelFilter<$PrismaModel> | $Enums.PriorityLevel
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DocumentRelationFilter = {
    is?: DocumentWhereInput
    isNot?: DocumentWhereInput
  }

  export type ActiveSessionCountOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    notariaId?: SortOrder
    clientName?: SortOrder
    tramiteType?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    position?: SortOrder
    estimatedWaitTime?: SortOrder
    expiresAt?: SortOrder
    readyAt?: SortOrder
    calledAt?: SortOrder
    completedAt?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActiveSessionAvgOrderByAggregateInput = {
    position?: SortOrder
    estimatedWaitTime?: SortOrder
  }

  export type ActiveSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    notariaId?: SortOrder
    clientName?: SortOrder
    tramiteType?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    position?: SortOrder
    estimatedWaitTime?: SortOrder
    expiresAt?: SortOrder
    readyAt?: SortOrder
    calledAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActiveSessionMinOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    notariaId?: SortOrder
    clientName?: SortOrder
    tramiteType?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    position?: SortOrder
    estimatedWaitTime?: SortOrder
    expiresAt?: SortOrder
    readyAt?: SortOrder
    calledAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActiveSessionSumOrderByAggregateInput = {
    position?: SortOrder
    estimatedWaitTime?: SortOrder
  }

  export type EnumTramiteTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TramiteType | EnumTramiteTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TramiteType[] | ListEnumTramiteTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TramiteType[] | ListEnumTramiteTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTramiteTypeWithAggregatesFilter<$PrismaModel> | $Enums.TramiteType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTramiteTypeFilter<$PrismaModel>
    _max?: NestedEnumTramiteTypeFilter<$PrismaModel>
  }

  export type EnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
  }

  export type EnumPriorityLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorityLevel | EnumPriorityLevelFieldRefInput<$PrismaModel>
    in?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityLevelWithAggregatesFilter<$PrismaModel> | $Enums.PriorityLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPriorityLevelFilter<$PrismaModel>
    _max?: NestedEnumPriorityLevelFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type ExtractedFieldCountOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    fieldName?: SortOrder
    value?: SortOrder
    confidence?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type ExtractedFieldAvgOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type ExtractedFieldMaxOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    fieldName?: SortOrder
    value?: SortOrder
    confidence?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type ExtractedFieldMinOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    fieldName?: SortOrder
    value?: SortOrder
    confidence?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
  }

  export type ExtractedFieldSumOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumFormTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FormType | EnumFormTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FormType[] | ListEnumFormTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FormType[] | ListEnumFormTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFormTypeFilter<$PrismaModel> | $Enums.FormType
  }

  export type EnumFormSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FormSessionStatus | EnumFormSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FormSessionStatus[] | ListEnumFormSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FormSessionStatus[] | ListEnumFormSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFormSessionStatusFilter<$PrismaModel> | $Enums.FormSessionStatus
  }

  export type FormSessionCountOrderByAggregateInput = {
    id?: SortOrder
    accessId?: SortOrder
    documentId?: SortOrder
    formType?: SortOrder
    ownerName?: SortOrder
    ownerCedula?: SortOrder
    status?: SortOrder
    data?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FormSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    accessId?: SortOrder
    documentId?: SortOrder
    formType?: SortOrder
    ownerName?: SortOrder
    ownerCedula?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FormSessionMinOrderByAggregateInput = {
    id?: SortOrder
    accessId?: SortOrder
    documentId?: SortOrder
    formType?: SortOrder
    ownerName?: SortOrder
    ownerCedula?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumFormTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FormType | EnumFormTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FormType[] | ListEnumFormTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FormType[] | ListEnumFormTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFormTypeWithAggregatesFilter<$PrismaModel> | $Enums.FormType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFormTypeFilter<$PrismaModel>
    _max?: NestedEnumFormTypeFilter<$PrismaModel>
  }

  export type EnumFormSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FormSessionStatus | EnumFormSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FormSessionStatus[] | ListEnumFormSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FormSessionStatus[] | ListEnumFormSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFormSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.FormSessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFormSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumFormSessionStatusFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type QueueConfigCountOrderByAggregateInput = {
    notariaId?: SortOrder
    maxConcurrentSessions?: SortOrder
    sessionTimeoutMinutes?: SortOrder
    readyTimeoutMinutes?: SortOrder
    estimatedTimePerTramite?: SortOrder
    enablePriorities?: SortOrder
    autoExpireInactive?: SortOrder
    notificationSettings?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QueueConfigAvgOrderByAggregateInput = {
    maxConcurrentSessions?: SortOrder
    sessionTimeoutMinutes?: SortOrder
    readyTimeoutMinutes?: SortOrder
    estimatedTimePerTramite?: SortOrder
  }

  export type QueueConfigMaxOrderByAggregateInput = {
    notariaId?: SortOrder
    maxConcurrentSessions?: SortOrder
    sessionTimeoutMinutes?: SortOrder
    readyTimeoutMinutes?: SortOrder
    estimatedTimePerTramite?: SortOrder
    enablePriorities?: SortOrder
    autoExpireInactive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QueueConfigMinOrderByAggregateInput = {
    notariaId?: SortOrder
    maxConcurrentSessions?: SortOrder
    sessionTimeoutMinutes?: SortOrder
    readyTimeoutMinutes?: SortOrder
    estimatedTimePerTramite?: SortOrder
    enablePriorities?: SortOrder
    autoExpireInactive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QueueConfigSumOrderByAggregateInput = {
    maxConcurrentSessions?: SortOrder
    sessionTimeoutMinutes?: SortOrder
    readyTimeoutMinutes?: SortOrder
    estimatedTimePerTramite?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EventLogCountOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    event?: SortOrder
    notariaId?: SortOrder
    sessionId?: SortOrder
    socketId?: SortOrder
    userId?: SortOrder
    data?: SortOrder
    metadata?: SortOrder
  }

  export type EventLogMaxOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    event?: SortOrder
    notariaId?: SortOrder
    sessionId?: SortOrder
    socketId?: SortOrder
    userId?: SortOrder
  }

  export type EventLogMinOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    event?: SortOrder
    notariaId?: SortOrder
    sessionId?: SortOrder
    socketId?: SortOrder
    userId?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type GlobalConfigCountOrderByAggregateInput = {
    id?: SortOrder
    config?: SortOrder
    updatedAt?: SortOrder
  }

  export type GlobalConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    updatedAt?: SortOrder
  }

  export type GlobalConfigMinOrderByAggregateInput = {
    id?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type ActiveSessionCreateNestedManyWithoutDocumentInput = {
    create?: XOR<ActiveSessionCreateWithoutDocumentInput, ActiveSessionUncheckedCreateWithoutDocumentInput> | ActiveSessionCreateWithoutDocumentInput[] | ActiveSessionUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: ActiveSessionCreateOrConnectWithoutDocumentInput | ActiveSessionCreateOrConnectWithoutDocumentInput[]
    createMany?: ActiveSessionCreateManyDocumentInputEnvelope
    connect?: ActiveSessionWhereUniqueInput | ActiveSessionWhereUniqueInput[]
  }

  export type ExtractedFieldCreateNestedManyWithoutDocumentInput = {
    create?: XOR<ExtractedFieldCreateWithoutDocumentInput, ExtractedFieldUncheckedCreateWithoutDocumentInput> | ExtractedFieldCreateWithoutDocumentInput[] | ExtractedFieldUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: ExtractedFieldCreateOrConnectWithoutDocumentInput | ExtractedFieldCreateOrConnectWithoutDocumentInput[]
    createMany?: ExtractedFieldCreateManyDocumentInputEnvelope
    connect?: ExtractedFieldWhereUniqueInput | ExtractedFieldWhereUniqueInput[]
  }

  export type FormSessionCreateNestedManyWithoutDocumentInput = {
    create?: XOR<FormSessionCreateWithoutDocumentInput, FormSessionUncheckedCreateWithoutDocumentInput> | FormSessionCreateWithoutDocumentInput[] | FormSessionUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: FormSessionCreateOrConnectWithoutDocumentInput | FormSessionCreateOrConnectWithoutDocumentInput[]
    createMany?: FormSessionCreateManyDocumentInputEnvelope
    connect?: FormSessionWhereUniqueInput | FormSessionWhereUniqueInput[]
  }

  export type ActiveSessionUncheckedCreateNestedManyWithoutDocumentInput = {
    create?: XOR<ActiveSessionCreateWithoutDocumentInput, ActiveSessionUncheckedCreateWithoutDocumentInput> | ActiveSessionCreateWithoutDocumentInput[] | ActiveSessionUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: ActiveSessionCreateOrConnectWithoutDocumentInput | ActiveSessionCreateOrConnectWithoutDocumentInput[]
    createMany?: ActiveSessionCreateManyDocumentInputEnvelope
    connect?: ActiveSessionWhereUniqueInput | ActiveSessionWhereUniqueInput[]
  }

  export type ExtractedFieldUncheckedCreateNestedManyWithoutDocumentInput = {
    create?: XOR<ExtractedFieldCreateWithoutDocumentInput, ExtractedFieldUncheckedCreateWithoutDocumentInput> | ExtractedFieldCreateWithoutDocumentInput[] | ExtractedFieldUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: ExtractedFieldCreateOrConnectWithoutDocumentInput | ExtractedFieldCreateOrConnectWithoutDocumentInput[]
    createMany?: ExtractedFieldCreateManyDocumentInputEnvelope
    connect?: ExtractedFieldWhereUniqueInput | ExtractedFieldWhereUniqueInput[]
  }

  export type FormSessionUncheckedCreateNestedManyWithoutDocumentInput = {
    create?: XOR<FormSessionCreateWithoutDocumentInput, FormSessionUncheckedCreateWithoutDocumentInput> | FormSessionCreateWithoutDocumentInput[] | FormSessionUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: FormSessionCreateOrConnectWithoutDocumentInput | FormSessionCreateOrConnectWithoutDocumentInput[]
    createMany?: FormSessionCreateManyDocumentInputEnvelope
    connect?: FormSessionWhereUniqueInput | FormSessionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumDocumentTypeFieldUpdateOperationsInput = {
    set?: $Enums.DocumentType
  }

  export type EnumDocumentStatusFieldUpdateOperationsInput = {
    set?: $Enums.DocumentStatus
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ActiveSessionUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<ActiveSessionCreateWithoutDocumentInput, ActiveSessionUncheckedCreateWithoutDocumentInput> | ActiveSessionCreateWithoutDocumentInput[] | ActiveSessionUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: ActiveSessionCreateOrConnectWithoutDocumentInput | ActiveSessionCreateOrConnectWithoutDocumentInput[]
    upsert?: ActiveSessionUpsertWithWhereUniqueWithoutDocumentInput | ActiveSessionUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: ActiveSessionCreateManyDocumentInputEnvelope
    set?: ActiveSessionWhereUniqueInput | ActiveSessionWhereUniqueInput[]
    disconnect?: ActiveSessionWhereUniqueInput | ActiveSessionWhereUniqueInput[]
    delete?: ActiveSessionWhereUniqueInput | ActiveSessionWhereUniqueInput[]
    connect?: ActiveSessionWhereUniqueInput | ActiveSessionWhereUniqueInput[]
    update?: ActiveSessionUpdateWithWhereUniqueWithoutDocumentInput | ActiveSessionUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: ActiveSessionUpdateManyWithWhereWithoutDocumentInput | ActiveSessionUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: ActiveSessionScalarWhereInput | ActiveSessionScalarWhereInput[]
  }

  export type ExtractedFieldUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<ExtractedFieldCreateWithoutDocumentInput, ExtractedFieldUncheckedCreateWithoutDocumentInput> | ExtractedFieldCreateWithoutDocumentInput[] | ExtractedFieldUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: ExtractedFieldCreateOrConnectWithoutDocumentInput | ExtractedFieldCreateOrConnectWithoutDocumentInput[]
    upsert?: ExtractedFieldUpsertWithWhereUniqueWithoutDocumentInput | ExtractedFieldUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: ExtractedFieldCreateManyDocumentInputEnvelope
    set?: ExtractedFieldWhereUniqueInput | ExtractedFieldWhereUniqueInput[]
    disconnect?: ExtractedFieldWhereUniqueInput | ExtractedFieldWhereUniqueInput[]
    delete?: ExtractedFieldWhereUniqueInput | ExtractedFieldWhereUniqueInput[]
    connect?: ExtractedFieldWhereUniqueInput | ExtractedFieldWhereUniqueInput[]
    update?: ExtractedFieldUpdateWithWhereUniqueWithoutDocumentInput | ExtractedFieldUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: ExtractedFieldUpdateManyWithWhereWithoutDocumentInput | ExtractedFieldUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: ExtractedFieldScalarWhereInput | ExtractedFieldScalarWhereInput[]
  }

  export type FormSessionUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<FormSessionCreateWithoutDocumentInput, FormSessionUncheckedCreateWithoutDocumentInput> | FormSessionCreateWithoutDocumentInput[] | FormSessionUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: FormSessionCreateOrConnectWithoutDocumentInput | FormSessionCreateOrConnectWithoutDocumentInput[]
    upsert?: FormSessionUpsertWithWhereUniqueWithoutDocumentInput | FormSessionUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: FormSessionCreateManyDocumentInputEnvelope
    set?: FormSessionWhereUniqueInput | FormSessionWhereUniqueInput[]
    disconnect?: FormSessionWhereUniqueInput | FormSessionWhereUniqueInput[]
    delete?: FormSessionWhereUniqueInput | FormSessionWhereUniqueInput[]
    connect?: FormSessionWhereUniqueInput | FormSessionWhereUniqueInput[]
    update?: FormSessionUpdateWithWhereUniqueWithoutDocumentInput | FormSessionUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: FormSessionUpdateManyWithWhereWithoutDocumentInput | FormSessionUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: FormSessionScalarWhereInput | FormSessionScalarWhereInput[]
  }

  export type ActiveSessionUncheckedUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<ActiveSessionCreateWithoutDocumentInput, ActiveSessionUncheckedCreateWithoutDocumentInput> | ActiveSessionCreateWithoutDocumentInput[] | ActiveSessionUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: ActiveSessionCreateOrConnectWithoutDocumentInput | ActiveSessionCreateOrConnectWithoutDocumentInput[]
    upsert?: ActiveSessionUpsertWithWhereUniqueWithoutDocumentInput | ActiveSessionUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: ActiveSessionCreateManyDocumentInputEnvelope
    set?: ActiveSessionWhereUniqueInput | ActiveSessionWhereUniqueInput[]
    disconnect?: ActiveSessionWhereUniqueInput | ActiveSessionWhereUniqueInput[]
    delete?: ActiveSessionWhereUniqueInput | ActiveSessionWhereUniqueInput[]
    connect?: ActiveSessionWhereUniqueInput | ActiveSessionWhereUniqueInput[]
    update?: ActiveSessionUpdateWithWhereUniqueWithoutDocumentInput | ActiveSessionUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: ActiveSessionUpdateManyWithWhereWithoutDocumentInput | ActiveSessionUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: ActiveSessionScalarWhereInput | ActiveSessionScalarWhereInput[]
  }

  export type ExtractedFieldUncheckedUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<ExtractedFieldCreateWithoutDocumentInput, ExtractedFieldUncheckedCreateWithoutDocumentInput> | ExtractedFieldCreateWithoutDocumentInput[] | ExtractedFieldUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: ExtractedFieldCreateOrConnectWithoutDocumentInput | ExtractedFieldCreateOrConnectWithoutDocumentInput[]
    upsert?: ExtractedFieldUpsertWithWhereUniqueWithoutDocumentInput | ExtractedFieldUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: ExtractedFieldCreateManyDocumentInputEnvelope
    set?: ExtractedFieldWhereUniqueInput | ExtractedFieldWhereUniqueInput[]
    disconnect?: ExtractedFieldWhereUniqueInput | ExtractedFieldWhereUniqueInput[]
    delete?: ExtractedFieldWhereUniqueInput | ExtractedFieldWhereUniqueInput[]
    connect?: ExtractedFieldWhereUniqueInput | ExtractedFieldWhereUniqueInput[]
    update?: ExtractedFieldUpdateWithWhereUniqueWithoutDocumentInput | ExtractedFieldUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: ExtractedFieldUpdateManyWithWhereWithoutDocumentInput | ExtractedFieldUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: ExtractedFieldScalarWhereInput | ExtractedFieldScalarWhereInput[]
  }

  export type FormSessionUncheckedUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<FormSessionCreateWithoutDocumentInput, FormSessionUncheckedCreateWithoutDocumentInput> | FormSessionCreateWithoutDocumentInput[] | FormSessionUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: FormSessionCreateOrConnectWithoutDocumentInput | FormSessionCreateOrConnectWithoutDocumentInput[]
    upsert?: FormSessionUpsertWithWhereUniqueWithoutDocumentInput | FormSessionUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: FormSessionCreateManyDocumentInputEnvelope
    set?: FormSessionWhereUniqueInput | FormSessionWhereUniqueInput[]
    disconnect?: FormSessionWhereUniqueInput | FormSessionWhereUniqueInput[]
    delete?: FormSessionWhereUniqueInput | FormSessionWhereUniqueInput[]
    connect?: FormSessionWhereUniqueInput | FormSessionWhereUniqueInput[]
    update?: FormSessionUpdateWithWhereUniqueWithoutDocumentInput | FormSessionUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: FormSessionUpdateManyWithWhereWithoutDocumentInput | FormSessionUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: FormSessionScalarWhereInput | FormSessionScalarWhereInput[]
  }

  export type DocumentCreateNestedOneWithoutActiveSessionsInput = {
    create?: XOR<DocumentCreateWithoutActiveSessionsInput, DocumentUncheckedCreateWithoutActiveSessionsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutActiveSessionsInput
    connect?: DocumentWhereUniqueInput
  }

  export type EnumTramiteTypeFieldUpdateOperationsInput = {
    set?: $Enums.TramiteType
  }

  export type EnumSessionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SessionStatus
  }

  export type EnumPriorityLevelFieldUpdateOperationsInput = {
    set?: $Enums.PriorityLevel
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DocumentUpdateOneRequiredWithoutActiveSessionsNestedInput = {
    create?: XOR<DocumentCreateWithoutActiveSessionsInput, DocumentUncheckedCreateWithoutActiveSessionsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutActiveSessionsInput
    upsert?: DocumentUpsertWithoutActiveSessionsInput
    connect?: DocumentWhereUniqueInput
    update?: XOR<XOR<DocumentUpdateToOneWithWhereWithoutActiveSessionsInput, DocumentUpdateWithoutActiveSessionsInput>, DocumentUncheckedUpdateWithoutActiveSessionsInput>
  }

  export type DocumentCreateNestedOneWithoutExtractedFieldsInput = {
    create?: XOR<DocumentCreateWithoutExtractedFieldsInput, DocumentUncheckedCreateWithoutExtractedFieldsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutExtractedFieldsInput
    connect?: DocumentWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DocumentUpdateOneRequiredWithoutExtractedFieldsNestedInput = {
    create?: XOR<DocumentCreateWithoutExtractedFieldsInput, DocumentUncheckedCreateWithoutExtractedFieldsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutExtractedFieldsInput
    upsert?: DocumentUpsertWithoutExtractedFieldsInput
    connect?: DocumentWhereUniqueInput
    update?: XOR<XOR<DocumentUpdateToOneWithWhereWithoutExtractedFieldsInput, DocumentUpdateWithoutExtractedFieldsInput>, DocumentUncheckedUpdateWithoutExtractedFieldsInput>
  }

  export type DocumentCreateNestedOneWithoutFormSessionsInput = {
    create?: XOR<DocumentCreateWithoutFormSessionsInput, DocumentUncheckedCreateWithoutFormSessionsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutFormSessionsInput
    connect?: DocumentWhereUniqueInput
  }

  export type EnumFormTypeFieldUpdateOperationsInput = {
    set?: $Enums.FormType
  }

  export type EnumFormSessionStatusFieldUpdateOperationsInput = {
    set?: $Enums.FormSessionStatus
  }

  export type DocumentUpdateOneRequiredWithoutFormSessionsNestedInput = {
    create?: XOR<DocumentCreateWithoutFormSessionsInput, DocumentUncheckedCreateWithoutFormSessionsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutFormSessionsInput
    upsert?: DocumentUpsertWithoutFormSessionsInput
    connect?: DocumentWhereUniqueInput
    update?: XOR<XOR<DocumentUpdateToOneWithWhereWithoutFormSessionsInput, DocumentUpdateWithoutFormSessionsInput>, DocumentUncheckedUpdateWithoutFormSessionsInput>
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumDocumentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeFilter<$PrismaModel> | $Enums.DocumentType
  }

  export type NestedEnumDocumentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusFilter<$PrismaModel> | $Enums.DocumentStatus
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentType | EnumDocumentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentType[] | ListEnumDocumentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocumentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentTypeFilter<$PrismaModel>
    _max?: NestedEnumDocumentTypeFilter<$PrismaModel>
  }

  export type NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel> | $Enums.DocumentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentStatusFilter<$PrismaModel>
    _max?: NestedEnumDocumentStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumTramiteTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TramiteType | EnumTramiteTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TramiteType[] | ListEnumTramiteTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TramiteType[] | ListEnumTramiteTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTramiteTypeFilter<$PrismaModel> | $Enums.TramiteType
  }

  export type NestedEnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
  }

  export type NestedEnumPriorityLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorityLevel | EnumPriorityLevelFieldRefInput<$PrismaModel>
    in?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityLevelFilter<$PrismaModel> | $Enums.PriorityLevel
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumTramiteTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TramiteType | EnumTramiteTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TramiteType[] | ListEnumTramiteTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TramiteType[] | ListEnumTramiteTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTramiteTypeWithAggregatesFilter<$PrismaModel> | $Enums.TramiteType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTramiteTypeFilter<$PrismaModel>
    _max?: NestedEnumTramiteTypeFilter<$PrismaModel>
  }

  export type NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
  }

  export type NestedEnumPriorityLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PriorityLevel | EnumPriorityLevelFieldRefInput<$PrismaModel>
    in?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.PriorityLevel[] | ListEnumPriorityLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityLevelWithAggregatesFilter<$PrismaModel> | $Enums.PriorityLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPriorityLevelFilter<$PrismaModel>
    _max?: NestedEnumPriorityLevelFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumFormTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FormType | EnumFormTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FormType[] | ListEnumFormTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FormType[] | ListEnumFormTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFormTypeFilter<$PrismaModel> | $Enums.FormType
  }

  export type NestedEnumFormSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FormSessionStatus | EnumFormSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FormSessionStatus[] | ListEnumFormSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FormSessionStatus[] | ListEnumFormSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFormSessionStatusFilter<$PrismaModel> | $Enums.FormSessionStatus
  }

  export type NestedEnumFormTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FormType | EnumFormTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FormType[] | ListEnumFormTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FormType[] | ListEnumFormTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFormTypeWithAggregatesFilter<$PrismaModel> | $Enums.FormType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFormTypeFilter<$PrismaModel>
    _max?: NestedEnumFormTypeFilter<$PrismaModel>
  }

  export type NestedEnumFormSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FormSessionStatus | EnumFormSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FormSessionStatus[] | ListEnumFormSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FormSessionStatus[] | ListEnumFormSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFormSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.FormSessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFormSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumFormSessionStatusFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ActiveSessionCreateWithoutDocumentInput = {
    id?: string
    notariaId: string
    clientName: string
    tramiteType: $Enums.TramiteType
    status?: $Enums.SessionStatus
    priority?: $Enums.PriorityLevel
    position?: number
    estimatedWaitTime?: number
    expiresAt: Date | string
    readyAt?: Date | string | null
    calledAt?: Date | string | null
    completedAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveSessionUncheckedCreateWithoutDocumentInput = {
    id?: string
    notariaId: string
    clientName: string
    tramiteType: $Enums.TramiteType
    status?: $Enums.SessionStatus
    priority?: $Enums.PriorityLevel
    position?: number
    estimatedWaitTime?: number
    expiresAt: Date | string
    readyAt?: Date | string | null
    calledAt?: Date | string | null
    completedAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveSessionCreateOrConnectWithoutDocumentInput = {
    where: ActiveSessionWhereUniqueInput
    create: XOR<ActiveSessionCreateWithoutDocumentInput, ActiveSessionUncheckedCreateWithoutDocumentInput>
  }

  export type ActiveSessionCreateManyDocumentInputEnvelope = {
    data: ActiveSessionCreateManyDocumentInput | ActiveSessionCreateManyDocumentInput[]
    skipDuplicates?: boolean
  }

  export type ExtractedFieldCreateWithoutDocumentInput = {
    id?: string
    fieldName: string
    value: string
    confidence?: number
    type?: string | null
    createdAt?: Date | string
  }

  export type ExtractedFieldUncheckedCreateWithoutDocumentInput = {
    id?: string
    fieldName: string
    value: string
    confidence?: number
    type?: string | null
    createdAt?: Date | string
  }

  export type ExtractedFieldCreateOrConnectWithoutDocumentInput = {
    where: ExtractedFieldWhereUniqueInput
    create: XOR<ExtractedFieldCreateWithoutDocumentInput, ExtractedFieldUncheckedCreateWithoutDocumentInput>
  }

  export type ExtractedFieldCreateManyDocumentInputEnvelope = {
    data: ExtractedFieldCreateManyDocumentInput | ExtractedFieldCreateManyDocumentInput[]
    skipDuplicates?: boolean
  }

  export type FormSessionCreateWithoutDocumentInput = {
    id?: string
    accessId: string
    formType?: $Enums.FormType
    ownerName?: string | null
    ownerCedula?: string | null
    status?: $Enums.FormSessionStatus
    data?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FormSessionUncheckedCreateWithoutDocumentInput = {
    id?: string
    accessId: string
    formType?: $Enums.FormType
    ownerName?: string | null
    ownerCedula?: string | null
    status?: $Enums.FormSessionStatus
    data?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FormSessionCreateOrConnectWithoutDocumentInput = {
    where: FormSessionWhereUniqueInput
    create: XOR<FormSessionCreateWithoutDocumentInput, FormSessionUncheckedCreateWithoutDocumentInput>
  }

  export type FormSessionCreateManyDocumentInputEnvelope = {
    data: FormSessionCreateManyDocumentInput | FormSessionCreateManyDocumentInput[]
    skipDuplicates?: boolean
  }

  export type ActiveSessionUpsertWithWhereUniqueWithoutDocumentInput = {
    where: ActiveSessionWhereUniqueInput
    update: XOR<ActiveSessionUpdateWithoutDocumentInput, ActiveSessionUncheckedUpdateWithoutDocumentInput>
    create: XOR<ActiveSessionCreateWithoutDocumentInput, ActiveSessionUncheckedCreateWithoutDocumentInput>
  }

  export type ActiveSessionUpdateWithWhereUniqueWithoutDocumentInput = {
    where: ActiveSessionWhereUniqueInput
    data: XOR<ActiveSessionUpdateWithoutDocumentInput, ActiveSessionUncheckedUpdateWithoutDocumentInput>
  }

  export type ActiveSessionUpdateManyWithWhereWithoutDocumentInput = {
    where: ActiveSessionScalarWhereInput
    data: XOR<ActiveSessionUpdateManyMutationInput, ActiveSessionUncheckedUpdateManyWithoutDocumentInput>
  }

  export type ActiveSessionScalarWhereInput = {
    AND?: ActiveSessionScalarWhereInput | ActiveSessionScalarWhereInput[]
    OR?: ActiveSessionScalarWhereInput[]
    NOT?: ActiveSessionScalarWhereInput | ActiveSessionScalarWhereInput[]
    id?: StringFilter<"ActiveSession"> | string
    documentId?: StringFilter<"ActiveSession"> | string
    notariaId?: StringFilter<"ActiveSession"> | string
    clientName?: StringFilter<"ActiveSession"> | string
    tramiteType?: EnumTramiteTypeFilter<"ActiveSession"> | $Enums.TramiteType
    status?: EnumSessionStatusFilter<"ActiveSession"> | $Enums.SessionStatus
    priority?: EnumPriorityLevelFilter<"ActiveSession"> | $Enums.PriorityLevel
    position?: IntFilter<"ActiveSession"> | number
    estimatedWaitTime?: IntFilter<"ActiveSession"> | number
    expiresAt?: DateTimeFilter<"ActiveSession"> | Date | string
    readyAt?: DateTimeNullableFilter<"ActiveSession"> | Date | string | null
    calledAt?: DateTimeNullableFilter<"ActiveSession"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"ActiveSession"> | Date | string | null
    metadata?: JsonNullableFilter<"ActiveSession">
    createdAt?: DateTimeFilter<"ActiveSession"> | Date | string
    updatedAt?: DateTimeFilter<"ActiveSession"> | Date | string
  }

  export type ExtractedFieldUpsertWithWhereUniqueWithoutDocumentInput = {
    where: ExtractedFieldWhereUniqueInput
    update: XOR<ExtractedFieldUpdateWithoutDocumentInput, ExtractedFieldUncheckedUpdateWithoutDocumentInput>
    create: XOR<ExtractedFieldCreateWithoutDocumentInput, ExtractedFieldUncheckedCreateWithoutDocumentInput>
  }

  export type ExtractedFieldUpdateWithWhereUniqueWithoutDocumentInput = {
    where: ExtractedFieldWhereUniqueInput
    data: XOR<ExtractedFieldUpdateWithoutDocumentInput, ExtractedFieldUncheckedUpdateWithoutDocumentInput>
  }

  export type ExtractedFieldUpdateManyWithWhereWithoutDocumentInput = {
    where: ExtractedFieldScalarWhereInput
    data: XOR<ExtractedFieldUpdateManyMutationInput, ExtractedFieldUncheckedUpdateManyWithoutDocumentInput>
  }

  export type ExtractedFieldScalarWhereInput = {
    AND?: ExtractedFieldScalarWhereInput | ExtractedFieldScalarWhereInput[]
    OR?: ExtractedFieldScalarWhereInput[]
    NOT?: ExtractedFieldScalarWhereInput | ExtractedFieldScalarWhereInput[]
    id?: StringFilter<"ExtractedField"> | string
    documentId?: StringFilter<"ExtractedField"> | string
    fieldName?: StringFilter<"ExtractedField"> | string
    value?: StringFilter<"ExtractedField"> | string
    confidence?: FloatFilter<"ExtractedField"> | number
    type?: StringNullableFilter<"ExtractedField"> | string | null
    createdAt?: DateTimeFilter<"ExtractedField"> | Date | string
  }

  export type FormSessionUpsertWithWhereUniqueWithoutDocumentInput = {
    where: FormSessionWhereUniqueInput
    update: XOR<FormSessionUpdateWithoutDocumentInput, FormSessionUncheckedUpdateWithoutDocumentInput>
    create: XOR<FormSessionCreateWithoutDocumentInput, FormSessionUncheckedCreateWithoutDocumentInput>
  }

  export type FormSessionUpdateWithWhereUniqueWithoutDocumentInput = {
    where: FormSessionWhereUniqueInput
    data: XOR<FormSessionUpdateWithoutDocumentInput, FormSessionUncheckedUpdateWithoutDocumentInput>
  }

  export type FormSessionUpdateManyWithWhereWithoutDocumentInput = {
    where: FormSessionScalarWhereInput
    data: XOR<FormSessionUpdateManyMutationInput, FormSessionUncheckedUpdateManyWithoutDocumentInput>
  }

  export type FormSessionScalarWhereInput = {
    AND?: FormSessionScalarWhereInput | FormSessionScalarWhereInput[]
    OR?: FormSessionScalarWhereInput[]
    NOT?: FormSessionScalarWhereInput | FormSessionScalarWhereInput[]
    id?: StringFilter<"FormSession"> | string
    accessId?: StringFilter<"FormSession"> | string
    documentId?: StringFilter<"FormSession"> | string
    formType?: EnumFormTypeFilter<"FormSession"> | $Enums.FormType
    ownerName?: StringNullableFilter<"FormSession"> | string | null
    ownerCedula?: StringNullableFilter<"FormSession"> | string | null
    status?: EnumFormSessionStatusFilter<"FormSession"> | $Enums.FormSessionStatus
    data?: JsonNullableFilter<"FormSession">
    expiresAt?: DateTimeNullableFilter<"FormSession"> | Date | string | null
    createdAt?: DateTimeFilter<"FormSession"> | Date | string
    updatedAt?: DateTimeFilter<"FormSession"> | Date | string
  }

  export type DocumentCreateWithoutActiveSessionsInput = {
    id?: string
    fileName: string
    originalName: string
    filePath: string
    type?: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    size?: number
    notariaId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    extractedFields?: ExtractedFieldCreateNestedManyWithoutDocumentInput
    formSessions?: FormSessionCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutActiveSessionsInput = {
    id?: string
    fileName: string
    originalName: string
    filePath: string
    type?: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    size?: number
    notariaId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    extractedFields?: ExtractedFieldUncheckedCreateNestedManyWithoutDocumentInput
    formSessions?: FormSessionUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentCreateOrConnectWithoutActiveSessionsInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutActiveSessionsInput, DocumentUncheckedCreateWithoutActiveSessionsInput>
  }

  export type DocumentUpsertWithoutActiveSessionsInput = {
    update: XOR<DocumentUpdateWithoutActiveSessionsInput, DocumentUncheckedUpdateWithoutActiveSessionsInput>
    create: XOR<DocumentCreateWithoutActiveSessionsInput, DocumentUncheckedCreateWithoutActiveSessionsInput>
    where?: DocumentWhereInput
  }

  export type DocumentUpdateToOneWithWhereWithoutActiveSessionsInput = {
    where?: DocumentWhereInput
    data: XOR<DocumentUpdateWithoutActiveSessionsInput, DocumentUncheckedUpdateWithoutActiveSessionsInput>
  }

  export type DocumentUpdateWithoutActiveSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    size?: IntFieldUpdateOperationsInput | number
    notariaId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    extractedFields?: ExtractedFieldUpdateManyWithoutDocumentNestedInput
    formSessions?: FormSessionUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutActiveSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    size?: IntFieldUpdateOperationsInput | number
    notariaId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    extractedFields?: ExtractedFieldUncheckedUpdateManyWithoutDocumentNestedInput
    formSessions?: FormSessionUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentCreateWithoutExtractedFieldsInput = {
    id?: string
    fileName: string
    originalName: string
    filePath: string
    type?: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    size?: number
    notariaId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activeSessions?: ActiveSessionCreateNestedManyWithoutDocumentInput
    formSessions?: FormSessionCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutExtractedFieldsInput = {
    id?: string
    fileName: string
    originalName: string
    filePath: string
    type?: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    size?: number
    notariaId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activeSessions?: ActiveSessionUncheckedCreateNestedManyWithoutDocumentInput
    formSessions?: FormSessionUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentCreateOrConnectWithoutExtractedFieldsInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutExtractedFieldsInput, DocumentUncheckedCreateWithoutExtractedFieldsInput>
  }

  export type DocumentUpsertWithoutExtractedFieldsInput = {
    update: XOR<DocumentUpdateWithoutExtractedFieldsInput, DocumentUncheckedUpdateWithoutExtractedFieldsInput>
    create: XOR<DocumentCreateWithoutExtractedFieldsInput, DocumentUncheckedCreateWithoutExtractedFieldsInput>
    where?: DocumentWhereInput
  }

  export type DocumentUpdateToOneWithWhereWithoutExtractedFieldsInput = {
    where?: DocumentWhereInput
    data: XOR<DocumentUpdateWithoutExtractedFieldsInput, DocumentUncheckedUpdateWithoutExtractedFieldsInput>
  }

  export type DocumentUpdateWithoutExtractedFieldsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    size?: IntFieldUpdateOperationsInput | number
    notariaId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSessions?: ActiveSessionUpdateManyWithoutDocumentNestedInput
    formSessions?: FormSessionUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutExtractedFieldsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    size?: IntFieldUpdateOperationsInput | number
    notariaId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSessions?: ActiveSessionUncheckedUpdateManyWithoutDocumentNestedInput
    formSessions?: FormSessionUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentCreateWithoutFormSessionsInput = {
    id?: string
    fileName: string
    originalName: string
    filePath: string
    type?: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    size?: number
    notariaId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activeSessions?: ActiveSessionCreateNestedManyWithoutDocumentInput
    extractedFields?: ExtractedFieldCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutFormSessionsInput = {
    id?: string
    fileName: string
    originalName: string
    filePath: string
    type?: $Enums.DocumentType
    status?: $Enums.DocumentStatus
    size?: number
    notariaId: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activeSessions?: ActiveSessionUncheckedCreateNestedManyWithoutDocumentInput
    extractedFields?: ExtractedFieldUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentCreateOrConnectWithoutFormSessionsInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutFormSessionsInput, DocumentUncheckedCreateWithoutFormSessionsInput>
  }

  export type DocumentUpsertWithoutFormSessionsInput = {
    update: XOR<DocumentUpdateWithoutFormSessionsInput, DocumentUncheckedUpdateWithoutFormSessionsInput>
    create: XOR<DocumentCreateWithoutFormSessionsInput, DocumentUncheckedCreateWithoutFormSessionsInput>
    where?: DocumentWhereInput
  }

  export type DocumentUpdateToOneWithWhereWithoutFormSessionsInput = {
    where?: DocumentWhereInput
    data: XOR<DocumentUpdateWithoutFormSessionsInput, DocumentUncheckedUpdateWithoutFormSessionsInput>
  }

  export type DocumentUpdateWithoutFormSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    size?: IntFieldUpdateOperationsInput | number
    notariaId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSessions?: ActiveSessionUpdateManyWithoutDocumentNestedInput
    extractedFields?: ExtractedFieldUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutFormSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    type?: EnumDocumentTypeFieldUpdateOperationsInput | $Enums.DocumentType
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    size?: IntFieldUpdateOperationsInput | number
    notariaId?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSessions?: ActiveSessionUncheckedUpdateManyWithoutDocumentNestedInput
    extractedFields?: ExtractedFieldUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type ActiveSessionCreateManyDocumentInput = {
    id?: string
    notariaId: string
    clientName: string
    tramiteType: $Enums.TramiteType
    status?: $Enums.SessionStatus
    priority?: $Enums.PriorityLevel
    position?: number
    estimatedWaitTime?: number
    expiresAt: Date | string
    readyAt?: Date | string | null
    calledAt?: Date | string | null
    completedAt?: Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExtractedFieldCreateManyDocumentInput = {
    id?: string
    fieldName: string
    value: string
    confidence?: number
    type?: string | null
    createdAt?: Date | string
  }

  export type FormSessionCreateManyDocumentInput = {
    id?: string
    accessId: string
    formType?: $Enums.FormType
    ownerName?: string | null
    ownerCedula?: string | null
    status?: $Enums.FormSessionStatus
    data?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveSessionUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    notariaId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    tramiteType?: EnumTramiteTypeFieldUpdateOperationsInput | $Enums.TramiteType
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    priority?: EnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel
    position?: IntFieldUpdateOperationsInput | number
    estimatedWaitTime?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveSessionUncheckedUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    notariaId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    tramiteType?: EnumTramiteTypeFieldUpdateOperationsInput | $Enums.TramiteType
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    priority?: EnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel
    position?: IntFieldUpdateOperationsInput | number
    estimatedWaitTime?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveSessionUncheckedUpdateManyWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    notariaId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    tramiteType?: EnumTramiteTypeFieldUpdateOperationsInput | $Enums.TramiteType
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    priority?: EnumPriorityLevelFieldUpdateOperationsInput | $Enums.PriorityLevel
    position?: IntFieldUpdateOperationsInput | number
    estimatedWaitTime?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    calledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtractedFieldUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    type?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtractedFieldUncheckedUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    type?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtractedFieldUncheckedUpdateManyWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    type?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FormSessionUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessId?: StringFieldUpdateOperationsInput | string
    formType?: EnumFormTypeFieldUpdateOperationsInput | $Enums.FormType
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerCedula?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumFormSessionStatusFieldUpdateOperationsInput | $Enums.FormSessionStatus
    data?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FormSessionUncheckedUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessId?: StringFieldUpdateOperationsInput | string
    formType?: EnumFormTypeFieldUpdateOperationsInput | $Enums.FormType
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerCedula?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumFormSessionStatusFieldUpdateOperationsInput | $Enums.FormSessionStatus
    data?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FormSessionUncheckedUpdateManyWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    accessId?: StringFieldUpdateOperationsInput | string
    formType?: EnumFormTypeFieldUpdateOperationsInput | $Enums.FormType
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerCedula?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumFormSessionStatusFieldUpdateOperationsInput | $Enums.FormSessionStatus
    data?: NullableJsonNullValueInput | InputJsonValue
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use DocumentCountOutputTypeDefaultArgs instead
     */
    export type DocumentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DocumentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DocumentDefaultArgs instead
     */
    export type DocumentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DocumentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ActiveSessionDefaultArgs instead
     */
    export type ActiveSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ActiveSessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ExtractedFieldDefaultArgs instead
     */
    export type ExtractedFieldArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ExtractedFieldDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FormSessionDefaultArgs instead
     */
    export type FormSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FormSessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use QueueConfigDefaultArgs instead
     */
    export type QueueConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = QueueConfigDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventLogDefaultArgs instead
     */
    export type EventLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GlobalConfigDefaultArgs instead
     */
    export type GlobalConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GlobalConfigDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}