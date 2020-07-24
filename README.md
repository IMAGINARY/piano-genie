# Piano Genie

Adaptation of the Piano Genie web demo for use in the I AM AI exhibition website.

Have fun playing piano like a virtuoso with the help of machine learning!

Use the **1-8** numbered keys on your keyboard (or the home row **a-f** and **j-;**) or 
**touch** the coloured blocks to play the piano. Use the **space bar** to control the 
sustain pedal. 

The more you pretend you're a real player, the better the melody (and you!) will sound.

## Configuration

The app can be configured through the config.json file in its root directory.

Keys supported are:

- **defaultLanguage** (string): Default language, indicated as an ISO two letter code.

## Query string options

The following query string options are supported

- **embed**: Add this query string if the app is run embedded in another page.

## Compilation

This app is built using several compilable languages:

- The HTML pages are built from **pug** template files.
- The CSS stylesheet is pre-compiled from **sass** files.
- The JS scripts are trans-compiled from **es6** (ES2015) files. 

To make any modifications re-compilation is necessary. You should install:

- **node** and **npm**
- **yarn**
- **gulp** (install globally)

Afterwards run the following in the command line:

```
cd src
yarn
```

After it runs succesfuly you can compile as needed:

- **sass (stylesheets)**
    ```
    gulp styles
    ```
  
- **scripts (ES6)**
    ```
    gulp scripts
    gulp dependencies
    ```

Either of these can be run separately.

- **pug (HTML pages)**
    ```
    gulp html
    ```

- **all**
    ```
    yarn run build
    ```

- **Watch and compile automatically on changes**
    ```
    gulp watch
    ```

## Credits

Piano Genie was created by Chris Donahue, Ian Simon, Sander Dieleman and is part of the Google 
Magenta project.

This version is an adaptation by Eric Londaits (IMAGINARY gGmH), for use in the I AM AI exhibition 
website.

## License

Audio samples based on [SGM](https://web.archive.org/web/20180715062911/http://www.geocities.jp/shansoundfont/) 
with modifications by [John Nebauer](https://sites.google.com/site/soundfonts4u/).

Copyright 2020 IMAGINARY gGmbH. All Rights Reserved.
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License (see LICENSE).
