A simple nodejs lib for handling feature flags through typescript decorators.
Define the flags by remote url (json response), inline, or environment variables.

#### Install

```sh
$ npm install flips-client --save
```

#### Usage

```
import Flips, { FlipsConfig } from 'flips-client'

const flipped = new Flips(<FlipsConfig>{json: {features: [{feature:"hello", switchedOn: true}]}})

//...

class App {
  @flipped.on("hello")
  works (input): any {
    return input;
  }
  
  @flipped.on("bye")
  wontwork (input): any {
    return input;
  }
}

const app = new App();

console.log(app.works("Yay"));      // logs "Yay"
console.log(app.wontwork("Sorry"))  // logs "false"

//...
```

#### Or in js
As the decorators are not available use the ```by``` function
```
var Flips = require("flips-client").default;

const flipped = new Flips({json: {features: [{feature:"hello", switchedOn: true}]}});

console.log("true => ", flipped.by("hello"))
console.log("false => ", flipped.by("not"))
```