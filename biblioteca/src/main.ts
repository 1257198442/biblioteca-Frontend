import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

sessionStorage.clear();
console.log("  _     ___ ____  ____      _    ______   __\n" +
  " | |   |_ _| __ )|  _ \\    / \\  |  _ \\ \\ / /\n" +
  " | |    | ||  _ \\| |_) |  / _ \\ | |_) \\ V / \n" +
  " | |___ | || |_) |  _ <  / ___ \\|  _ < | |  \n" +
  " |_____|___|____/|_| \\_\\/_/   \\_\\_| \\_\\|_|  ")

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
