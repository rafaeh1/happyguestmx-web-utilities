module.exports = {
    FSP: (function () {
        function FSP(fullData, filterColums) {
            this.data = fullData;
            this.filterColums = filterColums;
        }
        FSP.prototype.Filter = function (term) {
            var _this = this;
            this.data = this.data.filter(function (value, index, ar) {
                var result = false;
                _this.filterColums.forEach(function (element) {
                    if (value[element]) {
                        if (value[element].toString().toLowerCase().match(term.toLowerCase()))
                            result = true;
                    }
                });
                return result;
            });
        };
        FSP.prototype.Sort = function (orderBy, sortType) {
            this.data.sort(function (a, b) {
                if (a[orderBy] > b[orderBy]) {
                    return sortType === 'desc' ? -1 : 1;
                } else if (a[orderBy] < b[orderBy]) {
                    return sortType === 'asc' ? -1 : 1;
                }
                return 0;
            });
        };
        FSP.prototype.Pagin = function (page, size) {
            var start = (page - 1) * size;
            var end = size > -1 ? (start + size) : this.data.length;
            this.data = this.data.slice(start, end);
            return {
                start: start,
                end: end
            };
        };
        FSP.prototype.FSP = function (query) {
            var pagination = {
                items: [],
                total: 0,
                pageTop: 1,
                page: 1,
                indexBegin: 0,
                indexEnd: 0
            };
            this.Filter(query.queryString);
            this.Sort(query.orderBy, query.sortType);
            pagination.total = this.data.length;
            var top = Math.ceil(pagination.total / query.size);
            pagination.pageTop = top > 0 ? top : 1;
            pagination.page = query.page > pagination.pageTop ? pagination.pageTop : query.page;
            var range = this.Pagin(pagination.page, query.size);
            pagination.indexBegin = range.start + 1 <= 0 ? 0 : range.start + 1;
            pagination.indexEnd = this.data.length < query.size ? this.data.length : range.end;
            pagination.items = this.data;
            return pagination;
        };
        return FSP;
    }())
};
