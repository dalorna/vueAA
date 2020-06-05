//import store from '../../../store'
//import router from '../../../router'

export function convertIdToMotoKind(id) {
  if (!id || id.length === 0){
    return '';
  }

  return id.replace(/-/g, ':');
};

export function convertIdToPubNubKind(id) {
  if (!id || id.length === 0){
    return '';
  }

  return id.replace(/:/g, '-');
};

export function arraymove(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
};

export function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)){
      return false;
    }
  }
  return true;
};

export function globalLogin(authToken) {
  /*
  store.dispatch('login', authToken).then(function () {
      store.dispatch('getSetUser').then(data => {
          console.log(data);
          if (data && data.id && data.IsApproved) {
              console.log('In data block');

              // let filter = store.getters.currentFilter
              // filter.filterCategory = 'Inbox'
              // filter.isActive = false

              store.dispatch('setPubNub');
              store.dispatch('loadUserPreferences');
              // store.commit('updateFilter', filter)
              store
                  .dispatch('getAllUsers')
                  .then(() => {
                      store.dispatch('initializeBadgeManager');
                      //store.dispatch('getGroups');
                      if (!window.chrome) {
                          router.replace({
                              name: 'plugin'
                          })

                      }
                  })
                  .catch(() => {
                      console.log('Failed to get users');
                      //store.dispatch('getGroups');
                  });
          }
      });
  });
  */
};

export function hashCode(str) {
  var hash = 0
  if (str.length == 0) return hash
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

export function deepCopy(Obj) {
  return JSON.parse(JSON.stringify(Obj));
};

export function sortType(type){
  type.sort(function (a, b) {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    let comparison = 0;
    if (nameA < nameB) {
        comparison = -1;
    } else if (nameA > nameB) {
        comparison = 1;
    }
    return comparison;
  });
}

export function secondsToString(seconds){
  let numdays = Math.floor(seconds / 86400);
  let numhours = Math.floor((seconds % 86400) / 3600);
  let numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
  let numseconds = ((seconds % 86400) % 3600) % 60;

  numdays = numdays > 0 ? numdays + ' day' + rets(numdays) + ' ' : '';
  numhours = numhours > 0 ? numhours + ' hour' + rets(numhours) + ' ' : '';
  numminutes = numminutes > 0 ? numminutes + ' minute' + rets(numminutes) + ' ' : '';
  numseconds = numseconds > 0 ? numseconds + ' second' + rets(numseconds) + ' ' : '';
  return numdays + numhours + numminutes + numseconds;
};
export function rets(n){
  if (n > 1){
    return 's';
  }
  return '';
};

//This method generates pagination list items
//Currently generates a max of 5 items; Will be optimized later to generate 'n' items
export function generatePagingList(totalPages, currentPage) {
  let pages = []
  try {
    if (totalPages > 1) {
      pages = [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2
      ]

      if (currentPage == 0 || currentPage == 1)
        pages.push(currentPage + 3)
      if (currentPage == 0)
        pages.push(currentPage + 4)
      if (currentPage == totalPages - 1 || currentPage == totalPages - 2)
        pages.splice(0, 0, currentPage - 3)
      if (currentPage == totalPages - 1)
        pages.splice(0, 0, currentPage - 4)

      pages = pages.filter((number) => {
        return number >= 0 && number < totalPages
      })
    }
  } catch (err) {
    console.log('Error generating paging list: ', err)
  }
  return pages
}

export var dates = {
  convert:function(d) {
    // Converts the date in d to a date-object. The input can be:
    //   a date object: returned without modification
    //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
    //   a number     : Interpreted as number of milliseconds
    //                  since 1 Jan 1970 (a timestamp)
    //   a string     : Any format supported by the javascript engine, like
    //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
    //  an object     : Interpreted as an object with year, month and date
    //                  attributes.  **NOTE** month is 0-11.
    return (
      d.constructor === Date ? d :
        d.constructor === Array ? new Date(d[0],d[1],d[2]) :
          d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
              typeof d === "object" ? new Date(d.year,d.month,d.date) :
                NaN
    );
  },
  compare:function(a,b) {
    // Compare two dates (could be of any type supported by the convert
    // function above) and returns:
    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    // NaN : if a or b is an illegal date
    // NOTE: The code inside isFinite does an assignment (=).
    return (
      isFinite(a=this.convert(a).valueOf()) &&
      isFinite(b=this.convert(b).valueOf()) ?
        (a>b)-(a<b) :
        NaN
    );
  },
  inRange:function(d,start,end) {
    // Checks if date in d is between dates in start and end.
    // Returns a boolean or NaN:
    //    true  : if d is between start and end (inclusive)
    //    false : if d is before start or after end
    //    NaN   : if one or more of the dates is illegal.
    // NOTE: The code inside isFinite does an assignment (=).
    return (
      isFinite(d=this.convert(d).valueOf()) &&
      isFinite(start=this.convert(start).valueOf()) &&
      isFinite(end=this.convert(end).valueOf()) ?
        start <= d && d <= end :
        NaN
    );
  }
}
