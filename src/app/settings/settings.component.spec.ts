import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ng2-cookies';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SettingsService } from '../home/services/settingsService';
import { Settings } from './settings';
import { SettingsComponent } from './settings.component';


describe('SettingsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SettingsComponent
      ],
      imports: [
        HttpClientModule,
        FormsModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        CookieService,
        SettingsService,
      ],
    }).compileComponents();
  });

  // Init component
  function initComponent() {
    const fixture = TestBed.createComponent(SettingsComponent);
    return fixture.componentInstance;
  }

  it('Switch theme without saving', () => {
    const app = initComponent();

    // First theme variable
    expect(app.settingsDict.isDarkTheme).toEqual(false);
    app.switchTheme();
    expect(app.settingsDict.isDarkTheme).toEqual(false);
  });

  it('Switch theme and saving', () => {
    const app = initComponent();

    // First theme variable
    expect(app.settingsDict.isDarkTheme).toEqual(false);
    app.switchTheme();
    app.saveSettings();
    expect(app.settingsDict.isDarkTheme).toEqual(true);
  });

  it('add new cookie', () => {
    const app = initComponent();
    const cookieService: CookieService = new CookieService();
    cookieService.deleteAll();
    expect(cookieService.get('settings_cookie')).toEqual('');
    app.addCookie();
    const settingsToMatch: string = JSON.stringify(new Settings(20, false));
    const receivedSettings: string = cookieService.get('settings_cookie');
    
    expect(receivedSettings).toEqual(settingsToMatch);
    cookieService.deleteAll();
  });

  it('update existing cookie', () => {
      const app = initComponent();
      const cookieService: CookieService = new CookieService();
      cookieService.deleteAll();

      const baseSettings: Settings = new Settings(20, false);
      const newSettings: Settings = new Settings(10, true);

      // Create the base cookie
      expect(cookieService.check('settings_cookie')).toEqual(false);
      cookieService.set('settings_cookie', baseSettings.toString());
      expect(cookieService.check('settings_cookie')).toEqual(true);

      expect(cookieService.get('settings_cookie')).toEqual(baseSettings.toString());

      // Update cookie with new settings
      app.settingsDict = newSettings;
      app.addCookie();
      expect(cookieService.get('settings_cookie')).toEqual(JSON.stringify(newSettings));

      cookieService.deleteAll();
  });

  it('remove cookies', () => {
    const app = initComponent();
    const cookieService: CookieService = new CookieService();
    cookieService.deleteAll();
    cookieService.set('settings_cookie', 'test_cookie');
    expect(cookieService.check('settings_cookie')).toEqual(true);
    spyOn(app, 'refreshPage'); // Prevent tests to refresh the page
    app.removeCookies();
    expect(cookieService.check('settings_cookie')).toEqual(false);
  });

  it('reset settings and adding a fresh cookie', () => {
    const app = initComponent();
    const cookieService: CookieService = new CookieService();
    cookieService.deleteAll();

    app.settingsDict = new Settings(10, true); // Custom settings
    app.addCookie();
    cookieService.set('settings_cookie', 'test_cookie');
    expect(cookieService.check('settings_cookie')).toEqual(true);
    app.resetSettings();

    const settingsToMatch: Settings = new Settings(20, false); // Defaul settings
    expect(cookieService.get('settings_cookie')).toEqual(JSON.stringify(settingsToMatch));
    cookieService.deleteAll();
  });

});