import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { registerLicense } from '@syncfusion/ej2-base';

// Register the Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF5cXmZCeUx3Rnxbf1x0ZFdMYlpbRX9PMyBoS35RckVlWHxecnZSRGhVUkBy');

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));