Users.recent = {
    /**
     * 最近阅读
     * 若不传入articleInfo，返回最近阅读列表，
     * 若传入articleInfo，则将传入的article插入到数组索引0位置，若数组长度超过10，移除最末位的元素
     * @param articleInfo
     */
    read: function (articleInfo) {
        if (articleInfo) {
            var obj = {
                _id: articleInfo._id,
                title: articleInfo.title,
                url: window.location.href
            };
            return Science.Cookies.queue("recentRead", obj, 5,function(a,b){return a._id===b._id});
        } else {
            return Science.Cookies.queue("recentRead");
        }
    },
    /**
     * 最近搜索
     * 和最近阅读差不多 -。-
     * @param keyword
     */
    search: function (keyword) {
        if (keyword) {
            return Science.Cookies.queue("recentSearch", keyword, 5)
        } else {
            return Science.Cookies.queue("recentSearch");
        }
    }

};