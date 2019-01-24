import { withSnippet } from '@hmh/lit-element-tester';
import { SinonStub, stub } from 'sinon';
import { MyComponent } from '../components/my-component';

const expect: Chai.ExpectStatic = chai.expect;

const fakeQuote = 'There is nothing permanent except change.';

describe(`<my-component>`, (): void => {
    let fetchStub: SinonStub;

    beforeEach(() => {
        const responseData = {};
        fetchStub = stub(window, 'fetch').returns(
            Promise.resolve(new Response(JSON.stringify(responseData), { headers: { 'Content-Type': 'application/json' } }))
        );
    });

    it('should render default state', async (): Promise<void> => {
        withSnippet('default');
        const el: MyComponent = document.querySelector('my-component');
        await el.updateComplete;

        expect(el.shadowRoot).not.to.be.undefined;
        const heading: HTMLHeadingElement = el.shadowRoot.querySelector('h3');
        expect(heading.innerText).to.equal('Hello World!');
        const paragraph: HTMLParagraphElement = el.shadowRoot.querySelector('p.quote');

        expect(paragraph.innerText).to.deep.equal('loading...');

        await new Promise((done: any) => {
            setTimeout(() => {
                expect(paragraph.innerText).to.deep.equal(fakeQuote);
                done();
            }, 0);
        });
    });

    it('should render with provided name attribute', async (): Promise<void> => {
        withSnippet('with-name');
        const el: MyComponent = document.querySelector('my-component');
        await el.updateComplete;

        expect(el.shadowRoot).not.to.be.undefined;
        const heading: HTMLHeadingElement = el.shadowRoot.querySelector('h3');
        expect(heading.innerText).to.equal('Hello John!');
    });

    it('should update when name is changed', async (): Promise<void> => {
        withSnippet('default');
        const el: MyComponent = document.querySelector('my-component');
        await el.updateComplete;

        expect(el.shadowRoot).not.to.be.undefined;
        const heading: HTMLHeadingElement = el.shadowRoot.querySelector('h3');
        expect(heading.innerText).to.equal('Hello World!');

        el.name = 'Jane';
        await el.updateComplete;
        expect(heading.innerText).to.equal('Hello Jane!');
    });

    afterEach(() => {
        fetchStub.restore();
    });
});

mocha.run();
