export function convertIdToPubNubKind(id) {
    var self = this;

    if (!id || id.length === 0)
        return "";

    return id.replace(/:/g, "-");
};

export function alphabeticSort(array){
    return array.sort(function compare(a, b) {
        if (a < b)
          return -1;
        if (a > b)
          return 1;
        return 0;
      })
}