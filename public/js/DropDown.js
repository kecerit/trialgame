

(function(node) {  // Self-executing function for encapsulation.

    // Register the widget in the widgets collection
    // (will be stored at node.widgets.widgets).
    node.widgets.register('DropDown', DropDown);

    // Add Meta-data.

    DropDown.version = '0.0.1';
    DropDown.description = 'This widget creates a basic dropdown menu.';

    DropDown.texts = {
        // Texts here (more info on this later).
    };

    DropDown.sounds = {
        // Sounds here (if any).
    };

    // Title is displayed in the header.
    DropDown.title = '';
    // Classname is added to the widgets.
    DropDown.className = 'DropDown';

    // Dependencies are checked when the widget is created.
    DropDown.dependencies = { JSUS: {} };

    // Constructor taking a configuration parameter.
    // The options object is always existing.
    function DropDown() {
        // You can define widget properties here,
        // but they should get assigned a value in init.

        this.id = null;

        /**
         * ### DropDown.labelText
         *
         * A label text for the input.
         */
        this.mainText = null;

        /**
         * ### DropDown.labelText
         *
         * A label text for the input.
         */
        this.labelText = null;

        /**
         * ### DropDown.choices
         *
         * The array available choices
         */
        this.choices = null;

        /**
         * ### DropDown.tagOption
         *
         * HTML tag options. Either "Datalist" or "Select".
         */
        this.tagOption = null;

        /**
         * ### DropDown.onChange
         *
         * User defined onchange function.
         */
        this.onChange = null;

   }


    DropDown.prototype.init = function(options) {
       // Init widget variables, but do not create
       // HTML elements, they should be created in append.

        if (!this.id) {
            throw new TypeError('DropDown.init: options.id is missing');
        }

        if ('string' === typeof options.mainText) {
            this.mainText = options.mainText;
        }
        else if ('undefined' !== typeof options.mainText) {
            throw new TypeError('DropDown.init: options.mainText must ' +
                                'be string or undefined. Found: ' +
                                options.mainText);
        }

       // Set the labelText, if any.
        if ('string' === typeof options.labelText) {
            this.labelText = options.labelText;
        }
        else if ('undefined' !== typeof options.labelText) {
            throw new TypeError('DropDown.init: options.labelText must ' +
                                'be string or undefined. Found: ' +
                                options.labelText);
        }

        // Add the choices.
        if ('undefined' !== typeof options.choices) {
            this.choices = options.choices;
        }

        if ( "undefined" === typeof options.tagOption ||
        "Datalist" === options.tagOption ||
        "Select" === options.tagOption) {
            this.tagOption = options.tagOption;
        }
        else {
            throw new TypeError('DropDown.init: options.tagOption must ' +
                                'be "Datalist" or "Select". Found: ' +
                                options.tagOption);
        }

        // Set an additional onchange, if any.
        if ('function' === typeof options.onChange) {
            this.onChange = options.onChange;
        }
        else if ('undefined' !== typeof options.onChange) {
            throw new TypeError('ChoiceTable.init: opts.onclick must ' +
                                'be function or undefined. Found: ' +
                                options.onChange);
        }


    }

    // Implements the Widget.append method.
    DropDown.prototype.append = function() {
        // Widgets are Bootstrap panels. The following HTML
        // elements are available at the time when
        // the `append` method is called:
        //
        //   - panelDiv:   the outer container
        //   - headingDiv: the title container
        //   - bodyDiv:    the main container
        //   - footerDiv:  the footer container
        //

        if (W.getElementById(this.id)) {
            throw new Error('DropDown.append: id is not ' +
                            'unique: ' + this.id);
        }
          this.text = document.createElement('p');
          this.text.innerHTML = this.mainText;
          this.bodyDiv.appendChild(this.text);


          this.label = document.createElement('label');
          this.label.innerHTML = this.labelText
          this.bodyDiv.appendChild(this.label);

        if (this.tagOption === "Datalist" || "undefined" === typeof this.tagOption) {
          this.datalist = document.createElement('datalist');
          this.datalist.id = "dropdown"


          this.input = document.createElement('input');
          this.input.setAttribute('list', this.datalist.id);
          this.input.id = this.id;
          this.input.onchange = this.onChange;
          this.bodyDiv.appendChild(this.input);
          this.bodyDiv.appendChild(this.datalist);

          let len = this.choices.length

          for (let i = 0; i < len; i++) {

            this.option = document.createElement('option');
            this.option.value = this.choices[i];
            this.datalist.appendChild(this.option);
          }
        }
        else if (this.tagOption === "Select") {

          this.select = document.createElement('select');
          this.select.id = this.id;
          this.select.onchange = this.onChange;

          this.bodyDiv.appendChild(this.select);

          this.choices.unshift(" ");
          let len = this.choices.length

          for (let i = 0; i < len; i++) {

            this.option = document.createElement('option');
            this.option.value = this.choices[i];
            this.option.innerHTML = this.choices[i];
            this.select.appendChild(this.option);
          }
        }

        this.p = document.createElement('p');
        this.p.id = this.id + "p";
        this.bodyDiv.appendChild(this.p);


    };




})(node);
