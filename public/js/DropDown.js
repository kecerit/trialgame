

(function(node) {  // Self-executing function for encapsulation.

    // Register the widget in the widgets collection
    // (will be stored at node.widgets.widgets).
    node.widgets.register('DropDown', DropDown);

    // Add Meta-data.

    DropDown.version = '0.1.0';
    DropDown.description = 'Creates a configurable dropdown menu.';

    DropDown.texts = {
        // Texts here (more info on this later).
        error: function (w, value) {
            if (value !== null && w.fixedChoice &&
                w.choices.indexOf(value) < 0) {
                return 'No custom values allowed.'
            }
            if (value !== null && w.correctChoice !== null) {
                return 'Not correct, try again.';
            }
            if (value !== null && w.verifyChoice().err) {
                return w.verifyChoice().err;
            }

            return 'Answer required.';
        }
    };

    DropDown.sounds = {
        // Sounds here (if any).
    };

    // Title is displayed in the header.
    DropDown.title = '';
    // Classname is added to the widgets.
    DropDown.className = 'dropdown';

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
         * HTML tag options. Either "datalist" or "select".
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


        this.listener = function (e) {
            var menu, timeout;

            e = e || window.event;
            menu = e.target || e.srcElement;

            that.currentChoice = menu.value;
            if (that.currentChoice.length === 0) that.currentChoice = null;
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

            if (timeout) clearTimeout(timeout);

            timeout = setTimeout(function () {
                that.verifyChoice();
                if (that.verifyChoice().err) {
                    that.setError(that.verifyChoice().err)
                }

            }, that.validationSpeed);

            // Call onchange, if any.
            if (that.onchange) {


                that.onchange(that.currentChoice, that);
            }

        };

        /*
         * ### DropDown.onchange
         *
         * User defined onchange function.
         */
        this.onchange = null;

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

        /**
         * ### DropDown.correctChoice
         *
         * The correct choice/s
         *
         * The field is an array or number|string.
         *
         */
        this.correctChoice = null;

        /**
         * ### DropDown.requiredChoice
         *
         * If True, a choice is required.
         */
        this.requiredChoice = null;

        /**
         * ### DropDown.fixedChoice
         *
         * If True, custom values in menu do not validated.
         */
        this.fixedChoice = null;

        /**
        * ### DropDown.inputWidth
        *
        * The width of the input form as string (css attribute)
        *
        * Some types preset it automatically
        */
        this.inputWidth = null;

        /**
          * ### CustomInput.userValidation
          *
          * An additional validation executed after the main validation function
          *
          * The function returns an object like:
          *
          * ```javascript
          *  {
          *    value: 'validvalue',
          *    err:   'This error occurred' // If invalid.
          *  }
          * ```
          */
        this.validation = null;

        /**
         * ### DropDown.validationSpeed
         *
         * How often (in milliseconds) the validation function is called
         *
         * Default: 500
         */
        this.validationSpeed = 500;



    }


    DropDown.prototype.init = function (options) {
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

        // Option requiredChoice, if any.
        if ('boolean' === typeof options.requiredChoice) {
            this.requiredChoice = options.requiredChoice;
        }
        else if ('undefined' !== typeof options.requiredChoice) {
            throw new TypeError('DropDown.init: options.requiredChoice ' +
                'be boolean or undefined. Found: ' +
                options.requiredChoice);
        }

        // Add the correct choices.
        if ('undefined' !== typeof options.correctChoice) {
            if (this.requiredChoice) {
                throw new Error('DropDown.init: cannot specify both ' +
                    'options requiredChoice and correctChoice');
            }
            if (J.isArray(options.correctChoice) &&
                options.correctChoice.length > options.choices.length) {
                throw new Error('DropDown.init: options.correctChoice ' +
                    'length cannot exceed options.choices length');
            }
            else {
                this.correctChoice = options.correctChoice;
            }

        }

        // Option fixedChoice, if any.
        if ('boolean' === typeof options.fixedChoice) {
            this.fixedChoice = options.fixedChoice;
        }
        else if ('undefined' !== typeof options.fixedChoice) {
            throw new TypeError('DropDown.init: options.fixedChoice ' +
                'be boolean or undefined. Found: ' +
                options.fixedChoice);
        }



        if ("undefined" === typeof options.tag ||
            "datalist" === options.tag ||
            "select" === options.tag) {
            this.tag = options.tag;
        }
        else {
            throw new TypeError('DropDown.init: options.tag must ' +
                'be "datalist" or "select". Found: ' +
                options.tag);
        }

        // Set the main onchange listener, if any.
        if ('function' === typeof options.listener) {
            this.listener = function (e) {
                options.listener.call(this, e);
            };
        }
        else if ('undefined' !== typeof options.listener) {
            throw new TypeError('DropDown.init: opts.listener must ' +
                'be function or undefined. Found: ' +
                options.listener);
        }

        // Set an additional onchange, if any.
        if ('function' === typeof options.onchange) {
            this.onchange = options.onchange;
        }
        else if ('undefined' !== typeof options.onchange) {
            throw new TypeError('DropDownn.init: opts.onchange must ' +
                'be function or undefined. Found: ' +
                options.onchange);
        }

        // Set an additional validation, if any.
        if ('function' === typeof options.validation) {
            this.validation = options.validation;
        }
        else if ('undefined' !== typeof options.validation) {
            throw new TypeError('DropDownn.init: opts.validation must ' +
                'be function or undefined. Found: ' +
                options.validation);
        }


        // Option shuffleChoices, default false.
        if ('undefined' === typeof options.shuffleChoices) tmp = false;
        else tmp = !!options.shuffleChoices;
        this.shuffleChoices = tmp;

        if (options.width) {
            if ('string' !== typeof options.width) {
                throw new TypeError('DropDownn.init:width must be string or ' +
                    'undefined. Found: ' + options.width);
            }
            this.inputWidth = options.width;
        }

        // Validation Speed
        if ('undefined' !== typeof options.validationSpeed) {

            tmp = J.isInt(options.valiadtionSpeed, 0, undefined, true);
            if (tmp === false) {
                throw new TypeError('DropDownn.init: validationSpeed must a non-negative ' +
                    'number or undefined. Found: ' +
                    options.validationSpeed);
            }
            this.validationSpeed = tmp;
        }


    }

    // Implements the Widget.append method.
    DropDown.prototype.append = function () {
        // Widgets are Bootstrap panels. The following HTML
        // elements are available at the time when
        // the `append` method is called:
        //
        //   - panelDiv:   the outer container
        //   - headingDiv: the title container
        //   - bodyDiv:    the main container
        //   - footerDiv:  the footer container
        //

        if (W.gid(this.id)) {
            throw new Error('DropDown.append: id is not ' +
                'unique: ' + this.id);
        }
        var text = this.text;
        var label = this.label;

        text = W.get('p');
        text.innerHTML = this.mainText;
        text.id = 'p';
        this.bodyDiv.appendChild(text);


        label = W.get('label');
        label.innerHTML = this.labelText
        this.bodyDiv.appendChild(label);

        this.setChoices(this.choices, true);

        this.errorBox = W.append('div', this.bodyDiv, { className: 'errbox', id: 'errbox' });


    };


    DropDown.prototype.setChoices = function (choices, append) {
        var tag = this.tag;
        var option = this.option;
        var placeHolder = this.placeHolder;
        var order = this.order;

        // TODO validate choices.
        this.choices = choices;

        if (!append) return;

        var create = false;
        if (this.menu) this.menu.innerHTML = '';
        else create = true;

        if (create) {
            tag = this.tag;
            if (tag === "datalist" || "undefined" === typeof tag) {

                var datalist = this.datalist;
                var input = this.input;

                datalist = W.get('datalist');
                datalist.id = "dropdown";

                input = W.get('input');
                input.setAttribute('list', datalist.id);
                input.id = this.id;
                input.autocomplete = "off";
                if (placeHolder) { input.placeholder = placeHolder; }
                if (this.inputWidth) input.style.width = this.inputWidth;
                this.bodyDiv.appendChild(input);
                this.bodyDiv.appendChild(datalist);
                this.menu = input;

            }
            else if (tag === "select") {

                var select = this.select;

                select = W.get('select');
                select.id = this.id;
                if (this.inputWidth) select.style.width = this.inputWidth;
                if (placeHolder) {
                    option = W.get('option');
                    option.value = "";
                    option.innerHTML = placeHolder;
                    option.setAttribute("disabled", "");
                    option.setAttribute("selected", "");
                    option.setAttribute("hidden", "");
                    select.appendChild(option);
                }

                this.bodyDiv.appendChild(select);
                this.menu = select;
            }
        }
        let len = choices.length;
        order = J.seq(0, len - 1);
        if (this.shuffleChoices) order = J.shuffle(order);

        for (let i = 0; i < len; i++) {

            option = W.get('option');
            option.value = choices[order[i]];
            option.innerHTML = choices[order[i]];

            if (tag === "datalist" || "undefined" === typeof tag) {

                datalist.appendChild(option);
            }
            else if (tag === "select") {

                select.appendChild(option);
            }
        }

        this.enable();
    }

    /**
     * ### DropDown.verifyChoice
     *
     * Compares the current choice/s with the correct one/s
     *
     * Depending on current settings, there are three modes of verifying
     * choices:
     *
     *    - requiredChoice: either true or false.
     *    - correctChoice:  the choices are compared against correct ones.
     *    - fixedChoice: compares the choice with given choices.
     *
     * @return {boolean|null} TRUE if current choice is correct,
     *   FALSE if it is not correct, or NULL if no correct choice
     *   was set
     *
     */
    DropDown.prototype.verifyChoice = function () {

        var that = this;
        var correct = this.correctChoice;
        var current = this.currentChoice;
        var res = { value: '' };


        if (this.tag === "select" && this.numberOfChanges === 0) {

            current = this.currentChoice = this.menu.value;

        }

        if (this.requiredChoice) {
            res.value = current !== null;
        }

        // If no correct choice is set return null.
        if ('undefined' === typeof correct) res.value = null;
        if ('string' === typeof correct) {
            res.value = current === correct;
        }
        if ('number' === typeof correct) {
            res.value = current === this.choices[correct];
        }
        if (J.isArray(correct)) {
            var correctOptions = correct.map(function (x) {
                return that.choices[x];
            });
            res.value = correctOptions.indexOf(current) >= 0;
        }

        if (this.fixedChoice) {
            if (this.choices.indexOf(current) < 0) res.value = false;
        }

        if (this.validation) {
            if (undefined === typeof res) {
                throw new TypeError('something');
            }

            this.validation(this.currentChoice, res);
        }

        return res;
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
    DropDown.prototype.setError = function (err) {
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
    DropDown.prototype.highlight = function (border) {
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
    DropDown.prototype.unhighlight = function () {

        if (this.highlighted !== true) return;
        this.menu.style.border = '';
        this.highlighted = false;
        this.setError();
        this.emit('unhighlighted');
    };

    /**
     * ### DropDown.getValues
     *
     * Returns the values for current selection and other paradata
     *
     * Paradata that is not set or recorded will be omitted
     *
     * @return {object} Object containing the choice and paradata
     *
     * @see DropDown.verifyChoice
     */
    DropDown.prototype.getValues = function (opts) {
        var obj;
        opts = opts || {};
        var verif = this.verifyChoice().value;

        obj = {
            id: this.id,
            choice: this.fixedChoice ?
                this.choices.indexOf(this.currentChoice) : this.currentChoice,
            time: this.timeCurrentChoice,
            nChanges: this.numberOfChanges
        };
        if ('undefined' === typeof opts.highlight) opts.highlight = true;
        if (this.shuffleChoices) obj.order = this.order;

        // Option getValue backward compatible.
        if (opts.addValue !== false && opts.getValue !== false) {
            obj.value = this.currentChoice;
        }

        if (null !== this.correctChoice || null !== this.requiredChoice ||
            null !== this.fixedChoice) {
            obj.isCorrect = verif;
            if (!obj.isCorrect && opts.highlight) this.highlight();
        }
        if (obj.isCorrect === false) {
            this.setError(this.getText('error', obj.value));
        }
        return obj;
    };

    /**
     * ### ChoiceTable.listeners
     *
     * Implements Widget.listeners
     *
     * Adds two listeners two disable/enable the widget on events:
     * INPUT_DISABLE, INPUT_ENABLE
     *
     * @see Widget.listeners
     */
    DropDown.prototype.listeners = function () {
        var that = this;
        node.on('INPUT_DISABLE', function () {
            that.disable();
        });
        node.on('INPUT_ENABLE', function () {
            that.enable();
        });
    };

    /**
     * ### ChoiceTable.disable
     *
     * Disables clicking on the table and removes CSS 'clicklable' class
     */
    DropDown.prototype.disable = function () {
        if (this.disabled === true) return;
        this.disabled = true;
        if (this.menu) {
            this.menu.removeEventListener('change', this.listener);
        }
        this.emit('disabled');
    };

    /**
     * ### ChoiceTable.enable
     *
     * Enables clicking on the table and adds CSS 'clicklable' class
     *
     * @return {function} cb The event listener function
     */
    DropDown.prototype.enable = function () {
        if (this.disabled === false) return;
        if (!this.menu) {
            throw new Error('DropDown.enable: menu is not defined');
        }
        this.disabled = false;
        this.menu.addEventListener('change', this.listener);
        this.emit('enabled');
    };





})(node);
