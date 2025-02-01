import Registry from './registry.container';

export default function inject(name: string) {
  return function (target: any, context: ClassFieldDecoratorContext) {
    if (context.kind !== 'field') {
      throw new Error('inject can only be used on class fields');
    }

    Object.defineProperty(target, context.name, {
      get() {
        return Registry.getInstance().inject(name);
      },
      enumerable: true,
      configurable: true,
    });
  };
}
