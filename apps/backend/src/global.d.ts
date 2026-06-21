declare module 'class-validator' {
  export function IsString(options?: any): PropertyDecorator;
  export function IsOptional(options?: any): PropertyDecorator;
  export function IsEnum(entity: object, options?: any): PropertyDecorator;
  export function IsBoolean(options?: any): PropertyDecorator;
  export function IsNotEmpty(options?: any): PropertyDecorator;
  export function MinLength(min: number, options?: any): PropertyDecorator;
  export function Matches(pattern: RegExp, options?: any): PropertyDecorator;
  export function IsEmail(options?: any): PropertyDecorator;
  export function IsNumber(options?: any): PropertyDecorator;
  export function IsDateString(options?: any): PropertyDecorator;
  export function IsArray(options?: any): PropertyDecorator;
  export function Min(min: number, options?: any): PropertyDecorator;
  export function Max(max: number, options?: any): PropertyDecorator;
  export function ArrayMaxSize(max: number, options?: any): PropertyDecorator;
  export function IsMongoId(options?: any): PropertyDecorator;
  export function IsIn(values: readonly any[], options?: any): PropertyDecorator;
}
