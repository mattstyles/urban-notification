(function( root ) {

    var ANIM_OUT_SPD = 100,
        ANIM_IN_SPD = 200;


    Polymer( 'urban-notification', {

        publish: {
            /**
             * Is the element showing
             *
             * @type {Boolean}
             */
            _showing: false
        },


        /**
         * Fired when Polymer has got the element ready
         */
        ready: function() {

            // Simple dirty bindAll method so any methods invoked as a callback maintain scope to this object
            this.bindAll( this );
        },

        attached: function() {
            console.log( 'attched');
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
         * Shows the whole login element, transitions in the login button
         *
         * @param animate {Boolean} determines if the animation fires or not
         * @event - emits a 'show' event
         */
        show: function( immediate ) {
            if ( this._showing ) return;

            this.$.container.classList.remove( 'transparent' );

            var anim = document.timeline.play( new Animation(
                this.children[ 0 ],
                frames.show, {
                    duration: ANIM_IN_SPD,
                    fill: 'forwards'
                }
            ));

            this._showing = true;
            this.fire( 'show' );
        },


        /**
         * Hides the whole login element, after transitioning out the login button
         *
         * @event - emits a 'hide' event
         */
        hide: function() {
            if ( !this._showing ) return;

            var anim = document.timeline.play( new Animation(
                this.children[ 0 ],
                frames.hide, {
                    duration: ANIM_OUT_SPD,
                    fill: 'forwards'
                }
            ));

            anim.onfinish = function( event ) {
                this.$.container.classList.add( 'transparent' );
                this._showing = false;
                this.fire( 'hide' );
            }.bind( this );
        },



        /*-----------------------------------------------------------*\
         *
         *  Helpers
         *
        \*-----------------------------------------------------------*/


        /**
         * Simple, dirty bindAll implementation
         */
        bindAll: function( ctx ) {
            for ( method in this ) {
                if ( typeof this[ method ] === 'function' && !this.hasOwnProperty( method ) ) {
                    try {
                        this[ method ] = this[ method ].bind( ctx );
                    } catch( err ) {
                        console.log( 'urban-login:: method binding error', method, err );
                    }
                }
            }
        }

    });


})( this );
