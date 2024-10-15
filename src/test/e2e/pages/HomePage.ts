import type {Locator, Page} from '@playwright/test';

export class HomePage {
    readonly navBar: Locator;
    readonly budgetVisualizerTab: Locator;
    readonly homePageHeading: Locator;

    constructor(public readonly page: Page) {
        this.navBar = this.page.locator('.el-tabs__nav-scroll');
        this.budgetVisualizerTab = this.navBar.getByRole('tab', {
            name: 'budget-visualizer'
        }).locator('span').first()
        this.homePageHeading = this.page.getByRole('heading', { name: 'Home' });
    }

    async goto() {
        await this.page.goto('/');
    }
}