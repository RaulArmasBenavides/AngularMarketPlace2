import { UrlsecurePipe } from './urlsecure.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('UrlsecurePipe', () => {
  it('should create an instance', () => {
    const fakeSanitizer = {
      bypassSecurityTrustResourceUrl: (val: string) => val
    } as unknown as DomSanitizer;

    const pipe = new UrlsecurePipe(fakeSanitizer);
    expect(pipe).toBeTruthy();
  });
});
