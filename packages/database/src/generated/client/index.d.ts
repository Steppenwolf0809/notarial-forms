
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
 * Enums
 */
export namespace $Enums {
  export const DocumentStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR'
};

export type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus]

}

export type DocumentStatus = $Enums.DocumentStatus

export const DocumentStatus: typeof $Enums.DocumentStatus

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
    ExtractedField: 'ExtractedField'
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
      modelProps: "document" | "activeSession" | "extractedField"
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
  }

  export type DocumentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activeSessions?: boolean | DocumentCountOutputTypeCountActiveSessionsArgs
    extractedFields?: boolean | DocumentCountOutputTypeCountExtractedFieldsArgs
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
   * Models
   */

  /**
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentMinAggregateOutputType = {
    id: string | null
    type: string | null
    fileName: string | null
    status: $Enums.DocumentStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: string | null
    type: string | null
    fileName: string | null
    status: $Enums.DocumentStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    type: number
    fileName: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DocumentMinAggregateInputType = {
    id?: true
    type?: true
    fileName?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    type?: true
    fileName?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    type?: true
    fileName?: true
    status?: true
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
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: string
    type: string
    fileName: string
    status: $Enums.DocumentStatus
    createdAt: Date
    updatedAt: Date
    _count: DocumentCountAggregateOutputType | null
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
    type?: boolean
    fileName?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    activeSessions?: boolean | Document$activeSessionsArgs<ExtArgs>
    extractedFields?: boolean | Document$extractedFieldsArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    fileName?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectScalar = {
    id?: boolean
    type?: boolean
    fileName?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activeSessions?: boolean | Document$activeSessionsArgs<ExtArgs>
    extractedFields?: boolean | Document$extractedFieldsArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {
      activeSessions: Prisma.$ActiveSessionPayload<ExtArgs>[]
      extractedFields: Prisma.$ExtractedFieldPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      fileName: string
      status: $Enums.DocumentStatus
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
    readonly type: FieldRef<"Document", 'String'>
    readonly fileName: FieldRef<"Document", 'String'>
    readonly status: FieldRef<"Document", 'DocumentStatus'>
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
  }

  export type ActiveSessionSumAggregateOutputType = {
    position: number | null
  }

  export type ActiveSessionMinAggregateOutputType = {
    id: string | null
    documentId: string | null
    clientName: string | null
    position: number | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ActiveSessionMaxAggregateOutputType = {
    id: string | null
    documentId: string | null
    clientName: string | null
    position: number | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ActiveSessionCountAggregateOutputType = {
    id: number
    documentId: number
    clientName: number
    position: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ActiveSessionAvgAggregateInputType = {
    position?: true
  }

  export type ActiveSessionSumAggregateInputType = {
    position?: true
  }

  export type ActiveSessionMinAggregateInputType = {
    id?: true
    documentId?: true
    clientName?: true
    position?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ActiveSessionMaxAggregateInputType = {
    id?: true
    documentId?: true
    clientName?: true
    position?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ActiveSessionCountAggregateInputType = {
    id?: true
    documentId?: true
    clientName?: true
    position?: true
    expiresAt?: true
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
    clientName: string
    position: number
    expiresAt: Date
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
    clientName?: boolean
    position?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["activeSession"]>

  export type ActiveSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    clientName?: boolean
    position?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["activeSession"]>

  export type ActiveSessionSelectScalar = {
    id?: boolean
    documentId?: boolean
    clientName?: boolean
    position?: boolean
    expiresAt?: boolean
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
      clientName: string
      position: number
      expiresAt: Date
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
    readonly clientName: FieldRef<"ActiveSession", 'String'>
    readonly position: FieldRef<"ActiveSession", 'Int'>
    readonly expiresAt: FieldRef<"ActiveSession", 'DateTime'>
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
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExtractedFieldMaxAggregateOutputType = {
    id: string | null
    documentId: string | null
    fieldName: string | null
    value: string | null
    confidence: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExtractedFieldCountAggregateOutputType = {
    id: number
    documentId: number
    fieldName: number
    value: number
    confidence: number
    createdAt: number
    updatedAt: number
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
    createdAt?: true
    updatedAt?: true
  }

  export type ExtractedFieldMaxAggregateInputType = {
    id?: true
    documentId?: true
    fieldName?: true
    value?: true
    confidence?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExtractedFieldCountAggregateInputType = {
    id?: true
    documentId?: true
    fieldName?: true
    value?: true
    confidence?: true
    createdAt?: true
    updatedAt?: true
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
    createdAt: Date
    updatedAt: Date
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
    createdAt?: boolean
    updatedAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["extractedField"]>

  export type ExtractedFieldSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    fieldName?: boolean
    value?: boolean
    confidence?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["extractedField"]>

  export type ExtractedFieldSelectScalar = {
    id?: boolean
    documentId?: boolean
    fieldName?: boolean
    value?: boolean
    confidence?: boolean
    createdAt?: boolean
    updatedAt?: boolean
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
      createdAt: Date
      updatedAt: Date
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
    readonly createdAt: FieldRef<"ExtractedField", 'DateTime'>
    readonly updatedAt: FieldRef<"ExtractedField", 'DateTime'>
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
    type: 'type',
    fileName: 'fileName',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const ActiveSessionScalarFieldEnum: {
    id: 'id',
    documentId: 'documentId',
    clientName: 'clientName',
    position: 'position',
    expiresAt: 'expiresAt',
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
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ExtractedFieldScalarFieldEnum = (typeof ExtractedFieldScalarFieldEnum)[keyof typeof ExtractedFieldScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


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
   * Reference to a field of type 'DocumentStatus'
   */
  export type EnumDocumentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentStatus'>
    


  /**
   * Reference to a field of type 'DocumentStatus[]'
   */
  export type ListEnumDocumentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: StringFilter<"Document"> | string
    type?: StringFilter<"Document"> | string
    fileName?: StringFilter<"Document"> | string
    status?: EnumDocumentStatusFilter<"Document"> | $Enums.DocumentStatus
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    activeSessions?: ActiveSessionListRelationFilter
    extractedFields?: ExtractedFieldListRelationFilter
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    fileName?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    activeSessions?: ActiveSessionOrderByRelationAggregateInput
    extractedFields?: ExtractedFieldOrderByRelationAggregateInput
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    type?: StringFilter<"Document"> | string
    fileName?: StringFilter<"Document"> | string
    status?: EnumDocumentStatusFilter<"Document"> | $Enums.DocumentStatus
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    activeSessions?: ActiveSessionListRelationFilter
    extractedFields?: ExtractedFieldListRelationFilter
  }, "id">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    fileName?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Document"> | string
    type?: StringWithAggregatesFilter<"Document"> | string
    fileName?: StringWithAggregatesFilter<"Document"> | string
    status?: EnumDocumentStatusWithAggregatesFilter<"Document"> | $Enums.DocumentStatus
    createdAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
  }

  export type ActiveSessionWhereInput = {
    AND?: ActiveSessionWhereInput | ActiveSessionWhereInput[]
    OR?: ActiveSessionWhereInput[]
    NOT?: ActiveSessionWhereInput | ActiveSessionWhereInput[]
    id?: StringFilter<"ActiveSession"> | string
    documentId?: StringFilter<"ActiveSession"> | string
    clientName?: StringFilter<"ActiveSession"> | string
    position?: IntFilter<"ActiveSession"> | number
    expiresAt?: DateTimeFilter<"ActiveSession"> | Date | string
    createdAt?: DateTimeFilter<"ActiveSession"> | Date | string
    updatedAt?: DateTimeFilter<"ActiveSession"> | Date | string
    document?: XOR<DocumentRelationFilter, DocumentWhereInput>
  }

  export type ActiveSessionOrderByWithRelationInput = {
    id?: SortOrder
    documentId?: SortOrder
    clientName?: SortOrder
    position?: SortOrder
    expiresAt?: SortOrder
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
    clientName?: StringFilter<"ActiveSession"> | string
    position?: IntFilter<"ActiveSession"> | number
    expiresAt?: DateTimeFilter<"ActiveSession"> | Date | string
    createdAt?: DateTimeFilter<"ActiveSession"> | Date | string
    updatedAt?: DateTimeFilter<"ActiveSession"> | Date | string
    document?: XOR<DocumentRelationFilter, DocumentWhereInput>
  }, "id">

  export type ActiveSessionOrderByWithAggregationInput = {
    id?: SortOrder
    documentId?: SortOrder
    clientName?: SortOrder
    position?: SortOrder
    expiresAt?: SortOrder
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
    clientName?: StringWithAggregatesFilter<"ActiveSession"> | string
    position?: IntWithAggregatesFilter<"ActiveSession"> | number
    expiresAt?: DateTimeWithAggregatesFilter<"ActiveSession"> | Date | string
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
    createdAt?: DateTimeFilter<"ExtractedField"> | Date | string
    updatedAt?: DateTimeFilter<"ExtractedField"> | Date | string
    document?: XOR<DocumentRelationFilter, DocumentWhereInput>
  }

  export type ExtractedFieldOrderByWithRelationInput = {
    id?: SortOrder
    documentId?: SortOrder
    fieldName?: SortOrder
    value?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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
    createdAt?: DateTimeFilter<"ExtractedField"> | Date | string
    updatedAt?: DateTimeFilter<"ExtractedField"> | Date | string
    document?: XOR<DocumentRelationFilter, DocumentWhereInput>
  }, "id">

  export type ExtractedFieldOrderByWithAggregationInput = {
    id?: SortOrder
    documentId?: SortOrder
    fieldName?: SortOrder
    value?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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
    createdAt?: DateTimeWithAggregatesFilter<"ExtractedField"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ExtractedField"> | Date | string
  }

  export type DocumentCreateInput = {
    id?: string
    type: string
    fileName: string
    status?: $Enums.DocumentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    activeSessions?: ActiveSessionCreateNestedManyWithoutDocumentInput
    extractedFields?: ExtractedFieldCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateInput = {
    id?: string
    type: string
    fileName: string
    status?: $Enums.DocumentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    activeSessions?: ActiveSessionUncheckedCreateNestedManyWithoutDocumentInput
    extractedFields?: ExtractedFieldUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSessions?: ActiveSessionUpdateManyWithoutDocumentNestedInput
    extractedFields?: ExtractedFieldUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSessions?: ActiveSessionUncheckedUpdateManyWithoutDocumentNestedInput
    extractedFields?: ExtractedFieldUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentCreateManyInput = {
    id?: string
    type: string
    fileName: string
    status?: $Enums.DocumentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveSessionCreateInput = {
    id?: string
    clientName: string
    position?: number
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    document: DocumentCreateNestedOneWithoutActiveSessionsInput
  }

  export type ActiveSessionUncheckedCreateInput = {
    id?: string
    documentId: string
    clientName: string
    position?: number
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    document?: DocumentUpdateOneRequiredWithoutActiveSessionsNestedInput
  }

  export type ActiveSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveSessionCreateManyInput = {
    id?: string
    documentId: string
    clientName: string
    position?: number
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtractedFieldCreateInput = {
    id?: string
    fieldName: string
    value: string
    confidence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    document: DocumentCreateNestedOneWithoutExtractedFieldsInput
  }

  export type ExtractedFieldUncheckedCreateInput = {
    id?: string
    documentId: string
    fieldName: string
    value: string
    confidence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExtractedFieldUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    document?: DocumentUpdateOneRequiredWithoutExtractedFieldsNestedInput
  }

  export type ExtractedFieldUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtractedFieldCreateManyInput = {
    id?: string
    documentId: string
    fieldName: string
    value: string
    confidence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExtractedFieldUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtractedFieldUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumDocumentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusFilter<$PrismaModel> | $Enums.DocumentStatus
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

  export type ActiveSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExtractedFieldOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    fileName?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    fileName?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    fileName?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type EnumDocumentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel> | $Enums.DocumentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentStatusFilter<$PrismaModel>
    _max?: NestedEnumDocumentStatusFilter<$PrismaModel>
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

  export type DocumentRelationFilter = {
    is?: DocumentWhereInput
    isNot?: DocumentWhereInput
  }

  export type ActiveSessionCountOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    clientName?: SortOrder
    position?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActiveSessionAvgOrderByAggregateInput = {
    position?: SortOrder
  }

  export type ActiveSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    clientName?: SortOrder
    position?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActiveSessionMinOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    clientName?: SortOrder
    position?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActiveSessionSumOrderByAggregateInput = {
    position?: SortOrder
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

  export type ExtractedFieldCountOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    fieldName?: SortOrder
    value?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExtractedFieldMinOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    fieldName?: SortOrder
    value?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumDocumentStatusFieldUpdateOperationsInput = {
    set?: $Enums.DocumentStatus
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

  export type DocumentCreateNestedOneWithoutActiveSessionsInput = {
    create?: XOR<DocumentCreateWithoutActiveSessionsInput, DocumentUncheckedCreateWithoutActiveSessionsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutActiveSessionsInput
    connect?: DocumentWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
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

  export type DocumentUpdateOneRequiredWithoutExtractedFieldsNestedInput = {
    create?: XOR<DocumentCreateWithoutExtractedFieldsInput, DocumentUncheckedCreateWithoutExtractedFieldsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutExtractedFieldsInput
    upsert?: DocumentUpsertWithoutExtractedFieldsInput
    connect?: DocumentWhereUniqueInput
    update?: XOR<XOR<DocumentUpdateToOneWithWhereWithoutExtractedFieldsInput, DocumentUpdateWithoutExtractedFieldsInput>, DocumentUncheckedUpdateWithoutExtractedFieldsInput>
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

  export type NestedEnumDocumentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusFilter<$PrismaModel> | $Enums.DocumentStatus
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

  export type NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel> | $Enums.DocumentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentStatusFilter<$PrismaModel>
    _max?: NestedEnumDocumentStatusFilter<$PrismaModel>
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

  export type ActiveSessionCreateWithoutDocumentInput = {
    id?: string
    clientName: string
    position?: number
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveSessionUncheckedCreateWithoutDocumentInput = {
    id?: string
    clientName: string
    position?: number
    expiresAt: Date | string
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
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExtractedFieldUncheckedCreateWithoutDocumentInput = {
    id?: string
    fieldName: string
    value: string
    confidence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExtractedFieldCreateOrConnectWithoutDocumentInput = {
    where: ExtractedFieldWhereUniqueInput
    create: XOR<ExtractedFieldCreateWithoutDocumentInput, ExtractedFieldUncheckedCreateWithoutDocumentInput>
  }

  export type ExtractedFieldCreateManyDocumentInputEnvelope = {
    data: ExtractedFieldCreateManyDocumentInput | ExtractedFieldCreateManyDocumentInput[]
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
    clientName?: StringFilter<"ActiveSession"> | string
    position?: IntFilter<"ActiveSession"> | number
    expiresAt?: DateTimeFilter<"ActiveSession"> | Date | string
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
    createdAt?: DateTimeFilter<"ExtractedField"> | Date | string
    updatedAt?: DateTimeFilter<"ExtractedField"> | Date | string
  }

  export type DocumentCreateWithoutActiveSessionsInput = {
    id?: string
    type: string
    fileName: string
    status?: $Enums.DocumentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    extractedFields?: ExtractedFieldCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutActiveSessionsInput = {
    id?: string
    type: string
    fileName: string
    status?: $Enums.DocumentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    extractedFields?: ExtractedFieldUncheckedCreateNestedManyWithoutDocumentInput
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
    type?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    extractedFields?: ExtractedFieldUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutActiveSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    extractedFields?: ExtractedFieldUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentCreateWithoutExtractedFieldsInput = {
    id?: string
    type: string
    fileName: string
    status?: $Enums.DocumentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    activeSessions?: ActiveSessionCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutExtractedFieldsInput = {
    id?: string
    type: string
    fileName: string
    status?: $Enums.DocumentStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    activeSessions?: ActiveSessionUncheckedCreateNestedManyWithoutDocumentInput
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
    type?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSessions?: ActiveSessionUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutExtractedFieldsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activeSessions?: ActiveSessionUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type ActiveSessionCreateManyDocumentInput = {
    id?: string
    clientName: string
    position?: number
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExtractedFieldCreateManyDocumentInput = {
    id?: string
    fieldName: string
    value: string
    confidence?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActiveSessionUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveSessionUncheckedUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActiveSessionUncheckedUpdateManyWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtractedFieldUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtractedFieldUncheckedUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtractedFieldUncheckedUpdateManyWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
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