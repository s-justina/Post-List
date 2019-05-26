interface ComponentData {
    props?: any
    template: (props: any) => string | string;
}


export class Component {
    elem: string | HTMLElement;
    template: (props: any) => string | string;
    props?: any;

    constructor(elem, {props, template}: ComponentData){
        if (!elem) throw 'You did not provide an element to make into a component.';
        this.elem = elem;
        this.props = props;
        this.template = template;
    }

    // Sanitization for safety reasons
    private sanitize (str): string {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };


    // Component's render function
    public render (): object {

        // Make sure there's a template
        if (!this.template) throw 'No template was provided.';

        // If elem is an element, use it.
        // If it's a selector, get it.
        console.log(typeof this.elem);
        const elem = typeof this.elem === 'string' ? document.querySelector(this.elem) : this.elem;
        if (!elem) return;

        // Get the template
        const template = (typeof this.template === 'function' ? this.template(this.props) : this.template);
        if (['string', 'number'].indexOf(typeof template) === -1) return;

        // Render the template into the element
        if (elem.innerHTML === template) return;
        elem.innerHTML = template;

        // Dispatch a render event
        if (typeof window.event === 'function') {
            const event = new CustomEvent('render', {
                bubbles: true
            });
            elem.dispatchEvent(event);
        }

        // Return the elem for use elsewhere
        return elem;

    }

    public setProps(props: any){
        this.props = props;
    }
}






