import { translocoConfig } from '@ngneat/transloco';

export default translocoConfig({
  availableLangs: ['es', 'en'],
  defaultLang: 'es',
  reRenderOnLangChange: true,
  prodMode: false
});
