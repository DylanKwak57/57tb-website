// node 시험에서 확장자 없는 상대 import(`./inviteCode`)를 `.ts` 로 찾게 하는 작은 훅(11/26).
// 쓰는 법: node --experimental-strip-types --import ./tests/ts-resolve.mjs --test tests/invite-track.test.mjs
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context);
    } catch (e) {
      if (specifier.startsWith('.') && !/\.[cm]?[jt]sx?$/.test(specifier)) return next(`${specifier}.ts`, context);
      throw e;
    }
  },
});
