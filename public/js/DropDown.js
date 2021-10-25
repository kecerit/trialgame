
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
         * ### DropDown.placeHolder.
         *
         * A placeHolder text for the input.
         */
        this.placeHolder = null;

        /**
         * ### DropDown.choices
         *
         * The array available choices
         */
        this.choices = null;

        /**
         * ### DropDown.tag
         *
         * HTML tag options. Either "Datalist" or "Select".
         */
        this.tag = null;

        /**
         * ### DropDown.onChange
         *
         * User defined onchange function.
         */
        this.onChange = null;


        /**
         * ###  DropDown.shuffleChoices
         *
         * If TRUE, choices are shuffled.
         */
        this.shuffleChoices = null;

   }


    DropDown.prototype.init = function(options) {
       // Init widget variables, but do not create
       // HTML elements, they should be created in append.

       var tmp;

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

        // Set the placeHolder text, if any.
         if ('string' === typeof options.placeHolder) {
             this.placeHolder = options.placeHolder;
         }
         else if ('undefined' !== typeof options.placeHolder) {
             throw new TypeError('DropDown.init: options.placeHolder must ' +
                                 'be string or undefined. Found: ' +
                                 options.placeHolder);
         }

        // Add the choices.
        if ('undefined' !== typeof options.choices) {
            this.choices = options.choices;
        }

        if ( "undefined" === typeof options.tag ||
        "Datalist" === options.tag ||
        "Select" === options.tag) {
            this.tag = options.tag;
        }
        else {
            throw new TypeError('DropDown.init: options.tag must ' +
                                'be "Datalist" or "Select". Found: ' +
                                options.tag);
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

        // Option shuffleChoices, default false.
        if ('undefined' === typeof options.shuffleChoices) tmp = false;
        else tmp = !!options.shuffleChoices;
        this.shuffleChoices = tmp;


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
          var text = this.text;
          var label = this.label;
          var tag = this.tag;
          var option = this.option;
          var choices = this.choices;
          var placeHolder = this.placeHolder;
          var p = this.p;

          text = document.createElement('p');
          text.innerHTML = this.mainText;
          this.bodyDiv.appendChild(text);

          label = document.createElement('label');
          label.innerHTML = this.labelText
          this.bodyDiv.appendChild(label);

        if (this.shuffleChoices) choices = shuffle(choices);

        if (tag === "Datalist" || "undefined" === typeof tag) {

          var datalist = this.datalist;
          var input = this.input;

          datalist = document.createElement('datalist');
          datalist.id = "dropdown"

          input = document.createElement('input');
          input.setAttribute('list', datalist.id);
          input.id = this.id;
          input.onchange = this.onChange;
          if (placeHolder) { input.placeholder = placeHolder;}
          this.bodyDiv.appendChild(input);
          this.bodyDiv.appendChild(datalist);

        }
        else if (tag === "Select") {

          var select = this.select;

          select = document.createElement('select');
          select.id = this.id;
          select.onchange = this.onChange;
          if (placeHolder) {
          option = document.createElement('option');
          option.value = "";
          option.innerHTML = placeHolder;
          option.setAttribute("disabled","");
          option.setAttribute("selected","");
          option.setAttribute("hidden","");
          select.appendChild(option);
          }

          this.bodyDiv.appendChild(select);
        }

        let len = choices.length;

        for (let i = 0; i < len; i++) {

          option = document.createElement('option');
          option.value = choices[i];
          option.innerHTML = choices[i];

          if (tag === "Datalist" || "undefined" === typeof tag) {
          datalist.appendChild(option);
          }
          else if (tag === "Select") {
          select.appendChild(option);
          }
        }


        p = document.createElement('p');
        p.id = this.id + "p";
        this.bodyDiv.appendChild(p);


    };


    /**
   * ### shuffle
   *
   * Shuffles the choice array.
   *
   * @param {choices}  array of choices
   *
   * @return {choices} new array of choices
   */

   function shuffle(choicesArray) {
   return choicesArray.sort(() => J.random() - 0.5);
   }




})(node);
