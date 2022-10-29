import { AType, makeTagged as makeTagged_, Materialized } from '@morphic-ts/summoners';
import { InterpreterURI } from '@morphic-ts/summoners/lib/InterpreterResult';
import { ProgramURI } from '@morphic-ts/summoners/lib/ProgramType';
import { TaggedUnionProg, UnionTypes } from '@morphic-ts/summoners/lib/tagged-union';
import { InhabitedTypes } from '@morphic-ts/summoners/lib/utils';

export type AnyH = InhabitedTypes<any, any, any> & { readonly tag: string };

export type TagsOf<X extends InhabitedTypes<any, any, any> & { readonly tag: string }> =
  AType<X>[X['tag']];

export type Narrow<AU, U extends { readonly tag: string }, Tag> = Extract<
  AU,
  { readonly [GG in U['tag']]: Tag }
>;

export type TypeOf<
  G extends { readonly Union: AnyH },
  UnionMorph extends G['Union'] = G['Union'],
  UnionType extends AType<UnionMorph> = AType<UnionMorph>
> = {
  readonly [Tag in TagsOf<UnionMorph>]: Narrow<UnionType, UnionMorph, Tag>;
} & {
  readonly Union: UnionType;
};

export type MakeUnion = <ProgURI extends ProgramURI, InterpURI extends InterpreterURI, R>(
  summ: <E, A>(F: TaggedUnionProg<R, E, A, ProgURI>) => Materialized<R, E, A, ProgURI, InterpURI>
) => <Tag extends string>(
  tag: Tag
) => <Types extends UnionTypes<Types, Tag, ProgURI, InterpURI, R>>(
  types: Types
) => Types & {
  readonly Union: import('@morphic-ts/summoners/lib/tagged-union').MorphADT<
    {
      readonly [k in keyof Types]: Types[k] extends InhabitedTypes<any, infer E_1, infer A_2>
        ? readonly [E_1, A_2]
        : never;
    },
    Tag,
    ProgURI,
    InterpURI,
    R
  >;
};

export const makeUnion: MakeUnion = (summ) => (tag) => (types) => ({
  ...types,
  Union: makeTagged_(summ)(tag)(types),
});
