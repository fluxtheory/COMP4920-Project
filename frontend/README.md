# How to get lit with the frontend
## TLDR get me started
* cd `frontend/`
* `npm install`
* `npm start`
* *write code* (see changes in browser)
* Kick Wobcke's ass
* Profit
## Some javascript things
### NPM
* This will take care of managing your packing
* To install a package, the magic words are `npm install [library-name]`
* But other people also need to know about the awesome library you are using
* So chuck `npm install --save [library-name]`
* This will add that library as a dependency to the project, in a file called `package.json`
* `npm install` will install everything specified in the `package.json` file
* A good way to find a library is to google `npm [functionality you desire]`

## VSCode
* The development environment is of course personal, but this is what works for me.
* Pretty much everything you need to know about vscode is to use <kbd>ctrl</kbd> + <kbd>p</kbd>   
    * Start typing to fuzzy search your files
    * Type <kbd>#</kbd> to search any symbol in your codebase
        * functions
        * variables
        * components
        * ...
    * Type <kbd>></kbd> to enter a system command
        * It's a decent search so enter whatever you desire to change with regards to the editor
        * A good time to try `recommended extensions` and install those
* <kbd>ctrl</kbd> + <kbd>`</kbd> to see errors, and a cool in-editor terminal 

## Development
### PSA
* Everything is not meant make sense off the bat
* Don't worry about being perfect (it takes balls). *Just keep swimming*.
* Please ask if you're on a problem/concept for more than 10 mins
    * Most things react aren't about competence or aptitude, lot's of gotchas you learn only by experience.
    * I also enjoy helping people :)
### React
* Let's try to use functional react (no class components)
    * It's the way of the future
    * Probably not intuitive at first, but trust me it's nice :)
    * This means you won't have the [component life cycle methods](https://programmingwithmosh.com/javascript/react-lifecycle-methods/) you may or may not be used to
    * Instead we have [react hooks](https://reactjs.org/docs/hooks-intro.html)
        * The only two you need to worry about starting off are:
            * [useState()](https://reactjs.org/docs/hooks-state.html)
            * [useEffect()](https://reactjs.org/docs/hooks-effect.html)
### Making things look pretty
* Using a component library like Material UI is probably worth. It's quick (once you make friends with it) and convenient, despite it looking ikea-esque generic.
* This is the flow that works for me:
    * Going to the [components page](https://material-ui.com/components/buttons/)
    * Choose the component you want (e.g. buttons, menus, app bars...)
    * Look at the example code they provide on the page and slap it into the code base
    * You can fine tune things by looking at the individual component API at the bottom of that page.
* We'll also need to use CSS for certain things
    * There's heaps of ways to do this, let's just [pick one](https://material-ui.com/styles/basics/#hook-api) (stick with material ui because the less libraries the better)
### Routing
* We'll be using [react-router](https://reacttraining.com/react-router/web/guides/quick-start) for routing. It's the industry standard.
* There's not much to this, the only 2 things you'll want to know about are:
    * [Route](https://reacttraining.com/react-router/web/api/Route) - Attaches a component to a route `/home`, `/chat`, etc.
    * [Link](https://reacttraining.com/react-router/web/api/Link) - Basically a hyperlink to somewhere on our own site.
### Examples
#### Writing a component
```jsx
import React from 'react' // import this anytime you return jsx (things with angle brackets)
import { SomeJSX } from '../components/SomeJSX'; // import any components you use

const  Component = () => {
    // ... 
    // normal imperative javascript

    return (
        <div>
            <SomeJSX />
        </div>
    );
}

export { Component }; // make sure to export, so other components can use this.
```
* NOTE: if you're using vscode and installed the recommended extensions
    * It will autocomplete the imports for you, just start typing the component, function, anything you've exported
    * It will format your code for you when save the file :)
