

(function(node) {  // Self-executing function for encapsulation.

    // Register the widget in the widgets collection
    // (will be stored at node.widgets.widgets).
    node.widgets.register('DropDown', DropDown);

    // Add Meta-data.

    DropDown.version = '0.0.1';
    DropDown.description = 'This widget creates a basic dropdown menu.';

    DropDown.texts = {
        // Texts here (more info on this later).
        error: function() {

            return 'There is something wrong.';
        }
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
         * ### DropDown.menu
         *
         * Main HTML tag depend on the value of DropDown.tag
         */

        this.menu = null;

        /**
         * ### DropDown.listener
         *
         * The main function listening on changes
         *addEventListener
         * @see DropDown.onchange
         */

         var that;
         that = this;

         this.listener = function(e) {
             var  menu;

             e = e || window.event;
             menu = e.target || e.srcElement;

             that.currentChoice = menu.value;
             // Relative time.
             if ('string' === typeof that.timeFrom) {
                 that.timeCurrentChoice = node.timer.getTimeSince(that.timeFrom);
             }
             // Absolute time.
             else {
                 that.timeCurrentChoice = Date.now ?
                     Date.now() : new Date().getTime();
             }

             // One more change.
             that.numberOfChanges++;

             // Remove any warning/errors on change.
             if (that.isHighlighted()) that.unhighlight();

             // Call onclick, if any.
             if (that.onChange) {

                that.onChange.call();
             }

         };

        /**
         * ### DropDown.onChange
         *
         * User defined onchange function.
         */
        this.onChange = null;

        /**
         * ### DropDown.timeCurrentChoice
         *
         * Time when the last choice was made
         */
        this.timeCurrentChoice = null;

        /**
         * ### DropDown.timeFrom
         *
         * Time is measured from timestamp as saved by node.timer
         *
         * Default event is a new step is loaded (user can interact with
         * the screen). Set it to FALSE, to have absolute time.
         *
         * @see node.timer.getTimeSince
         */
        this.timeFrom = 'step';

        /**
         * ### DropDown.numberOfChanges
         *
         * Total number of changes between different choices
         */
        this.numberOfChanges = 0;


        /**
         * ### DropDown.currentChoice
         *
         * Choice associated with currently selected cell/s
         *
         * The field is a  number.
         */
        this.currentChoice = null;


        /**
         * ###  DropDown.shuffleChoices
         *
         * If TRUE, choices are shuffled.
         */
        this.shuffleChoices = null;

        /**
         * ### DropDown.order
         *
         * The current order of display of choices
         *
         */
        this.order = null;

        /**
         * ### DropDown.errorBox
         *
         * An HTML element displayed when a validation error occurs
         */
        this.errorBox = null;


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
          var order = this.order;
          var p = this.p;

          text = document.createElement('p');
          text.innerHTML = this.mainText;
          this.bodyDiv.appendChild(text);

          label = document.createElement('label');
          label.innerHTML = this.labelText
          this.bodyDiv.appendChild(label);

        if (tag === "Datalist" || "undefined" === typeof tag) {

          var datalist = this.datalist;
          var input = this.input;

          datalist = document.createElement('datalist');
          datalist.id = "dropdown"

          input = document.createElement('input');
          input.setAttribute('list', datalist.id);
          input.id = this.id;
          input.onchange = this.listener;
          if (placeHolder) { input.placeholder = placeHolder;}
          this.bodyDiv.appendChild(input);
          this.bodyDiv.appendChild(datalist);
          this.menu = input;

        }
        else if (tag === "Select") {

          var select = this.select;

          select = document.createElement('select');
          select.id = this.id;
          select.onchange = this.listener;
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
          this.menu = select;
        }

        let len = choices.length;
        order = J.seq(0, len-1);
        if (this.shuffleChoices) order = J.shuffle(order);

        for (let i = 0; i < len; i++) {

          option = document.createElement('option');
          option.value = choices[order[i]];
          option.innerHTML = choices[order[i]];

          if (tag === "Datalist" || "undefined" === typeof tag) {
          datalist.appendChild(option);
          }
          else if (tag === "Select") {
          select.appendChild(option);
          }
        }

        this.errorBox = W.append('div', this.bodyDiv, { className: 'errbox' });

        p = document.createElement('p');
        p.id = this.id + "p";
        this.bodyDiv.appendChild(p);



    };

    /**
     * ### ChoiceTable.setError
     *
     * Set the error msg inside the errorBox.
     *
     * @param {string} The error msg (can contain HTML)
     *
     * @see DropDown.errorBox
     */
    DropDown.prototype.setError = function(err) {
        // TODO: the errorBox is added only if .append() is called.
        // However, ChoiceTableGroup use the table without calling .append().
        if (this.errorBox) this.errorBox.innerHTML = err || '';
        if (err) this.highlight();
        else this.unhighlight();
    };

    /**
     * ### DropDown.highlight
     *
     * Highlights the input.
     *
     * @param {string} The style for the table's border.
     *   Default '3px solid red'
     *
     * @see DropDown.highlighted
     */
    DropDown.prototype.highlight = function(border) {
        if (border && 'string' !== typeof border) {
            throw new TypeError('DropDown.highlight: border must be ' +
                                'string or undefined. Found: ' + border);
        }
        if (this.highlighted) return;
        this.menu.style.border = border || '3px solid red';
        this.highlighted = true;
        this.emit('highlighted', border);
    };

    /**
     * ### DropDown.unhighlight
     *
     * Removes highlight.
     *
     * @see DropDown.highlighted
     */
    DropDown.prototype.unhighlight = function() {

        if (this.highlighted !== true) return;
        this.menu.style.border = '';
        this.highlighted = false;
        this.setError();
        this.emit('unhighlighted');
    };







})(node);
