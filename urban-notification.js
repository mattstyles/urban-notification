(function( root ) {

    var ANIM_OUT_SPD = 100,
        ANIM_IN_SPD = 200,
        ANIM_DELAY = 50,
        ANIM_DELAY_MAG = .8;


    Polymer( 'urban-notification', {

        /**
         * Array of elements attached as light DOM content
         *
         * @type {Array}
         */
        contents: null,


        /**
         * Published properties
         */
        publish: {
            /**
             * Is the element showing
             *
             * @property _showing
             * @type boolean
             */
            _showing: false
        },


        /*-----------------------------------------------------------*\
         *
         *  Polymer lifecycle events
         *
        \*-----------------------------------------------------------*/

        /**
         * Fired when Polymer has got the element ready
         */
        ready: function() {
            this.bindAll( this );

            this.onMutation( this, this.updateContent );
        },


        /**
         * Light DOM should be ready by now so grab all the relevant child nodes
         */
        attached: function() {
            // This is replaced by an observer, but keep this hook in for now incase the initial update happens too quickly
        },


        /*-----------------------------------------------------------*\
         *
         *  Events
         *
        \*-----------------------------------------------------------*/

        eventDelegates: {
            down: 'downAction',
            up: 'upAction'
        },

        /**
         * Abstract for initial touch on element
         */
        downAction: function( event ) {},

        /**
         * A click starts state transition to loading if the element is shown and not already loading
         */
        upAction: function( event ) {},


        /*-----------------------------------------------------------*\
         *
         *  State Management
         *
        \*-----------------------------------------------------------*/


        /**
         * Shows the whole element and starts the 'in' animation
         *
         * @param animate {Boolean} determines if the animation fires or not
         * @event - emits a 'show' event
         */
        show: function( immediate ) {
            if ( this._showing ) return;

            this.$.container.classList.remove( 'transparent' );

            var anims = [];
            this.contents.forEach( function( el, index ) {
                anims.push( new Animation(
                    el,
                    frames.show, {
                        duration: ANIM_IN_SPD,
                        delay: ANIM_DELAY * ( Math.sqrt( index ) * ANIM_DELAY_MAG ),
                        fill: 'forwards'
                    }
                ));
            });

            var anim = document.timeline.play( new AnimationGroup( anims ) );

            anim.onfinish = function( event ) {
                this.fire( 'showEnd' );
            }.bind( this );

            this._showing = true;
            this.fire( 'showStart' );
        },


        /**
         * Hides the whole element and starts the 'out' animation
         *
         * @event - emits a 'hide' event
         */
        hide: function() {
            if ( !this._showing ) return;

            var anims = [];
            this.contents.forEach( function( el, index ) {
                anims.push( new Animation(
                    this.contents[ this.contents.length - index - 1 ],
                    frames.hide, {
                        duration: ANIM_OUT_SPD,
                        delay: ANIM_DELAY * ( Math.sqrt( index ) * ANIM_DELAY_MAG ),
                        fill: 'forwards'
                    }
                ));
            }, this );

            var anim = document.timeline.play( new AnimationGroup( anims ) );
            this.fire( 'hideStart' );

            // Last to start will be last to finish so listen for the last one
            anim.onfinish = function( event ) {
                this.$.container.classList.add( 'transparent' );
                this._showing = false;
                this.fire( 'hideEnd' );
            }.bind( this );
        },



        /*-----------------------------------------------------------*\
         *
         *  Helpers
         *
        \*-----------------------------------------------------------*/


        /**
         * Simple, dirty bindAll implementation
         *
         * @param ctx {Object} the context to bind `this` to
         */
        bindAll: function( ctx ) {
            for ( method in this ) {
                if ( typeof this[ method ] === 'function' && !this.hasOwnProperty( method ) ) {
                    try {
                        this[ method ] = this[ method ].bind( ctx );
                    } catch( err ) {
                        console.log( this.element.name + '::', 'method binding error\n', method, err );
                    }
                }
            }
        },


        /**
         * Fired whenever the content of the element changes.
         * Ensures that the content cache is synced.
         */
        updateContent: function( observer, mutations ) {
            this.contents = [];

            // Iterate over each content tag
            Array.prototype.forEach.call( this.$.container.querySelectorAll( 'content' ), function( content ) {
                // Iterate over each root node distributed into content
                Array.prototype.forEach.call( content.getDistributedNodes(), function( el ) {
                    // Only keep track of elements.
                    if ( el.nodeType === 1 ) {
                        el.classList.add( 'transparent' );
                        this.contents.push( el );
                    }
                }, this );
            }, this );

            this.fire( 'contentUpdated' );

            // Reattach
            this.onMutation( this, this.updateContent );
        }


    });


})( this );
