# logger-chain

[![NPM Version](https://img.shields.io/npm/v/logger-chain)](https://www.npmjs.com/package/logger-chain)

Zero deps simple node.js logger with colored outputs

### How to use

```bash
$ yarn add logger-chain
```

```ts
import { Logger } from 'logger-chain';

const logger = new Logger();

const logger2 = new Logger(undefined, 'Main');

const logger3 = new Logger(undefined, 'Main2', 'MainFunc');

logger.debug('this is test');

logger2.debug('this is test');

logger2.info('this is test');

logger2.warning('this is test');

logger2.error('this is test');

logger3.debug('this is test');

logger2.debug('Main', 'MainFunc2', 'this is test');

logger2.debug('Main', 'MainFunc3', 'this is test', 'subtest');

logger2.warning('Main', 'MainFunc', 'this is warning');
```
