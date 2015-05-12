import Ember from 'ember';
const { Mixin, computed, observer, $, A, run, on, typeOf, defineProperty } = Ember;    // jshint ignore:line
const capitalize = Ember.String.capitalize;

let SharedItem = Mixin.create({  
  // Classy stuff
  classNames: ['ui-list','item'],
  classNameBindings: ['_size','_style','disabled:disabled:enabled', '_mood' ],

  // Stylish stuff
  _style: computed('style', function() {
    let style = this.get('style');
    if (typeOf(style) === 'function') {
      run( ()=> {
        style = style(this);
      });
    }
    return !style || style === 'default' ? '' : `style-${style}`;
  }).volatile(),
  _size: computed('size', function() {
    let size = this.get('size');
    if (typeOf(size) === 'function') {
      run( ()=> {
        size = size(this);
      });
    }    
    return !size || size === 'default' ? '' : size;
  }).volatile(),
  _mood: computed('mood','size','style', function() {
    let mood = this.get('mood');
    console.log('mood is: %o', mood);
    if (typeOf(mood) === 'function') {
      run( ()=> {
        mood = mood(this);
      });
    }
    return !mood || mood === 'default' ? '' : `mood-${mood}`;
  }).volatile(),

  // Convenience Aliases and Defaults
  mood: 'default',
  style: 'default',
  size: 'default',
  skin: computed.alias('style'),
  color: computed.alias('mood'),
  
  // Initialize "Dereferenced Computed Properties"
	// ---------------------------------------------
	// NOTE: 'map' is a dereferenced hash of mappings; an item can use either a map or individual property assignments
	// of the variety item.fooMap = 'mappedTo'; 
  _defineAspectMappings: on('init', observer('_aspects','_panes','map', function() {
    const aspects = new A(this.get('_aspects'));
    const panes = new A(this.get('_panes'));
    aspects.forEach( aspect => {
      if(this.getMap(aspect)) {
        let cp = computed.readOnly(this.getMap(aspect));
        defineProperty(this, aspect, cp);
			}
      // iterate through Panes
      panes.forEach( pane => {
        if(this.getMap(aspect,pane)) {
          let cp = computed.readOnly(this, this.getMap(aspect,pane));
          defineProperty(this, aspect + capitalize(pane), cp);
        }
      });
    });
  })),
	// looks in both the map property directly off the item as well as the dereferenced
	// map hash that may also contain the property. If both are defined the locally defined 
	// map takes precedence
	getMap: function(property, pane) {
		pane = pane ? capitalize(pane) : '';
		property = property + pane;
    return this.get(`map${capitalize(property)}`) || this.get(`map.${property}`);
	},
  
  // Default Values
  _setDefaultValues: on('didInsertElement', computed('items.[]', 'items.@each._propertyChanged', function() {
    const aspects = this.get('_aspects');
    const panes = this.get('_panes');
    aspects.forEach( aspect => {
      const propValue = this.get('aspect');
      if(!propValue) {
        this.set(aspect,propValue);
      }
      panes.forEach( pane => {
        const prop = aspect + capitalize(pane);
        const propValue = this.get(prop);
        if(!propValue) {
          this.set(prop,propValue);
        }
      });
    });
  })) // end default value
});

SharedItem[Ember.NAME_KEY] = 'Item Mixin';
export default SharedItem;