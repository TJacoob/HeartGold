var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['name', 'brand','type','season'];
var filter = {name:"", brand:[], type:[], season:[] };

PackageSearch = new SearchSource('products', fields, options);

Template.AdminSeeAllProducts.onRendered(function() {
    var self = this;

    self.autorun(function(){
        self.subscribe('products');
        filter.brand = distinct(Products,"brand");
    	  filter.type = distinct(Products,"type");
        filter.season = distinct(Products,"season");
        empty = true ;
        emptyType = true ;
        emptySeason = true ;
    });
    PackageSearch.search("",filter);
});

Template.AdminSeeAllProducts.helpers({
  products: function() {
    return PackageSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {isoScore: -1}
    });
  }, 
  
  isLoading: function() {
    return PackageSearch.getStatus().loading;
  },

  brands: function() {
  	return distinct(Products,"brand");
  },
  types: function() {
  	return distinct(Products,"type");
  },
  seasons: function() {
    return distinct(Products,"season");
  }
});

var empty = true ;
var emptyType = true ;

Template.AdminSeeAllProducts.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    filter.name = text ;
    PackageSearch.search("-", filter);
  }, 200),

  "click #searchOP": function(){

  	if ((filter.brand.indexOf(this.valueOf()) > -1)&&(!empty) ) {
    //In the array!

    	filter.brand = deleteFrom(filter.brand, this.valueOf());
    	if ( filter.brand.length == 0 )
    	{
    		empty = true ;
    	}
    }
    else if ((filter.brand.indexOf(this.valueOf()) > -1)&&(empty) ){
		filter.brand = [] ;
		filter.brand.push(this.valueOf());
		empty = false;	
	} else {
    	filter.brand.push(this.valueOf());
    	empty=false ;
	}

  	if (empty)
	{
		for (i=0; i<distinct(Products,"brand").length ; i++ )
  		{
    		filter.brand.push(distinct(Products,"brand")[i]);
  		}
  		empty = true ;
	}
  	PackageSearch.search("-", filter);
  },
  "click #searchOPType": function(){

  	if ((filter.type.indexOf(this.valueOf()) > -1)&&(!emptyType) ) {
    //In the array!

    	filter.type = deleteFrom(filter.type, this.valueOf());
    	if ( filter.type.length == 0 )
    	{
    		emptyType = true ;
    	}
    }
    else if ((filter.type.indexOf(this.valueOf()) > -1)&&(emptyType) ){
		filter.type = [] ;
		filter.type.push(this.valueOf());
		emptyType = false;	
	} else {
    	filter.type.push(this.valueOf());
    	emptyType = false ;
	}

  	if (emptyType)
	{
		for (i=0; i<distinct(Products,"type").length ; i++ )
  		{
    		filter.type.push(distinct(Products,"type")[i]);
  		}
  		emptyType = true ;
	}
  	PackageSearch.search("-", filter);
  },
  "click #searchOPSeason": function(){

    if ((filter.season.indexOf(this.valueOf()) > -1)&&(!emptySeason) ) {
    //In the array!

      filter.season = deleteFrom(filter.season, this.valueOf());
      if ( filter.season.length == 0 )
      {
        emptySeason = true ;
      }
    }
    else if ((filter.season.indexOf(this.valueOf()) > -1)&&(emptySeason) ){
    filter.season = [] ;
    filter.season.push(this.valueOf());
    emptySeason = false;  
  } else {
      filter.season.push(this.valueOf());
      emptySeason = false ;
  }

    if (emptySeason)
  {
    for (i=0; i<distinct(Products,"season").length ; i++ )
      {
        filter.season.push(distinct(Products,"season")[i]);
      }
      emptySeason = true ;
  }
    PackageSearch.search("-", filter);
  },
});


function distinct(collection, field) {
  return _.uniq(collection.find({}, {
    sort: {[field]: 1}, fields: {[field]: 1}
  }).map(x => x[field]), true);
}


function deleteFrom(array, search_term){
  for (var i=array.length-1; i>=0; i--) {
    if (array[i] === search_term) {
        array.splice(i, 1);
        // break;       //<-- Uncomment  if only the first term has to be removed
    }
  }

  return array ;
}