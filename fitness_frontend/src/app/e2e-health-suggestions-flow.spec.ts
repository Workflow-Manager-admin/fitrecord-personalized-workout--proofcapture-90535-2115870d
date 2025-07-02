import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from './api.service';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { of, throwError } from 'rxjs';

/*
 * End-to-End Flow Unit Test:
 * 1. Enter valid height/weight, save.
 * 2. Route to suggestions, backend returns result.
 * 3. Exercise plan appears in UI.
 * 4. Handles errors gracefully.
 */
describe('End-to-End Flow: Health Data → Exercise Suggestion', () => {
  let apiServiceSpy: any;

  beforeEach(async () => {
    // Plain spy object for all ApiService methods; will override per-test as needed
    apiServiceSpy = {
      submitHealthData: () => {},
      getSuggestionsWithPayload: () => {},
      getToken: () => {},
      getAuthHeaders: () => {},
      setToken: () => {},
      logout: () => {},
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: DashboardComponent },
          { path: 'suggestions', component: SuggestionsComponent }
        ]),
        AppComponent,
        DashboardComponent,
        SuggestionsComponent,
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
      ]
    }).compileComponents();
  });

  function setLocalStorageHeightWeight(height: number, weight: number) {
    // Patch globalThis.window for test env if missing to avoid linter error
    if (typeof globalThis.window === 'undefined') {
      (globalThis as any).window = globalThis;
    }
    // Patch localStorage for unit test shim (lint fix: removed unused 'key' variable)
    if (!('localStorage' in globalThis.window)) {
      let storage: {[k: string]: string} = {};
      (globalThis.window as any).localStorage = {
        getItem: s => (s in storage ? storage[s] : null),
        setItem: (s, v) => { storage[s] = v; },
        removeItem: s => { delete storage[s]; },
        clear: () => { storage = {}; }
      };
    }
    globalThis.window.localStorage.setItem('lastSubmittedHeight', String(height));
    globalThis.window.localStorage.setItem('lastSubmittedWeight', String(weight));
  }

  it('should enter valid data, save, route to suggestions, and display exercise plan from backend', async () => {
    // ARRANGE
    const height = 170;
    const weight = 70;
    const mockBackendSuggestion = {
      exercises: [
        { type: 'Cardio', detail: '15 min running' },
        { type: 'Strength', detail: 'Squat - 3x10' }
      ]
    };

    apiServiceSpy.submitHealthData.and.returnValue(of({ status: 'ok' }));
    apiServiceSpy.getSuggestionsWithPayload.and.returnValue(of(mockBackendSuggestion));
    apiServiceSpy.getToken.and.returnValue('FAKE_JWT');
    apiServiceSpy.getAuthHeaders.and.returnValue({ Authorization: 'Bearer FAKE_JWT' });

    // Simulate localStorage so SuggestionsComponent can fetch numbers
    setLocalStorageHeightWeight(height, weight);

    // Mount dashboard
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.componentInstance.height = height;
    fixture.componentInstance.weight = weight;
    fixture.detectChanges();

    // Simulate the submit (save health data)
    fixture.componentInstance.submit();
    fixture.detectChanges();

    // Simulate what router would do: create a SuggestionsComponent
    const suggFixture = TestBed.createComponent(SuggestionsComponent);
    suggFixture.detectChanges();

    // 1. Should have called submitHealthData on backend with correct params
    expect(apiServiceSpy.submitHealthData).toHaveBeenCalledWith(height, weight);

    // 2. Should have called getSuggestionsWithPayload with those params
    expect(apiServiceSpy.getSuggestionsWithPayload).toHaveBeenCalledWith(height, weight);

    // 3. The routine should match the mock backend
    expect(suggFixture.componentInstance.routine).toEqual(mockBackendSuggestion);

    // 4. Should display exercise routine in the component
    suggFixture.detectChanges();
    const html = suggFixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Cardio');
    expect(html.textContent).toContain('Squat');

    // 5. No error message
    expect(suggFixture.componentInstance.errorMsg).toBe('');
  });

  it('should show user-friendly error if backend fails', async () => {
    // ARRANGE
    const height = 170;
    const weight = 70;
    apiServiceSpy.submitHealthData.and.returnValue(of({ status: 'ok' }));
    apiServiceSpy.getSuggestionsWithPayload.and.returnValue(throwError(() => ({
      status: 500,
      message: 'Internal Server Error',
      error: { message: 'DB offline' }
    })));
    setLocalStorageHeightWeight(height, weight);

    // Mount dashboard and submit valid data
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.componentInstance.height = height;
    fixture.componentInstance.weight = weight;
    fixture.detectChanges();
    fixture.componentInstance.submit();
    fixture.detectChanges();

    // Move to suggestions (simulate navigation)
    const suggFixture = TestBed.createComponent(SuggestionsComponent);
    suggFixture.detectChanges();

    // ASSERT: error should appear, routine should be null
    expect(suggFixture.componentInstance.routine).toBe(null);
    expect(suggFixture.componentInstance.errorMsg).toContain('Could not fetch exercises');
  });

  it('should block route to suggestions and show an error if no height/weight entered', async () => {
    // Simulate no data entered and SuggestionsComponent invoked
    apiServiceSpy.getSuggestionsWithPayload.and.returnValue(of({}));
    if (typeof globalThis.window === 'undefined') {
      (globalThis as any).window = globalThis;
    }
    // Remove any localStorage values
    if (!('localStorage' in globalThis.window)) {
      let storage: {[key: string]: string} = {};
      (globalThis.window as any).localStorage = {
        getItem: (key: string) => null,
        setItem: (key: string, value: string) => { storage[key] = value; },
        removeItem: (key: string) => { delete storage[key]; },
        clear: () => { storage = {}; }
      };
    } else {
      globalThis.window.localStorage.removeItem('lastSubmittedHeight');
      globalThis.window.localStorage.removeItem('lastSubmittedWeight');
    }

    const suggFixture = TestBed.createComponent(SuggestionsComponent);
    suggFixture.detectChanges();

    expect(suggFixture.componentInstance.errorMsg).toContain('Please enter your height and weight');
    expect(suggFixture.componentInstance.routine).toBeNull();
  });
});
