import { getRollupConfig } from '@cpuchain/rollup';

const config = [
    getRollupConfig({ input: './src/index.ts', external: [] }),
    getRollupConfig({ input: './src/example.ts', external: [] }),
]

export default config;