import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

describe('EditTexts source', () => {
    it('uses the local-only localisation contract', () => {
        const source = readFileSync(path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            '../src/bulma/pages/localisation/EditTexts.vue',
        ), 'utf8');

        expect(source).not.toContain('filterCore');
        expect(source).not.toContain('system.localisation.merge');
        expect(source).not.toContain('Merge all localisation files');
        expect(source).not.toContain('subDir');
        expect(source).toContain("system.localisation.getLangFile");
        expect(source).toContain("system.localisation.saveLangFile");
    });
});
