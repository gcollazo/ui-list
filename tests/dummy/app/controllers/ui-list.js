import Ember from 'ember';
const { computed, observer, $, A, run, on } = Ember;    // jshint ignore:line

export default Ember.Controller.extend({

  queryParams: ['mood','size','style','compressed'],
  
  items: [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6}),
    Ember.Object.create({when: 4, foo: "Pub", bar: "it's time for some suds", icon: "beer"}),
    Ember.Object.create({when: 5, foo: "Took Cab", bar: "took a cab, drinking not driving", icon: "cab"}),
    Ember.Object.create({when: 6, foo: "Had Coffee", bar: "need to chill out after that beer", icon: "coffee"}),
    Ember.Object.create({when: 1, foo: "Ate Breakfast", bar: "start of every good morning", icon: "cutlery"})
  ],
  emberItems: [
    {foo: "Groceries", bar: "hungry, hungry, hippo", icon: "cutlery", badge: 6},
    {foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 1},
    {foo: "Pub", bar: "it's time for some suds", icon: "beer"},
    {foo: "Took Cab", bar: "took a cab, drinking not driving", icon: "cab"},
    {foo: "Had Coffee", bar: "need to chill out after that beer", icon: "coffee"}
  ],
  map: {
    title: 'foo',
    subHeading: 'bar'
  },
  sillyLogic: function(item,list) {
    let badge = item.get('badge');
    let moodiness = badge && badge > 5 ? 'error' : 'warning';
    return badge ? moodiness : null;
  },
  sortOrders: [
    {name: 'Natural', id: null},
    {name: 'When', id: 'when'},
    {name: 'Badges', id: 'badge'},
    {name: 'Title', id: 'title'}
  ],
  sortAscending: true,
  moodStrategy: 'static',
  enableStaticChooser: on('init',computed('moodStrategy', function() {
    return this.get('moodStrategy') === 'static';
  })),
  listFilter: computed('isFiltered', function() {
    const FilterFunc = item => { return item.badge > 0; };
    return this.get('isFiltered') ? FilterFunc : null;
  }),
  
  
  toggledBadge: on('init',computed('showBadge', function() {
    return this.get('showBadge') ? 4 : null;
  })),
  showBadge: true,
  showIcon: true,
  showSubHeading: true,
  toggledIcon: on('init',computed('showIcon', function() {
    return this.get('showIcon') ? 'envelope' : null;
  })),
  toggledSubHeading: on('init',computed('showSubHeading', function() {
    return this.get('showSubHeading') ? 'ran 12mi in London' : null;
  })),
  mood: 'default',
  style: 'default',
  size: 'default',
  compressed: false,
  defaultIcon: 'envelope',
  
  loadEmberData: on('init', function() {
    let items = new A(this.get('items'));
    let index = 1;
    items.forEach( item => {
      this.store.push('activity', {id: index++, foo: item.foo, bar: item.bar, icon: item.icon, badge: item.badge});
    });
  })

});