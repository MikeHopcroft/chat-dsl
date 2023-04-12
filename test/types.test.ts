import * as t from '../src/dsl/types';

describe('primitive types', () => {
  test('primititves', () => {
    expect(t.Boolean.tag).toBe(t.Types.Boolean);
    expect(t.Number.tag).toBe(t.Types.Number);
    expect(t.String.tag).toBe(t.Types.String);

    expect(t.check(t.Boolean, t.Boolean)).toBe(true);
    expect(t.check(t.Boolean, t.Number)).toBe(false);
    expect(t.check(t.Boolean, t.String)).toBe(false);

    expect(t.check(t.Number, t.Boolean)).toBe(false);
    expect(t.check(t.Number, t.Number)).toBe(true);
    expect(t.check(t.Number, t.String)).toBe(false);

    expect(t.check(t.String, t.Boolean)).toBe(false);
    expect(t.check(t.String, t.Number)).toBe(false);
    expect(t.check(t.String, t.String)).toBe(true);
  });

  test('tuples', () => {
    const t1a = t.Tuple(t.String, t.Boolean);
    const t1b = t.Tuple(t.String, t.Boolean);
    const t2 = t.Tuple(t.Number, t.Boolean);
    const t3a = t.Tuple(t1a, t2);
    const t3b = t.Tuple(t1b, t2);
    const t4 = t.Tuple(t2, t2);

    expect(t1a.tag).toBe(t.Types.Tuple);

    expect(t.check(t1a, t1b)).toBe(true);
    expect(t.check(t1a, t2)).toBe(false);
    expect(t.check(t3a, t3b)).toBe(true);
    expect(t.check(t3a, t4)).toBe(false);
  });

  test('functions', () => {
    const f1a = t.Function([t.String, t.Boolean], t.Number);
    const f1b = t.Function([t.String, t.Boolean], t.Number);
    const f2 = t.Function([t.Number, t.Boolean], t.Number);
    const f3 = t.Function([t.String, t.Boolean], t.String);

    expect(f1a.tag).toBe(t.Types.Function);

    expect(t.check(f1a, f1b)).toBe(true);
    expect(t.check(f1a, f2)).toBe(false);
    expect(t.check(f1a, f3)).toBe(false);
  });

  test('static type checking', () => {
    const func = t.Function([t.String, t.Boolean], t.Number);
    const tuple = t.Tuple(
      t.Tuple(t.String, t.Boolean),
      t.Tuple(t.Number, t.Boolean)
    );

    // These lambda expressions will force a compile error if the runtime types
    // are not compatible with the TypeScript return types.
    const f = [
      (a: t.Typeof<typeof t.Boolean>): boolean => a,
      (a: t.Typeof<typeof t.Number>): number => a,
      (a: t.Typeof<typeof t.String>): string => a,
      (a: t.Typeof<typeof func>): ((p1: string, p2: boolean) => number) => a,
      (a: t.Typeof<typeof tuple>): [[string, boolean], [number, boolean]] => a,
    ];

    expect(f).toBeDefined();
  });
});
